import { DashboardStats, OperationHistoryItem } from '../types';

const STORAGE_KEYS = {
  HISTORY: 'localpdf_history',
  STATS: 'localpdf_stats',
  TEMPLATES: 'localpdf_templates',
};

export const clientStorage = {
  getHistory(): OperationHistoryItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addHistory(item: {
    toolType: string;
    fileName: string;
    fileSizeBytes: number;
    processingTimeMs: number;
  }): void {
    try {
      const history = this.getHistory();
      const newItem: OperationHistoryItem = {
        id: `op_${Date.now()}`,
        toolType: item.toolType,
        inputFiles: [item.fileName],
        outputFileName: item.fileName,
        status: 'completed',
        originalSizeBytes: item.fileSizeBytes,
        processedSizeBytes: item.fileSizeBytes,
        processingTimeMs: item.processingTimeMs,
        createdAt: new Date().toISOString(),
      };

      const updated = [newItem, ...history].slice(0, 100);
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));

      // Update stats
      this.incrementStats(item.toolType, item.fileSizeBytes);
    } catch (e) {
      console.warn('Failed to save history to localStorage', e);
    }
  },

  getStats(): DashboardStats {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STATS);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // fallback
    }

    // Compute from history if stats don't exist yet
    const history = this.getHistory();
    const toolCounts: Record<string, number> = {};
    let totalBytes = 0;

    history.forEach((h) => {
      toolCounts[h.toolType] = (toolCounts[h.toolType] || 0) + 1;
      totalBytes += h.originalSizeBytes || 0;
    });

    return {
      totalOperations: history.length,
      totalFilesProcessed: history.length,
      totalBytesSaved: Math.round(totalBytes * 0.25),
      toolUsage: toolCounts,
    };
  },

  incrementStats(toolType: string, fileSizeBytes: number) {
    const stats = this.getStats();
    stats.totalOperations += 1;
    stats.totalFilesProcessed += 1;
    stats.totalBytesSaved = (stats.totalBytesSaved || 0) + Math.round(fileSizeBytes * 0.25);
    stats.toolUsage = stats.toolUsage || {};
    stats.toolUsage[toolType] = (stats.toolUsage[toolType] || 0) + 1;

    try {
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    } catch (e) {
      console.warn('Failed to persist stats', e);
    }
  },

  getTemplates(): any[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
      return data
        ? JSON.parse(data)
        : [
            { id: '1', name: 'High Compression Preset', toolType: 'compress', config: { level: 'high' } },
            { id: '2', name: 'Executive Watermark', toolType: 'edit', config: { watermark: 'CONFIDENTIAL' } },
          ];
    } catch {
      return [];
    }
  },

  saveTemplate(name: string, toolType: string, config: any): any {
    const templates = this.getTemplates();
    const newTpl = {
      id: `tpl_${Date.now()}`,
      name,
      toolType,
      config,
    };
    const updated = [newTpl, ...templates];
    try {
      localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save template', e);
    }
    return newTpl;
  },

  clearHistory(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
      localStorage.removeItem(STORAGE_KEYS.STATS);
    } catch (e) {
      console.warn(e);
    }
  },
};
