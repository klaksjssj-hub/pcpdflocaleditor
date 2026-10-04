import { Router, Request, Response } from 'express';
import { StorageService } from '../services/storageService';
import { PdfService } from '../services/pdfService';
import { db } from '../db/store';

const router = Router();

/**
 * POST /api/compress
 * Body: { fileId, level: 'low' | 'medium' | 'high' }
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
  const startTime = Date.now();
  try {
    const { fileId, level = 'medium' } = req.body;
    if (!fileId) {
      res.status(400).json({ error: 'fileId is required' });
      return;
    }

    const record = StorageService.getFile(fileId);
    if (!record) {
      res.status(404).json({ error: 'File not found' });
      return;
    }

    const compressed = await PdfService.compressPdf(record.storagePath, level);
    const userId = req.headers['x-user-id'] as string | undefined;

    const savedFile = StorageService.saveProcessedFile(
      compressed.buffer,
      `compressed_${record.originalName}`,
      'application/pdf',
      userId
    );

    const processingTimeMs = Date.now() - startTime;

    db.addOperation({
      userId,
      toolType: 'compress',
      inputFiles: [fileId],
      outputFileId: savedFile.id,
      outputFileName: savedFile.originalName,
      status: 'completed',
      originalSizeBytes: compressed.originalSize,
      processedSizeBytes: compressed.newSize,
      savingsPercentage: compressed.savings,
      processingTimeMs,
    });

    res.json({
      success: true,
      fileId: savedFile.id,
      fileName: savedFile.originalName,
      originalSize: compressed.originalSize,
      compressedSize: compressed.newSize,
      savingsPercentage: compressed.savings,
      downloadUrl: `/api/download/${savedFile.id}`,
      processingTimeMs,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'PDF compression failed' });
  }
});

export default router;
