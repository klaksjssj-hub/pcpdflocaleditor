import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config';

export interface FileRecord {
  id: string;
  userId?: string;
  originalName: string;
  storedName: string;
  mimeType: string;
  fileSizeBytes: number;
  pageCount?: number;
  storagePath: string;
  isProcessed: boolean;
  isDeleted: boolean;
  expiresAt: string;
  createdAt: string;
}

export interface OperationRecord {
  id: string;
  userId?: string;
  toolType: string;
  inputFiles: string[];
  outputFileId?: string;
  outputFileName?: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  originalSizeBytes: number;
  processedSizeBytes?: number;
  savingsPercentage?: number;
  processingTimeMs: number;
  createdAt: string;
}

export interface SavedTemplate {
  id: string;
  userId?: string;
  name: string;
  toolType: string;
  config: Record<string, any>;
  createdAt: string;
}

interface DatabaseData {
  files: Record<string, FileRecord>;
  operations: OperationRecord[];
  templates: SavedTemplate[];
}

class Store {
  private data: DatabaseData = {
    files: {},
    operations: [],
    templates: [],
  };
  private filePath: string;

  constructor() {
    this.filePath = config.dbPath;
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    this.load();
  }

  private load(): void {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        this.data = JSON.parse(raw);
      } else {
        this.save();
      }
    } catch (err) {
      console.warn('Failed to load database JSON file, using in-memory store:', err);
    }
  }

  private save(): void {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  // --- Files ---
  public addFile(record: Omit<FileRecord, 'id' | 'createdAt' | 'isDeleted'>): FileRecord {
    const id = uuidv4();
    const now = new Date().toISOString();
    const newRecord: FileRecord = {
      ...record,
      id,
      isDeleted: false,
      createdAt: now,
    };
    this.data.files[id] = newRecord;
    this.save();
    return newRecord;
  }

  public getFile(id: string): FileRecord | undefined {
    const file = this.data.files[id];
    if (file && !file.isDeleted) {
      return file;
    }
    return undefined;
  }

  public markFileDeleted(id: string): boolean {
    const file = this.data.files[id];
    if (file) {
      file.isDeleted = true;
      this.save();
      return true;
    }
    return false;
  }

  // --- Operations History ---
  public addOperation(record: Omit<OperationRecord, 'id' | 'createdAt'>): OperationRecord {
    const id = uuidv4();
    const op: OperationRecord = {
      ...record,
      id,
      createdAt: new Date().toISOString(),
    };
    this.data.operations.unshift(op);
    // keep recent 1000 operations
    if (this.data.operations.length > 1000) {
      this.data.operations = this.data.operations.slice(0, 1000);
    }
    this.save();
    return op;
  }

  public getOperations(userId?: string): OperationRecord[] {
    if (!userId) {
      return this.data.operations.slice(0, 50);
    }
    return this.data.operations.filter((op) => op.userId === userId);
  }

  // --- Statistics ---
  public getStatistics() {
    const totalOps = this.data.operations.length;
    let totalBytesSaved = 0;
    let totalFilesProcessed = 0;

    const toolUsage: Record<string, number> = {};

    for (const op of this.data.operations) {
      toolUsage[op.toolType] = (toolUsage[op.toolType] || 0) + 1;
      totalFilesProcessed += op.inputFiles.length;
      if (op.originalSizeBytes && op.processedSizeBytes && op.originalSizeBytes > op.processedSizeBytes) {
        totalBytesSaved += (op.originalSizeBytes - op.processedSizeBytes);
      }
    }

    return {
      totalOperations: totalOps,
      totalFilesProcessed,
      totalBytesSaved,
      toolUsage,
    };
  }

  // --- Templates ---
  public addTemplate(template: Omit<SavedTemplate, 'id' | 'createdAt'>): SavedTemplate {
    const record: SavedTemplate = {
      ...template,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    this.data.templates.push(record);
    this.save();
    return record;
  }

  public getTemplates(userId?: string): SavedTemplate[] {
    if (!userId) return this.data.templates;
    return this.data.templates.filter((t) => t.userId === userId);
  }

  // --- Cleanup Expired Files ---
  public getExpiredFiles(): FileRecord[] {
    const now = new Date().toISOString();
    return Object.values(this.data.files).filter(
      (f) => !f.isDeleted && f.expiresAt <= now
    );
  }
}

export const db = new Store();
