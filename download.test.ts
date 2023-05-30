import { assertEquals } from "https://deno.land/std@0.134.0/testing/asserts.ts";
import { ensureDirSync } from "https://deno.land/std@0.134.0/fs/mod.ts";
import { Destination, DownloadedFile } from "./types.ts";
import { download } from "./mod.ts";

const url =
  "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

// t = Deno Test Context

Deno.test({
  name: "File Download",
  async fn(t) {
    let fileObj: DownloadedFile;

    // Step 1
    await t.step(`Step 1 - Download`, async () => {
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
    });

    // Step 2
    await t.step(`Step 2 - Check file size`, async () => {
      const fileInfo = await Deno.stat(fileObj.fullPath);
      assertEquals(fileInfo.size, fileObj.size);
      await Deno.remove("./test", { recursive: true }); // remove folder in the last test
    });

    // Step 3
    // Deno.FileInfo.mode unstable as of now.
    // await t.step(`Step 3 - Check file permissions`, async () => {
    //   const fileInfo: Deno.FileInfo = await Deno.stat(fileObj.fullPath);
    //   assertEquals(0o777, fileInfo.mode);
    // });
  },
});
