// @ts-ignore
///<reference path="../../src/ts.d/global.d.ts"/>

// function webSafeBase64(str: string) {
//     return str
//     .replace(/\+/g, "-")
//     .replace(/\//g, "_")
//     .replace(/=/g, "");
// }

/**
 * @typedef {Object} ESIHealthStatus - creates a new type named 'ESIHealthStatus'
 * @property {string} endpoint - a string property of ESIHealthStatus
 * @property {string} method - a string property of ESIHealthStatus
 * @property {string} route - a string property of ESIHealthStatus
 * @property {"green" | "yellow" | "red"} status - a string property of ESIHealthStatus
 * @prop {string[]} tags - a number property of ESIHealthStatus
 */
/**
 * @typedef ESIRequestParam
 * @property {string} endpoint
 * @property {string} [bindName]
 * @property {Function | null} [handler]
 * @property {Record<string, any>} [esiQuery]
 */
/**
 * @typedef {Object} SimplifiedESIRequestEntry - creates a new type named 'SimplifiedESIRequestEntry'
 * @property {number} interval - task running interval. (from "x-cached-seconds"
 * @property {string} operationId - from operationId.
 * @property {string} summary - from summary.
 * @property {ESIRequestParam} context - includes "endpoint" and extras.
 * @prop {string} [scope] - optional, ESI scope token.
 */
/**
 * @typedef {Object} ESIRequestEntry - creates a new type named 'ESIRequestEntry'
 * @property {string} description - a string property of ESIRequestEntry
 * @property {string} operationId - a string property of ESIRequestEntry
 * @property {Record<string, any>[]} parameters - a string property of ESIRequestEntry
 * @property {{ [status: number]: object }} responses - a string property of ESIRequestEntry
 * @property { { evesso: string[] }[] } security - a string property of ESIRequestEntry
 * @property {string} summary - a string property of ESIRequestEntry
 * @property {string[]} tags - a string property of ESIRequestEntry
 *  prop {string[]} x-alternate-versions - a number property of ESIRequestEntry
 *  prop {number} x-cached-seconds - a number property of ESIRequestEntry
 */
/**
 * @typedef {Record<string, { [method: string]: ESIRequestEntry }>} ESIRequestRegistry - creates a new type named 'ESIRequestEntry'
 */
/**
 * @typedef {RequestInit & { uri: string }} RequestInitPlus
 */

/**
 * `length` must be Datetime span as number.
 * @param {number} length
 */
function toDateUnit(length) {
    return length / (24 * 3600 * 1000);
}

 /**
 * UPDATE: 2020/1/28 - commented out bookmarks related
 * 
 * @type {Record<string, string>}
 */
