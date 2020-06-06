/*!
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    <one line to give the program's name and a brief idea of what it does.>
    Copyright (C) 2018  jeffy-g hirotom1107@gmail.com

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

// DEVNOTE: require eve.db, download from: https://www.fuzzwork.co.uk/dump/latest/eve.db.bz2
const sqlite = require("sqlite3").verbose(); // <global install>

const updateEVEDB = require("./update-eve-db");
const ssimage = require("./ss-image");
const utils = require("../etc/utils");

const EVE_SDE_DBPath = updateEVEDB.EVE_SDE_DBPath;

// create sqlite.Database instance.
/**
 * @typedef {import("sqlite3").Database} Sqlite3Database
 * 
 * @type {Sqlite3Database}
 */
let eveDB;// = new sqlite.Database(EVE_SDE_DBPath);
/**
 * should lazy initialize because when "eve.db" not exists create by sqlite.Database instance
 */
const getDBInstance = () => {
    if (!eveDB) {
        eveDB = new sqlite.Database(EVE_SDE_DBPath);
    }
    return eveDB;
};


/**
 * @param {number} dgmId 
 */
function selectEVEAttribute(dgmId) {
    switch(dgmId) {
        case 164: return "charisma";
        case 165: return "intelligence";
        case 166: return "memory";
        case 167: return "perception";
        case 168: return "willpower";
    }
    return "ERROR: getAttrName";
}

/**
 * 
 * @param {Record<any, any>} object
 * @param separatedToArray conver separated by comma to array?
 */
function toStripedJSON(object, separatedToArray = false) {
    let striped = JSON.stringify(object, null, 2).replace(/"([^"]+)":/g, "$1:");
    return separatedToArray? striped.replace(/"(?=\d)/g, "[").replace(/",?(?=\s)/g, "],"): striped;
}

/**
 * 
 * @param {string} body json string
 */
function createSkillDatabaseTS(body) {
    return `
declare global {
  interface Requiredskill {
    id: number;
    level: number;
  }
  /**
   * for calcSkillPointPerHours
   * 
   * from "eve-skils.ts"
   */
  type SkillDataBaseEntry = {
    name: string;
    desc: string;
    // type id
    tid: number;
    // market group id
    mkt_gid: number;
    // market group name
    mkt_gname: string;
    // primary attribute
    p_attr: EVECharacterAttributesKeys;
    // secondary attribute
    s_attr: EVECharacterAttributesKeys;
    // training time multiplier
    ttm: number;
    // required skills
    rq_skills: Requiredskill[];
  };

  /**
   * from "eve-skils.ts"
   */
  type GroupDataBaseEntry = {
    /** e.g - "Skills pertaining to efficiently protecting the structural integrity of spaceships" */
    desc: string;
    /** e.g - 1745 */
    mkt_gid: number;
    /** e.g - "Armor" */
    name: string;
    /** e.g - 150 */
    // parent_group_id: number;
    /** e.g - [...] */
    types: number[];

    /** lazy initialize */
    children?: SkillDataBaseEntry[];
  };

  type EVESkillDataBase = {
    skills: {
      [skill_id: string]: SkillDataBaseEntry
    };
    groups: GroupDataBaseEntry[];
  };
}

export const SkillDB: EVESkillDataBase = ${body};
`.replace(/"(\w+)":/g, "$1:");
}

