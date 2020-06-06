import { Store } from "@util/indexed-db-store";
import { ESI_BASE } from "./constants";
import * as ESIHealthStatus from "./esi-health";
declare global {
    namespace EVEStatusFragment {
        const esiAvailable: boolean;
        const ESIHealth: typeof ESIHealthStatus;
    }
    const EVEStatus: typeof EVEStatusFragment & typeof ES;
    interface Window {
        EVEStatus: typeof EVEStatus;
    }
}
export type EVEStatusData = {
    players: number;
    server_version: string;
    start_time: DateString;
    at?: string;
    vip?: boolean;
};
export type EVEStatusObserverState = {
    data?: EVEStatusData[];
};
export interface IEVEStatusObserver {
    setState(state: EVEStatusObserverState): void;
}
const _DEBUG = 1;
const ENTRY_NAME = "eve-status";
let store: Store<EVEStatusData[]>;
function getTimeFragment(): string {
    return new Date().toLocaleString(void 0, {
        year: "2-digit",
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
}
const CHECK_INTERVAL = 180 * 1000;
let _serverEnable = true;
namespace ES {
    const HISTORY_SIZE = 15;
    const components: IEVEStatusObserver[] = [];
    export const ESIHealth: typeof ESIHealthStatus = ESIHealthStatus;
    export const register = (c: IEVEStatusObserver) => {
        !components.includes(c) && components.push(c);
    };
    export const unRegister = (c: IEVEStatusObserver): void => {
        const index = components.indexOf(c);
        index !== -1 && components.splice(index, 1);
    };
    let statusCache: EVEStatusData[];
    const fetchData = async () => {
        statusCache = await store.getAsync(ENTRY_NAME, []);
    };
    const notify = (state: EVEStatusData): void => {
        statusCache.push(state);
        statusCache.length > HISTORY_SIZE && statusCache.shift();
        store.set(statusCache, ENTRY_NAME);
        const histories = statusCache.slice();
        for (const c of components) {
            if (c) {
                c.setState( {data: histories} );
            }
        }
    };
    const _getServiceUnAvailbleState = () => {
        _serverEnable = false;
        return { players: 0, server_version: "---", start_time: "" };
    };
    const query = async () => {
        if (statusCache === void 0) {
            await fetchData();
        }
        let state: TBD<EVEStatusData>;
        const endpointUrl = `${ESI_BASE}/latest/status/`;
        try {
            state = await fetch(endpointUrl).then(res => {
                _DEBUG && console.log(res);
                _serverEnable = res.ok;
                if (!res.ok) {
                    return void 0;
                } else {
                    return res.json();
                }
            });
        } catch (e) {
            console.warn(e);
        }
        if (state === void 0) {
            state = _getServiceUnAvailbleState();
        }
        state.at = getTimeFragment();
        _DEBUG && console.log(state);
        notify(state);
    };
    export const isCurrentEnabled = async () => {
        return fetch(`${ESI_BASE}/headers/`, { mode: "cors" }).then(
            response => response.ok
        ).catch(
            reason => (console.warn(reason), false)
        );
    };
    let tid: TBD<number>;
    export const run = () => {
        if (store === void 0) {
            store = new Store({
                name: "misc",
                onChangeDatabase: fetchData
            });
        }
        stop();
        query();
        tid = window.setInterval(query, CHECK_INTERVAL);
    };
    export const stop = () => {
        if (tid !== void 0) {
            clearInterval(tid);
            tid = void 0;
        }
    };
}
window["EVEStatus"] = Object.defineProperty(ES, "esiAvailable", {
    get: () => _serverEnable,
    enumerable: true,
    configurable: false,
});