import fs from 'fs';
import path from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import pdfParse from 'pdf-parse';
import { Document, Paragraph, TextRun, Packer, HeadingLevel } from 'docx';
import ExcelJS from 'exceljs';
import archiver from 'archiver';
import { sanitizeForWinAnsi } from '../utils/textUtils';

export class ConvertService {
  /**
   * Convert Images (JPG/PNG) to single PDF
   */
  public static async imagesToPdf(
    imagePaths: string[],
    options?: { fitPage?: boolean; margin?: number }
  ): Promise<Buffer> {
    const doc = await PDFDocument.create();
    const margin = options?.margin ?? 20;

    for (const imgPath of imagePaths) {
      if (!fs.existsSync(imgPath)) continue;
      const imgBytes = fs.readFileSync(imgPath);
      const isPng = imgPath.toLowerCase().endsWith('.png');

      const embedded = isPng
        ? await doc.embedPng(imgBytes)
        : await doc.embedJpg(imgBytes);

      // Determine dimensions (fit nicely on standard A4 or image size)
      const imgDims = embedded.scale(1);
      // Create page with matching or standard dimensions
      const pageWidth = imgDims.width + margin * 2;
      const pageHeight = imgDims.height + margin * 2;
      const page = doc.addPage([pageWidth, pageHeight]);

      page.drawImage(embedded, {
        x: margin,
        y: margin,
        width: imgDims.width,
        height: imgDims.height,
      });
    }

    const saved = await doc.save();
    return Buffer.from(saved);
  }