// node ./resources/eve-tool -cmd eve-skills
async function genEVESkillDatabase() {

    const skills = {};
    const groups = [];
    // const RQ_SKILL_ENTRY = { id: 0, level: 0 };

    await new Promise(resolve => {
		// marketGroups.yaml
        // getDBInstance().all("select * from marketGroups where parentGroupID = 150 order by nameID;", async function (err, mktGrpRows) { // - - - use origin column
        getDBInstance().all("select * from invMarketGroups where parentGroupID = 150 order by marketGroupName;", async function (err, mktGrpRows) {
            for (const mktGrpRow of mktGrpRows) {
				// - - - use origin column
                // console.log(mktGrpRow);
                // const group = {
                //     desc: mktGrpRow.descriptionID,
                //     mkt_gid: mktGrpRow.marketGroupID,
                //     name: mktGrpRow.nameID,
                //     types: []
                // };
                const group = {
                    desc: mktGrpRow.description,
                    mkt_gid: mktGrpRow.marketGroupID,
                    name: mktGrpRow.marketGroupName,
                    // parent_group_id: 150,
                    types: []
                };
                groups.push(group);

                await new Promise(resolveInner => {
                    getDBInstance().all(`select * from invTypes where marketGroupID = ${mktGrpRow.marketGroupID} order by typeName;`, function (err, typeRows) {
                        typeRows.forEach(typeRow => {
                            const tid = typeRow.typeID;
                            const skill = {
                                tid,
                                name: typeRow.typeName,
                                desc: typeRow.description,
                                mkt_gid: typeRow.marketGroupID,
                                mkt_gname: group.name,
                                rq_skills: []
                            };
                            skills[tid] = skill;
                            group.types.push(tid);
                        });
                        group.types.sort(
                            (a, b) => a > b ? 1: -1 // DEVNOTE: typeID is unique
                        );
                        resolveInner();
                    });
                }); // await new Promise(resolveInner =>
            } // for (const mktGrpRow of mktGrpRows)
            resolve();
        }); // getDBInstance().all("select * from invMarketGroups where parentGroupID = 150 order by marketGroupName;" ...
    });

    // NOTE: finally, resolve p_attr and s_attr, required skills from dogma attribute.
    for (const skill_id of Object.keys(skills)) {
        const skill = skills[skill_id];
        await new Promise(resolve => {
            // getDBInstance().all(`select * from dogmaTypeAttributes where typeID = ${skill.tid} order by attributeID;`, async function (err, dgmAttrRows) {
            getDBInstance().all(`select * from dgmTypeAttributes where typeID = ${skill.tid} order by attributeID;`, async function (err, dgmAttrRows) {

                // DEVNOTE: map by dgmTypeAttributes name requiredSkill1, ...
                const rq_skills_cache = {
                    182: { id: 0, level: 0 },
                    183: { id: 0, level: 0 },
                    184: { id: 0, level: 0 },
                    1285: { id: 0, level: 0 },
                    1289: { id: 0, level: 0 },
                    1290: { id: 0, level: 0 },
                };
                // DEVNOTE: map by dgmTypeAttributes name requiredSkill1Level, ...
                const rq_skills_cache_mirror = {
                    277: rq_skills_cache[182],
                    278: rq_skills_cache[183],
                    279: rq_skills_cache[184],

                    1286: rq_skills_cache[1285],
                    1287: rq_skills_cache[1289],
                    1288: rq_skills_cache[1290],
                };

                for (const dgmAttrRow of dgmAttrRows) {
                    const attrID = dgmAttrRow.attributeID;
                    switch(attrID) {
                        case 180: // p_attr, s_attr
                        case 181: {
                            await new Promise(resolveAttrName => {
                                // getDBInstance().get(`SELECT value FROM dogmaTypeAttributes where attributeID = ${attrID} and typeID = ${skill_id};`, (err, row) => {
                                // DEVNOTE: A value is set in either "valueInt" or "valueFloat" in the SDE database made by fuzz works!!
                                //   Note this is different from the original data structure
                                getDBInstance().get(`SELECT valueInt, valueFloat FROM dgmTypeAttributes where attributeID = ${attrID} and typeID = ${skill_id};`, (err, row) => {
                                    const propName = attrID === 180? "p_attr": "s_attr";
                                    // skill[propName] = selectEVEAttribute(row.value);
                                    skill[propName] = selectEVEAttribute(row.valueInt || row.valueFloat);
                                    resolveAttrName();
                                });
                            });
                            break;
                        }

                        case 182: // requiredSkill1, requiredSkill2, requiredSkill3
                        case 183:
                        case 184:
                        case 1285: // requiredSkill4, requiredSkill5, requiredSkill6
                        case 1289:
                        case 1290: {
                            // rq_skills_cache[attrID].id = +dgmAttrRow.value;
                            rq_skills_cache[attrID].id = +(dgmAttrRow.valueInt || dgmAttrRow.valueFloat);
                            break;
                        }

                        // "Time constant for skill training" -> [Training time multiplier]
                        case 275: {
                            // dgmAttrRow.value === null && console.error("invalid value:", dgmAttrRow.value);
                            // skill.ttm = +(dgmAttrRow.value);
                            dgmAttrRow.valueFloat === null && console.error("invalid value:", dgmAttrRow.valueFloat);
                            skill.ttm = +(dgmAttrRow.valueFloat);
                            break;
                        }

                        case 277: // requiredSkill1Level, 2, 3
                        case 278:
                        case 279:
                        case 1286: // requiredSkill4Level, 5, 6
                        case 1287:
                        case 1288: {
                            // rq_skills_cache_mirror[attrID].level = +dgmAttrRow.value;
                            rq_skills_cache_mirror[attrID].level = +(dgmAttrRow.valueInt || dgmAttrRow.valueFloat);
                            break;
                        }
                    }
                }; // for (const dgmAttrRow of dgmAttrRows)

                const required_skills = skill.rq_skills;
                Object.keys(rq_skills_cache).forEach(dogmaId => {
                    const rq_skill = rq_skills_cache[dogmaId];
                    // console.log(e);
                    if (rq_skill.id > 0)
                        required_skills.push(rq_skill);
                });

                resolve();

            }); // getDBInstance().all(`select * from dgmTypeAttributes where typeID...
        }); //  for (const skill_id of Object.keys(skills))
    }
    return { skills, groups };
}

