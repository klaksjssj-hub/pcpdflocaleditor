import { Router, Request, Response } from 'express';
import { StorageService } from '../services/storageService';
import { PdfService } from '../services/pdfService';
import { db } from '../db/store';

const router = Router();

/**
 * POST /api/merge
 * Body: { files: [{ fileId: string, pages?: number[] }] }
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
  const startTime = Date.now();
  try {
    const { files } = req.body;
    if (!files || !Array.isArray(files) || files.length < 2) {
      res.status(400).json({ error: 'Please provide at least 2 PDF files to merge' });
      return;
    }

    const mergeItems = [];
    let totalOriginalSize = 0;
    const fileIds: string[] = [];

    for (const item of files) {
      const fileId = typeof item === 'string' ? item : item.fileId;
      const record = StorageService.getFile(fileId);
      if (!record) {
        res.status(404).json({ error: `File with ID ${fileId} not found` });
        return;
      }
      totalOriginalSize += record.fileSizeBytes;
      fileIds.push(fileId);
      mergeItems.push({
        path: record.storagePath,
        pages: item.pages,
      });
    }

    const mergedBuffer = await PdfService.mergePdfs(mergeItems);
    const userId = req.headers['x-user-id'] as string | undefined;

    const savedFile = StorageService.saveProcessedFile(
      mergedBuffer,
      `merged_${Date.now()}.pdf`,
      'application/pdf',
      userId
    );

    const processingTimeMs = Date.now() - startTime;

    db.addOperation({
      userId,
      toolType: 'merge',
      inputFiles: fileIds,
      outputFileId: savedFile.id,
      outputFileName: savedFile.originalName,
      status: 'completed',
      originalSizeBytes: totalOriginalSize,
      processedSizeBytes: savedFile.fileSizeBytes,
      processingTimeMs,
    });

    res.json({
      success: true,
      fileId: savedFile.id,
      fileName: savedFile.originalName,
      fileSize: savedFile.fileSizeBytes,
      downloadUrl: `/api/download/${savedFile.id}`,
      processingTimeMs,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'PDF merge failed' });
  }
});

export default router;
