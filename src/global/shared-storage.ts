import { Store as DBStore } from "@util/indexed-db-store";
import { TEVEAppCredentials } from "@eve/oauth/";
import { LocalStorage } from "@util/web-storage-util";
import * as mf from "@util/misc-functions";
type TEVEAppSettings = {
    "eve-credentials"?: TEVEAppCredentials;
    [key: string]: any;
};
const ENTRY_NAME = "settings";
let store: DBStore<TEVEAppSettings>;
let cachedSettings: TEVEAppSettings;
let enterCritical = false;
export async function init() {
    const fetchData = async () => {
        enterCritical = true;
        cachedSettings = await store.getAsync(ENTRY_NAME, {});
        enterCritical = false;
    };
    if (store === void 0) {
        store = new DBStore({
            name: "app-config",
            onChangeDatabase: fetchData
        });
    }
    if (cachedSettings === void 0) {
        await fetchData();
    }
}
const local = new LocalStorage(
    "/global/*", {} as Record<string, any>
);
const storage = local.load();
export const get = <T extends any>(key: string, fallback: T): T => {
    const ret = storage[key] as T;
    if (!ret) {
        set(key, fallback);
        return fallback;
    }
    return ret;
};
export const set = <T extends any>(key: string, value: T): void => {
    storage[key] = value;
    local.merge(storage);
};
export namespace SharedStorage {
    export type TEVEAppSetting = TEVEAppSettings;
    export function set<T = TEVEAppCredentials | any>(
        key: keyof TEVEAppSettings, value: T, callback?: (e: Event) => void
    ) {
        cachedSettings[key] = value;
        store.set(cachedSettings, ENTRY_NAME, callback);
    }
    export async function getAsync<T>(key: string, fallback: T): Promise<T> {
        if (!cachedSettings[key]) {
            const record = await store.getAsync(ENTRY_NAME, undefined);
            if (record && record[key]) {
                cachedSettings[key] = record[key];
            }
        }
        return cachedSettings[key] || fallback;
    }
    const _get = <T>(key: string, callback: (data: T) => void) => {
        if (!cachedSettings[key]) {
            store.get(ENTRY_NAME, (record) => {
                if (record && record[key]) {
                    Object.assign(cachedSettings, record);
                }
                callback(<T>cachedSettings[key]);
            });
        } else {
            callback(<T>cachedSettings[key]);
        }
    };
    export function get<T>(
        key: string, callback: (data: T) => void,
    ): void {
        (async ()  => {
            while (enterCritical) {
                await mf.sleep(16);
            }
            _get(key, callback);
        })();
    }
}