/**
 * 
 */
async function genEVETypeIdMap() {

    const categoryIDs = await new Promise(resolve => {
        getDBInstance().all("select * from invCategories order by categoryID;", async function (err,  categories) {
            const datas = {};
            for (const { categoryID, categoryName } of categories) {
                // DEVNOTE: direct assign. (categoryName
                datas[categoryID] = categoryName;
            }
            resolve(datas);
        });
    });
    const groupIDs = await new Promise(resolve => {
        getDBInstance().all("select * from invGroups order by groupID;", async function (err,  groups) {
            const datas = {};
            for (const { groupID, categoryID, groupName } of groups) {
                datas[groupID] = {
                    // cid - categoryID
                    c: categoryID,
                    // name - groupName
                    n: groupName
                };
            }
            resolve(datas);
        });
    });
    const typeIDs = await new Promise(resolve => {
        getDBInstance().all("select * from invTypes order by typeID;", async function (err,  types) {
            const datas = {};
            for (const { typeID, groupID } of types) {
                // CHANGES: 2019/8/24 - became more simplified structure
                datas[typeID] = groupID;
                // datas[typeID] = {
                //     // gid - groupID
                //     g: groupID,
                //     // name - typeName
                //     // DEVNOTE: 1/7/2019 - This type id map is used to create asset data, however, "n" is not used.
                //     //   -> By excluding "n" property you can considerably reduce file size.
                //     // n: type.typeName
                // };
            }
            resolve(datas);
        });
    });
    return {
        categoryIDs,
        groupIDs,
        typeIDs
    };
}

function createEVETypeIdMapTS(map) {
    return `
export type TEVETypeIdMap = {
  categoryIDs: Record<number, string>;
  groupIDs: Record<number, {
    /** category id */ c: number;
    /** name */ n: string;
  }>;
  typeIDs: Record<number, /** group id */number>;
//   groupIDs: {
//     [n: number]: {
//       /** category id */
//       c: number;
//       /** name */
//       n: string;
//     }
//   };
//   typeIDs: {
//     [n: number]: {
//       /** group id */
//       g: number;
//       // /** name */
//       //n: string;
//     }
//   }
};
// for webpack deployment.
// const EVETypeIdMap: TEVETypeIdMap;

export const EVETypeIdMap: TEVETypeIdMap = ${map};
// see: app.tsx
// window["EVEApp"] = Object.assign({ EVETypeIdMap }, window["EVEApp"] || {} as typeof EVEApp);
window["EVEApp"] = Object.assign(window["EVEApp"] || {} as typeof EVEApp, { EVETypeIdMap });
`.replace(/"(\w+)":/g, "$1:");
}

