export type ToolId =
  | 'merge'
  | 'split'
  | 'compress'
  | 'pdf-to-word'
  | 'pdf-to-excel'
  | 'pdf-to-html'
  | 'images-to-pdf'
  | 'edit'
  | 'watermark'
  | 'rotate'
  | 'protect'
  | 'unlock'
  | 'sign'
  | 'ocr';

export interface ToolDefinition {
  id: ToolId;
  title: string;
  description: string;
  category: 'organize' | 'optimize' | 'convert' | 'edit' | 'security';
  icon: string;
  color: string;
  badge?: string;
  path: string;
}

export interface UploadedFileItem {
  id: string; // server ID or local client ID
  file: File;
  name: string;
  size: number;
  type: string;
  pageCount?: number;
  previewUrl?: string;
  serverFileId?: string;
}

export interface OperationHistoryItem {
  id: string;
  toolType: string;
  inputFiles: string[];
  outputFileId?: string;
  outputFileName?: string;
  status: string;
  originalSizeBytes: number;
  processedSizeBytes?: number;
  savingsPercentage?: number;
  processingTimeMs: number;
  createdAt: string;
}

export interface DashboardStats {
  totalOperations: number;
  totalFilesProcessed: number;
  totalBytesSaved: number;
  toolUsage: Record<string, number>;
}
