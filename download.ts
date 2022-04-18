import { Destination, DownloadedFile } from "./types.ts";
import { Buffer } from "https://deno.land/std@0.135.0/io/buffer.ts";

// TODO(kt-12): Enable ensure dir once stable.
// import { ensureDirSync } from "https://deno.land/std/fs/mod.ts"

/** Download file from url to the destination. */

// Overload Signature to be called with a fetch request object
export async function download(
  request: Request,
  destination?: Destination,
  options?: RequestInit,
): Promise<DownloadedFile>;

// Overload Signature to be called with a simple string url
export async function download(
  url: string,
  destination?: Destination,
  options?: RequestInit,
): Promise<DownloadedFile>;

// "download" function implementation
export async function download(
  fetchInput: string | Request,
  destination?: Destination,
  options?: RequestInit,
): Promise<DownloadedFile> {
  const response = await fetch(fetchInput, options);
  if (response.status !== 200) {
    throw new Deno.errors.Http(
      `status ${response.status}-'${response.statusText}' received instead of 200`,
    );
  }

  const finalUrl = response.url.replace(/\/$/, "");
  const blob = await response.blob();
  /** size in bytes */
  const size = blob.size;
  const buffer = await blob.arrayBuffer();
  const unit8arr = new Buffer(buffer).bytes();

  // ?. operator - returns undefined, if destination is undefined
  // ?.dir expression - returns undefined, when dir prop is undefined
  // ?? operator -  returns the right side expression, when left side is undefined
  let dir = destination?.dir ?? Deno.makeTempDirSync({ prefix: "deno_dwld" });
  const file = destination?.file ??
    finalUrl.substring(finalUrl.lastIndexOf("/") + 1);
  const mode = (destination?.mode !== undefined)
    ? { mode: destination.mode }
    : {};

  dir = dir.replace(/\/$/, "");
  // TODO(kt-12): Enable ensureDirSync once stable.
  // ensureDirSync(dir)

  const fullPath = `${dir}/${file}`;
  await Deno.writeFile(fullPath, unit8arr, mode);
  return { file, dir, fullPath, size };
}