const scopeDescRegistry = {
    // // assets, assets/locations, assets/names
    "esi-assets.read_assets.v1": "Return a list of the characters assets",
    "esi-assets.read_corporation_assets.v1": "Return a list of the corporation assets",

    // DEVNOTE: 2020/1/28 - currently, bookmarks related endpoint is not working
    // // {character_id}/bookmarks/, {character_id}/bookmarks/folders/
    // "esi-bookmarks.read_character_bookmarks.v1": "A list of your character’s personal bookmarks, folders",
    // // {corporation_id}/bookmarks/, {corporation_id}/bookmarks/folders/
    // "esi-bookmarks.read_corporation_bookmarks.v1": "A list of your corporation’s bookmarks, folders",

    "esi-characters.read_contacts.v1": "Read character contacts and contacts labels",
    "esi-characters.read_fatigue.v1": "Return a character’s jump activation and fatigue information",
    "esi-characters.read_loyalty.v1": "Return a list of loyalty points for all corporations the character has worked for",
    // This route is cached for up to 86400 seconds
    "esi-characterstats.read.v1": "Returns aggregate yearly stats for a character",
    "esi-clones.read_clones.v1": "A list of the character’s clones",
    "esi-clones.read_implants.v1": "Return implants on the active clone of a character",
    // contracts, contracts/{contract_id}/bids, contracts/{contract_id}/items
    "esi-contracts.read_character_contracts.v1": "Returns contracts available to a character",

    // GET, POST: /characters/{character_id}/fittings/, DELETE: /characters/{character_id}/fittings/{fitting_id}/
    "esi-fittings.read_fittings.v1": "Return fittings of a character",
    "esi-fittings.write_fittings.v1": "Delete a fitting from a character",

    "esi-location.read_location.v1": "Information about the characters current location",
    "esi-location.read_online.v1": "Checks if the character is currently online",
    "esi-location.read_ship_type.v1": "Get the current ship type, name and id",
    // post_characters_character_id_mail_labels delete_characters_character_id_mail_labels_label_id
    // delete_characters_character_id_mail_mail_id put_characters_character_id_mail_mail_id
    "esi-mail.organize_mail.v1": "organize mail of character",
    // mail/{mail_id} (individual), /mail/lists[mailinglists], mail/labels[maillabels], mail[mails]
    "esi-mail.read_mail.v1": "Return the 50 most recent mail headers belonging to the character that match the query criteria",
    // /characters/{character_id}/mail/
    "esi-mail.send_mail.v1": "Create and send a new mail",
    // characters/{character_id}/orders/, characters/{character_id}/orders/history/
    "esi-markets.read_character_orders.v1": "List open market orders placed by a character",
    "esi-skills.read_skillqueue.v1": "List the configured skill queue for the given character",
    // attributes, skills
    "esi-skills.read_skills.v1": "List all trained skills for the given character",
    "esi-universe.read_structures.v1": "Read Dockable Structure Information",
    // wallet_journal, wallet_transactions
    "esi-wallet.read_character_wallet.v1": "Read character’s wallet balance, journal(going 30 days back), transactions",
    // "esi-wallet.read_corporation_wallets.v1": "Read corporation’s wallet journal for the given division going 30 days back"

    "esi-industry.read_character_jobs.v1": "List industry jobs placed by a character etc",

    "esi-search.search_structures.v1": "Search for entities that match a given sub-string.", // get_characters_character_id_search
    "esi-characters.read_agents_research.v1": "Return a list of agents research information for a character.",
    "esi-ui.write_waypoint.v1": "Set a solar system as waypoint.",
    
    // DEVNOTE: 2019/7/11 - added irregular scopes
    "esi-markets.structure_markets.v1": "Return all orders in a structure",
};
/**
 * UPDATE: 11/30/2018
 * UPDATE: 2020/1/28 - commented out bookmarks related
 * 
 * DEVNOTE: If you need to periodically request the EVE character related data query, write it here.
 */
const bindNameRegistry = {
    // "/characters/{character_id}/assets/": { esiQuery: { query: { page: 1 } } },
    // DEVNOTE: "page" parameter are not required. default: 1
    "/characters/{character_id}/assets/": undefined,

    "/alliances/{alliance_id}/": "alliance",
    "/corporations/{corporation_id}/": "corporation",
    "/characters/{character_id}/attributes/": "attributes",
    "/characters/{character_id}/agents_research/": "agents_research",

    // DEVNOTE: 2020/1/28 - currently, bookmarks related endpoint is not working
    // "/characters/{character_id}/bookmarks/": "bookmarks",                // "page" parameter
    // "/characters/{character_id}/bookmarks/folders/": "bookmark_folders", // "page" parameter
    // "/corporations/{corporation_id}/bookmarks/": "corp_bookmarks",                // has "page" parameter but restricted 500 item. (request result are 1000 item max.
    // "/corporations/{corporation_id}/bookmarks/folders/": "corp_bookmark_folders", // has "page" parameter but ...

    "/characters/{character_id}/contacts/": "contacts",
    "/characters/{character_id}/contacts/labels/": "contacts_labels",
    "/characters/{character_id}/fatigue/": "fatigue",
    // 2019/11/3
    "/characters/{character_id}/fittings/": "fittings",
    /**
     * DEVNOTE: 2019/11/5 - see class ESIRequestContext
     */
    "/characters/{character_id}/industry/jobs/": {
        bindName: "industry_jobs",
        esiQuery: { include_completed: true }
    },

    "/characters/{character_id}/mail/labels/": "mailLabels",
    "/characters/{character_id}/online/": "online",
    "/characters/{character_id}/orders/": "orders",
    "/characters/{character_id}/orders/history/": "orders_history",
    "/characters/{character_id}/stats/": "stats",
    "/characters/{character_id}/wallet/": "balance",
    "/characters/{character_id}/wallet/journal/": "wallet_journal",
    "/characters/{character_id}/wallet/transactions/": "wallet_transactions",

    "/characters/{character_id}/": undefined,
    "/characters/{character_id}/clones/": undefined,
    "/characters/{character_id}/contracts/": undefined,
    "/characters/{character_id}/implants/": undefined,
    "/characters/{character_id}/location/": undefined,
    "/characters/{character_id}/loyalty/points/": undefined,
    "/characters/{character_id}/mail/": undefined,
    "/characters/{character_id}/mail/lists/": undefined,
    "/characters/{character_id}/ship/": undefined,
    "/characters/{character_id}/skillqueue/": undefined,
    "/characters/{character_id}/skills/": undefined,
};

