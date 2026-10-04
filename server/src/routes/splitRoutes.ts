import { Router, Request, Response } from 'express';
import { StorageService } from '../services/storageService';
import { PdfService } from '../services/pdfService';
import { db } from '../db/store';

const router = Router();

/**
 * POST /api/split
 * Body: { fileId, mode: 'range' | 'extract' | 'splitEveryN', ranges, pages, n }
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
  const startTime = Date.now();
  try {
    const { fileId, mode = 'range', ranges, pages, n } = req.body;
    if (!fileId) {
      res.status(400).json({ error: 'fileId is required' });
      return;
    }

    const record = StorageService.getFile(fileId);
    if (!record) {
      res.status(404).json({ error: 'File not found' });
      return;
    }

    const result = await PdfService.splitPdf(record.storagePath, {
      mode,
      ranges,
      pages,
      n: n ? parseInt(n, 10) : undefined,
    });

    const userId = req.headers['x-user-id'] as string | undefined;
    const mimeType = result.isZip ? 'application/zip' : 'application/pdf';

    const savedFile = StorageService.saveProcessedFile(
      result.buffer,
      result.fileName,
      mimeType,
      userId
    );

    const processingTimeMs = Date.now() - startTime;

    db.addOperation({
      userId,
      toolType: 'split',
      inputFiles: [fileId],
      outputFileId: savedFile.id,
      outputFileName: savedFile.originalName,
      status: 'completed',
      originalSizeBytes: record.fileSizeBytes,
      processedSizeBytes: savedFile.fileSizeBytes,
      processingTimeMs,
    });

    res.json({
      success: true,
      fileId: savedFile.id,
      fileName: savedFile.originalName,
      fileSize: savedFile.fileSizeBytes,
      isZip: result.isZip,
      downloadUrl: `/api/download/${savedFile.id}`,
      processingTimeMs,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'PDF split failed' });
  }
});

export default router;
