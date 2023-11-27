import {
  assertEquals,
  assertRejects,
} from "https://deno.land/std@0.190.0/testing/asserts.ts";
import { ensureDirSync } from "https://deno.land/std@0.190.0/fs/mod.ts";
import * as mockFetch from "https://deno.land/x/mock_fetch@0.3.0/mod.ts";
import { Destination, DownloadAllParams, DownloadedFile } from "./types.ts";
import { download, downloadAll } from "./mod.ts";

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

Deno.test({
  name: "file download throws error when fetch return status!=200",
  async fn() {
    mockFetch.install();
    mockFetch.mock("GET@/sample.pdf", () => {
      return new Response("Error!", {
        status: 500,
        statusText: "invalid url",
      });
    });
    await assertRejects(
      () => download("https://example.com/sample.pdf"),
      Error,
      "status 500-'invalid url' received instead of 200",
    );
    mockFetch.uninstall();
  },
});

Deno.test({
  name: "Multiple files download with all parameters available",
  async fn(t) {
    let fileObjList: DownloadedFile[];
    await t.step(`download all files`, async () => {
      ensureDirSync("./test");
      const options: RequestInit = {
        method: "GET",
      };

      const downloadList: DownloadAllParams[] = [{
        input: url,
        output: "example1.pdf",
      }, {
        input: "https://www.africau.edu/images/default/sample.pdf",
        output: "example2.pdf",
      }].map(({ input, output }) => ({
        input,
        destination: { file: output, dir: "./test", mode: 0o777 },
        options,
      }));

      fileObjList = await downloadAll(downloadList);

      for (const fileObj of fileObjList) {
        const fileStats = await Deno.stat(fileObj.fullPath);
        assertEquals(true, fileStats.isFile);
      }
    });

    // Step 2
    await t.step(
      `check all downloaded file size and remove destination folder`,
      async () => {
        for (const fileObj of fileObjList) {
          const fileInfo = await Deno.stat(fileObj.fullPath);
          assertEquals(fileInfo.size, fileObj.size);
        }
        await Deno.remove("./test", { recursive: true }); // remove folder in the last test
      },
    );
  },
});

Deno.test({
  name: "Multiple files download with destination.mode and options missing",
  async fn() {
    ensureDirSync("./test");

    const downloadList: DownloadAllParams[] = [{
      input: url,
      output: "example1.pdf",
    }, {
      input: "https://www.africau.edu/images/default/sample.pdf",
      output: "example2.pdf",
    }].map(({ input, output }) => ({
      input,
      destination: { file: output, dir: "./test" },
    }));

    const fileObjList: DownloadedFile[] = await downloadAll(downloadList);

    for (const fileObj of fileObjList) {
      const fileStats = await Deno.stat(fileObj.fullPath);
      assertEquals(true, fileStats.isFile);
    }
    await Deno.remove("./test", { recursive: true });
  },
});

Deno.test({
  name: "Multiple files download throws error when url is incorrect",
  async fn() {
    const input = "https://www.non-exitent-url.com";
    await assertRejects(
      () =>
        downloadAll([{
          input,
        }]),
      Error,
      `error sending request for url (${input}/): error trying to connect: dns error: No such host is known. (os error 11001)`,
    );
  },
});

Deno.test({
  name: "Multiple files download throws error when fetch return status!=200",
  async fn() {
    mockFetch.install();
    mockFetch.mock("GET@/sample.pdf", () => {
      return new Response("Error!", {
        status: 500,
        statusText: "invalid url",
      });
    });
    await assertRejects(
      () =>
        downloadAll([{
          input: "https://example.com/sample.pdf",
        }]),
      Error,
      "status 500-'invalid url' received instead of 200",
    );
    mockFetch.uninstall();
  },
});