/**
 * 
 */
async function genEVERegionMap() {

    return await new Promise(resolve => {
        getDBInstance().all("select regionID, regionName from mapRegions;", async function (err,  regions) {
            const datas = {};
            for (const region of regions) {
                // DEVNOTE: direct assign. (regionName
                datas[region.regionID] = region.regionName;
            }
            resolve(datas);
        });
    });
}

/**
 * 
 */
async function genEVESystemCoordinateMap() {
    return await new Promise(resolve => {
        // typeID, groupID is 5.
        // solarSystemID, orbitID, celestialIndex, orbitIndex is empty
        getDBInstance().all("select * from mapDenormalize where typeId = 5;", async function (err,  systemCoords) {
            /** @type {Parameters<typeof resolve>[0]} */
            const datas = [];
            for (const sc of systemCoords) {
                // const { solarSystemID, orbitID, celestialIndex, orbitIndex, ...rest } = sc;
                const { solarSystemID, orbitID, celestialIndex, orbitIndex, groupID, typeID, ...rest } = sc;
                datas.push(rest);
            }
            resolve(datas);
        });
    });
}

/**
 * @typedef {{
 *   itemName: string,
 *   x: number, y: number, z: number,
 *   radius: number
 * }} Coodinate
 */

async function genEVESystemCoordinateMapSmall() {
    return await new Promise((/** @type {(value: Coodinate[]) => void} */resolve) => {
        // typeID, groupID is 5.
        // solarSystemID, orbitID, celestialIndex, orbitIndex is empty
        getDBInstance().all("select * from mapDenormalize where typeId = 5;", async function (err,  /** @type {Coodinate[]} */systemCoords) {
            /** @type {Parameters<typeof resolve>[0]} */
            const datas = [];
            for (const sc of systemCoords) {
                const { itemName, x, y, z, radius } = sc;
                // exclude wh
                !/\d{5}/.test(itemName) && datas.push({ itemName, x, y, z, radius });
            }
            resolve(datas);
        });
    });
}

/**
 * @typedef {{ licenseTypeID: number, skinID: number }} SkinLicense
 * @typedef {{ skinMaterialID: number }} Skin
 */
/**
 * DEVNOTE: 2019-6-29
 *   + which means, skinLicense.licenseTypeID as typeID, skinLicense.skinID as skins.skinID
 *     + -> skins.skinMaterialID to skinMaterials.skinMaterialID (=sde/Icons/UI/SKINIcons/*.png) !correct
 * 
 *  skinLicense.licenseTypeID(typeID) -> skinLicense.skinID(skins.skinID)
 *  skins.skinID -> skins.skinMaterialID(skinMaterials.skinMaterialID) - (=sde/Icons/UI/SKINIcons/*.png)
 * 
 * DEVNOTE: 2019/9/13 - output json data is need merge to src/util/skin-map.ts data content
 * TODO: Skin image supplementation
 */