/**
 * ESI endpoint list of EVE character periodically request.
 */
let currentEndpointUsed = Object.keys(bindNameRegistry);


/**
 * [swagger.json].securityDefinitions.evesso.scopes (at 12/2/2018)
 * @type {Record<string, string>}
 */
const LatestScopes = {
    "esi-alliances.read_contacts.v1": "EVE SSO scope esi-alliances.read_contacts.v1",
    "esi-assets.read_assets.v1": "EVE SSO scope esi-assets.read_assets.v1",
    "esi-assets.read_corporation_assets.v1": "EVE SSO scope esi-assets.read_corporation_assets.v1",
    "esi-bookmarks.read_character_bookmarks.v1": "EVE SSO scope esi-bookmarks.read_character_bookmarks.v1",
    "esi-bookmarks.read_corporation_bookmarks.v1": "EVE SSO scope esi-bookmarks.read_corporation_bookmarks.v1",
    "esi-calendar.read_calendar_events.v1": "EVE SSO scope esi-calendar.read_calendar_events.v1",
    "esi-calendar.respond_calendar_events.v1": "EVE SSO scope esi-calendar.respond_calendar_events.v1",
    "esi-characters.read_agents_research.v1": "EVE SSO scope esi-characters.read_agents_research.v1",
    "esi-characters.read_blueprints.v1": "EVE SSO scope esi-characters.read_blueprints.v1",
    "esi-characters.read_contacts.v1": "EVE SSO scope esi-characters.read_contacts.v1",
    "esi-characters.read_corporation_roles.v1": "EVE SSO scope esi-characters.read_corporation_roles.v1",
    "esi-characters.read_fatigue.v1": "EVE SSO scope esi-characters.read_fatigue.v1",
    "esi-characters.read_fw_stats.v1": "EVE SSO scope esi-characters.read_fw_stats.v1",
    "esi-characters.read_loyalty.v1": "EVE SSO scope esi-characters.read_loyalty.v1",
    "esi-characters.read_medals.v1": "EVE SSO scope esi-characters.read_medals.v1",
    "esi-characters.read_notifications.v1": "EVE SSO scope esi-characters.read_notifications.v1",
    "esi-characters.read_opportunities.v1": "EVE SSO scope esi-characters.read_opportunities.v1",
    "esi-characters.read_standings.v1": "EVE SSO scope esi-characters.read_standings.v1",
    "esi-characters.read_titles.v1": "EVE SSO scope esi-characters.read_titles.v1",
    "esi-characters.write_contacts.v1": "EVE SSO scope esi-characters.write_contacts.v1",
    "esi-characterstats.read.v1": "EVE SSO scope esi-characterstats.read.v1",
    "esi-clones.read_clones.v1": "EVE SSO scope esi-clones.read_clones.v1",
    "esi-clones.read_implants.v1": "EVE SSO scope esi-clones.read_implants.v1",
    "esi-contracts.read_character_contracts.v1": "EVE SSO scope esi-contracts.read_character_contracts.v1",
    "esi-contracts.read_corporation_contracts.v1": "EVE SSO scope esi-contracts.read_corporation_contracts.v1",
    "esi-corporations.read_blueprints.v1": "EVE SSO scope esi-corporations.read_blueprints.v1",
    "esi-corporations.read_contacts.v1": "EVE SSO scope esi-corporations.read_contacts.v1",
    "esi-corporations.read_container_logs.v1": "EVE SSO scope esi-corporations.read_container_logs.v1",
    "esi-corporations.read_corporation_membership.v1": "EVE SSO scope esi-corporations.read_corporation_membership.v1",
    "esi-corporations.read_divisions.v1": "EVE SSO scope esi-corporations.read_divisions.v1",
    "esi-corporations.read_facilities.v1": "EVE SSO scope esi-corporations.read_facilities.v1",
    "esi-corporations.read_fw_stats.v1": "EVE SSO scope esi-corporations.read_fw_stats.v1",
    "esi-corporations.read_medals.v1": "EVE SSO scope esi-corporations.read_medals.v1",
    "esi-corporations.read_standings.v1": "EVE SSO scope esi-corporations.read_standings.v1",
    "esi-corporations.read_starbases.v1": "EVE SSO scope esi-corporations.read_starbases.v1",
    "esi-corporations.read_structures.v1": "EVE SSO scope esi-corporations.read_structures.v1",
    "esi-corporations.read_titles.v1": "EVE SSO scope esi-corporations.read_titles.v1",
    "esi-corporations.track_members.v1": "EVE SSO scope esi-corporations.track_members.v1",
    "esi-fittings.read_fittings.v1": "EVE SSO scope esi-fittings.read_fittings.v1",
    "esi-fittings.write_fittings.v1": "EVE SSO scope esi-fittings.write_fittings.v1",
    "esi-fleets.read_fleet.v1": "EVE SSO scope esi-fleets.read_fleet.v1",
    "esi-fleets.write_fleet.v1": "EVE SSO scope esi-fleets.write_fleet.v1",
    "esi-industry.read_character_jobs.v1": "EVE SSO scope esi-industry.read_character_jobs.v1",
    "esi-industry.read_character_mining.v1": "EVE SSO scope esi-industry.read_character_mining.v1",
    "esi-industry.read_corporation_jobs.v1": "EVE SSO scope esi-industry.read_corporation_jobs.v1",
    "esi-industry.read_corporation_mining.v1": "EVE SSO scope esi-industry.read_corporation_mining.v1",
    "esi-killmails.read_corporation_killmails.v1": "EVE SSO scope esi-killmails.read_corporation_killmails.v1",
    "esi-killmails.read_killmails.v1": "EVE SSO scope esi-killmails.read_killmails.v1",
    "esi-location.read_location.v1": "EVE SSO scope esi-location.read_location.v1",
    "esi-location.read_online.v1": "EVE SSO scope esi-location.read_online.v1",
    "esi-location.read_ship_type.v1": "EVE SSO scope esi-location.read_ship_type.v1",
    "esi-mail.organize_mail.v1": "EVE SSO scope esi-mail.organize_mail.v1",
    "esi-mail.read_mail.v1": "EVE SSO scope esi-mail.read_mail.v1",
    "esi-mail.send_mail.v1": "EVE SSO scope esi-mail.send_mail.v1",
    "esi-markets.read_character_orders.v1": "EVE SSO scope esi-markets.read_character_orders.v1",
    "esi-markets.read_corporation_orders.v1": "EVE SSO scope esi-markets.read_corporation_orders.v1",
    "esi-markets.structure_markets.v1": "EVE SSO scope esi-markets.structure_markets.v1",
    "esi-planets.manage_planets.v1": "EVE SSO scope esi-planets.manage_planets.v1",
    "esi-planets.read_customs_offices.v1": "EVE SSO scope esi-planets.read_customs_offices.v1",
    "esi-search.search_structures.v1": "EVE SSO scope esi-search.search_structures.v1",
    "esi-skills.read_skillqueue.v1": "EVE SSO scope esi-skills.read_skillqueue.v1",
    "esi-skills.read_skills.v1": "EVE SSO scope esi-skills.read_skills.v1",
    "esi-ui.open_window.v1": "EVE SSO scope esi-ui.open_window.v1",
    "esi-ui.write_waypoint.v1": "EVE SSO scope esi-ui.write_waypoint.v1",
    "esi-universe.read_structures.v1": "EVE SSO scope esi-universe.read_structures.v1",
    "esi-wallet.read_character_wallet.v1": "EVE SSO scope esi-wallet.read_character_wallet.v1",
    "esi-wallet.read_corporation_wallets.v1": "EVE SSO scope esi-wallet.read_corporation_wallets.v1"
};

