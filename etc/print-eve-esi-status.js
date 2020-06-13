

const fetch = require("node-fetch").default;
/* const colors =  */require("colors");
/**
 * @typedef {Object} ESIHealthStatus - creates a new type named 'ESIHealthStatus'
 * @property {string} endpoint - a string property of ESIHealthStatus
 * @property {string} method - a string property of ESIHealthStatus
 * @property {string} route - a string property of ESIHealthStatus
 * @property {"green" | "yellow" | "red"} status - a string property of ESIHealthStatus
 * @prop {string[]} tags - a number property of ESIHealthStatus
 */
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
 * // e.g:
 * [
 *   {
 *     "endpoint": "esi-sovereignty",
 *     "method": "get",
 *     "route": "/sovereignty/campaigns/",
 *     "status": "yellow",
 *     "tags": [
 *         "Sovereignty"
 *     ]
 *   }, ...
 * ]
 * ```
 */
function showESIHealthStatus() {

    const statistics = {
        green: 0, yellow: 0, red: 0
    };

    /** @type {(json: ESIHealthStatus[]) => void} */
    const handler = statusIndices => {

        if (Array.isArray(statusIndices)) {
            statusIndices.sort(esiStatusComparator);
            statusIndices.forEach(e => {
                const state = e.status;
                console.log(
                    "route: %s- method: %s tag: %s",
                    e.route.padEnd(64)[state],
                    (e.method + ",").padEnd(8), e.tags[0]
                );
                statistics[state]++;
            });
            console.log("statistics:", statistics);
        }
    };

    fetch("https://esi.evetech.net/status.json?version=latest").then(res => {
        return res.json();
    }).then(handler).catch(reason => {
        console.log(reason.message);
    });
}

if (process.argv[2] === "-x") {
    showESIHealthStatus();
} else {
    module.exports = showESIHealthStatus;
}
