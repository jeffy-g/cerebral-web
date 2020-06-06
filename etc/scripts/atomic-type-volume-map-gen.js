// @ts-nocheck
//
// esi types batch request
//
// DEVNOTE: 2019/9/15 - can works both node.js and browser
//
//
// prolougue: because could not found "packaged_volume" data from SDE databse
// 
/*
 POSTSCRIPT: 2019/10/20
  ❓ perhaps, "packaged volume" data is "invVolumes" table
      SELECT * FROM invVolumes; // 503 entry

  ⚠️ However, it seems that the latest data is reflected in ESI data server rather than SDE database.
*/
/**
 * @type {import("../utils")}
 */
let __utils;
if (typeof NsESIClient === "undefined" && typeof require === "function") {
    console.log("loading esi client module");
    globalThis.NsESIClient = require("./esi-client");
    globalThis.performance = require("perf_hooks").performance;
    __utils = require("../utils");
}

//
// -- required ./etc/scripts/esi-client.js --
// NsESIClient
//
/** @type {Record<string, string>} */
const typeDatas = {};
/**
 * 36137 entries
 *
 * NOTE: typeId - 52542 is not exists so this request always error
 *
 * @example [ "2324,2345,2355", "120231,120232,120233", ...]
 *
 * @type {string[]}
 */
const knownTypeIDs = [];
let typesEntryCount = 0;

/**
 * request cancel flag
 */
let cancelProcess;

/** @type {(resolver?: () => void) => Promise<string>} */
let genTypeVolumeMap;
/** @type {(force?: boolean) => Promise<number[]>} */
let fetchTypeIds;
{
    // reduce sequential request
    const WAIT = 333;
    // unit of typeId request
    const UNIT = 300;

    NsESIClient.setDebug();
    //
    // push typeIds to knownTypeIDs each 150 units
    //
    fetchTypeIds = async function fetchTypeIds(force = false) {
        /** @type {number[]} */
        let typeIds;
        if (force || knownTypeIDs.length === 0) {
            const esi = await NsESIClient.getInstance();
            typeIds = await esi.get(`/universe/types/`);
            typesEntryCount = typeIds.length;
            const tempArray = [];
            outer: for (let offset = 0, end = typeIds.length; offset < end; offset += UNIT) {
                for (let i = 0; i < UNIT; i++) {
                    const index = offset + i;
                    if (index >= end) {
                        knownTypeIDs.push(tempArray.join(","));
                        break outer;
                    }
                    tempArray.push(typeIds[index]);
                }
                knownTypeIDs.push(tempArray.join(","));
                tempArray.length = 0;
            }
            console.log("typeIds.length: ", typeIds.length);
        }
        return typeIds;
    };
    //
    // epilogue: update source of resources/raw-type-volume-map.js
    //
    function emitSource() {
        return `
//
// ${Object.keys(typeDatas).length} entries
//
// format : <typeId>: "volume,packaged_volume,capacity"
//
// generate by: etc/scripts/atomic-type-volume-map.js
//
/** @type {Record<number, string>} */
const TypeVolumeMap = ${JSON.stringify(typeDatas, null, 2).replace(/"([\d.]+)":/g, "$1:")};

module.exports = {
    TypeVolumeMap
};
`;
    }
	/**
	 * @param {() => void} [resolver]
     * @return raw-type-volume-map.js source
	 */
    async function fireTypeRequest(resolver) {

        /** @type {number} */
        let index;
        /** @type {number} */
        let errorCount;
        let errors = [];
        const esi = await NsESIClient.getInstance();

        do {
            index = 0, errorCount = 0;
            const start = performance.now();
            // fire request each UNIT units
            outer: for (const ids of knownTypeIDs) {
                const typeIDs = ids.split(",").map(id => +id);
                const promises = [];
                const timeTag = "fire-esi-requset#" + index++;

                console.time(timeTag);
                inner: for (const typeID of typeIDs) {
                    if (typeDatas[typeID]) {
                        continue inner;
                    }
                    promises.push(
                        esi.get(`/universe/types/${typeID}/`).then(type => {
                            typeDatas[type.type_id] = `${type.volume},${type.packaged_volume},${type.capacity}`;
                        }).catch(reason => {
                            errorCount++;
                            errors.push(reason);
                            return reason;
                        })
                    );
                }

                if (promises.length === 0) {
                    console.timeEnd(timeTag);
                    continue outer;
                }

                // wait for esi request done each 100 units
                await Promise.all(promises);
                console.timeEnd(timeTag);

                console.log("errors: %s", errorCount);
                // seems a much sequential request is forbidden.
                // so wait for a while
                await new Promise(resolve => setTimeout(resolve, WAIT));

                if (cancelProcess) {
                    console.log("> > > process canceled");
                    return;
                }
            }

            // Display the total processing time
            const totalTime = performance.now() - start;
            console.log("request total time(ms): %s, error: %s", totalTime, errorCount);
            // print errors
            console.log("request errors:", errors);
            await new Promise(resolve => {
                if (errorCount) {
                    errors.length = 0;
                    console.log("正常に完了しませんでした, 2秒後に再度 request process を実行します");
                    setTimeout(resolve, 2000);
                } else {
                    console.log("request process が完了しましました!");
                    resolve();
                }
            });

        } while (!cancelProcess && errorCount > 0);

        const source = emitSource();
        if (__utils && __utils.writeTextUTF8) {
            // at node.js
            __utils.writeTextUTF8(source, "./resources/raw-type-volume-map.js", () => {
                console.log("created raw-type-volume-map.js");
				resolver && resolver();
            });
        }
		// else {
        //     // at browser
        //     console.log(source);
        // }
		return source;
    }

    genTypeVolumeMap = async function (resolver) {
        await fetchTypeIds().then(() => console.log("typeIDs length: ", typesEntryCount));
        return fireTypeRequest(resolver);
    };
}

//
// you must run following function!
//
if (typeof module === "object") {
    module.exports = {
        /**
         * return eve typeId array or `undefined`
         */
        fetchTypeIds,
        /**
         * return the raw-type-volume-map.js source
         * @param {() => void} resolver Required at runtime with node.js (Promse resolver)
         */
        genTypeVolumeMap
    };
    console.log(
`- - - - You can do like following:
genTypeVolumeMap().then((/* data */) => console.log("done!!!"));
`
    );
} else {
    // genTypeVolumeMap().then(source => console.log(source));
    console.log("you must run this function -> genTypeVolumeMap().then(source => console.log(source))");
}
