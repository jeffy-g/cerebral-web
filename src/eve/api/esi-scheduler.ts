import { Store } from "@util/indexed-db-store";
import * as DateTimeUtil from "@util/date-time-util";
import * as _ere from "./esi-request-entries";
import { TOAuthRequestErrorReason } from "@eve/oauth/oauth-client";
export const ere = _ere;
export type ScheduleStatus = {
    type: string;
    typeDetails: string;
    lastRefresh: string;
    nextRefresh: string | "Due" | "Never";
};
interface IRequestTimingRecord {
    do?: Date;
    last: Date;
    error?: TOAuthRequestErrorReason;
}
type RequestTimingRecordMap = {
    [tag: string]: IRequestTimingRecord;
};
const ENTRY_NAME = "esi-request-schedule";
let records: Record<string, RequestTimingRecordMap>;
let esiRequestSchedule: Store<Record<string, RequestTimingRecordMap>>;
const emergency_queue: EVEId[] = [];
export async function init() {
    const fetchData = async () => {
        records = await esiRequestSchedule.getAsync(ENTRY_NAME, {} as Record<string, RequestTimingRecordMap>);
    };
    if (esiRequestSchedule === void 0) {
        esiRequestSchedule = new Store({
            name: "misc",
            onChangeDatabase: fetchData
        });
    }
    if (records === undefined) {
        await fetchData();
        if (emergency_queue.length) {
            console.log("esi-scheduler: any id in emergency_queue!", emergency_queue);
            for (const id of emergency_queue) {
                register(id);
            }
            emergency_queue.length = 0;
        }
    }
}
const pushTask = () => {
    esiRequestSchedule.set(
        records, ENTRY_NAME,
        () => console.log("ESIScheduler::pushTask - database updated")
    );
};
export const save = () => {
    records !== undefined && pushTask.reemitDefer(777);
};
export function register(charId: EVEId, force: boolean = false) {
    if (records === void 0) {
        emergency_queue.push(charId);
        return;
    }
    if (force || records[charId] === undefined) {
        records[charId] = onil() as RequestTimingRecordMap;
    }
}
export function unRegister(charId: EVEId): boolean {
    const success = delete records[charId];
    save();
    return success;
}
export function getTagsOf(charId: EVEId): string[] {
    return Object.keys(records[charId] || onil());
}
export function shouldRefresh(charId: EVEId, tag: string) {
    const schedule = records[charId];
    const is_irregular = schedule === void 0;
    is_irregular && (records[charId] = onil());
    return is_irregular || !schedule[tag] || (
        new Date(schedule[tag].do!) < new Date()
    );
}
export function markRefreshed(charId: EVEId, tag: string) {
    const last = new Date();
    const schedule = records[charId];
    schedule[tag] = {
        last,
        do: new Date(last.getTime() + _ere.getRefreshInterval(tag, true))
    };
}
const NEXT_INTERVAL = 300 * 1000;
export function markFailed(charId: EVEId, reason: TOAuthRequestErrorReason, temporary = false) {
    const schedule = records[charId];
    const opids = Object.keys(schedule);
    const last = new Date();
    const next = temporary ? new Date(last.getTime() + NEXT_INTERVAL) : undefined;
    for (const opid of opids) {
        schedule[opid] = {
            last,
            do: next,
            error: reason
        };
    }
}
function formatESIEndpointInfo(explain: string, interval: number) {
    const min = interval / 60;
    return `${explain} - (${min}m)`;
}
export function explainOfLastTimeSchedule(charId: EVEId, type: string) {
    const sc_stat = listTheScheduleState(charId).find(c => c.type === type);
    return sc_stat === void 0 ? "N/A" : `Last Update: ${sc_stat.lastRefresh}`;
}
export function listTheScheduleState(charId: EVEId): ScheduleStatus[] {
    const info: ScheduleStatus[] = [];
    const entries = _ere.getSimplifiedEntries();
    let schedule = records[charId];
    schedule === void 0 && (records[charId] = schedule = onil());
    for (const operationId in entries) {
        if (schedule[operationId] && entries[operationId]) {
            let lastState: string;
            const current = new Date();
            const se = schedule[operationId];
            if (se.error === void 0) {
                const lastDate = new Date(se.last);
                lastState = (lastDate.getTime() < current.getTime()) ? `${DateTimeUtil.timeSince(lastDate)} ago` : "Just now";
            } else {
                switch (se.error) {
                    case "scope":
                        lastState = "No Scope";
                        break;
                    case "token":
                        lastState = "Token Invalid";
                        break;
                    case "client":
                        lastState = "Client Invalid";
                        break;
                    default:
                        lastState = se.error || "Error";
                }
            }
            let nextState: ScheduleStatus["nextRefresh"];
            if (se.do !== void 0) {
                const nextDate = new Date(se.do);
                nextState = (nextDate > current) ? DateTimeUtil.timeUntil(nextDate, current) : "Due";
            } else {
                nextState = "Never";
            }
            info.push({
                type: operationId,
                typeDetails: formatESIEndpointInfo(operationId, _ere.getRefreshInterval(operationId)),
                lastRefresh: lastState,
                nextRefresh: nextState
            });
        }
    }
    return info.sort(
        (a, b) => a.type.localeCompare(b.type)
    );
}