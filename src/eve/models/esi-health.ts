import { ESI_BASE } from "./constants";
const _DEBUG = 1;
const ADJUST = 10_000;
let nsl_Expires = Date.now();
function emitRequest() {
    let petag: TBC<string> = null;
    let hscache: ESIHealthStatus[] = [];
    return async function () {
        if (nsl_Expires > Date.now()) {
            return hscache;
        }
        const opt: RequestInit = {
            method: "get", mode: "cors",
            headers: onil()
        };
        if (petag) {
            // @ts-ignore
            opt.headers["if-none-match"] = petag;
        }
        const healthes: ESIHealthStatus[] = await fetch(
            `${ESI_BASE}/status.json?version=latest`, opt
        ).then(res => {
            const st = res.status;
            petag = res.headers.get("etag");
            nsl_Expires = Date.parse(res.headers.get("expires")!) + ADJUST;
            _DEBUG && console.log(
                "----> esi health status response: etag=%s, http::status=%s, expires=%s",
                petag, st, new Date(nsl_Expires).toLocaleTimeString()
            );
            return st === 200? res.json(): void 0;
        });
        if (healthes) {
            hscache = healthes;
        }
        return hscache;
    };
}
export const getStatus = emitRequest();
export const getCurrentESIHealthExpires = <K extends NorSFunctions<Date>>(method?: K): ReturnType<Date[K]> => {
    if (method) {
        return new Date(nsl_Expires)[method]() as ReturnType<Date[K]>;
    }
    return nsl_Expires as ReturnType<Date[K]>;
};