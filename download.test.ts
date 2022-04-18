import { assertEquals } from "https://deno.land/std@0.134.0/testing/asserts.ts";
import { ensureDirSync } from "https://deno.land/std@0.134.0/fs/mod.ts";
import { Destination, DownlodedFile } from "./types.ts";
import { download } from "./mod.ts";

const url =
  "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
let fileObj: DownlodedFile;
let fileInfo: Deno.FileInfo;

Deno.test({
  name: "Download File",
  async fn(): Promise<void> {
    const reqInit: RequestInit = {
      method: "GET",
    };
    ensureDirSync("./test");
    const destination: Destination = {
      file: "example.pdf",
      dir: "./test",
      mode: 0o777,
    };
    fileObj = await download(url, destination, reqInit);

    const fileStats = await Deno.stat(fileObj.fullPath);
    assertEquals(true, fileStats.isFile);
  },
});

Deno.test({
  name: "Downloaded File Size",
  async fn() {
    fileInfo = await Deno.stat(fileObj.fullPath);
    assertEquals(fileInfo.size, fileObj.size);
    await Deno.remove("./test", { recursive: true }); // remove folder in the last test
  },
});

// Deno.FileInfo.mode unstable as of now.
// Deno.test({
//   name: "Check File Permission",
//   fn(): void {
//      assertEquals( 0o777, fileInfo.mode);
//   },
// });
