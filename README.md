# `download⤵️` for Deno

[![Travis](http://img.shields.io/travis/deno-module/download.svg?style=flat)](https://travis-ci.org/github/deno-module/download/) [![tag](https://img.shields.io/badge/deno->=1.0.2-green.svg?color=blue&logo=qcom&logoColor=blue&style=plastic)](https://github.com/denoland/deno)


Deno `fetch api` based module to `download` file from a URL.

## Import

A specific version (preferred): 
```ts
// Note this "@v1.0.1" part in the url, 
// this can be any version tag of this library
import { download } from "https://deno.land/x/download@v1.0.1/mod.ts";
```

Non-versioned URL / "latest" (for quick tests only!): 
```ts
import { download } from "https://deno.land/x/download/mod.ts";
```

Note: The problem with importing the versionless url is
that each team member might get a different version of this library, 
depending on when they downloaded this lib the first time.  
Therefore it's better to import from a versioned url and update the version manually. 

Extra Tip: To avoid needing to update this url in every file in your codebase, 
you can write a file like `/dependencies/download.ts` in your repo, 
which re-exports the contents of this library like this: 

```ts
export * from "https://deno.land/x/download@v1.0.1/mod.ts"
```

After that you can import your local `/dependencies/download.ts` file everywhere you need it. 

## Usage

##### SAMPLE 1 :
``` ts
import { download } from "https://deno.land/x/download/mod.ts";

const url = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

try {
    const fileObj = await download(url);
} catch (err) {
    console.log(err)
}
```
##### Alternatively :
``` ts
import { download } from "https://deno.land/x/download/mod.ts";

const url = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

download(url)
  .then(fileObj => {
    console.log(fileObj)
  })
  .catch(err => {
    console.log(err)
  });
```
By default, the module creates a temporary directory every time you call the `download` function and downloads the file into it.

You can specify the download destination, filename and also the file permission via the second parameter.

**Note :**`As of now download directory should be present, else error will be thrown. This will not be the case in future.`


``` ts
// def of 2nd parameter. ./type.ts
Destination {
  dir?: string,
  file?: string,
  mode?: number
}
```
##### SAMPLE 2 :
``` ts
import { download, Destination } from "https://deno.land/x/download/mod.ts";

const url = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

try {
    // NOTE : You need to ensure that the directory you pass exists.
    const destination: Destination = {
        file: 'example.pdf',
        dir: './test'
    }
    /* sample with mode
     const destination: Destination = {
        file: 'example.pdf',
        dir: './test',
        mode: 0o777
    }
    */
    const fileObj = await download(url, destination);
} catch (err) {
    console.log(err)
}
```
##### Passing http methods and headers:
Behind the scene this module uses deno's fetch api. The third parameter to `download` function is [RequestInit](https://github.com/denoland/deno/blob/master/cli/js/lib.deno.shared_globals.d.ts#L769). You can pass `body`, `headers`, `cache`, `method`... the same way you pass to the fetch api.

##### SAMPLE 3 :
``` ts
import { download, Destination } from "https://deno.land/x/download/mod.ts";

const url = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

try {
    const destination: Destination = {}
    const reqInit: RequestInit = {
        method: 'GET'
    }
    /* sample with mode
     const destination: Destination = {
        file: 'example.pdf',
        dir: './test',
        mode: 0o777
    }
    */
    const fileObj = await download(url, destination, reqInit);
} catch (err) {
    console.log(err)
}
```
### Return Value
`download` function returns an object with attributes: `file`(filename), `dir`, `fullPath`, and `size`(in bytes)
```ts
// definiton of return object. check:./type.ts
DownlodedFile {
  file: string,
  dir:string,
  fullPath: string,
  size: number
}
```

## Deno Permission
You need `--allow-net` and `--allow-write` permission to use `download` function.

## License

[MIT](./LICENSE)