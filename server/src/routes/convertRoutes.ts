import { Router, Request, Response } from 'express';
import path from 'path';
import { StorageService } from '../services/storageService';
import { ConvertService } from '../services/convertService';
import { db } from '../db/store';

const router = Router();

/**
 * POST /api/convert
 * Body: { fileId, fileIds, to: 'word' | 'excel' | 'html' | 'pdf' }
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
  const startTime = Date.now();
  try {
    const { fileId, fileIds, to } = req.body;
    const userId = req.headers['x-user-id'] as string | undefined;

    if (!to) {
      res.status(400).json({ error: 'Target conversion format "to" is required (word, excel, html, pdf)' });
      return;
    }

    // Conversion 1: Images to PDF
    if (to === 'pdf') {
      const ids = fileIds || (fileId ? [fileId] : []);
      if (ids.length === 0) {
        res.status(400).json({ error: 'At least one image file is required for PDF conversion' });
        return;
      }

      const imgPaths: string[] = [];
      let totalOriginalSize = 0;

      for (const id of ids) {
        const record = StorageService.getFile(id);
        if (record) {
          imgPaths.push(record.storagePath);
          totalOriginalSize += record.fileSizeBytes;
        }
      }

      const pdfBuffer = await ConvertService.imagesToPdf(imgPaths);
      const saved = StorageService.saveProcessedFile(
        pdfBuffer,
        `converted_${Date.now()}.pdf`,
        'application/pdf',
        userId
      );

      const processingTimeMs = Date.now() - startTime;
      db.addOperation({
        userId,
        toolType: 'convert_to_pdf',
        inputFiles: ids,
        outputFileId: saved.id,
        outputFileName: saved.originalName,
        status: 'completed',
        originalSizeBytes: totalOriginalSize,
        processedSizeBytes: saved.fileSizeBytes,
        processingTimeMs,
      });

      res.json({
        success: true,
        fileId: saved.id,
        fileName: saved.originalName,
        fileSize: saved.fileSizeBytes,
        downloadUrl: `/api/download/${saved.id}`,
        processingTimeMs,
      });
      return;
    }

    // Conversion 2, 3, 4: PDF to Word / Excel / HTML
    if (!fileId) {
      res.status(400).json({ error: 'fileId is required for this conversion' });
      return;
    }

    const record = StorageService.getFile(fileId);
    if (!record) {
      res.status(404).json({ error: 'File not found' });
      return;
    }

    const baseName = path.parse(record.originalName).name;

    if (to === 'word') {
      const docxBuffer = await ConvertService.pdfToWord(record.storagePath);
      const saved = StorageService.saveProcessedFile(
        docxBuffer,
        `${baseName}.docx`,
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        userId
      );

      const processingTimeMs = Date.now() - startTime;
      db.addOperation({
        userId,
        toolType: 'pdf_to_word',
        inputFiles: [fileId],
        outputFileId: saved.id,
        outputFileName: saved.originalName,
        status: 'completed',
        originalSizeBytes: record.fileSizeBytes,
        processedSizeBytes: saved.fileSizeBytes,
        processingTimeMs,
      });

      res.json({
        success: true,
        fileId: saved.id,
        fileName: saved.originalName,
        fileSize: saved.fileSizeBytes,
        downloadUrl: `/api/download/${saved.id}`,
        processingTimeMs,
      });
      return;
    }

    if (to === 'excel') {
      const excelBuffer = await ConvertService.pdfToExcel(record.storagePath);
      const saved = StorageService.saveProcessedFile(
        excelBuffer,
        `${baseName}.xlsx`,
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        userId
      );

      const processingTimeMs = Date.now() - startTime;
      db.addOperation({
        userId,
        toolType: 'pdf_to_excel',
        inputFiles: [fileId],
        outputFileId: saved.id,
        outputFileName: saved.originalName,
        status: 'completed',
        originalSizeBytes: record.fileSizeBytes,
        processedSizeBytes: saved.fileSizeBytes,
        processingTimeMs,
      });

      res.json({
        success: true,
        fileId: saved.id,
        fileName: saved.originalName,
        fileSize: saved.fileSizeBytes,
        downloadUrl: `/api/download/${saved.id}`,
        processingTimeMs,
      });
      return;
    }

    if (to === 'html') {
      const htmlContent = await ConvertService.pdfToHtml(record.storagePath);
      const saved = StorageService.saveProcessedFile(
        Buffer.from(htmlContent, 'utf-8'),
        `${baseName}.html`,
        'text/html',
        userId
      );

      const processingTimeMs = Date.now() - startTime;
      res.json({
        success: true,
        fileId: saved.id,
        fileName: saved.originalName,
        fileSize: saved.fileSizeBytes,
        downloadUrl: `/api/download/${saved.id}`,
        processingTimeMs,
      });
      return;
    }

    res.status(400).json({ error: `Unsupported conversion target: ${to}` });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Conversion failed' });
  }
});

export default router;
