import { Router, Request, Response } from 'express';
import { StorageService } from '../services/storageService';
import { OcrService } from '../services/ocrService';
import { db } from '../db/store';

const router = Router();

/**
 * POST /api/ocr
 * Body: { fileId, language }
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
  const startTime = Date.now();
  try {
    const { fileId, language = 'eng' } = req.body;
    if (!fileId) {
      res.status(400).json({ error: 'fileId is required' });
      return;
    }

    const record = StorageService.getFile(fileId);
    if (!record) {
      res.status(404).json({ error: 'File not found' });
      return;
    }

    const result = await OcrService.recognizeText(record.storagePath, language);
    const userId = req.headers['x-user-id'] as string | undefined;

    let savedSearchablePdf;
    if (result.searchablePdfBuffer) {
      savedSearchablePdf = StorageService.saveProcessedFile(
        result.searchablePdfBuffer,
        `ocr_searchable_${record.originalName}.pdf`,
        'application/pdf',
        userId
      );
    }

    const processingTimeMs = Date.now() - startTime;
    db.addOperation({
      userId,
      toolType: 'ocr',
      inputFiles: [fileId],
      outputFileId: savedSearchablePdf?.id,
      outputFileName: savedSearchablePdf?.originalName,
      status: 'completed',
      originalSizeBytes: record.fileSizeBytes,
      processedSizeBytes: savedSearchablePdf?.fileSizeBytes,
      processingTimeMs,
    });

    res.json({
      success: true,
      text: result.text,
      confidence: result.confidence,
      language: result.language,
      fileId: savedSearchablePdf?.id,
      fileName: savedSearchablePdf?.originalName,
      downloadUrl: savedSearchablePdf ? `/api/download/${savedSearchablePdf.id}` : undefined,
      processingTimeMs,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'OCR processing failed' });
  }
});

export default router;