function genEVESkinMap() {
    return new Promise((/** @type {(value: Object.<number, number>) => void} */resolve) => {
        // licenseTypeID
        // getDBInstance().all("select * from skinLicenses order by licenseTypeID;", async function (err,  /** @type {SkinLicense[]} */skinLicenses) {
        getDBInstance().all("select * from skinLicense order by licenseTypeID;", async function (err,  /** @type {SkinLicense[]} */skinLicenses) {
            // const datas = {};
            // for (const skinLicense of skinLicenses) {
            //     await new Promise(resolveInner => {
            //         getDBInstance().get("select * from skins where skinID = ?;", skinLicense.skinID, async function (err,  skin) {
            //             datas[skinLicense.licenseTypeID] = skin.skinMaterialID;
            //             resolveInner();
            //         });
            //     });
            // }
            // resolve(datas);

            /** @type {Parameters<typeof resolve>[0]} */
            const datas = {};
            const promises = [];
            for (const skinLicense of skinLicenses) {
                promises.push(
                    new Promise(resolveInner => {
                        getDBInstance().get("select * from skins where skinID = ?;", skinLicense.skinID, async function (err,  /** @type {Skin} */skin) {
                            datas[skinLicense.licenseTypeID] = skin.skinMaterialID;
                            resolveInner();
                        });
                    })
                );
            }
            await Promise.all(promises);
            resolve(datas);

            // const datas = {};
            // const promises = [];
            // for (const skinLicense of skinLicenses) {
            //     promises.push(
            //         new Promise(resolveInner => {
            //             getDBInstance().get("select * from skins where skinID = ?;", skinLicense.skinID, async function (err,  skin) {
            //                 let array = datas[skin.skinMaterialID];
            //                 if (array === void 0) {
            //                     datas[skin.skinMaterialID] = array = [];
            //                 }
            //                 array.push(skinLicense.licenseTypeID);
            //                 resolveInner();
            //             });
            //         })
            //     );
            // }
            // await Promise.all(promises);
            // Object.keys(datas).forEach(key => {
            //     datas[key] = datas[key].join(",");
            // });
            // resolve(datas);
        });
    });
}

const emitSkinMapTs = (/** @type {string} */json) => {
    return `/*!
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  <one line to give the program's name and a brief idea of what it does.>
  Copyright (C) ${new Date().getFullYear()} jeffy-g hirotom1107@gmail.com

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

export type TSkinMapKey = keyof typeof SkinMap;
/**
 * skin icon size is 64x64
 * 
 * @example
 * // usage:
 * \`./images/skin-icons/\${n}.png\`
 */
export const SkinMap = ${
    json
    // json.replace(/: "(?=\d)/g, ": [").replace(/",?(?=\s)/g, "],")
} as const;
`;
}

async function genAlphaSkillMap() {
    /**
     * @param {string[]} names 
     */
    function * getSkillLevelDataByName(names) {
        for (const name of names) {
            console.log(name);
            yield new Promise((/** @type {(value: Object.<number, number> | null) => void} */resolve) => {
                getDBInstance().get("select typeID from invTypes where typeName = ?;", name, async function (err, /** @type {{ typeID: number }} */data) {
                    resolve(
                        data === void 0? null:
                        { [data.typeID]: baseData[name] }
                    );
                });
            });
        }
    }
    /** @type {{ [skillName: string]: number }} */
    const baseData = JSON.parse(
        utils.readTextUTF8("./etc/eve/alphaskill-set.json")
    );
    const skillNames = Object.keys(baseData);
    /** @type {{ [skillTypeId: string]: number }} */
    const alphaSkillMap = {};
    // console.log(skillNames);
    for await (const alpahSkillData of getSkillLevelDataByName(skillNames)) {
        if (alpahSkillData === null) {
            console.error("ERROR: typeID not found!");
        } else {
            console.log(alpahSkillData);
            Object.assign(alphaSkillMap, alpahSkillData);
        }
    }
    return alphaSkillMap;
}


/**
 * 
 * @param {() => Promise<any>} handler 
 * @param {string} fileName 
 */
async function defaultBuilder(
    handler,
    fileName,
    indent = 1,
    stripName = false,
    /** @type {(json: string) => string} */
    formater = void 0
) {
    const data = await handler();
    let jsonSource = JSON.stringify(data, null, indent);
    if (stripName) {
        jsonSource = jsonSource.replace(/"([^"]+)":/g, "$1:");
    }
    if (typeof formater === "function") {
        jsonSource = formater(jsonSource);
    }
    utils.writeTextUTF8(jsonSource, fileName, function () {
        console.log(`created ${fileName}, `, arguments);
        // getDBInstance().close();
    });
}

