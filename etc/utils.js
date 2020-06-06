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
 * node <script path> -minify -t es6 -values "value0,value1,value2" -array "['value0', 100, true, /\r?\n/g]" -regex "/\d+/g"
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
                    // DEVNOTE: now possible to process array parameters. -> gulp pug --electron --dests "['../eve-cerebral-app.bitbucket.io', './src']"
                    // DEVNOTE: 2020/2/28 - support regex parameter -> node ./scripts/tools -cmd rmc -basePath ./dist -test '/.js$/'
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
 * use toLocaleString
 *@param {any} ymd use simple year month day formant? default `false`
 *  + should be truthy/falsy value
 */
function dateStringForFile(ymd = false) {
    // return new Date().toLocaleString().replace(/\//g, "-").replace(/:/g, "_").replace(/ /g, "@");
    return new Date().toLocaleString(void 0, {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
        hour: ymd? void 0: "2-digit",
        minute: ymd? void 0: "2-digit",
        second: ymd? void 0: "2-digit",
        // DEVNOTE: 191215 - "-" character appeared in node v13.3.0 (maybe
    }).replace(/(-|\/|:| )/g, (match, $1) => {
        switch($1) {
            case "-":
            case "/":
            case ":": return "";
            case " ": return "@";
        }
        return match;
    });
//    return new Date().toLocaleString().replace(/(\/|:| )/g, (match, $1) => {
//        switch($1) {
//            case "/": return "-";
//            case ":": return "_";
//            case " ": return "@";
//        }
//        return match;
//    });
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
 * 
 * @param {string} path
 * @param {(dirent: import("fs").Dirent) => void} handler 
 */
function walkDirSync(path, handler) {
    fs.readdirSync(path, { withFileTypes: true }).forEach(dirent => {
        handler(dirent);
    });
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
        // const success = ws.write(content, function (/*no args*/) {
        //     // console.log(arguments);
        //     console.log("callback of WriteStream.write");
        // });
        console.log("writeTextUTF8: write: %s,", dest, success);
        // DEVNOTE: "drain" event callback -> WriteStream.write callback
        //   -> WriteStream.end() => "close" event callback.
        if (!success) {
            ws.once("drain", function () {
                console.log("[drain] file written: %s,", dest, ws.bytesWritten);
                ws.end(); // -> call close()
            });
        }
        else {
            // process.nextTick(callback);
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
        // @ts- ignore cannot detect TFsCallback from `callback` parameter in javascript
        fs.readFile(from, "utf8", callback);
        // return undefined;
    }
    else {
        // @ts-ignore 
        return fs.readFileSync(from, "utf8");
    }
}

// 
// type TFsCallback = (err: any, data: any) => void;
// /**
//  * @typedef {(err: any, data: any) => void} TFsCallback
//  */
// /**
//  * @param {string} from file path.
//  * @param [callback]
//  * @type {<C extends TFsCallback | undefined,R extends undefined extends C ? string : void>(from: string, callback?: C) => R}
//  */
// function readTextUTF8<
//     C extends TFsCallback | undefined,
//     R extends undefined extends C ? string : void
// >(from: string, callback?: C): R {
//     if (typeof callback === "function") {
//         fs.readFile(from, "utf8", callback!);
//         return undefined as R;
//     } else {
//         return fs.readFileSync(from, "utf8") as R;
//     }
// }
// /**
//  * @param {string} path
//  * @param [callback]
//  * @type {<C extends TFsCallback | undefined,R extends undefined extends C ? Record<string, any> : void>(from: string, callback?: C) => R}
//  */
// function readJson2<
//     C extends TFsCallback | undefined,
//     R extends undefined extends C ? Record<string, any> : void
// >(path: string, callback?: C): R {
//     if (typeof callback === "function") {
//         // console.log(path, callback);
//         readTextUTF8(path, callback!);
//         return undefined as R;
//     } else {
//         const data = readTextUTF8(path);
//         // console.log(removeJsonComments(data));
//         return JSON.parse(data) as R;
//     }
// }
// // OK
// const config = readJson2("path");
// // OK
// readJson2("path", (err: any) => { err });
// 

// /**
//  * NOTE: when callback specified, returns undefined
//  * 
//  * @param {string} path file path.
//  * @param [callback] 
//  * @type {(path: string, callback?: (err: any, data: string) => void) => Record<string, any>}
//  */
// function readJson(path, callback) {
//     if (typeof callback === "function") {
//         readTextUTF8(path, callback);
//     } else {
//         const data = readTextUTF8(path);
//         // console.log(removeJsonComments(data));
//         return JSON.parse(data);
//     }
// }

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
        // @ts- ignore cannot detect TFsCallback from `callback` parameter in javascript
        //  => readTextUTF8("path", (err, data) => err); OK
        readTextUTF8(path, (err, data) => {
            callback(err, JSON.parse(data));
        });
    }
    else {
        const data = readTextUTF8(path);
        // console.log(removeJsonComments(data));
        return JSON.parse(data);
    }
}
// // OK
// /** @type {Record<string, {}>} */
// const config = readJson("path");
// // OK
// readJson("path", (err, data) => err);
// // OK
// const config2 = readTextUTF8("path");
// // OK
// readTextUTF8("path", (err, data) => err);


