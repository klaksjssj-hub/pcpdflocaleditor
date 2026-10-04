import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, config.uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${uuidv4()}${ext}`;
    cb(null, uniqueName);
  },
});

const allowedMimeTypes = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-powerpoint',
  'text/plain',
  'text/html'
];

export const upload = multer({
  storage,
  limits: {
    fileSize: config.maxFileSize, // 100MB
    files: 20, // up to 20 files per batch
  },
  fileFilter: (_req, file, cb) => {
    // Check MIME type or extension
    const ext = path.extname(file.originalname).toLowerCase();
    const validExts = ['.pdf', '.jpg', '.jpeg', '.png', '.webp', '.docx', '.doc', '.xlsx', '.xls', '.pptx', '.ppt', '.txt', '.html'];
    
    if (allowedMimeTypes.includes(file.mimetype) || validExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype} (${ext}). Allowed: PDF, Images, Word, Excel, PPT.`));
    }
  },
});
