export type Input = string | Request;

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

export interface DownloadAllParams {
  input: Input;
  destination?: Destination;
  options?: RequestInit;
}
