import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const BASE_DIR = path.resolve(__dirname, '..', '..');
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(BASE_DIR, 'uploads');
const PROCESSED_DIR = process.env.PROCESSED_DIR || path.join(BASE_DIR, 'processed');

// Ensure storage directories exist
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}
if (!fs.existsSync(PROCESSED_DIR)) {
  fs.mkdirSync(PROCESSED_DIR, { recursive: true });
}

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  uploadDir: UPLOAD_DIR,
  processedDir: PROCESSED_DIR,
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '104857600', 10), // 100MB default
  fileRetentionHours: parseInt(process.env.FILE_RETENTION_HOURS || '24', 10), // Auto-delete after 24h
  dbPath: process.env.DB_PATH || path.join(BASE_DIR, 'data', 'metadata.json'),
};
