/*!
-----------------------------------------------------------------------

Copyright 2019 jeffy-g hirotom1107@gmail.com

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

------------------------------------------------------------------------
*/
/**
 * @typedef {(matchs: string, ...args: any[]) => string} TStringReplacer
 */

const fs = require("fs");
/* utilities module by own. */
const utils = require("./utils");

/**
 * @typedef TToolArgs
 * @prop {string | string[]} basePath
 * @prop {string[]} targets
 * @prop {string} major
 * @prop {string} minor
 * @prop {string} patch
 * @prop {string[]} extras
 * @prop {string} dest
 * @prop {string} projectName
 * @prop {string} cmd
 * @prop {RegExp} test
 * @prop {RegExp} regex
 * @prop {boolean} beautify
 * @prop {boolean} rmc4ts
 */

 /**
  * @type {TToolArgs}
  */
const params = utils.getExtraArgs();
console.log(params);


/**
 * @type {import("terser").MinifyOptions}
 */
// DEVNOTE: 2020/3/4 - https://terser.org/docs/api-reference
const terserOptions = {
    ecma: 2019,
    // sourceMap: true,
    parse: {
        shebang: true
    },
    mangle: true,
    output: {
        comments: /@license|@preserve|^!/, // or /^(?:!|\*)/
        beautify: !!params.beautify,
        indent_level: 1,
        max_line_len: 120,
        /**
        @example
        export enum OutputQuoteStyle {
            PreferDouble = 0,
            AlwaysSingle = 1,
            AlwaysDouble = 2,
            AlwaysOriginal = 3
        }
         */
        quote_style: 3
    }
};

/**
 * @typedef {
    (path: string, handler: (dirent: import("fs").Dirent) => void) => void
 } TWalkDirSyncFunction
 */
/**
 * @type {TWalkDirSyncFunction}
 */
const walkDirSync = ((/** @type {TWalkDirSyncFunction | undefined} */fn) => {
    /** @type {TWalkDirSyncFunction} */
    let actualFn;
    if (typeof fn === "function") {
        actualFn = fn;
    } else {
        actualFn =  function walkDirSync(path, handler) {
            fs.readdirSync(path, { withFileTypes: true }).forEach(dirent => {
                handler(dirent);
            });
        };
    }
    return actualFn;
})(utils.walkDirSync);

/**
 * @typedef TProcessSourcesOpt
 * @prop {string} [base]
 * @prop {string[]} [bases]
 * @prop {RegExp} [test]
 * @prop {string[]} [targets]
 */
/**
 * 
 * @param {string} taskName 
 * @param {(source: string) => string} process 
 * @param {TProcessSourcesOpt} [opt] 
 */
function processSources(
    taskName,
    process, {
        base = "./build", bases,
        test,
        targets,
    } = {}
) {

    /** @type {string[]} */
    let sourceFiles;
    if (bases || base) {
        sourceFiles = [];
        const re = params.test || test;
        const visitDirectry = (/** @type {string} */ dir) => {
            walkDirSync(dir, dirent => {
                if (dirent.isFile() && re.test(dirent.name)) {
                    sourceFiles.push(`${dir}/${dirent.name}`);
                }
            });
        };
        if (Array.isArray(bases)) {
            bases.forEach(base => visitDirectry(base));
        } else {
            visitDirectry(base);
        }
    } else {
        sourceFiles = params.targets || targets;
        if (sourceFiles.length && params.basePath) {
            const basePath = Array.isArray(params.basePath)? params.basePath[0]: params.basePath;
            utils.appendStringTo(sourceFiles, basePath, "/");
        }
    }

    console.time(taskName);
    for (const sourceFile of sourceFiles) {
        if (fs.existsSync(sourceFile)) {
            // (err: any, data: string) => void
            utils.readTextUTF8(sourceFile, (err, data) => {
                if (err) {
                    console.log(err);
                    return;
                }
                utils.writeTextUTF8(
                    process(data), sourceFile
                );
            });
        } else {
            console.warn(`file: ${sourceFile} is not exists`);
        }
    }
    console.timeEnd(taskName);
}


