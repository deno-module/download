export interface Destination {
  dir?: string,
  file?: string,
  mode?: number
}

export interface DownlodedFile {
  file: string,
  dir:string,
  fullPath: string,
  size: number
}