import * as Auth from "@eve/models/auth-provider";
import * as esis from "./esi-scheduler";
import * as mf from "@util/misc-functions";
import { createDebugLogger } from "@util/logger";
import * as ere from "./esi-request-entries";
import {
    ESIResponseProcessor, SimplifiedESIRequestEntry
} from "./esi-request-entries";
import * as esi from "./esi-client";
import {
    IESIClient, ESIRequestOptions
} from "./esi-client";
export const esiScheduler = esis;
export const ESI = esi;
const MOD_BANNER = "[esi-request-aggregator]";
let rqprg: IESIRequestProgress;
export const getRequestProgress = async (): Promise<IESIRequestProgress> => {
    if (rqprg === void 0) {
        const erqp: TypedCtor<IESIRequestProgress> = await import("./esi-request-progress").then(m => m.ESIRequestProgress);
        return rqprg = new erqp();
    }
    return rqprg;
};
let log: TStdFunction;
const prepareLogger = (isDebug: 1 | 0) => {
    log = createDebugLogger(MOD_BANNER, isDebug, "color: orange; font-weight: bold");
};
let pst: number;
let rc: number;
let erc: number;
let esiCache: Record<string, IESIClient>;
const esiCacheby = async (cid: string) => {
    if (esiCache === void 0) {
        throw new Error("getESICacheById: `afterProcessed` has already been executed and cleaned up, or has not been initialized by `beforeProcessing`");
    }
    let eSi = esiCache[cid];
    if (!eSi) {
        esiCache[cid] = eSi = await esi.getInstance(cid);
    }
    return eSi;
};
let rqErrors: Record<string, Error>;
const handleException = (e: Error, mtag: string) => {
    rqErrors[mtag] = e;
    erc++;
    if (e.valueOf() == 420) {
        throw e;
    }
};
const rqDone = (char: IEVECharacter, operationId: string, endpoint: string, timeTag: string) => {
    rqprg.explain(`${char.name} ${endpoint} done.`);
    rqprg.workUp();
    rc++;
    const error = rqErrors[timeTag];
    if (error) {
        mf.log(error.message);
    } else {
        esis.markRefreshed(char.character_id, operationId);
    }
};
let esiRqp: SimplifiedESIRequestEntry;
let esiRqmails: SimplifiedESIRequestEntry;
const esiRqrgls: SimplifiedESIRequestEntry[] = [];
const esiRqmrel: SimplifiedESIRequestEntry[] = [];
let processorRegistry: Record<string, ESIResponseProcessor<any>>;
let Universal: typeof import("./esi-request-processors").Universal;
import("./esi-request-processors").then(
    processors => {
        processorRegistry = processors as unknown as typeof processorRegistry;
        Universal = processors.Universal;
    }
);
const checkRequestsData = () => {
    if (esiRqrgls.length === 0) {
        ere.getESIRequestEnties().forEach(esirq => {
            const operationId = esirq.operationId;
            if (esirq.context.handler === null) {
                esirq.context.handler = processorRegistry[operationId];
            }
            if (operationId === "get_characters_character_id") {
                esiRqp = esirq;
                return;
            }
            if (operationId === "get_characters_character_id_mail_lists" || operationId === "get_characters_character_id_mail_labels") {
                esiRqmrel.push(esirq);
            } else if (operationId === "get_characters_character_id_mail") {
                esiRqmails = esirq;
            } else {
                esiRqrgls.push(esirq);
            }
        });
    }
};
const clearMeasures = (tags: string[]) => {
    const pf = performance;
    for (let index = 0, end = tags.length; index < end; index++) {
        const tag = tags[index];
        pf.clearMeasures(tag);
        pf.clearMarks(tag + "::start");
        pf.clearMarks(tag + "::end");
    }
};
let enableRep = false;
export const setPerformanceReportEnable = (is: boolean) => {
    enableRep = is;
};
export const performanceReport = () => {
    const measures = performance.getEntriesByType("measure");
    if (measures.length === 0) {
        return;
    }
    console.log(`count of measure: ${measures.length}`);
    const RE_meausreTag = /"(.+)" - (.+)/;
    const results: Record<string, Record<string, number>> = {
    };
    const measureTags: string[] = [];
    for (let i = 0, measure: typeof measures[0]; measure = measures[i];) {
        const m: TBC<RegExpExecArray> = RE_meausreTag.exec(
            measureTags[i++] = measure.name
        );
        if (m !== null) {
            const name = m[1];
            let operationId = m[2];
            operationId = operationId.substring(operationId.indexOf("_", 4) + 1);
            let data = results[operationId];
            if (!data) {
                results[operationId] = data = onil();
            }
            data[name] = parseFloat(measure.duration.toFixed(3));
        }
    }
    console.table(results);
    console.table(
        parseMarkDatas(results)
    );
    clearMeasures(measureTags);
};
const parseMarkDatas = (datas: Record<string, Record<string, number>>) => {
    let entryCount = 0;
    const opids = Object.keys(datas);
    const result = opids.reduce((acc, opid) => {
        const entry = datas[opid];
        acc[opid] = Object.keys(entry).reduce((acc, key, index, array) => {
            const sum = acc + entry[key];
            if ((index + 1) === array.length) {
                entryCount += array.length;
                return sum / array.length;
            } else {
                return sum;
            }
        }, 0);
        return acc;
    }, onil() as Record<string, number>);
    const totalAverage = opids.reduce((acc, opid, index, array) => {
        const sum = acc + result[opid];
        return ((index + 1) === array.length)? sum / array.length: sum;
    }, 0);
    result["totalAverage"] = totalAverage;
    result["averagePerEntry"] = totalAverage / entryCount;
    return result;
};
export const replaceCurlyBracesToken = (char: IEVECharacter, endpoint: string): string | null => {
    const m = /{([\w]+)}/.exec(endpoint);
    let n: TBD<number>;
    if (m) {
        n = char[m[1] as PickNumberProperties<IEVECharacter>];
    }
    // @ts-ignore because already non null checked (m
    return n && endpoint.replace(m[0], n + "") || null;
};
export const createMeasureTag = (rq: SimplifiedESIRequestEntry, char: IEVECharacter) => {
    return `"${char.name}" - ${rq.operationId}`;
};
const fireESIRequest = async (char: IEVECharacter, rqe: SimplifiedESIRequestEntry): Promise<void> => {
    rqprg.explain(`${char.name} processing ${rqe.operationId}`);
    const context = rqe.context;
    const endpoint = replaceCurlyBracesToken(char, context.endpoint);
    if (endpoint !== null) {
        const options: ESIRequestOptions = { cancelable: abortController, auth: !!rqe.scope };
        if (context.esiQuery) {
            options.queries = context.esiQuery;
        }
        const esi = await esiCacheby(char.character_id);
        const mtag = createMeasureTag(rqe, char);
        if (enableRep) {
            performance.mark(mtag + "::start");
        }
        try {
            const data = await esi.get(endpoint, void 0, options);
            if (typeof context.handler === "function") {
                await (<ESIResponseProcessor<any>>context.handler)(char, data, esi);
            } else if (context.bindName) {
                (char[
                    context.bindName as NonFunctionPropertyNames<IEVECharacter>
                ] as unknown) = data;
            }
        } catch (e) {
            handleException(e, mtag);
        } finally {
            rqDone(char, rqe.operationId, endpoint, mtag);
            if (enableRep) {
                performance.mark(mtag + "::end");
                performance.measure(
                    mtag as string,
                    mtag + "::start", mtag + "::end"
                );
            }
        }
    }
};
let esiHealthStatusCache: TBD<ESIHealthStatus[]>;
let abortController: TBD<AbortController>;
const canFireRequest = (character_id: EVEId, operationId: string) => {
    const esiEntry = ere.lookUpRequestByOperationId(operationId, false);
    if (esiEntry && esiHealthStatusCache) {
        if (
            esiEntry.scope && !Auth.getGrantedScopesById(character_id).includes(esiEntry.scope)
        ) {
            console.warn("scope %s is not granted. operationId=%s", esiEntry.scope, operationId);
            return false;
        }
        const endpoint = esiEntry.context.endpoint;
        for (let index = 0, end = esiHealthStatusCache.length; index < end;) {
            const estat = esiHealthStatusCache[index++];
            if (estat.route === endpoint && estat.method === "get" && estat.status !== "green") {
                console.warn("%s is not available", operationId);
                return false;
            }
        }
    }
    return esis.shouldRefresh(character_id, operationId);
};
const collectESIRequest = (char: IEVECharacter, esirq: SimplifiedESIRequestEntry, promises: Promise<void>[]) => {
    if (canFireRequest(char.character_id, esirq.operationId)) {
        promises.push(
            fireESIRequest(char, esirq)
        );
    }
};
export const beforeProcessing = async (debug = true): Promise<void> => {
    esiHealthStatusCache = await EVEStatus.ESIHealth.getStatus();
    abortController = new AbortController();
    rc = 0;
    erc = 0;
    esiCache = onil();
    rqErrors = onil();
    prepareLogger(+debug as (1 | 0));
    pst = performance.now();
};
export const afterProcessed = () => {
    const total = performance.now() - pst;
    const bannerStyle = "color: purple; font-weight: bold";
    const resetStyle = "color: inherit; font-weight: normal";
    console.log(
        `%c${MOD_BANNER}: %cESI request time spent total: ${total}ms (${rc} requests)`,
        bannerStyle, resetStyle
    );
    console.log(
        `%c${MOD_BANNER}: %cAverage time spent per ESI request: ${rc? (total / rc) + "ms": "N/A"}`,
        bannerStyle, resetStyle
    );
    return erc;
};
export const cleanup = () => {
    esiHealthStatusCache = void 0;
    abortController = void 0;
    esiCache = void 0 as unknown as typeof esiCache;
    rqErrors = void 0 as unknown as typeof rqErrors;
    log = void 0 as unknown as typeof log;
};
export const process = async (char: IEVECharacter) => {
    checkRequestsData();
    const character_id = char.character_id;
    const regulars: Promise<void>[] = [], mailRelated: Promise<void>[] = [];
    if (canFireRequest(character_id, esiRqp.operationId)) {
        await fireESIRequest(char, esiRqp);
    }
    for (const esirq of esiRqmrel) {
        collectESIRequest(char, esirq, mailRelated);
    }
    F: for (const esirq of esiRqrgls) {
        if (
            esirq.operationId.includes("corporation_id_bookmarks") &&
            Universal.isNpcCorporationId(char.corporation_id)
        ) {
            continue F;
        }
        collectESIRequest(char, esirq, regulars);
    }
    await Promise.all([
        await Promise.all(mailRelated).then(async () => {
            const cn = char.name;
            log(`- > done mailRelateds [${cn}]`);
            if (canFireRequest(character_id, esiRqmails.operationId)) {
                await fireESIRequest(char, esiRqmails);
                log(`- - > done mails [${cn}]`);
            }
            log(`- > done mails section [${cn}]`);
        }),
        await Promise.all(regulars)
    ]).catch(reason => Promise.reject(reason)).finally(() => esis.save());
};
export const getCurrentlyRequestCount = (cid: EVEId) => {
    checkRequestsData();
    const tags = esis.getTagsOf(cid);
    if (tags.length === 0) {
        return esiRqrgls.length + esiRqmrel.length + 1 + 1;
    }
    let count = 0;
    for (let i = 0, tag: typeof tags[0]; tag = tags[i++];) {
        if (tag === "get_characters_character_id_assets") {
            continue;
        }
        esis.shouldRefresh(cid, tag) && count++;
    }
    return count;
};
export const getNeedUpdateCharCount = (cids: string[]) => {
    let count = 0;
    for (const cid of cids) {
        const tags = esis.getTagsOf(cid);
        if (tags.length === 0) {
            count++;
            continue;
        }
        inner: for (const t of tags) {
            if (t === "get_characters_character_id_assets") {
                continue inner;
            }
            if (esis.shouldRefresh(cid, t)) {
                count++;
                break inner;
            }
        }
    }
    return count;
};