const ToolFunctions = {

    /** (r)ecord(W)ebpack(S)ize */
    // node ./scripts/tools -cmd rws
    rws: () => {
        /** @type {{ [key: string]: any }} */
        // @ts-ignore cannot apply "resolveJsonModule" option
        const thisPackage = require("../package.json");
        const recordPath = "logs/webpack-size.json";
        const sizeRecord = fs.existsSync(recordPath)? require(`../${recordPath}`): {};
        const versionStr = thisPackage.version;
        sizeRecord[versionStr] = {
            webpack: fs.statSync("./docs/webpack.js").size,
        };
        console.log(sizeRecord);
        utils.writeTextUTF8(
            JSON.stringify(sizeRecord, null, 2), recordPath, () => {
                console.log("[%s] is updated", recordPath);
            }
        );
    },

    // 
    // (C)onvert (J)S to (B)rowser (M)odule
    // optional: -basePath <js source base directory>
    // node ./scripts/tools -cmd cjbm -basePath extra-tests/mini-semaphore -targets "['core.js', 'object.js']"
    // 
    /**
     * about regex: see [[tools.js] regex - (C)onvert (J)S to (B)rowser (M)odule](https://regex101.com/r/uQ1FmQ/2)
     */
    cjbm: () => {
        // DEVNOTE: 2020/5/27 - https://regex101.com/r/EpuQLT/21
        /** ### regex summary
         * ```perl
         * # start regex
         * (?:import|export)      # comments
         * \s+
         * (?:
         *   \x22|                # character ["]
         *   \{[^}]+\}\s+from|
         *   \*\s+(?:as|from)\s+
         * )
         * (?!.*(?:\.js";?)).+
         * (?=";?)
         * ```
         */
        const reImportExportDetection = /(?:import|export)\s+(?:\x22|\{[^}]+\}\s+from|\*\s+(?:as|from)\s+)(?!.*(?:\.js";?)).+(?=";?)/gm;
        processSources(
            "[(C)onvert (J)S to (B)rowser (M)odule]", (data) => {
                return data.replace(reImportExportDetection, "$&.js");
            }, {
                base: ""
            }
        );
    },

    /* the-comment-toggle-trick
    "dummy": {},
    /*/
    "du-m-my": {},
    //*/

    // node ./scripts/tools -cmd cmtTrick -targets "['core.js', 'object.js']" [-basePath extra-tests/mini-semaphore]
    cmtTrick: () => {
        processSources(
            "[comment trick toggle]", (data) => {
                return data.replace(/\/+(?=\*\s?(the-comment-toggle-trick|https:\/\/coderwall))/g, $0 => {
                    const slashes = $0.length === 2? "/": "//";
                    console.log("the-comment-toggle-trick: %s", /*enableBefore*/slashes.length === 2 ? "-->enable before<--, mute after": "mute before, -->enable after<--");
                    return slashes;
                });
            }, {
                base: "",
                targets: params.targets
            }
        );
    },

    // // node ./scripts/tools -cmd stripWebpack -targets "['dist/umd/index.js', 'dist/webpack/index.js']"
    // stripWebpack: () => {
    //     /** @type {string[]} */
    //     const targets = params.targets || [];
    //     if (params.basePath) {
    //         utils.appendStringTo(targets, params.basePath, "/");
    //     }
    //     // regex - https://regex101.com/r/9E6ssx/2/ [eve-oauth - strip webpack regex]
    //     const RE_XXX = params.test || /,\s?\w\.t\s?=\s?function\(\w,\s?\w\s?\)\s?\{[\s\S]+?(?=,\s?r\.o)/;
    //     utils.fireReplace(RE_XXX, "", targets); // old: targets.map(name => `./${OUTPUT}/${name}.js`)
    // },

    // node ./scripts/tools -cmd stripWebpack -regex \"%npm_package_defs_regex%\""
    stripWebpack: () => {
        const re = params.regex;
        if (re) {
            processSources(
                "[stripWebpack]", data => data.replace(re, ""), {
                    base: "",
                    targets: ["./dist/umd/index.js", "./dist/webpack/index.js"]
                }
            );
        }
    },


    // node ./scripts/tools -cmd version -extras "test/web/index.html,"
    version: () => {
        let { major, minor/*, patch*/ } = params;
        /** @type {string} */
        let nextVersion;
        utils.fireReplace(/"version": "(\d+)\.(\d+)\.(\d+)(-\w+)?"/, /** @type {TStringReplacer} */($0, $1, $2, $3, tag) => {
            /** @type {string | number} */
            let _major = $1;
            /** @type {string | number} */
            let _minor = $2;
            /** @type {string | number} */
            let _patch = $3;
            if (major) {
                _minor = 0;
                _major = +_major + 1;
            }
            else if (minor) {
                _minor = +_minor + 1;
            }
            if (major || minor) {
                _patch = 0;
            } else {
                _patch = +_patch + 1;
            }
            nextVersion = `${_major}.${_minor}.${_patch}${tag? tag: ""}`;
            return `"version": "${nextVersion}"`;
        }, ["./package.json"]);
        utils.fireReplace(/v(\d+\.\d+\.\d+)(-\w+)?/g, /** @type {TStringReplacer} */($0, $1, $2) => {
            if ($1) {
                return "v" + nextVersion; // + ($2? $2: "");
            }
            return $0;
        }, params.extras || []);
        console.log("version updated: %s", nextVersion);
    },

    // node ./scripts/tools -cmd minify -basePath extra-tests/web/mini-semaphore
    minify: () => {
        // DEVNOTE: 12:05 2020/03/04 - minify with `terser`
        const Terser = require("terser");
        const basePath = Array.isArray(params.basePath)? params.basePath[0]: params.basePath;
        processSources(
            "minify", (data) => Terser.minify(data, terserOptions).code, {
                base: basePath,
                test:  /.js$/
            }
        );
    },
    // DEVNOTE: 2020/3/4 - old minify command
    // node ./scripts/tools -cmd minify -basePath extra-tests/web/mini-semaphore -targets "['core', 'object', 'extras', 'deque']"
    // minify: () => {
    //     // @ts-ignore 
    //     const UglifyJS = require("uglify-es");
    //     console.time("minify");
    //     for (const name of params.targets) {
    //         // (err: any, data: string) => void
    //         utils.readTextUTF8(`${params.basePath}/${name}.js`, (err, data) => {
    //             // @ts-ignore missing type
    //             const code = UglifyJS.minify(data, minifyOptions).code;
    //             // console.log(code);
    //             utils.writeTextUTF8(
    //                 code, `${params.basePath}/${name}.js`
    //             );
    //         });
    //     }
    //     console.timeEnd("minify");
    // },

    // node ./scripts/tools -cmd rmc [-rmc4ts -basePath ./dist]
    // rmc version 3.x
    /**
     * NOTE: keep comment that start with "/&#42;" when "&#42;/" end mark appears in same line.
     * 
     *   + if start with "/&#42;-" remove it
     */
    rmc: () => {
        // const rmc = require("../LKG");
        // @ts-ignore 
        const rmc = require("rm-cstyle-cmts");
        // DEVNOTE: 2020/5/2 - rm-cstyle-cmts dev (with scan event listener)
        if (rmc.setListener && params.rmc4ts) {
            rmc.setListener(({ event, fragment }) => {
                if (event === /*ScannerEvent.MultiLineComment*/1) {
                    // DEVNOTE: \b is not contained LF
                    return /^\/\*(\*|!)\s|^\/\*(?!-).+\*\/$/.test(fragment);
                }
                // DEVNOTE: this detection is rmc default
                // else if (event === /*ScannerEvent.SingleLineComment*/0) {
                //     return /(?:\/\/\/?\s+@ts-\w+|\/\/\/\s*<reference)/.test(fragment);
                // }
                // else if (event === /*ScannerEvent.ES6Template*/2) {
                //     ;
                // }
                return false;
            });
        }
        const basePaths = Array.isArray(params.basePath)? params.basePath: [params.basePath];
        processSources(
            "rm-cstyle-cmts", data => {
                const after = rmc(data);
                // purge typescript v3.9.x extra statement
                return after.replace(/\s(exports\.\w+\s=\s)+void 0;/m, "");
            }, {
                bases: basePaths,
                test: /.js$/
            }
        );
    },

    // 2020/2/21
    backup: () => {
        // @ts-ignore 
        const archiver = require("archiver");
        const archive = archiver("zip", {
            // comment, deplicated, unzip.min will fail decompress...
            zlib: { level: 9  } // Sets the compression level.
        });

        // TODO: Parameterize these settings
        // node backup-session -dest "../tmp" -projectName cerebral-web-dev
        const destDir = params.dest || "../tmp";
        const projectName = params.projectName || "anonymouse";
        const prefix = utils.dateStringForFile(true);

        /* [https://nodejs.org/api/repl.html]
            Accessing Core Node.js Modules#
            The default evaluator will automatically load Node.js core modules into the REPL environment when used.
            For instance, unless otherwise declared as a global or scoped variable, the input fs will be evaluated on-demand as global.fs = require('fs').
        */
        // @ts- ignore fs is already imported at node REPL
        const output = fs.createWriteStream(`${destDir}/${prefix}-${projectName}-backup.zip`)
            .on("close", function () {
                console.log(archive.pointer() + " total bytes");
                console.log("archiver has been finalized and the output file descriptor has closed.");
            }).on("end", function () {
                console.log("Data has been drained");
            });

        archive.on("progress", progress => {
            // console.log(progress); too many infos...
            console.log(progress.entries.processed);
        });
        archive.pipe(output);
        archive.glob(
            "{*,*/**/.*,*/**/*,.*,.*/**/*,.*/**/.*}", {
                cwd: `${destDir}/${projectName}/`,
                // root: "../tmp/cerebral-web-dev/",
                // dot: true,
            }
        );
        archive.finalize();
    }
};

if (params.cmd) {
    const fn = ToolFunctions[params.cmd];
    typeof fn === "function" && fn();
} else {
    const commands = Object.keys(ToolFunctions);
    console.log(`
Usage: node tools -cmd <command name>
 - - - - available commands:`
    );
    for (const cmd of commands) {
        console.log(cmd);
    }
}
