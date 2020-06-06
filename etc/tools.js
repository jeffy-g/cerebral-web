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
            webpack: fs.statSync("./build/webpack.js").size,
        };
        console.log(sizeRecord);
        utils.writeTextUTF8(
            JSON.stringify(sizeRecord, null, 2), recordPath, () => {
                console.log("[%s] is updated", recordPath);
            }
        );
    },

    // node ./etc/tools -cmd version -extras "test/web/index.html,"
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
        utils.fireReplace(/v(\d+\.\d+\.\d+)(-\w+)?/g, /** @type {TStringReplacer} */($0, $1/*, $2*/) => {
            if ($1) {
                return "v" + nextVersion; // + ($2? $2: "");
            }
            return $0;
        }, params.extras || []);
        console.log("version updated: %s", nextVersion);
    },
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