/**
 * 
 * @param {() => Promise<any>} asyncGenerator 
 * @param {(json: string) => string} sourceBuilder 
 * @param {string} sourcePath 
 */
async function processSource(
    asyncGenerator,
    sourceBuilder,
    sourcePath,
) {
    const product = await asyncGenerator();
    const tsSource = sourceBuilder(
        JSON.stringify(product, null, 2)
    );
    utils.writeTextUTF8(tsSource, sourcePath, function () {
        console.log(`process: "${sourcePath}" done, callback args:`, arguments);
    });
}

const ToolFunctions = {
    // node ./resources/eve-tool -cmd check-db
    "check-db": updateEVEDB.updateSDEDatabase,

    // node ./resources/eve-tool -cmd sde-version
    "sde-version": () => {
		updateEVEDB.getSDEVersion().then(v => console.log(v));
	},

    // node ./resources/eve-tool -cmd up-imglist
    "up-imglist": ssimage.updateImageList,

    // node ./resources/eve-tool -cmd eve-skills
    "eve-skills": () => {
        processSource(
            genEVESkillDatabase,
            createSkillDatabaseTS,
            "./src/eve/models/eve-skills.ts",
        );
    },
    // node ./resources/eve-tool -cmd typeid-map
    "typeid-map": () => {
        processSource(
            genEVETypeIdMap,
            createEVETypeIdMapTS,
            "./src/eve/api/typeid-map.ts",
        );
    },
    // node ./resources/eve-tool -cmd skin-map
    "skin-map": () => {
        defaultBuilder(
            genEVESkinMap, "src/eve/models/skin-map.ts",
            2, false,
            emitSkinMapTs
        );
    },
    // node ./resources/eve-tool -cmd region-map
    "region-map": () => {
        defaultBuilder(genEVERegionMap, "tmp/region-map.json", 2/* , true */);
    },
    // node ./resources/eve-tool -cmd system-coordinate
    "system-coordinate": () => {
        defaultBuilder(genEVESystemCoordinateMap, "tmp/system-coordinate-map.json");
    },
    // node ./resources/eve-tool -cmd system-coordinate-small
    "system-coordinate-small": () => {
        defaultBuilder(genEVESystemCoordinateMapSmall, "tmp/sc-small-map.json");
    },
    // node ./resources/eve-tool -cmd alphaskill-map
    "alphaskill-map": () => {
        defaultBuilder(
            genAlphaSkillMap, "./src/eve/models/alphaskill-map.ts",
            2, true,
            (/** @type {string} */json) => `export type TAlphaSkillMapKey = keyof typeof alphaSkillMap;\nexport const alphaSkillMap = ${json} as const;\n`
        );
    },
    // node ./resources/eve-tool -cmd type-volume
};

/**
 * @typedef {keyof typeof ToolFunctions} EVEToolCommand
 * @typedef {Exclude<EVEToolCommand, "check-db" | "sde-version" | "up-imglist">} EVEToolCommandList
 * 
 * @typedef {object} ToolArgs
 * @prop {EVEToolCommand | "all"} cmd
 */

/**
 * @type {ToolArgs}
 */
const params = utils.getExtraArgs({}, true);

/**
 * @type {EVEToolCommandList[]}
 */
// @ts-ignore cannot resolve type
const cmdList = Object.keys(ToolFunctions).filter(key => key !== "check-db" && key !== "sde-version" && key !== "up-imglist");

if (params.cmd === "all") {
    /** DEVNOTE: 2019-2-26 - all commands is works normally. */
    for (const cmd of cmdList) {
        ToolFunctions[cmd]();
    }
} else {
	console.log(params);
    const fn = ToolFunctions[params.cmd];
    if (typeof fn === "function") {
        fn();
    } else {
        const commands = Object.keys(ToolFunctions);
        console.log("- - - - available commands:");
        for (const cmd of commands) {
            console.log(cmd);
        }
    }
}


