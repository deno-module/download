import { Destination, DownlodedFile } from "./types.ts";
import { ensureDirSync } from "https://deno.land/std@0.77.0/fs/mod.ts"

/** Download file from url to the destination. */
export async function download(
  url:string|URL,
  destination?:Destination,
  options?:RequestInit
): Promise<DownlodedFile>{
    let file:string;
    let fullPath:string;
    let dir:string = '';
    let mode:object = {};
    let finalUrl:string;
    let size:number;

    const response = await fetch(url, options);
    finalUrl = response.url.replace(/\/$/, "");
    if(response.status != 200){
      return Promise.reject(
        new Deno.errors.Http(`status ${response.status}-'${response.statusText}' received instead of 200`)
      );
    }
    const blob = await response.blob();
    /** size in bytes */
    size = blob.size;
    const buffer = await blob.arrayBuffer();
    const unit8arr = new Deno.Buffer(buffer).bytes();
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
    if(typeof destination != 'undefined' && typeof destination.mode != 'undefined' ){
        mode = { mode: destination.mode }
    }

    dir = dir.replace(/\/$/, "");
    ensureDirSync(dir)
    fullPath = `${dir}/${file}`;
    Deno.writeFileSync(fullPath, unit8arr, mode);
    return Promise.resolve({file, dir, fullPath, size});
}