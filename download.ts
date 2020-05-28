import { Destination, DownlodedFile } from "./lib.d.ts";

/**
 * Download file using the fetch api
 */
export async function download(
  url:string|URL,
  destination?:Destination,
  options?:RequestInit
): Promise<DownlodedFile>{
    let file:string;
    let filePath:string;
    let dir:string = '';
    let mode:number;
    let finalUrl:string;

    const response: Response = await fetch(url, options);
    finalUrl = response.url.replace(/\/$/, "");
    if(response.status != 200){
      return Promise.reject(
        new Deno.errors.Http(`status ${response.status}-'${response.statusText}' received instead of 200`)
      );
    }
    const blob: Blob = await response.blob();
    const buffer: ArrayBuffer = await blob.arrayBuffer();
    const unit8arr: Uint8Array = new Deno.Buffer(buffer).bytes();
    if( typeof destination === 'undefined' || typeof destination.dir === 'undefined' ){
      dir = Deno.makeTempDirSync({ prefix: 'deno_dwld' });
    } else {
      dir = destination.dir;
    }
    if(typeof destination === 'undefined' || typeof destination.file === 'undefined' ){
      file = finalUrl.substring(finalUrl.lastIndexOf('/')+1);
    } else {
      file = destination.file;
    }
    dir = dir.replace(/\/$/, "");
    filePath = `${dir}/${file}`;
    Deno.writeFileSync(filePath, unit8arr);
    return Promise.resolve({filePath, file, dir});
}