import { Router, Request, Response } from 'express';
import { StorageService } from '../services/storageService';
import { PdfService } from '../services/pdfService';
import { db } from '../db/store';

const router = Router();

/**
 * POST /api/edit
 * Body: { fileId, rotations, deletePages, reorderPages, watermark, annotations, images }
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
  const startTime = Date.now();
  try {
    const { fileId, rotations, deletePages, reorderPages, watermark, annotations, images } = req.body;
    if (!fileId) {
      res.status(400).json({ error: 'fileId is required' });
      return;
    }

    const record = StorageService.getFile(fileId);
    if (!record) {
      res.status(404).json({ error: 'File not found' });
      return;
    }

    const editedBuffer = await PdfService.editPdf(record.storagePath, {
      rotations,
      deletePages,
      reorderPages,
      watermark,
      annotations,
      images,
    });

    const userId = req.headers['x-user-id'] as string | undefined;
    const saved = StorageService.saveProcessedFile(
      editedBuffer,
      `edited_${record.originalName}`,
      'application/pdf',
      userId
    );

    const processingTimeMs = Date.now() - startTime;
    db.addOperation({
      userId,
      toolType: 'edit',
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
    res.status(500).json({ error: error.message || 'PDF editing failed' });
  }
});

export default router;