/*FORMALIZE_SCOPES:*/ {
    Object.keys(scopeDescRegistry).forEach(scope => {
        LatestScopes[scope] = scopeDescRegistry[scope];
    });
    Object.keys(LatestScopes).forEach(scope => {
        const desc = LatestScopes[scope];
        if (desc.startsWith("EVE SSO scope")) {
            LatestScopes[scope] = "N/A";
        }
    });
    console.log(
        JSON.stringify(LatestScopes, null, 4)
    );
}


/**
 * combine scope tokens by separator.
 * 
 * @param separator default is " ". (space char)
 */
function combineScopeTokens(separator = " ") {
    return Object.keys(scopeDescRegistry).join(separator);
    // return scopeDesc Registry.map(a => a.name).join(separator);
}
// /**
//  * 
//  * @param {string} scope 
//  */
// function lookUpScopeDescription(scope) {
//     // for (const scopeEntry of scopeDesc Registry) {
//     //     if (scopeEntry.name === scope) {
//     //         return scopeEntry.description;
//     //     }
//     // }
//     // return void 0;
//     return scopeDescRegistry[scope];
// }

function showEVEColors() {
    const base = [ "#0000fe", "#006634", "#0099ff", "#00ff33", "#01ffff", "#349800", "#660066", "#666666", "#999999", "#99ffff", "#9a0000", "#ccff9a", "#e6e6e6", "#fe0000", "#ff6600", "#ffff01", "#ffffcd", "#ffffff"];

    for (const c of base) {
        const line = `%cEVE color sample, value: ${c}`;
        console.log(line, `padding: 2px 5px; background: black; color: ${c}`);
    }
}

