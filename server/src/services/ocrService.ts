import fs from 'fs';
import path from 'path';
import { createWorker } from 'tesseract.js';
import pdfParse from 'pdf-parse';
import { PDFDocument, PDFName } from 'pdf-lib';
import { ConvertService } from './convertService';

export interface OcrResult {
  text: string;
  confidence: number;
  language: string;
  searchablePdfBuffer?: Buffer;
}

export class OcrService {
  /**
   * Perform OCR on an image or PDF file
   * Supports 'hin' (Hindi), 'eng', 'spa', 'fra', 'deu', 'ara', 'rus', 'chi_sim', 'jpn', etc.
   */
  public static async recognizeText(
    filePath: string,
    language: string = 'eng'
  ): Promise<OcrResult> {
    const ext = path.extname(filePath).toLowerCase();

    // Map language to Tesseract code.
    // For Hindi, hin+eng yields far better accuracy for bilingual documents with numbers/words.
    let tesseractLang = language;
    if (language === 'hin') {
      tesseractLang = 'hin+eng';
    } else if (['spa', 'fra', 'deu', 'ita', 'por', 'rus'].includes(language)) {
      tesseractLang = `${language}+eng`;
    }

    let recognizedText = '';
    let confidence = 95.0;

    if (ext === '.pdf') {
      const fileBytes = fs.readFileSync(filePath);

      // 1. Try digital text extraction first
      let digitalText = '';
      try {
        const parsed = await pdfParse(fileBytes);
        if (parsed.text && parsed.text.trim().length > 10) {
          digitalText = parsed.text.trim();
        }
      } catch (e) {
        console.warn('pdfParse error:', e);
      }

      // 2. Check if the PDF has embedded scanned images (standard for scanned PDFs)
      const imageBuffers: Buffer[] = [];
      try {
        const doc = await PDFDocument.load(fileBytes, { ignoreEncryption: true });
        for (const [_, obj] of doc.context.enumerateIndirectObjects()) {
          if (obj && (obj as any).dict) {
            const subtype = (obj as any).dict.get(PDFName.of('Subtype'))?.toString();
            if (subtype === '/Image') {
              const filter = (obj as any).dict.get(PDFName.of('Filter'))?.toString();
              const rawContents = (obj as any).contents;
              if (rawContents && rawContents.length > 300) {
                if (filter === '/DCTDecode') {
                  imageBuffers.push(Buffer.from(rawContents));
                }
              }
            }
          }
        }
      } catch (e) {
        console.warn('Scanned image extraction from PDF error:', e);
      }

      // 3. If scanned images were found, run Tesseract OCR on them
      if (imageBuffers.length > 0) {
        let worker: any = null;
        try {
          worker = await createWorker(tesseractLang);
          const textParts: string[] = [];
          let totalConf = 0;

          // Process each page image (limit to first 10 for performance)
          const pagesToProcess = imageBuffers.slice(0, 10);
          for (const imgBuf of pagesToProcess) {
            const ret = await worker.recognize(imgBuf);
            if (ret.data.text && ret.data.text.trim()) {
              textParts.push(ret.data.text.trim());
              totalConf += ret.data.confidence || 90;
            }
          }

          await worker.terminate();

          if (textParts.length > 0) {
            recognizedText = textParts.join('\n\n--- Page Break ---\n\n');
            confidence = Math.round(totalConf / textParts.length);
          }
        } catch (e) {
          if (worker) {
            try { await worker.terminate(); } catch {}
          }
          console.warn('Tesseract scanned image OCR error:', e);
        }
      }

      // 4. Fallback to digitalText if OCR on images was not triggered or returned empty
      if (!recognizedText && digitalText) {
        recognizedText = digitalText;
        confidence = 98.0;
      }

      if (!recognizedText) {
        recognizedText = digitalText || 'No legible text detected in document.';
      }
    } else {
      // Direct image file (PNG, JPG, JPEG, WEBP, etc.)
      let worker: any = null;
      try {
        worker = await createWorker(tesseractLang);
        const ret = await worker.recognize(filePath);
        recognizedText = ret.data.text.trim();
        confidence = ret.data.confidence;
        await worker.terminate();
      } catch (err: any) {
        if (worker) {
          try { await worker.terminate(); } catch {}
        }
        console.warn('Tesseract OCR error on image:', err);
        throw new Error(`OCR processing failed: ${err.message || 'Unknown error'}`);
      }
    }

    // Generate searchable PDF using our Unicode font (Nirmala.ttf supporting Hindi and multi-language)
    let searchablePdfBuffer: Buffer | undefined;
    try {
      searchablePdfBuffer = await ConvertService.textToPdf(
        'OCR Extracted Document',
        recognizedText || 'No legible text detected in document.'
      );
    } catch (e) {
      console.warn('Could not generate searchable PDF:', e);
    }

    return {
      text: recognizedText,
      confidence,
      language,
      searchablePdfBuffer,
    };
  }
}
