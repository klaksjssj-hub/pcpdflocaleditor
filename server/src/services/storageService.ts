import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config';
import { db, FileRecord } from '../db/store';

export class StorageService {
  /**
   * Register an uploaded multer file into the store
   */
  public static registerUploadedFile(file: Express.Multer.File, userId?: string): FileRecord {
    const expiresAt = new Date(Date.now() + config.fileRetentionHours * 3600 * 1000).toISOString();
    return db.addFile({
      userId,
      originalName: file.originalname,
      storedName: file.filename,
      mimeType: file.mimetype,
      fileSizeBytes: file.size,
      storagePath: file.path,
      isProcessed: false,
      expiresAt,
    });
  }

  /**
   * Save a processed buffer to the processed folder and register in db
   */
  public static saveProcessedFile(
    buffer: Buffer,
    originalName: string,
    mimeType: string,
    userId?: string
  ): FileRecord {
    const ext = path.extname(originalName) || '.pdf';
    const storedName = `processed_${uuidv4()}${ext}`;
    const storagePath = path.join(config.processedDir, storedName);

    fs.writeFileSync(storagePath, buffer);

    const expiresAt = new Date(Date.now() + config.fileRetentionHours * 3600 * 1000).toISOString();

    return db.addFile({
      userId,
      originalName,
      storedName,
      mimeType,
      fileSizeBytes: buffer.length,
      storagePath,
      isProcessed: true,
      expiresAt,
    });
  }

  /**
   * Retrieve file path and metadata
   */
  public static getFile(id: string): FileRecord | null {
    const record = db.getFile(id);
    if (!record) return null;
    if (!fs.existsSync(record.storagePath)) {
      return null;
    }
    return record;
  }

  /**
   * Delete file from disk and mark deleted in DB
   */
  public static deleteFile(id: string): boolean {
    const record = db.getFile(id);
    if (!record) return false;
    try {
      if (fs.existsSync(record.storagePath)) {
        fs.unlinkSync(record.storagePath);
      }
    } catch (e) {
      console.error(`Error deleting file from disk: ${record.storagePath}`, e);
    }
    return db.markFileDeleted(id);
  }

  /**
   * Scheduled cleanup of expired files (older than 24h)
   */
  public static cleanupExpiredFiles(): number {
    const expired = db.getExpiredFiles();
    let cleaned = 0;
    for (const file of expired) {
      try {
        if (fs.existsSync(file.storagePath)) {
          fs.unlinkSync(file.storagePath);
        }
      } catch (err) {
        console.warn(`Could not unlink expired file ${file.storagePath}:`, err);
      }
      db.markFileDeleted(file.id);
      cleaned++;
    }
    if (cleaned > 0) {
      console.log(`[StorageService] Cleaned up ${cleaned} expired files.`);
    }
    return cleaned;
  }
}
