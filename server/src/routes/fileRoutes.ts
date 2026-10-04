import { Router, Request, Response } from 'express';
import { upload } from '../middleware/upload';
import { StorageService } from '../services/storageService';
import { db } from '../db/store';
import { PdfService } from '../services/pdfService';

const router = Router();

/**
 * POST /api/upload
 * Multi-file or single-file upload endpoint
 */
router.post('/upload', upload.array('files', 20), async (req: Request, res: Response): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      res.status(400).json({ error: 'No files uploaded' });
      return;
    }

    const userId = req.headers['x-user-id'] as string | undefined;
    const uploadedRecords = [];

    for (const f of files) {
      const record = StorageService.registerUploadedFile(f, userId);
      // Try to determine page count if it's a PDF
      if (f.mimetype === 'application/pdf') {
        try {
          const info = await PdfService.getPdfInfo(f.path);
          record.pageCount = info.pageCount;
        } catch {}
      }
      uploadedRecords.push(record);
    }

    res.json({
      success: true,
      files: uploadedRecords,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'File upload failed' });
  }
});

/**
 * GET /api/download/:fileId
 * Download processed or uploaded file
 */
router.get('/download/:fileId', (req: Request, res: Response): void => {
  try {
    const { fileId } = req.params;
    const record = StorageService.getFile(fileId);

    if (!record) {
      res.status(404).json({ error: 'File not found or expired' });
      return;
    }

    res.download(record.storagePath, record.originalName);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to download file' });
  }
});

/**
 * DELETE /api/file/:fileId
 * Delete a temporary file immediately
 */
router.delete('/file/:fileId', (req: Request, res: Response): void => {
  try {
    const { fileId } = req.params;
    const success = StorageService.deleteFile(fileId);
    if (!success) {
      res.status(404).json({ error: 'File not found or already deleted' });
      return;
    }
    res.json({ success: true, message: 'File deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete file' });
  }
});

/**
 * GET /api/history
 * Fetch user file history / operations
 */
router.get('/history', (req: Request, res: Response): void => {
  try {
    const userId = req.headers['x-user-id'] as string | undefined;
    const operations = db.getOperations(userId);
    res.json({ success: true, operations });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/stats
 * Dashboard usage analytics
 */
router.get('/stats', (_req: Request, res: Response): void => {
  try {
    const stats = db.getStatistics();
    res.json({ success: true, stats });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/templates
 * Saved configuration templates
 */
router.get('/templates', (req: Request, res: Response): void => {
  try {
    const userId = req.headers['x-user-id'] as string | undefined;
    const templates = db.getTemplates(userId);
    res.json({ success: true, templates });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/templates
 * Save a new preset template
 */
router.post('/templates', (req: Request, res: Response): void => {
  try {
    const { name, toolType, config } = req.body;
    if (!name || !toolType) {
      res.status(400).json({ error: 'Missing name or toolType' });
      return;
    }
    const userId = req.headers['x-user-id'] as string | undefined;
    const template = db.addTemplate({ name, toolType, config: config || {}, userId });
    res.json({ success: true, template });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