/**
 * 
 * @param {ESIHealthStatus} a 
 * @param {ESIHealthStatus} b 
 */
function esiStatusComparator(a, b) {
    if (a.status === "red") {
        return b.status === "red" ? a.route.localeCompare(b.route): 1;
    }

    const stat_b = b.status;
    if (a.status === "yellow") {
        return stat_b === "red" ? -1: stat_b === "green" ? 1: a.route.localeCompare(b.route);
    }
    if (a.status === "green") {
        return stat_b === "green" ? a.route.localeCompare(b.route): -1;
    }
}
/**
 * https://esi.evetech.net/status.json?version=latest
 * ```
[
    {
        "endpoint": "esi-sovereignty",
        "method": "get",
        "route": "/sovereignty/campaigns/",
        "status": "yellow",
        "tags": [
            "Sovereignty"
        ]
    }, ...
]
```
 */
function showESIHealthStatus() {
    const statistics = {
        green: 0, yellow: 0, red: 0
    };
    /** @type {(json: ESIHealthStatus[]) => void} */
    const handler = json => {
        if (Array.isArray(json)) { //get,     
            json.sort(esiStatusComparator);
            const styleBase = "padding: 1px 0 1px 2px; background: rgba(192, 192, 192, 0.39); color: gray; font-weight: bold";
            const routeStyle = "padding: 1px 2px 1px 0; background: rgba(192, 192, 192, 0.39); font-weight: bold";
            json.forEach(e => {
                // method:get,tag:Killmails, route: /characters/{character_id}/killmails/recent/
                console.log(
                    "%croute: %c%s%c- method: %stag: %s",
                    styleBase,
                    `${routeStyle}; color: ${e.status}`, e.route.padEnd(64),
                    styleBase, (e.method + ",").padEnd(8), e.tags[0],
                );
                statistics[e.status]++;
            });
            console.log("statistics:", statistics);
        }
    };

    fetch("https://esi.evetech.net/status.json?version=latest").then(res => {
        console.log("----> recive response: etag=%s", res.headers.get("etag"));
        return res.json();
    }).then(handler);
}

/**
 * 
 * @param {(json: Record<string, any>) => void} callback 
 */
async function fetchEVESwaggarJson(callback) {
//  https://esi.evetech.net/latest/swagger.json

    const GLOBAL_VAR_NAME = "__eve_swaggar_json";
    {
        if (window.hasOwnProperty(GLOBAL_VAR_NAME)) {
            callback(window[GLOBAL_VAR_NAME]);
            return;
        }
    }

    /** @type {RequestInit} */
    const options = {
        method: "get",
        mode: "cors",
    };

    return fetch("https://esi.evetech.net/latest/swagger.json", options).then(res => {
        console.log("----> recive response");
        return res.json();
    }).then(json => {
        console.log("--------> recive json data");
        if (!window.hasOwnProperty(GLOBAL_VAR_NAME)) {
            window[GLOBAL_VAR_NAME] = json;
        }
        if (typeof callback === "function") {
            callback(json);
            console.log("----> callback called.");
        } else {
            console.log(json);
        }
    });
}

