export type ExportFormat = 'pdf' | 'docx' | 'md' | 'json';

export interface ExportOptions {
  outputDir?: string;
  filename?: string;
  author?: string;
}

export interface ExportResult {
  format: ExportFormat;
  filePath: string;
  bytesWritten: number;
}
