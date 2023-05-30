export interface Destination {
  dir?: string;
  file?: string;
  mode?: number;
}

export interface DownloadedFile {
  file: string;
  dir: string;
  fullPath: string;
  size: number;
}