// NOTE: use regexp document: "remove C style comments."
// /(\s*\/\*[\s\S]*?(.*)\*\/\s*$)|(\s*\/\/.*\s*$)|(^[\s]$)|(^[\n])|([\n]$)/gm;
// - - - old version - - -
// const RE_SOURCE = `
// (\\s*\\/\\*[\\s\\S]*?(.*)\\*\\/\\s*$)|  # /* */ style block comment
// (\\s*\\/\\/.*\\s*$)|                    # // style line comment
// (^[\\s]$)|                              # empty lines
// ([\\n]$)
// `;
// DEVNOTE: new version, see: https://regex101.com/r/EpuQLT/13/
const RE_SOURCE = `
\\s*\\/\\*[\\s\\S]*?.*\\*\\/\\s*$| # /* */ style block comment
\\s*\\/\\/.*\\s*$|                 # // style line comment
\\s+(?=\\r|\\n|\\r\\n)             # trailing whitespaces
`;
// NOTE: replace by regexp document: "use util.getRegexpSource test#3 update simple"
const RE_C_STYLE_COMMENT = new RegExp(RE_SOURCE.replace(/\s*\(\?#.*\)\s*$|\s*#\s.*$|\s+/gm, ""), "gm");
/**
 * 
 * @param {string} source 
 */
// FIXME: 2019/8/13 - removed double slash in quoted string...
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
        // 
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
// CHANGES: 2020/2/18 - fix ちらつき
// dir <number>
//   -1: to the left from cursor
//    1: to the right from cursor
//    0: the entire line
// 
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
 * 
 * @param {boolean} enabled 
 * @param {typeof process.stdout} [output] 
 */
const cursor = (enabled, output = process.stderr) => {
    if (enabled) {
        output.write('\x1B[?25h');
    } else {
        output.write('\x1B[?25l');
    }
};

/**
 * 
 * @param {string[]} frames progress frame.
 * @param {{ fmt: string, payload?: Record<string, string> }} [formatOpt] 
 * ```
 * " {frameName} [{tick}]: {msg}" // etc
 * ```
 */
const createProgressSync = (frames, formatOpt) => {
    const fsize =  frames.length;
    let index = 0;
    /** @type {string} */
    let fmt;
    /** @type {Record<string, string>} */
    let payload;
    /** @type {string[]} */
    let keys;
    if (formatOpt) {
        fmt = formatOpt.fmt;
        payload = formatOpt.payload;
        keys = Object.keys(payload);
    }
    /**
     * @param {string} tick 
     * @param {string} msg 
     */
    const formater = (tick, msg) => {
        if (fmt) {
            let content = fmt;
            for (let i = 0, end = keys.length; i < end;) {
                const key = keys[i++];
                content = content.replace("{"+ key +"}", payload[key]);
            }
            return content.replace("{tick}", tick).replace("{msg}", msg);
        }
        return `[${tick}]: ${msg}`;
    };
    // let prev = "";
    return /**@type {(msg: string, done?: boolean) => void}*/ (msg, done = false) => {
        const tick = done? "-done-": frames[(index++) % fsize];
        const line = msg? formater(tick, msg): "";
        if (line) {
            // if (prev !== line) {
            //     renderLine(line);
            //     prev = line;
            // }
            renderLine(line);
        } else {
            renderLine();
        }
        // !line && (renderLine(), 1) || renderLine(line);
    }
};

/**
 * @typedef {{ fmt: string, payload?: Record<string, string> }} TProgressFormatOptions
 */
/**
 * 
 * @param {string[]} frames progress frame.
 * @param {TProgressFormatOptions} formatOpt 
 * ```
 * " {frameName} [{tick}]: {msg}" // etc
 * ```
 * @param {() => string} callback
 */
const createProgressObject = (frames, formatOpt, callback) => {

    let done = false;
    const render = () => {
        progress(callback(), done);
    };

    let progress = createProgressSync(frames, formatOpt);
    /** @type {ReturnType<typeof setInterval> | undefined} */
    let timer;
    let ms = 33;

    // progressObject
    return {
        /**
         * @param {string[]} [newFrames] 
         * @param {TProgressFormatOptions} [newOpt] 
         */
        updateOptions(newFrames, newOpt) {
            if (Array.isArray(newFrames) && typeof newFrames[0] === "string") {
                frames = newFrames;
            }
            if (typeof newOpt === "object" && newOpt.fmt) {
                formatOpt = newOpt;
            }
            done = false;
            progress = createProgressSync(frames, formatOpt);
        },
        /**
         * which means progress done
         */
        deadline() { done = true, render(); },
        /**
         * adjust to next line
         */
        newLine() { console.log(); },
        /**
         * change the fps rate
         * 
         * @param {number} fps 
         */
        setFPS(fps) {
            ms = (1000 / fps) | 0;
            if (timer) {
                clearInterval(timer);
                timer = setInterval(render, ms);
            }
        },
        /**
         * run timer (30fps)
         */
        run() {
            cursor(false);
            done = false;
            if (timer) { return; }
            timer = setInterval(render, ms);
        },
        /**
         * stop timer
         */
        stop() {
            done = true;
            clearInterval(timer);
            timer = void 0;
            cursor(true);
        }
    };
};

/**
 * create async progress
 * 
 * @param {number} timeSpanMS controll rotator cycle speed (ms). (maybe about...
 * @param {string[]} frames progress frame.
 */
const createProgress = (timeSpanMS, frames) => {
    // let index = 0;
    // return /**@type {(text: string) => void}*/ text => {
    //     const line = text === void 0? "" : `[${frames[index++ % frames.length]}]: ${text}`;
    //     !line && (progress(), 1) || process.nextTick(progress, line);
    // }
    const { performance } = require("perf_hooks");

    let index = 0;
    const fsize =  frames.length;
    let x = performance.now();
    return /**@type {(text: string) => void}*/ text => {
        const x2 = performance.now();
        const line = text === void 0? "" : `[${frames[index % fsize]}]: ${text}`;
        if ((x2 - x) > timeSpanMS) {
            index++;
        }
        x = x2;
        !line && (renderLine(), 1) || process.nextTick(renderLine, line);
    }
};

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
 * logger for browserify
 * 
 * @param {string} logFilePath log output path name.
 */
function createBrowserifyFileEventLogger(logFilePath) {

    const log = createLogStreamAndResolvePath(logFilePath);
    /**
     * write browserify file event data.
     * 
     * @type {(counter: number, message: string, ...args: string[]) => void} */
    const logger = (counter, message, ...args) => {
        if (counter === void 0) {
            log.end();
            return;
        }
        const progressMessage = `resolve - ${counter}`;
        log.write(`${progressMessage}, ${message}: ${args}\n`, () => {
            renderLine(progressMessage);
        });
    };
    return logger;
}

/**
 * create sourceName zip. (using zip.min.js
 *
 * @param {string} scriptPath simple script file name. e.g - webpack (original path are "./docs/webpack.js")
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

/**
 * it is bundled in webpack.js, other code becomes unnecessary.(at webpack
 * 
 *   + 📝 using "exec" internally
 *     * 🆗️ can use pipe command
 * 
 * @param {string} command
 * @param {(result: string) => void} doneCallbackWithArgs gulp callback function.
 */
function execWithOutputResult(command, doneCallbackWithArgs) {
    // const process = require("child_process");
    console.log();
    const { exec } = require("child_process");
    return exec(command, (err, stdout/* , stderr */) => {
            if (err) {
                console.error(err);
            } else {
                doneCallbackWithArgs(stdout);
            }
        }
    );
}


/**
 * use for gulp.dest(...)
 * 
 * **useful when glob pattern can not be used (when path must be explicitly specified).**
 * 
 * ```js
 *  gulp.src([
 *      "./src/app-config.ts",
 *      "./src/auth/{eve-sso,eve-sso-v2e}.php"
 *  ]).pipe(
 *      ...
 *  ).pipe(gulp.dest((vinyl) => {
 *      return convertRelativeDir(vinyl);
 *  })).on("end", () => {
 *      console.log("done");
 *  });
 * ```
 * @param {import("vinyl")} vinyl 
 * @param {string} dest default is "." -> node launched directory. (cwd?)
 */
function convertRelativeDir(vinyl, dest = ".") { // NOTE: vinyl is https://github.com/gulpjs/vinyl
    let x = vinyl.cwd.length + 1;
    let relative_dir = vinyl.base.substring(x);
    return `${dest}/${relative_dir}`;
}

/**
 * concatenate `content` to the beginning of each element of `str_array`
 * 
 * @param {string} content append content
 * @param {string[]} str_array the string array of dest
 */
function appendStringTo(str_array, content, suffix = "") {
    /** @type {string} */
    let target;
    for (let i = 0; target = str_array[i];) {
        str_array[i++] = `${content}${suffix}${target}`
    }
}

module.exports = {
    appendStringTo,

    dateStringForFile,
    getExtraArgs,
    removeJsonComments,
    writeTextUTF8,
    readTextUTF8,
    readJson,
    walkDirSync,
    renderLine,
    cursor,
    createProgress,
    createProgressSync,
    createProgressObject,
    createWebpackProgressPluginHandler,
    createBrowserifyFileEventLogger,
    compressScript,
    execWithOutputResult,
    convertRelativeDir,

    fireReplace
};
