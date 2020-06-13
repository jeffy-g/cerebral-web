/*!
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  <one line to give the program's name and a brief idea of what it does.>
  Copyright (C) 2019 jeffy-g hirotom1107@gmail.com

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

/**
 * @typedef {(url: string | Request, init?: RequestInit) => Promise<Response>} TFetch - fetch API main type.
 */
/** @type {TFetch} */
// @ts-ignore 
const fetch = require("node-fetch");  // global install
const fs = require("fs");
const utils = require("../etc/utils");

const EVE_SDE_DBPath = "./etc/SDE/eve.db";


/**
 * @date 2020/03/31
 * @version 2.0 fix version date string problem (v1.0
 * @type {() => Promise<string>}
 */
async function getSDEVersion() {

	const sdeZipUrl = "https://eve-static-data-export.s3-eu-west-1.amazonaws.com/tranquility/sde.zip";
    const date = await fetch(sdeZipUrl, { method: "head", mode: "cors" }).then(
        (/** @type {Response} */res) => res.headers.get("last-modified")
    ).catch(reason => {
        console.log(reason);
        return new Date();
    });
	if (date) {
		const YMD = new Date(date).toLocaleString(void 0, {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
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
        return `sde-${YMD}-TRANQUILITY`;
	} else {
        return "sde-2020xxxx-TRANQUILITY";
	}
}

/** 
 * @requires unbzip2-stream
 * @requires sqlite3 binary executable
 * @param {string} basePath 
 */
const extractEVEDatabase = (/** @type {string} */basePath) => {
    // - - - - - - - - - - - - - - - using unbzip2-stream (global install
    // @ts-ignore 
    const bz2 = require("unbzip2-stream");

    if (fs.existsSync(basePath)) {
        fs.renameSync(
            basePath,
            basePath.replace(/(\w+\.db)$/, "prev-$1")
        );
    }

    const ws = fs.createWriteStream(basePath, {
        // flags: "w", // default
        // autoClose: true, // default
        encoding: ""
    }).on("error", function(/* err */) {
        console.log("WriteStream.error evnet!", arguments);
    }).on("close", function(/*no args*/) {
        console.log("%s, stream closed.", basePath);
        // should run sqlite3 eve.db "VACUUM;"
        console.log("- - - let vacuum db, wait for a minute...");
        const proc = utils.execWithOutputResult(`sqlite3 ${basePath} "VACUUM;"`, outputLog => {
            console.log(outputLog);
        });
        console.log("running process:", proc.pid);
    });

    fs.createReadStream(basePath + ".bz2").pipe(bz2()).pipe(ws);
};


// node ./resources/eve-tool -cmd check-db
async function updateSDEDatabase() {

    const eve_db_url = "https://www.fuzzwork.co.uk/dump/latest/eve.db.bz2";
    /**
     * @typedef {object} Etag
     * @prop {string} etag
     */
    /** @type {Etag} */
    let prevEtag;
    try {
        // @ts- ignore cannot apply resolveJsonModule option
        prevEtag = require("../etc/SDE/etag.json");
    } catch (e) {
        console.log(e.message);
        prevEtag = null;
    }

    const options = {
        method: "HEAD",
        // mode: 'cors',
    };
    const head = await fetch(eve_db_url, options).then(response => {
        return response.headers;
    });

    let etag = head.get("etag");
    // DEVNOTE: strip quote or double quote...?
    etag = etag.substring(1, etag.length - 1);

    prevEtag && console.log("prev etag:", prevEtag.etag);
    console.log("fetched etag:", etag);

    if (!prevEtag || prevEtag.etag !== etag) {
        fs.writeFile("./etc/SDE/etag.json", Buffer.from(JSON.stringify({ etag }, null, 2)), err => {
            err && console.log(err);
            console.log("update etag.json!");
        });

        // update page-config.json
        console.log("get sde version"); {
            // @ts-ignore cannot apply resolveJsonModule option
            const pageConfig = require("../src/page-config.json");
            pageConfig["sde-version"] = await getSDEVersion();
            fs.writeFile("./src/page-config.json", Buffer.from(JSON.stringify(pageConfig, null, 2)), err => {
                err && console.log(err);
                console.log("update page-config.json!");
            });
        }

        options.method = "get";

        // DEVNOTE: "node-fetch" implementation are different to Web fetch API.
        //  -> see @types/node-fetch
        fetch(eve_db_url, options).then(async response => {
            console.log("- - - recieve response.");
            let offset = 0;
            const bz2Stream = fs.createWriteStream(`${EVE_SDE_DBPath}.bz2`/* , { autoClose: true } */).on("finish", () => {
                utils.renderLine();
                console.info("created bz2 file!, size=%s bytes", offset.toLocaleString());
                console.log("- - - lets extract bz2, wait for a minute...");
                extractEVEDatabase(EVE_SDE_DBPath);
            });
            // @ts-ignore
            response.body.on("data", (/** @type {any[]} */chunk) => {
                offset += chunk.length;
                utils.renderLine(`byte written: ${offset.toLocaleString()} bytes`);
            });
            // @ts-ignore
            response.body.pipe(bz2Stream);
            // - - - - on chrome browser
            // get body.reader
            // const reader = response.body.getReader();
            // // did read size.
            // let offset = 0;
            // do {
            //     /** @type {ResponseBodyReaderResult} */
            //     const result = await reader.read()
            //     if (result.done) break
            //     bz2Stream.write(result.value/*() => console.log(".")*/);
            //     offset += result.value.length;
            //     utils.renderLine(`byte written: ${offset.toLocaleString()} bytes`);
            // } while (true);
            // utils.renderLine();
            // - - - - on chrome browser
        });
    } else {
        console.log("new eve database were not yet released.");
    }
}

module.exports = {
    EVE_SDE_DBPath,
    updateSDEDatabase,
	getSDEVersion,
};
