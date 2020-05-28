import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { ensureDirSync, existsSync } from "https://deno.land/std/fs/mod.ts"
import { DownlodedFile, Destination } from "./types.ts"
import { download } from "./mod.ts";

const url:string = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
let fileObj:DownlodedFile;
let fileInfo:Deno.FileInfo;

Deno.test({
  name: "Download File",
  async fn(): Promise<void> {
    const reqInit: RequestInit = {
          method: "GET",
        };
    ensureDirSync('./test');
    const destination: Destination = {
        file: 'example.pdf',
        dir: './test',
        mode: 0o777
    }
    fileObj= await download(url, destination, reqInit);
    assertEquals(true, existsSync(fileObj.fullPath));
  },
});

Deno.test({
  name: "Downloaded File Size",
  fn(): void {
    fileInfo = Deno.lstatSync(fileObj.fullPath);
    assertEquals(fileInfo.size, fileObj.size);
    Deno.removeSync('./test', { recursive: true }); // remove folder in the last test
  },
});

// Deno.FileInfo.mode unstable as of now.
// Deno.test({
//   name: "Check File Permission",
//   fn(): void {
//      assertEquals( 0o777, fileInfo.mode);
//   },
// });

