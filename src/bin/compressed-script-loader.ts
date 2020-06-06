/*!
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  <one line to give the program's name and a brief idea of what it does.>
  Copyright (C) 2018 jeffy-g hirotom1107@gmail.com

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as
  published by the Free Software Foundation, either version 3 of the
  License, or (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
*/
///<reference path="./zlibjs.d.ts"/>
 {
    let RESOURCE_BASE: string;
    let INSERTION_SELECTOR: string;
    let decoder: TextDecoder | undefined = new TextDecoder();
    let enableGzip: boolean | undefined;
    let cleanUp = () => {
        decoder = void 0;
        // @ts-ignore
        setConfig = void 0;
        // @ts-ignore
        fireReadChunk = void 0;
        // @ts-ignore
        loadCompressedScript = void 0;
        // @ts-ignore 
        checkEncoding = void 0;
        // @ts-ignore 
        cleanUp = void 0;
    };
    let checkEncoding = async () => {
        return fetch("sw.js").then(res => {
            const enc = res.headers.get("content-encoding");
            enableGzip = enc === "gzip" || enc === "br";
        });
    };
    let setConfig = (base: string, insertionSelector?: string) => {
        RESOURCE_BASE = base;
        INSERTION_SELECTOR = insertionSelector || "";
    };
    let fireReadChunk = async (
        r: ReadableStreamDefaultReader<Uint8Array>,
        scriptName: string,
        log: (msg: string) => void
    ) => {
        let source = "";
        let total = 0;
        do {
            const result = await r.read();
            if (result.done) {
                log(`loaded ${scriptName}: ${total.toLocaleString()} bytes 😃`);
                injectScript!(source);
                return;
            }
            const nextdata = result.value;
            source += decoder!.decode(nextdata);
            log(`loading ${scriptName}: ${(total += nextdata.length).toLocaleString()} bytes`);
        } while (1);
    };
    let injectScript = (source: string, integrity?: string) => {
        const script = document.createElement("script");
        const lastElement = INSERTION_SELECTOR
            ? document.querySelector(INSERTION_SELECTOR)!.nextSibling: document.head.lastElementChild;
        document.head.insertBefore(
            script, lastElement
        );
        integrity && (script.integrity = integrity);
        script.text = source;
    };
    let loadCompressedScript = async (baseName: string, log: (msg: string) => void = console.log) => {
        if (enableGzip === void 0) {
            await checkEncoding();
        }
        const scriptName = baseName + ".js";
        const arrayBuffer = await fetch(`${RESOURCE_BASE}/${baseName}.${enableGzip ? "js": "zip"}`).then(async response => {
            const reader = response.body!.getReader();
            if (enableGzip) {
                await fireReadChunk(reader, scriptName, log);
                return void 0;
            } else {
                const total = +response.headers.get("content-length")!;
                const u8buffer = new Uint8Array(total);
                let offset = 0;
                do {
                    const result = await reader.read();
                    if (result.done) break;
                    u8buffer.set(result.value, offset);
                    offset += result.value.length;
                    log(`loading script: ${offset.toLocaleString()} bytes(${Math.round(offset / total * 100)}%)`);
                } while (1);
                return u8buffer;
            }
        });
        if (arrayBuffer) {
            const unzip = new Zlib.Unzip(arrayBuffer);
            log(`loaded script ${scriptName}, decompressing binary...`);
            const u8array: Uint8Array = unzip.decompress(scriptName);
            log(`${scriptName} decompressed 😃`);
            const fh = unzip.getFileHeader(0);
            injectScript(
                decoder!.decode(<ArrayBuffer>u8array.buffer, { stream: false }),
                fh.getCommentAsString()
            );
        }
    };
    let logText: Text | undefined;
    let webpackLogger = (msg: string) => {
        if (!logText) {
            const textNode = document.createTextNode("");
            logText = document.querySelector(".splash-pane__content__message")!.appendChild(textNode);
        }
        logText.data = msg;
    };
    (async () => {
        setConfig(".", "script[src*=jquery]");
        await Promise.all([
            loadCompressedScript("typeid-map"), loadCompressedScript("webpack", webpackLogger)
        ]);
        cleanUp();
        logText = void 0;
        // @ts-ignore 
        webpackLogger = void 0;
        window.setTimeout(() => {
            document.querySelectorAll("script[src^='./bin/']").forEach(script => script.remove());
            // @ts-ignore !I do not understand the meaning of error diagnosis
            const ret = delete window.Zlib;
            console.log("delete window.Zlib:", ret);
        }, 1000);
    })();
}