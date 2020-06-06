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
// @ts-ignore 
/// <reference path="../../src/ts.d/basic-types.d.ts"/>
/**
 * @typedef {import("../../src/eve/api/esi-client").ESIRequestOptions} ESIRequestOptions
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//                                imports.
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//
// DEVNOTE: 2019/9/15 - can works both node.js and browser
//
/** @type {(input: RequestInfo, init?: RequestInit) => Promise<Response>} */
// @ts-ignore 
const _fetch = (() => {
    if (typeof fetch === "function") {
        return fetch;
    } else if (typeof require === "function") {
        console.log("- - - - - use node-fetch");
        // @ts-ignore 
        require("colors");
        return require("node-fetch");
    } else {
        // @ts-ignore
        return /** @type {(input: RequestInfo, init?: RequestInit) => Promise<Response>} */ (input, init) => {};
    }
})();

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//                            constants, types
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const isArray = Array.isArray;
/**
 * @typedef IESIClient
 * @prop {(token: string) => void} useAccessToken
 * @prop {(endpoint: string, options?: ESIRequestOptions) => Promise<any>} get
 * @prop {(endpoint: string, options?: ESIRequestOptions) => Promise<any>} post
 */
/**
 * @typedef TESIPlaceHolder
 * @prop {IESIClient} esi
 */
/**
 * @typedef TNsESIClient
 * @prop {boolean} debug
 * @prop {(token?: string) => IESIClient} getInstance
 * @prop {(is?: boolean) => void} setDebug
 * @prop {(is?: boolean) => void} suppressLog
 * @prop {() => number} getRequestPending
 * @prop {(endpoint: string, options?: {}, esiPlaceHolder?: TESIPlaceHolder, token?: string, method?: "get" | "post" ) => Promise<any>} fetchEndpoint
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//                       class or namespace declare.
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
let DEBUG = 0;

/** @type {Partial<TNsESIClient>} */
let NsESIClient = {
    get debug() {
        return !!DEBUG;
    },
    set debug(is) {
        DEBUG = +is;
    }
};

