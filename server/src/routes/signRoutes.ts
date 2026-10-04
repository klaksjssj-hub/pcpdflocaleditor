import { Router, Request, Response } from 'express';
import { StorageService } from '../services/storageService';
import { PdfService, SignatureItem } from '../services/pdfService';
import { db } from '../db/store';

const router = Router();

/**
 * POST /api/sign
 * Body: { fileId, signatures: [{ page, signatureDataUrl, x, y, width, height }] }
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
  const startTime = Date.now();
  try {
    const { fileId, signatures } = req.body;
    if (!fileId) {
      res.status(400).json({ error: 'fileId is required' });
      return;
    }
    if (!signatures || !Array.isArray(signatures) || signatures.length === 0) {
      res.status(400).json({ error: 'At least one signature placement is required' });
      return;
    }

    const record = StorageService.getFile(fileId);
    if (!record) {
      res.status(404).json({ error: 'File not found' });
      return;
    }

    const signedBuffer = await PdfService.signPdf(record.storagePath, signatures as SignatureItem[]);
    const userId = req.headers['x-user-id'] as string | undefined;

    const saved = StorageService.saveProcessedFile(
      signedBuffer,
      `signed_${record.originalName}`,
      'application/pdf',
      userId
    );

    const processingTimeMs = Date.now() - startTime;
    db.addOperation({
      userId,
      toolType: 'sign',
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
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'E-Signing PDF failed' });
  }
});

export default router;