function getESIBaseUri() {
    // @ts-ignore 
    let { schemes, host, basePath } = __eve_swaggar_json;
    return schemes[0] + "://" + host + basePath;
}

/**
 * 
 * @param {(endpoint: string, entries: { [method: string]: ESIRequestEntry }, paths: ESIRequestRegistry) => void} handler 
 */
async function forEachPaths(handler) {
    await fetchEVESwaggarJson(json => {
        /** @type {{ [path: string]: { [method: string]: ESIRequestEntry } }} */
        const paths = json.paths;
        const endpoints = Object.keys(paths);
        console.log("endpoints.length:", endpoints.length);
        // endpoints.forEach(endpoint => {
        //     handler(
        //         endpoint, paths[endpoint]
        //     );
        // });
        for (const endpoint of endpoints) {
            handler(
                endpoint, paths[endpoint], paths
            );
        }
        console.log("- - - - - for (const endpoint of endpoints) done - - - - -");
    });
}


function printEndpoints() {
    forEachPaths((ep, entries) => {
        console.log("endpoint=%s", ep);
    });
}

// esi-mail.send_mail.v1
function findHasScopePaths(scope) {
    const map = {};
    forEachPaths((ep, entries) => {
        Object.keys(entries).forEach(k => {
            const entry = entries[k];
            if (entry.security) {
                const evesso = entry.security[0].evesso;
//                 console.log("scope count:", evesso.length);
                if (evesso.includes(scope)) {
                    map[entry.operationId] = ({
                        [ep]: {
                            [k]: entry
                        }
                    });
                }
            }
        });
    }).then(() => {
        console.log("- - - - - findHasScopePaths result of <%s> - - - - -", scope);
        console.log(map);
    });
}
/**
 * example:
 * ```
// one liner
printEndpointEntry("/route/{origin}/{destination}/", e => console.log(JSON.stringify(e, null, 2)));

// multi line.
printEndpointEntry("/route/{origin}/{destination}/", e => {
    console.log(
        JSON.stringify(e, null, 2)
    );
});

```
 * @param {string} endpoint 
 * @param {(e: { [method: string]: ESIRequestEntry }) => void} callback 
 */
function printEndpointEntry(endpoint, callback) {
    forEachPaths((ep, entries) => {
        if (ep === endpoint) {
            if (typeof callback === "function") {
                callback(entries);
            } else {
                console.log(entries);
            }
        }
    });
}

// OK
function analyzeOperationID(opid) {
    // "get_characters_character_id"
    const tokens = opid.split("_");
    const method = tokens.shift();
    let path = "/";
    for (let i = 0, j = i + 1; i < tokens.length; i++, j = i + 1) {
        const next = tokens[j];
        if (next === "id") {
            path += `{${tokens[i++]}_id}/`;
        } else {
            path += tokens[i] + "/";
        }
    }
    return {
        method, path
    }
}

function test_analyzeOperationID(filter) {
    let count = 0;
    forEachPaths((ep, entries) => {
        // scan "method" of each endpoint.
        Object.keys(entries).forEach(method => {
            if (filter && filter !== method) {
                return;
            }
            count++;
            console.log(
                analyzeOperationID(entries[method].operationId)
            );
        });
    }).then(() => {
        console.log("- - - - - test_analyzeOperationID done, hit=%d - - - - -", count);
    });
}

// single filter
// /universe|wars|sovereignty|search|opportunities|markets|loyalty_stores|route_origin/.test("get_universe_graphics");
/**
 * 
 * @param {string} methodFilter get, post, put, delete...
 * @param {RegExp} re_excludes default is `/universe|wars|sovereignty|search|opportunities|markets|loyalty_stores|route_origin/`
 */