/* INIT_NsESIClient: */ {

    const isNode = typeof global === "object";
    /**
     * the EVE ESI base url (version: latest)
     */
    const ESI_BASEURL = "https://esi.evetech.net/latest";

    let LOG = true;
    /**
     * simple named error class.
     */
    class ESIRequesError extends Error {}
    /**
     * throws when x-esi-error-limit-remain header value is "0". (http status: 420)
     */
    class ESIErrorLimitReachedError extends Error {
        constructor() {
            super("Cannot continue ESI request because 'x-esi-error-limit-remain' is zero!");
        }
        valueOf() {
            return 420;
        }
    }
    /**
     *
     * @param {string} urlWithParams
     * @param {RequestInit} options
     * @param {number} pageCount
     */
    async function fetchPages(urlWithParams, options, pageCount) {
        const promises = [];
        const params = new URLSearchParams();
        for (let i = 2; i <= pageCount;) {
            // @ts-ignore
            params.set("page", i++);
            ax++;
            promises.push(
                // @ts-ignore
                _fetch(`${urlWithParams}&${params.toString()}`, options).then(
                    response => response.json()
                ).catch(reason => {
                    console.warn(reason);
                    // DEVNOTE: 2020/2/24 - emergency return
                    return [];
                }).finally(() => ax--)
            );
        }
        return Promise.all(promises).then((jsons) => {
            // DEVNOTE: let check the page 2, type is array?
            if (isArray(jsons[0])) {
                let combined = [];
                // TIP: Array: add by index vs push vs concat - https://jsbench.me/yhk6r8yj54
                for (let i = 0, end = jsons.length; i < end;) {
                    combined = combined.concat(jsons[i++]);
                }
                return combined;
            }
            return null;
        });
    }

    /**
     * @typedef {(method: string, data: unknown, endpoint: string) => void} TPrintResponseStat
     */
    const pstat = (() => {
        /** @type {string} */
        let red;
        /** @type {string} */
        let green;
        /** @type {string} */
        let normal;
        if (isNode) {
            red = "red", green = "green", normal = "";
        } else {
            red = "color: red; font-weight: bold", green = "color: green", normal = "color: inherit; font-weight: inherit";
        }
        // debug response data type.
        return /** @type {TPrintResponseStat} */(method, data, endpoint) => {
            const isa = isArray(data);
            const style = isa ? red : green;
            if (isNode) {
                console.log("Method: %s, typeof: %s, is array?: %s, endpoint=%s", method, typeof data, (isa + "")[style], endpoint);
            } else {
                console.log("Method: %s, typeof: %s, is array?: %c%s%c, endpoint=%s", method, typeof data, style, isa, normal, endpoint);
            }
        };
    })();

    let ax = 0;
    /**
     * @type {IESIClient}
     */
    class ESIClient /* implements IESIClient */ {
        /**
         * use `AccessToken` by `token`.
         *
         * @param {string} [token]
         */
        useAccessToken(token) {
            token && (this.token = token);
        }
        /**
         *
         * @async
         * @param {string} endpoint can omit first and last slash.
         * @param {ESIRequestOptions} options query parameters
         * @throws
         */
        async get(endpoint, options) {
            return this.request("GET", endpoint, options);
        }
        /**
         *
         * @async
         * @param {string} endpoint can omit first and last slash.
         * @param {ESIRequestOptions} options query parameters?, json data in `body`
         * @throws
         */
        async post(endpoint, options) {
            return this.request("POST", endpoint, options);
        }
        /**
         * @param {string} method
         * @param {string} endpoint
         * @param {ESIRequestOptions} [opt] body is json string
         * @throws
         * @returns
         */
        async request(method, endpoint, opt = {}) {
            /** @type {RequestInit} */
            const fetchOpt = {
                method,
                headers: {
                    // accept: "application/json",
                    // "content-type": "application/json",
                },
                mode: "cors",
                // see: http://yagisuke.hatenadiary.com/entry/2018/01/28/181907
                signal: opt.cancelable? opt.cancelable.signal: void 0,
                // signal: options.abortController ? options.abortController.signal : void 0
            };
            const qss = {
                language: "en-us",
            };
            if (opt.queries) {
                // Object.assign(queries, options.query);Object.assign is too slow
                const oqs = opt.queries;
                for (const k of Object.keys(oqs)) {
                    qss[k] = oqs[k];
                }
            }
            if (this.token !== undefined) {
                fetchOpt.headers["authorization"] = `Bearer ${this.token}`;
            }
            if (opt.body) { // means "POST" method etc
                fetchOpt.headers["content-type"] = "application/json";
                fetchOpt.body = JSON.stringify(opt.body);
            }

            const urlWithParams = `${ESI_BASEURL}${endpoint}?${new URLSearchParams(qss).toString()}`;

            ax++;
            try {
                const res = await _fetch(`${urlWithParams}`, fetchOpt).finally(() => ax--);
                const stat = res.status;
                if (!res.ok && !opt.ignoreError) {
                    if (stat === 420) {
                        // DEVNOTE: 2019-3-31 - *Invalidate the subsequent request immediately!!
                        opt.cancelable && opt.cancelable.abort();
                        throw new ESIErrorLimitReachedError();
                    }
                    // DEVNOTE: 11/4/2018
                    //  ->  e.g: {"error":"Token is not valid for scope: esi-characterstats.read.v1","sso_status":200}
                    //
                    //  status: 504, json: {"error":"Timeout contacting tranquility","timeout":10}
                    //
                    if (LOG) {
                        const responseText = await res.text();
                        const logMsg = `request failed: ${method} ${urlWithParams}, status: ${stat}, message: ${responseText}`;
                        console.warn(logMsg);
                    }
                    // else {
                    //     throw new ESIRequesError(`maybe network disconneted or otherwise request data are invalid. (endpoint=${endpoint}, http status=${stat})`);
                    // }
                }
                else {
                    // DEVNOTE: - 204 No Content
                    if (stat === 204) {
                        // this result is empty, decided to return status code.
                        return { status: stat };
                    }
                    /** @type {Record<string, any>} */
                    let data = await res.json();

                    if (DEBUG) {
                        pstat(method, data, endpoint);
                    }

                    // - - - - x-pages response.
                    // undefined is NaN
                    const pageCount = +res.headers.get("x-pages");
                    // has remaining pages? NaN > 1 === false !isNaN(pageCount)
                    if (pageCount > 1) {
                        LOG && console.log(`found "x-pages" header, pages: %d`, pageCount);
                        let remainData = await fetchPages(urlWithParams, fetchOpt, pageCount);
                        // finally, decide product data.
                        if (isArray(data)) {
                            if (remainData) {
                                data = data.concat(remainData);
                            }
                        }
                        else {
                            remainData && Object.assign(data, remainData);
                        }
                    }

                    // DEVNOTE: 2020/2/23 - i tried solve undefined problem on nodejs
                    //   but I couldn't solve it because I don't know the cause
                    // !data && (data = {}); // no side-effect...
                    return data;
                }
            }
            catch (e) {
                throw new ESIRequesError(`unknown error occurred, message: ${e.message}, endpoint=${endpoint}`);
            }
        }
    } // class ESIClient

    /**
     * @param {string} [token]
     */
    const getInstance = (token) => {
        /** @type {IESIClient} */
        const esi = new ESIClient();
        token && esi.useAccessToken(token);
        return esi;
    };
    NsESIClient.getInstance = getInstance;
    NsESIClient.setDebug = (is = false) => {
        DEBUG = +is;
    };
    NsESIClient.suppressLog = (is = false) => {
        LOG = !is;
    };
    NsESIClient.getRequestPending = () => {
        return ax;
    };

    /**
     * ```
     * this.alliance = await EsiClient.fetchEndpoint(
     *     `/v3/alliances/${this.alliance_id}/`
     * );
     * ```
     * @param {string} endpoint e.g /{version}/characters/{character_id}/assets/
     *   can omit first and last slash.
     * @param {object} [options]
     * @param {TESIPlaceHolder} [placeHolder] if need EsiClient instance then use this parameter.
     * @param {string} [token] undefined or access token.
     * @throws
     */
    async function fetchEndpoint(endpoint, options = {}, placeHolder, token, method = "get") {
        const esi = getInstance(token);
        if (placeHolder && typeof placeHolder === "object") {
            placeHolder.esi = esi;
        }
        /* JsonObject */
        return await esi[method](endpoint, options);
    }
    NsESIClient.fetchEndpoint = fetchEndpoint;

    if (typeof module === "object") {
        module.exports = NsESIClient;
    }
}
