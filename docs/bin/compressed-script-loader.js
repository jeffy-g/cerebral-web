"use strict";
{
    let RESOURCE_BASE;
    let INSERTION_SELECTOR;
    let decoder = new TextDecoder();
    let enableGzip;
    let cleanUp = () => {
        decoder = void 0;
        setConfig = void 0;
        fireReadChunk = void 0;
        loadCompressedScript = void 0;
        checkEncoding = void 0;
        cleanUp = void 0;
    };
    let checkEncoding = async () => {
        return fetch("sw.js").then(res => {
            enableGzip = res.headers.get("content-encoding") === "gzip";
        });
    };
    let setConfig = (base, insertionSelector) => {
        RESOURCE_BASE = base;
        INSERTION_SELECTOR = insertionSelector || "";
    };
    let fireReadChunk = async (r, scriptName, log) => {
        let source = "";
        let total = 0;
        do {
            const result = await r.read();
            if (result.done) {
                log(`loaded ${scriptName}: ${total.toLocaleString()} bytes 😃`);
                injectScript(source);
                return;
            }
            const nextdata = result.value;
            source += decoder.decode(nextdata);
            log(`loading ${scriptName}: ${(total += nextdata.length).toLocaleString()} bytes`);
        } while (1);
    };
    let injectScript = (source, integrity) => {
        const script = document.createElement("script");
        const lastElement = INSERTION_SELECTOR
            ? document.querySelector(INSERTION_SELECTOR).nextSibling : document.head.lastElementChild;
        document.head.insertBefore(script, lastElement);
        integrity && (script.integrity = integrity);
        script.text = source;
    };
    let loadCompressedScript = async (baseName, log = console.log) => {
        if (enableGzip === void 0) {
            await checkEncoding();
        }
        const scriptName = baseName + ".js";
        const arrayBuffer = await fetch(`${RESOURCE_BASE}/${baseName}.${enableGzip ? "js" : "zip"}`).then(async (response) => {
            const reader = response.body.getReader();
            if (enableGzip) {
                await fireReadChunk(reader, scriptName, log);
                return void 0;
            }
            else {
                const total = +response.headers.get("content-length");
                const u8buffer = new Uint8Array(total);
                let offset = 0;
                do {
                    const result = await reader.read();
                    if (result.done)
                        break;
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
            const u8array = unzip.decompress(scriptName);
            log(`${scriptName} decompressed 😃`);
            const fh = unzip.getFileHeader(0);
            injectScript(decoder.decode(u8array.buffer, { stream: false }), fh.getCommentAsString());
        }
    };
    let logText;
    let webpackLogger = (msg) => {
        if (!logText) {
            const textNode = document.createTextNode("");
            logText = document.querySelector(".splash-pane__content__message").appendChild(textNode);
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
        webpackLogger = void 0;
        window.setTimeout(() => {
            document.querySelectorAll("script[src^='./bin/']").forEach(script => script.remove());
            const ret = delete window.Zlib;
            console.log("delete window.Zlib:", ret);
        }, 1000);
    })();
}