function filterEndPointByMethod(
    methodFilter,
    re_excludes = /universe|wars|sovereignty|search|opportunities|markets|loyalty_stores|route_origin|fw_|fleets|get_status|killmails|insurance_|industry_systems|facilities|incursions|dogma/
) {
    let count = 0;
    const map = {};
    const knownScopes = [];
    forEachPaths((ep, entries) => {
        // scan "method" of each endpoint.
        Object.keys(entries).forEach(method => {
            if (methodFilter && methodFilter !== method) {
                return;
            }
            if (
                currentEndpointUsed.includes(ep) &&
                !re_excludes.test(entries[method].operationId)
            ) {
                count++;
                const ere = entries[method];
                if (ere.security) {
                    const scope = ere.security[0].evesso[0];
                    if (!knownScopes.includes(scope)) {
                        knownScopes.push(scope);
                    }
                }
                map[ep] = ere;
                // map[entries[method].operationId] = entries[method];
            }
        });
    }).then(() => {
        console.log("- - - - - filterEndPointByMethod done, hit=%d - - - - -", count);
        console.log(map);
        console.assert(Object.keys(map).length === count, "map key entry count was not equals count!!");
        console.log(knownScopes);
    });
}

class ESIRequestContext {

    /**
     * 
     * @param {string} endpoint 
     * @param {string | Record<string, any> | undefined} property 
     */
    constructor(
        endpoint, property = void 0
    ) {
        if (property) {
            if (typeof property === "string") {
                this["bindName"] = property;
            } else if (typeof property === "object") { // when need esiQuery
                // example:
                // {
                //     bindName: "industry_jobs",
                //     esiQuery: { include_completed: true }
                // }
                Object.assign(this, property);
            }
        } else {
            this["handler"] = null;
        }

        this.endpoint = endpoint;
    }
}

/**
 * 
 * @param {SimplifiedESIRequestEntry[]} tasks 
 */
function genScopeDescriptionMap(tasks) {
    /** @type {Record<string, string>} */
    const tempScopes = {};
    /** @type {Record<string, string>} */
    const knownScopes = {};
    // DEVNOTE: As EVE Swagger json does not have a clear explanation in scope, we are recording a brief explanation by my judgment at this time.
    for (const task of tasks) {
        const scope = task.scope;
        if (scope && tempScopes[scope] === void 0) {
            // const _scope = scopeDesc Registry.find(s => s.name === scope);
            let scopeDescription = scopeDescRegistry[scope];
            scopeDescription === void 0 && (scopeDescription = "TODO: let's write description");
            tempScopes[scope] = scopeDescription;
        }
    }
    // marge formailzed latest scopes.
    Object.keys(LatestScopes).forEach(scope => {
        const desc = LatestScopes[scope];
        if (desc !== "N/A") {
            tempScopes[scope] = desc;
        }
    });
    // then sort by scope token.
    Object.keys(tempScopes).sort().forEach(scope => {
        knownScopes[scope] = tempScopes[scope];
    });
    console.log("result of knownScopes:", knownScopes);
    return knownScopes;
}

// re_excludes = /universe|wars|sovereignty|search|opportunities|markets|loyalty_stores|route_origin|fw_|fleets|get_status|killmails|insurance_|industry_systems|facilities|incursions|dogma/
/**
 * auto generate EVE ESI request config
 */