  /**
   * Convert PDF to Word (.docx)
   * Extracts text, preserves paragraphs, generates valid Word document
   */
  public static async pdfToWord(pdfPath: string): Promise<Buffer> {
    const fileBytes = fs.readFileSync(pdfPath);
    const parsed = await pdfParse(fileBytes);
    const rawText = parsed.text || '';

    // Split text into paragraphs
    const lines = rawText.split('\n');
    const docxParagraphs: Paragraph[] = [];

    // Title paragraph
    docxParagraphs.push(
      new Paragraph({
        text: 'Converted Document',
        heading: HeadingLevel.TITLE,
        spacing: { after: 200 },
      })
    );

    let currentParagraphLines: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        if (currentParagraphLines.length > 0) {
          docxParagraphs.push(
            new Paragraph({
              children: [new TextRun(currentParagraphLines.join(' '))],
              spacing: { after: 120 },
            })
          );
          currentParagraphLines = [];
        }
      } else {
        currentParagraphLines.push(trimmed);
      }
    }

    if (currentParagraphLines.length > 0) {
      docxParagraphs.push(
        new Paragraph({
          children: [new TextRun(currentParagraphLines.join(' '))],
          spacing: { after: 120 },
        })
      );
    }

    const wordDoc = new Document({
      sections: [
        {
          properties: {},
          children: docxParagraphs,
        },
      ],
    });

    const buffer = await Packer.toBuffer(wordDoc);
    return buffer;
  }

  /**
   * Convert PDF to Excel (.xlsx)
   * Analyzes tabular data or text lines into Excel rows & columns
   */
  public static async pdfToExcel(pdfPath: string): Promise<Buffer> {
    const fileBytes = fs.readFileSync(pdfPath);
    const parsed = await pdfParse(fileBytes);
    const lines = (parsed.text || '').split('\n');

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'localpdf Converter';
    const worksheet = workbook.addWorksheet('Extracted Sheet');

    // Style header row
    worksheet.columns = [
      { header: 'Line #', key: 'lineNum', width: 10 },
      { header: 'Content Column 1', key: 'col1', width: 35 },
      { header: 'Content Column 2', key: 'col2', width: 35 },
      { header: 'Content Column 3', key: 'col3', width: 35 },
    ];

    let rowNum = 1;
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) continue;

      // Check if line looks like CSV/TSV or delimited by multiple spaces
      const parts = line.split(/\t|\s{2,}|\s*,\s*/);
      worksheet.addRow({
        lineNum: rowNum++,
        col1: parts[0] || '',
        col2: parts[1] || '',
        col3: parts.slice(2).join(' ') || '',
      });
    }

    const buffer = (await workbook.xlsx.writeBuffer()) as unknown as Buffer;
    return Buffer.from(buffer);
  }

  /**
   * Convert Word/Text to PDF
   */
  public static async textToPdf(title: string, textContent: string): Promise<Buffer> {
    // Ensure regeneratorRuntime is loaded for complex Indic font shaping
    if (!(global as any).regeneratorRuntime) {
      try {
        (global as any).regeneratorRuntime = require('regenerator-runtime');
      } catch {}
    }

    const doc = await PDFDocument.create();
    let font: any;
    let boldFont: any;

    // Check for bundled Unicode font (Nirmala.ttf supports Hindi, English, and Indic scripts)
    const fontCandidates = [
      path.join(__dirname, '..', 'assets', 'fonts', 'Nirmala.ttf'),
      'C:\\Windows\\Fonts\\Nirmala.ttf',
      'C:\\Windows\\Fonts\\arial.ttf',
      'C:\\Windows\\Fonts\\calibri.ttf',
    ];

    let loadedCustomFont = false;
    for (const fontPath of fontCandidates) {
      if (fs.existsSync(fontPath)) {
        try {
          const fontkit = require('@pdf-lib/fontkit');
          doc.registerFontkit(fontkit);
          const fontBytes = fs.readFileSync(fontPath);
          font = await doc.embedFont(fontBytes);
          boldFont = font;
          loadedCustomFont = true;
          break;
        } catch (e) {
          console.warn(`Could not embed font from ${fontPath}:`, e);
        }
      }
    }

    if (!loadedCustomFont) {
      font = await doc.embedFont(StandardFonts.Helvetica);
      boldFont = await doc.embedFont(StandardFonts.HelveticaBold);
    }

    const safeTitle = sanitizeForWinAnsi(title, boldFont);
    const safeContent = sanitizeForWinAnsi(textContent, font);

    const margin = 50;
    const pageWidth = 595; // A4
    const pageHeight = 842;
    let page = doc.addPage([pageWidth, pageHeight]);

    // Draw header safely
    try {
      page.drawText(safeTitle, {
        x: margin,
        y: pageHeight - margin - 20,
        size: 20,
        font: boldFont,
        color: rgb(0.1, 0.1, 0.1),
      });
    } catch {
      page.drawText('Document', {
        x: margin,
        y: pageHeight - margin - 20,
        size: 20,
        font: boldFont,
        color: rgb(0.1, 0.1, 0.1),
      });
    }

    let currentY = pageHeight - margin - 60;
    const fontSize = 11;
    const lineHeight = 16;
    const lines = safeContent.split('\n');

    const safeDrawText = (targetPage: any, text: string, yPos: number) => {
      try {
        targetPage.drawText(text, {
          x: margin,
          y: yPos,
          size: fontSize,
          font,
          color: rgb(0.2, 0.2, 0.2),
        });
      } catch {
        // Ultimate fallback: strip any non-ASCII character
        const asciiOnly = text.replace(/[^\x20-\x7E]/g, ' ');
        targetPage.drawText(asciiOnly, {
          x: margin,
          y: yPos,
          size: fontSize,
          font,
          color: rgb(0.2, 0.2, 0.2),
        });
      }
    };

    for (const line of lines) {
      if (currentY < margin + 40) {
        page = doc.addPage([pageWidth, pageHeight]);
        currentY = pageHeight - margin;
      }

      // Word wrapping logic
      const words = line.split(' ');
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        let testWidth = 0;
        try {
          testWidth = font.widthOfTextAtSize(testLine, fontSize);
        } catch {
          testWidth = font.widthOfTextAtSize(testLine.replace(/[^\x20-\x7E]/g, ' '), fontSize);
        }

        if (testWidth > pageWidth - margin * 2) {
          safeDrawText(page, currentLine, currentY);
          currentY -= lineHeight;
          currentLine = word;

          if (currentY < margin + 40) {
            page = doc.addPage([pageWidth, pageHeight]);
            currentY = pageHeight - margin;
          }
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine) {
        safeDrawText(page, currentLine, currentY);
        currentY -= lineHeight;
      }
    }

    const saved = await doc.save();
    return Buffer.from(saved);
  }

  /**
   * Convert PDF to HTML
   */
  public static async pdfToHtml(pdfPath: string): Promise<string> {
    const fileBytes = fs.readFileSync(pdfPath);
    const parsed = await pdfParse(fileBytes);
    const lines = (parsed.text || '').split('\n');

    const htmlParagraphs = lines
      .map((l: string) => l.trim())
      .filter(Boolean)
      .map((l: string) => `<p>${escapeHtml(l)}</p>`)
      .join('\n');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Converted PDF Document</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 0 20px; color: #333; }
    h1 { color: #e5322d; border-bottom: 2px solid #fee2e2; padding-bottom: 8px; }
    p { margin-bottom: 1em; }
  </style>
</head>
<body>
  <h1>Document Content</h1>
  <div class="content">
    ${htmlParagraphs}
  </div>
</body>
</html>`;
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
