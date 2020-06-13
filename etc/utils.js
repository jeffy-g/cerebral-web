/*!
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    <one line to give the program's name and a brief idea of what it does.>
    Copyright (C) 2017 jeffy-g hirotom1107@gmail.com

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
// @ts-check

// NOTE: fs-extra are bit slower.
const fs = require("fs");
// const util = require('util');
const path = require("path");
// for clearLine...
const readline = require("readline");


/**
 * @typedef {string | string[] | boolean | RegExp} TExtraArgsValue
 */

/** getExtraArgs default config.  */
const ArgsConfig = {
    /**
     * @default 2
     */
    startIndex: 2,
    /**
     * @default "-"
     */
    prefix: "-",
};
/**
 * get arguments helper.  
 * extra params must be start with "-".
 * 
 * > command example:
 * 
 * ```shell
 * node <script path> -minify -t es6 -values "value0,value1,value2" -array "['value0', 100, true, /\\r?\\n/g]" -regex "/\\d+/g"
 * ```
 *
 * + then resut is
 *
 * ```js
 * // params
 * {
 *   minify: true,
 *   t: "es6",
 *   values: ["value0", "value1", "value2"],
 *   array: ["value0", 100, true, /\r?\n/g],
 *   regex: /\d+/g,
 * }
 * ```
 *
 * if param value not specified -tag after then set value is "true".
 * 
 * @param {Partial<typeof ArgsConfig>} [args_config]
 * @param {boolean} [debug]
 * @type {<T, K extends keyof T>(config: Partial<typeof ArgsConfig>, debug?: boolean) => { [key in K]: T[key] }}
 */
function getExtraArgs(args_config, debug = false) {
    // debug log, if need.
    debug && console.log("process.argv: ", process.argv);

    args_config = args_config || {};
    args_config = Object.assign(ArgsConfig, args_config);

    const varIndex = args_config.prefix.length;
    const extra_index = args_config.startIndex;
    /** @type {ReturnType<typeof getExtraArgs>} */
    const params = {};

    if (process.argv.length > extra_index) {
        const args = process.argv;
        for (let index = extra_index; index < args.length;) {
            const opt = args[index++];
            if (opt && opt.startsWith(args_config.prefix)) {
                /** @type {TExtraArgsValue} */
                let value = args[index];
                if (value === void 0 || value.startsWith(args_config.prefix)) {
                    value = true;
                } else {
                    if (/\[.+\]/.test(value) || /^\/[^/]+\/[gimuy]{0,5}/.test(value)) {
                        value = eval(value);
                    } else if (/\\,/.test(value)) { // not Comma Separated Value
                        // DEVNOTE: fix comma in glob strings
                        value = value.replace(/\\,/g, ",");
                    } else if (/,/.test(value)) { // Comma Separated Value
                        value = value.split(",");
                    }
                    index++;
                }
                params[opt.substring(varIndex)] = value;
            }
        }
    }
    // @ts-ignore 
    return params;
}

/**
 * @param {string} dest 
 */
function checkParentDirectory(dest) {
    const parent = path.dirname(dest);
    if (!fs.existsSync(parent)) {
        // DEVNOTE: fix Error: ENOENT: no such file or directory, mkdir ./path/to/dir
        fs.mkdirSync(parent, {recursive: true});
    }
}
/**
 * 
 * @param {string} logPath 
 */
function createLogStreamAndResolvePath(logPath) {
    checkParentDirectory(logPath);
    return fs.createWriteStream(logPath);
}

/**
 * write text content to dest path.  
 * when not exists parent directory, creat it.
 * 
 * @param {string|NodeJS.ReadableStream|Buffer} content text? content.
 * @param {string} dest content output path
 * @param {() => void} [callback] the callback function
 */
