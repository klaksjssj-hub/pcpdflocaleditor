import { Router, Request, Response } from 'express';
import { StorageService } from '../services/storageService';
import { PdfService } from '../services/pdfService';
import { db } from '../db/store';

const router = Router();

/**
 * POST /api/protect
 * Body: { fileId, userPassword, ownerPassword, permissions }
 */
router.post('/protect', async (req: Request, res: Response): Promise<void> => {
  const startTime = Date.now();
  try {
    const { fileId, userPassword, ownerPassword, permissions } = req.body;
    if (!fileId) {
      res.status(400).json({ error: 'fileId is required' });
      return;
    }
    if (!userPassword) {
      res.status(400).json({ error: 'Password is required to protect PDF' });
      return;
    }

    const record = StorageService.getFile(fileId);
    if (!record) {
      res.status(404).json({ error: 'File not found' });
      return;
    }

    const protectedBuffer = await PdfService.protectPdf(record.storagePath, {
      userPassword,
      ownerPassword,
      permissions,
    });

    const userId = req.headers['x-user-id'] as string | undefined;
    const saved = StorageService.saveProcessedFile(
      protectedBuffer,
      `protected_${record.originalName}`,
      'application/pdf',
      userId
    );

    const processingTimeMs = Date.now() - startTime;
    db.addOperation({
      userId,
      toolType: 'protect',
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
    res.status(500).json({ error: error.message || 'PDF protection failed' });
  }
});

/**
 * POST /api/unlock
 * Body: { fileId, password }
 */
router.post('/unlock', async (req: Request, res: Response): Promise<void> => {
  const startTime = Date.now();
  try {
    const { fileId, password } = req.body;
    if (!fileId) {
      res.status(400).json({ error: 'fileId is required' });
      return;
    }

    const record = StorageService.getFile(fileId);
    if (!record) {
      res.status(404).json({ error: 'File not found' });
      return;
    }

    const unlockedBuffer = await PdfService.unlockPdf(record.storagePath, password);
    const userId = req.headers['x-user-id'] as string | undefined;

    const saved = StorageService.saveProcessedFile(
      unlockedBuffer,
      `unlocked_${record.originalName}`,
      'application/pdf',
      userId
    );

    const processingTimeMs = Date.now() - startTime;
    db.addOperation({
      userId,
      toolType: 'unlock',
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
    res.status(500).json({ error: error.message || 'PDF unlock failed' });
  }
});

export default router;