function genESIRequestEntriesForCerebralWeb() {
    let count = 0;
    /** @type {SimplifiedESIRequestEntry[]} */
    const tasks = [];
    let _paths;
    forEachPaths((endpoint, entries, paths) => {
        // assign each call...
        _paths = paths;
        // scan "method" of each endpoint.
        Object.keys(entries).forEach(method => {
            if ("get" !== method) {
                return;
            }
            if (currentEndpointUsed.includes(endpoint)) {
                count++;
                const entry = entries[method];
                let scope = "";
                if (entry.security) {
                    scope = entry.security[0].evesso[0];
                    // if (!knownScopes[scope]) {
                    //     // default value(description) is scope token.
                    //     knownScopes[scope] = lookUpScopeDescription(scope);
                    // }
                }

                let interval = entry["x-cached-seconds"];
                // DEVNOTE: restrict to 60 sec minimum
                interval < 60 && (interval = 60);
                const operationId = entry.operationId;
                const summary = entry.summary;
                const context = new ESIRequestContext(endpoint, bindNameRegistry[endpoint]);
                /** @type {SimplifiedESIRequestEntry} */
                const shapedEntry = {
                    interval,
                    operationId,
                    summary,
                    context,
                };
                scope && (shapedEntry.scope = scope);
                tasks.push(shapedEntry);
                // map[entries[method].operationId] = entries[method];
            }
        });
    }).then(() => {
        console.log("- - - - - genESIRequestEntriesForCerebralWeb done, hit=%d - - - - -", count);
        // sort by whether has scope. and or endpoint.
        tasks.sort((a, b) => {
            if (a.scope === void 0) {
                return b.scope === void 0? a.context.endpoint.localeCompare(b.context.endpoint): -1;
            }
            if (b.scope === void 0) {
                return 1;
            }
            return a.context.endpoint.localeCompare(b.context.endpoint);
        });
        console.log(tasks);
        console.assert(tasks.length === currentEndpointUsed.length, "new tasks entry count was not equals currentEndpointUsed!!");

        const knownScopes = genScopeDescriptionMap(tasks);
        // DEVNOTE: 2019/7/11 - added irregular scopes
        // knownScopes["esi-markets.structure_markets.v1"] = "Return all orders in a structure";
        // knownScopes[""] = "";
        // knownScopes[""] = "";
        const ESIRequestConfig = {
            requestEntries: tasks,
            knownScopes
        };

        const RE_description_extractor = /{\s+interval:[\s\S]+?endpoint:\s+"(.+)"/gm;
        let entriesScript = JSON.stringify(ESIRequestConfig, null, 4).replace(/"(\w+)":/g, "$1:");
        // inject endpoint description as comment to each entries...
        entriesScript = entriesScript.replace(RE_description_extractor, ($0, $1) => {
            let description = _paths[$1].get.description;
            description = description.split(/\n/)[0];
            console.log("endpoint=%s, description=[%s]", $1, description);
            return `{   // ${description}${$0.substring(1)/*$0.substring(1) contains a newline at the beginning.*/}`;
        })
        console.log(
`/**
 * NOTE: following code were generated by genESIRequestEntriesForCerebralWeb
 * internal data.
 */
const ESIRequestConfig: EVEESIRequestConfig = ${entriesScript};`
        );
    });
}

/**
 * search has "#/parameters/page" path.
 */
function findHasPageParameter() {
    const result = {};
    let count = 0;
    forEachPaths((endpoint, entries, paths) => {
        // scan "method" of each endpoint.
        Object.keys(entries).forEach(method => {
            const params = entries[method].parameters;
            for (const param of params) {
                if (param.$ref && param.$ref === "#/parameters/page") {
                    /** @type {{ [method: string]: ESIRequestEntry }} */
                    const path = result[endpoint] || {};
                    path[method] = entries[method];
                    result[endpoint] = path;
                    console.log(
                        analyzeOperationID(path[method].operationId)
                    );
                    count++;
                }
            }
        });
    }).then(() => {
        console.log("- - - - - findHasPageParameter done, hit=%d - - - - -", count, result);
    });
}

// 
// res = getSDEVersion();
// res.then(version => console.log(version));
// 
//   or
// 
// const version = await getSDEVersion();
// 
async function getSDEVersion() {
    const eve_dev_resouce_url = "https://developers.eveonline.com/resource/resources";
    const php_url = `https://jpropedit-gui.osdn.jp/get_source.php?url=${encodeURIComponent(eve_dev_resouce_url)}`;
    /** @type {RequestInit} */
    const options = {
        method: "GET",
        mode: 'cors',
    };
    // "https://developers.eveonline.com/resource/resources:: /(sde-\\d{8}-\\w+)\\.zip/.exec(document.getElementsByTagName('html')[0].outerHTML)
    return fetch(php_url, options).then(res => res.text()).then(source => {
        const m = /(sde-\d{8}-\w+)\.zip/.exec(source);
        return m[1];
    }).catch(reason => {
        console.log(reason);
        return "sde-20190219-TRANQUILITY";
    });
}
// sde(); => "sde-20190117-TRANQUILITY"
async function sde() {
    const version = await getSDEVersion();
    console.log(version);
    const div = document.createElement("div");
//     const ss = {
//       position: "absolute",
//       top: "14px",
//       right: "20px",
//       width: "auto",
//     };
//     Object.assign(div.style, ss);
    div.className = "sde-version";
    div.textContent = version;
    // div.app-right-container
    document.body.append(div);
//     return div;
}