function writeTextUTF8(content, dest, callback = null) {
    // need dest parent dir check.
    checkParentDirectory(dest);

    const ws = fs.createWriteStream(dest);
    ws.on("error", function(err) {
        console.log("WriteStream.error evnet!", arguments);
    })
    .on("close", function(/*no args*/) {
        // DEVNOTE: this event never occurs when WriteStream.write returned `true`
        console.log("[close] %s, stream closed", dest);
        callback && callback();
    });

    if (content instanceof Buffer) {
        content = content.toString();
    }

    if (typeof content === "string") {
        // chunk <string> | <Buffer> | <Uint8Array> | <any>
        const success = ws.write(content);
        console.log("writeTextUTF8: write: %s,", dest, success);
        if (!success) {
            ws.once("drain", function () {
                console.log("[drain] file written: %s,", dest, ws.bytesWritten);
                ws.end(); // -> call close()
            });
        }
        else {
            callback && callback();
        }
    }
    // NOTE: see https://nodejs.org/dist/latest-v6.x/docs/api/stream.html#stream_readable_pipe_destination_options
    else if ("readable" in content) { // Readable stream?
        content.pipe(ws);
    }
}

/**
 * @typedef {(err: any, data: string) => void} TFsCallback
 */
/**
 * @param {string} from file path.
 * @param [callback]
 * @type {<C extends TFsCallback, R extends void extends C ? string : void>(from: string, callback?: C) => R}
 */
function readTextUTF8(from, callback) {
    if (typeof callback === "function") {
        fs.readFile(from, "utf8", callback);
    }
    else {
        // @ts-ignore 
        return fs.readFileSync(from, "utf8");
    }
}


/**
 * @template T
 * @typedef {Record<string, T>} TypedRecord<T>
 */
/**
 * @template T
 * @typedef {(err: any, data: TypedRecord<T>) => void} TReadJsonCallback
 */
/**
 * NOTE: when callback specified, returns undefined
 * 
 * @param {string} path
 * @param [callback]
 * @type {<T, C extends TReadJsonCallback<T>, R extends void extends C ? TypedRecord<T> : void>(from: string, callback?: C) => R}
 */
function readJson(path, callback) {
    if (typeof callback === "function") {
        readTextUTF8(path, (err, data) => {
            callback(err, JSON.parse(data));
        });
    }
    else {
        const data = readTextUTF8(path);
        return JSON.parse(data);
    }
}

