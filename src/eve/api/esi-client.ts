import { IEVEOAuthCharacter } from "@eve/models/auth-provider";
import { create } from "mini-semaphore";
const log = console.log;
const Prms = Promise;
const Usp = URLSearchParams;
const isArray = Array.isArray;
const DEFAULT_CONCURRENCY = 250;
const EE_P_RESPONSE = 0;
let LOG = false;
const BASE = "https://esi.evetech.net";
export const ESI_BASE = BASE;
export type ESIRequestOptions = {
    queries?: Record<string, QueryValueTypes>;
    body?: any;
    ignoreError?: boolean;
    cancelable?: AbortController;
    auth?: boolean;
};
export type ESIConfigFragment = {
    datasource?: ESIDatasourceToken;
    logger?: CustomLogger;
    xUserAgent?: string;
    log?: boolean;
    concurrentRequest?: number;
};
export interface IAccessTokenHolder {
    token: TBD<string>;
    useAccessToken(ac: IEVEOAuthCharacter): Promise<void>;
    useAccessTokenById(characterId: EVEId): Promise<void>;
}
export interface IESIClient extends InterfaceType<EC> {}
interface RequestInitPlus extends RequestInit {
    url: string;
}
const s = create(DEFAULT_CONCURRENCY);
let A: typeof import("@eve/models/auth-provider");
const checkA = async () => {
    A === void 0 && (
        A = await import("@eve/models/auth-provider")
    );
};
const oAuthChr = async (characterId: EVEId): Promise<IEVEOAuthCharacter> => {
    await checkA();
    return A.getEVEOAuthCharacter(characterId)!;
};
let ax: number = 0;
class ESIRequesError extends Error {}
class ESIErrorLimitReachedError extends Error {
    constructor() {
        super("Cannot continue ESI request because 'x-esi-error-limit-remain' is zero!");
    }
    valueOf(): number {
        return 420;
    }
}
let logger: CustomLogger | undefined;
const fetchP = async <T>(rqopt: RequestInitPlus, qs: Record<string, string>, pc: number) => {
    const rqs: Promise<T>[] = [];
    const endpoint_url = rqopt.url;
    const rqp = new Usp(qs);
    for (let i = 2; i <= pc; ) {
        // @ts-ignore 
        rqp.set("page", i++);
        ax++;
        rqs.push(
            fetch(`${endpoint_url}?${rqp + ""}`, rqopt).then<T>(
                res => res.json()
            ).catch(reason => {
                console.warn(reason);
                return [] as unknown as T;
            }).finally(() => {
                ax--;
            })
        );
    }
    return Prms.all(rqs).then(jsons => {
        if (isArray(jsons[0])) {
            let combined: any[] = [];
            for (let i = 0, end = jsons.length; i < end;) {
                combined = combined.concat(jsons[i++]);
            }
            return <T><unknown>combined;
        }
        LOG && log("> > > pages result are object < < < --", jsons);
        return null;
    });
};
const pstat = (EE_P_RESPONSE ? () => {
    const red = "color: red; font-weight: bold";
    const green = "color: green";
    const normal = "color: inherit; font-weight: inherit";
    return (method: string, data: any, endP: string): void => {
        const isa = isArray(data);
        const style = isa ? red : green;
        log(
            "Method: %s, typeof: %s, is array?: %c%s%c, endpoint=%s",
            method, typeof data, style, isa, normal, endP
        );
    };
}: () => void 0)();
const curl = (endp: string, ver?: string) => {
    endp = endp.replace(/^\/+|\/+$/g, "");
    if (ver) {
        return `${BASE}/${ver}/${endp}/`;
    }
    return `${BASE}/${endp}/`;
};
async function rq<T extends any | never>(
    dis: IAccessTokenHolder,
    mthd: string, endp: string, ver?: string,
    opt: ESIRequestOptions = {}
): Promise<T> {
    const rqopt: RequestInitPlus = {
        url: curl(endp, ver),
        method: mthd,
        mode: "cors",
        cache: "no-cache",
        signal: opt.cancelable? opt.cancelable.signal: void 0,
        headers: {
        },
    };
    const qss: Record<string, string> = {
        language: "en-us",
    };
    if (opt.queries) {
        const oqs = opt.queries;
        for (const k of Object.keys(oqs)) {
            qss[k] = oqs[k] as string;
        }
    }
    if (opt.auth) {
        (rqopt.headers as Record<string, string>).authorization = `Bearer ${dis.token}`;
    }
    if (opt.body) {
        (rqopt.headers as Record<string, string>)["content-type"] = "application/json";
        rqopt.body = JSON.stringify(opt.body);
    }
    ax++;
    try {
        const res = await fetch(
            `${rqopt.url}?${new Usp(qss) + ""}`, rqopt
        ).finally(() => {
            ax--;
        });
         if (logger) {
            const elr = res.headers.get("x-esi-error-limit-remain");
            elr !== "100" && logger.log("info", `x-esi-error-limit-remain: ${elr}`);
        }
        const stat = res.status;
        if (!res.ok && !opt.ignoreError) {
            if (LOG || logger) {
                const text = await res.text();
                const logMsg = `request failed: ${mthd} ${rqopt.url} status: ${stat}, message: ${text}`;
                LOG && console.warn(logMsg);
                logger && logger.log("verbose", logMsg);
            }
            if (stat === 420) {
                opt.cancelable && opt.cancelable.abort();
                throw new ESIErrorLimitReachedError();
            } else {
                throw new ESIRequesError(`maybe network disconneted or otherwise request data are invalid. (endpoint=${endp}, http status=${stat})`);
            }
        } else {
            if (stat === 204) {
                return <T><unknown>{ status: stat };
            }
            const data: T = await res.json();
            pstat && pstat(mthd, data, endp);
            if (opt.ignoreError) {
                return data;
            }
                const pc = +res.headers.get("x-pages")!;
                if (pc > 1) {
                    LOG && log('found "x-pages" header, pages: %d', pc);
                    const remData = await fetchP<T>(rqopt as Required<RequestInitPlus>, qss, pc);
                    if (isArray(data) && isArray(remData)) {
                        return (data as any[]).concat(remData as any[]) as unknown as T;
                    } else {
                        remData && Object.assign(data, remData);
                    }
                }
            return data;
        }
    } catch (e) {
        throw new ESIRequesError(`unknown error occurred, message: ${e.message}, endpoint=${endp}`);
    }
}
class EC implements IAccessTokenHolder {
    token: TBD<string>;
    async useAccessToken(ac: IEVEOAuthCharacter): Promise<void> {
        if ((this.token !== ac.accessToken) || ac.isTokenExpired()) {
            this.token = await ac.getAccessToken();
        }
    }
    async useAccessTokenById(characterId: EVEId): Promise<void> {
        const ac = await oAuthChr(characterId);
        await this.useAccessToken(ac);
    }
    async get<T extends any>(
        endp: string,
        ver?: string, opt?: ESIRequestOptions
    ): Promise<T> {
        await s.acquire(false);
        try {
            return await rq(this, "GET", endp, ver, opt);
        } finally {
            s.release();
        }
    }
    async post<T extends any>(
        endp: string,
        ver?: string, opt?: ESIRequestOptions
    ): Promise<T> {
        await s.acquire(false);
        try {
            return await rq(this, "POST", endp, ver, opt);
        } finally {
            s.release();
        }
    }
}
    export const setConfiguration = (config: ESIConfigFragment) => {
        config.logger && (logger = config.logger);
        if (typeof config.log === "boolean") {
            LOG = config.log;
        }
        // @ts-ignore typescript cannot allow of `undefined | 0` expression
        let cr = config.concurrentRequest | 0;
        if (cr > 0) {
            if (cr > 400) {
                console.warn("this restriction value(=%s) is too large so re-set to 400", cr);
                cr = 400;
            }
            s.setRestriction(cr);
        }
    };
    export const getRequestPending = () => {
        return ax;
    };
    export const getInstance = async (charId?: EVEId): Promise<IESIClient> => {
        const esi = new EC();
        if (charId == 0) {
            return esi;
        }
        await checkA();
        if (charId === void 0) {
            const ids = A.getEVEOAuthCharacterIds();
            if (ids.length > 0) {
                charId = ids[0];
            }
        }
        if (charId !== void 0) {
            await esi.useAccessToken(
                A.getEVEOAuthCharacter(charId)
            );
        }
        return esi;
    };