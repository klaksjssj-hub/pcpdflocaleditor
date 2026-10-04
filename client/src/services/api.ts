import { UploadedFileItem, DashboardStats, OperationHistoryItem } from '../types';

const API_BASE = '/api';

export const apiClient = {
  /**
   * Upload multiple files to server
   */
  async uploadFiles(files: File[], onProgress?: (percent: number) => void): Promise<UploadedFileItem[]> {
    const formData = new FormData();
    for (const f of files) {
      formData.append('files', f);
    }

    const xhr = new XMLHttpRequest();
    return new Promise((resolve, reject) => {
      xhr.open('POST', `${API_BASE}/upload`);

      if (onProgress && xhr.upload) {
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            onProgress(Math.round((e.loaded / e.total) * 100));
          }
        };
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const res = JSON.parse(xhr.responseText);
          const mapped: UploadedFileItem[] = res.files.map((rec: any, idx: number) => ({
            id: rec.id,
            serverFileId: rec.id,
            file: files[idx] || new File([], rec.originalName),
            name: rec.originalName,
            size: rec.fileSizeBytes,
            type: rec.mimeType,
            pageCount: rec.pageCount,
          }));
          resolve(mapped);
        } else {
          try {
            const err = JSON.parse(xhr.responseText);
            reject(new Error(err.error || 'Upload failed'));
          } catch {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        }
      };

      xhr.onerror = () => reject(new Error('Network error during upload'));
      xhr.send(formData);
    });
  },

  /**
   * Merge PDFs on server
   */
  async mergePdfs(files: { fileId: string; pages?: number[] }[]) {
    const res = await fetch(`${API_BASE}/merge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ files }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Merge failed');
    }
    return res.json();
  },

  /**
   * Split PDF on server
   */
  async splitPdf(payload: {
    fileId: string;
    mode: 'range' | 'extract' | 'splitEveryN';
    ranges?: string;
    pages?: number[];
    n?: number;
  }) {
    const res = await fetch(`${API_BASE}/split`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Split failed');
    }
    return res.json();
  },

  /**
   * Compress PDF on server
   */
  async compressPdf(fileId: string, level: 'low' | 'medium' | 'high') {
    const res = await fetch(`${API_BASE}/compress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileId, level }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Compression failed');
    }
    return res.json();
  },

  /**
   * Convert file on server
   */
  async convert(payload: { fileId?: string; fileIds?: string[]; to: string }) {
    const res = await fetch(`${API_BASE}/convert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Conversion failed');
    }
    return res.json();
  },

  /**
   * Edit PDF on server
   */
  async editPdf(payload: {
    fileId: string;
    rotations?: { [pageNum: number]: number };
    deletePages?: number[];
    reorderPages?: number[];
    watermark?: {
      text?: string;
      opacity?: number;
      rotationDegrees?: number;
      fontSize?: number;
    };
    annotations?: any[];
  }) {
    const res = await fetch(`${API_BASE}/edit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Edit failed');
    }
    return res.json();
  },

  /**
   * Password protect PDF
   */
  async protectPdf(fileId: string, userPassword: string) {
    const res = await fetch(`${API_BASE}/protect/protect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileId, userPassword }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Protection failed');
    }
    return res.json();
  },

  /**
   * Unlock PDF
   */
  async unlockPdf(fileId: string, password?: string) {
    const res = await fetch(`${API_BASE}/protect/unlock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileId, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Unlock failed');
    }
    return res.json();
  },

  /**
   * Sign PDF
   */
  async signPdf(fileId: string, signatures: any[]) {
    const res = await fetch(`${API_BASE}/sign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileId, signatures }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Sign failed');
    }
    return res.json();
  },

  /**
   * OCR PDF
   */
  async ocrPdf(fileId: string, language: string = 'eng') {
    const res = await fetch(`${API_BASE}/ocr`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileId, language }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'OCR failed');
    }
    return res.json();
  },

  /**
   * Get operations history
   */
  async getHistory(): Promise<{ operations: OperationHistoryItem[] }> {
    const res = await fetch(`${API_BASE}/history`);
    if (!res.ok) throw new Error('Failed to load history');
    return res.json();
  },

  /**
   * Get dashboard statistics
   */
  async getStats(): Promise<{ stats: DashboardStats }> {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error('Failed to load stats');
    return res.json();
  },

  /**
   * Get templates
   */
  async getTemplates() {
    const res = await fetch(`${API_BASE}/templates`);
    if (!res.ok) throw new Error('Failed to load templates');
    return res.json();
  },

  /**
   * Save template
   */
  async saveTemplate(name: string, toolType: string, config: any) {
    const res = await fetch(`${API_BASE}/templates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, toolType, config }),
    });
    if (!res.ok) throw new Error('Failed to save template');
    return res.json();
  },
};