const RE_SOURCE = `
\\s*\\/\\*[\\s\\S]*?.*\\*\\/\\s*$| # /* */ style block comment
\\s*\\/\\/.*\\s*$|                 # // style line comment
\\s+(?=\\r|\\n|\\r\\n)             # trailing whitespaces
`;
const RE_C_STYLE_COMMENT = new RegExp(RE_SOURCE.replace(/\s*\(\?#.*\)\s*$|\s*#\s.*$|\s+/gm, ""), "gm");
/**
 * @param {string} source 
 */
function removeJsonComments(source) {
    if (typeof source !== "string") {
        throw new TypeError("invalid text content!");
    }
    return source.replace(RE_C_STYLE_COMMENT, "");
}

/** @type {(options: any) => void} */
let nodeReplace;
/**
 * @param {RegExp} regex 
 * @param {string | Function} replacement 
 * @param {string[]} paths 
 * @param {boolean} [async] 
 * 
 * @date 2019-4-26
 */
function fireReplace(regex, replacement, paths, async = false) {
    nodeReplace === void 0 && (nodeReplace = require("replace"));

    // DEVNOTE: 2020/5/11 - exclude non exists files
    paths = paths.filter(path => fs.existsSync(path));
    nodeReplace({
        regex,
        replacement,
        paths,
        recursive: false,
        silent: false,
        // for test?
        preview: false,
        // replace function.
        // funcFile: "js source path",
        async,
        // regexp flags, if "regex" are plain string then needed.
        ignoreCase: false,
        multiline: false,
    });
}

/**
 * use process.stderr stream
 * 
 * @param {string} [msg] if empty string or undefined then only clear line and move cursor to head.
 */
function renderLine(msg) {
    const output = process.stderr;
    // move cursor to line head
    readline.cursorTo(output, 0);
    // write the message.
    msg && output.write(msg);
    // clear line to the right from cursor
    readline.clearLine(output, 1);
}

/**
 * see https://webpack.js.org/plugins/progress-plugin/
 * 
 * @param {string} [logFilePath] can be undefined
 * @param {boolean} disableRenderLine 
 */
function createWebpackProgressPluginHandler(logFilePath, disableRenderLine = false) {

    const formatPercentage = (/** @type {number} */pct) => {
        return `processing ${(pct * 100).toFixed(4)}%`;
    };

    let dotted = 0;
    const renderDot = () => {
        process.stderr.write(".");
        // FIXME: first renderDot line length is not 100
        dotted++;
        if (dotted % 100 === 0) {
            process.stderr.write("\n");
        }
    };

    // (percentage: number, msg: string, moduleProgress?: string, activeModules?: string, moduleName?: string) => void
    /** @type {(percentage: number, message: string, ...args: string[]) => void} */
    let wpp_handler; {

        /** @type {string} */
        let progressMessage;
        /** @type {((msg?: string) => void) | undefined} */
        const renderer = process.env.CI? renderDot: renderLine;
        const cwd =  process.cwd(); // or path.resolve();

        if (logFilePath !== void 0) {
            const wpp_logger = createLogStreamAndResolvePath(logFilePath);
            /** @type {((p: number) => void) | undefined} */
            let writeCallback;

            if (!disableRenderLine) {
                writeCallback = (/** @type {number} */percentage) => {
                    renderer(progressMessage);
                    percentage === 1 && (console.log(), dotted = 0);
                };
            }
            wpp_handler = (percentage, message, ...args) => {
                progressMessage = formatPercentage(percentage);
                wpp_logger.write(`${progressMessage}, ${message}: ${args}\n`, () => {
                    writeCallback && writeCallback(percentage);
                });
                percentage === 1 && wpp_logger.end();
            };
        } else {
            wpp_handler = !disableRenderLine? (percentage, message, ...args) => {
                let [modules, actives, path = ""] = args;
                if (message) {
                    const x = path.lastIndexOf(cwd) + 1;
                    x > 0 && (path = path.substring(x + cwd.length));
                } else { // which means all processing done
                    message = "- done -";
                }
                renderer(
                    formatPercentage(percentage) + " | " + message + ` [${modules}, ${actives}] ${path}`
                );
                percentage === 1 && (console.log(), dotted = 0);
            }: () => {
                
            };
        }
    }

    return wpp_handler;
}

/**
 * create sourceName zip. (using zip.min.js
 *
 * @param {string} scriptPath simple script file name. e.g - webpack (original path are "./build/webpack.js")
 * @param {string} comment the zip file comment.
 * @requires zip.min
 */
function compressScript(scriptPath, comment = "") {
    // @ts-ignore 
    const zlibZip = require("./zip.min").Zlib.Zip;
    // const zlibZip = require("zlibjs/bin/zip.min").Zlib.Zip;
    const zip = new zlibZip();

    const scriptBin = fs.readFileSync(scriptPath);
    // plainData1
    zip.addFile(scriptBin, {
        filename: stringToByteArray(path.basename(scriptPath)),
        comment: stringToByteArray(comment),
        // STORE or DEFLATE, default: DEFLATE...?
        compressionMethod: zlibZip.CompressionMethod.DEFLATE,
        os: zlibZip.OperatingSystem.MSDOS
    });

    console.log(`added ${scriptPath} to zip`);
    console.log("start compress...");
    console.time("zip:compress");
    const compressed = zip.compress();
    console.timeEnd("zip:compress");
    console.log("compress done.\n");

    const pp = path.parse(scriptPath);
    fs.writeFile(`${pp.dir}/${pp.name}.zip`, compressed, err => {
        console.log(`\nzip file created, error: ${err}`);
    })

    function stringToByteArray(str) {
        const array = new Uint8Array(str.length);
        for (let i = 0, il = str.length; i < il; ++i) {
            array[i] = str.charCodeAt(i) & 0xff;
        }
        return array;
    }
}

module.exports = {
    getExtraArgs,
    removeJsonComments,
    writeTextUTF8,
    readTextUTF8,
    readJson,
    renderLine,
    createWebpackProgressPluginHandler,
    compressScript,

    fireReplace
};
