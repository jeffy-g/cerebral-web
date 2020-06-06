import { Stopwatch } from "@util/stopwatch";
const DEBUG = false;
const log = console.log;
type TDBOption = {
    version: number;
    keyPath?: string | string[];
};
type TConnectionContext = {
    dbName: string;
    tableName?: string;
    version?: number;
    callback?: (msg: string) => void;
};
export namespace IDBWrapper {
    export type SimpleIndexedDBOptions = TDBOption;
    export type DBConnectionContext = TConnectionContext;
}
const closeDB = (e: Event): void => {
    // @ts-ignore 
    const db = (e.target as IDBRequest<IDBDatabase>).result;
    if (db instanceof IDBDatabase) {
        db.close();
    }
};
const HANDLE_ERROR = (e: Event) => {
    // @ts-ignore un typed property
    log("Database error: ", e.target.errorCode);
};
const printDetails = <T>(method: string, req: IDBRequest<T> | null, tspent: string): void => {
    let format: string;
    if (req === null) {
        format = `${method} - ⏱(ms): %s`;
    } else {
        format = `${method} - \u{23F1}(ms): %s, result="${req.result}", store="${(<IDBObjectStore>req.source).name}"`;
    }
    log(format, tspent);
};
const _pfStart = (stpw?: Stopwatch) => {
    if (DEBUG && stpw) {
        stpw.start();
    }
};
const _pfReport = (stpw: Stopwatch | undefined, method: string, req: IDBRequest | null) => {
    if (DEBUG && stpw) {
        const tspent = stpw.stopAndResult();
        printDetails(method, req, tspent);
    }
};
export class IDBWrapper {
    private db?: IDBDatabase;
    private stopwatch = DEBUG? new Stopwatch(): void 0;
    private options: TDBOption;
    constructor(
        private dbName: string,
        private tableName: string,
        options?: TDBOption
    ) {
        options = options || onil() as TDBOption;
        this.options = Object.assign({ version: 1 }, options);
        this.open((msg: string) => {
            log("📂 database opend(%s) - ", msg, this);
        });
    }
    private open(callback?: (msg: string) => void): void {
        const req: IDBOpenDBRequest = indexedDB.open(this.dbName, this.options.version);
        req.onerror = function (e) {
            log(e);
            throw new Error(e.type);
        };
        req.onsuccess = () => {
            this.db = req.result;
            callback && callback("db-wapper.open::success");
        };
        req.onupgradeneeded = () => {
            const db = req.result;
            if (!db.objectStoreNames.contains(this.tableName)) {
                const op = this.options.keyPath? { keyPath: this.options.keyPath } : void 0;
                db.createObjectStore(this.tableName, op);
            }
            this.db = db;
            callback && callback("db-wapper.open::onupgradeneeded");
        };
    }
    public reconnectBy(context: TConnectionContext): void {
        const {
            dbName,
            tableName = this.tableName,
            version = this.options.version,
            callback
        } = context;
        const need_reconnect = this.options.version !== version || this.dbName !== dbName;
        this.tableName = tableName;
        this.options.version = version;
        this.dbName = dbName;
        if (need_reconnect) {
            this.close();
            this.open(callback);
        }
    }
    public async waitForUntilDBAvailable() {
        while (this.db === void 0) {
            await new Promise<void>(resolve => {
                window.setTimeout(resolve, 12);
            });
        }
    }
    public close(): void {
        if (this.db !== void 0) {
            this.db.close();
            this.db = void 0;
        }
    }
    public destroy(): void {
        this.close();
        (this.stopwatch as unknown) = void 0;
    }
    private getTable(mode: IDBTransactionMode): IDBObjectStore {
        return this.db!.transaction(this.tableName, mode).objectStore(this.tableName);
    }
    put<T extends any>(
        data: T, key?: IDBValidKey,
        callback?: (e: Event) => void
    ): void {
        _pfStart(this.stopwatch);
            const req: IDBRequest<IDBValidKey> = this.getTable("readwrite").put(data, key);
            req.onsuccess = (e) => {
                _pfReport(this.stopwatch, "put", req);
                callback && callback(e);
            };
            req.onerror = HANDLE_ERROR;
    }
    get<T extends any>(
        key: IDBValidKey, callback: (data: T) => void
    ): void {
        _pfStart(this.stopwatch);
            const req: IDBRequest<T> = this.getTable("readonly").get(key);
            req.onsuccess = () => {
                _pfReport(this.stopwatch, "get", req);
                callback(req.result);
            };
            req.onerror = HANDLE_ERROR;
    }
    getAsync<T>(key: IDBValidKey): Promise<T> {
        _pfStart(this.stopwatch);
        const req: IDBRequest<T> = this.getTable("readonly").get(key);
        return new Promise<T>((resolve, reject) => {
            req.onerror = function (e) {
                log(e);
                reject(null);
            };
            req.onsuccess = () => {
                let tspent: string | undefined;
                if (DEBUG) {
                    // @ts-ignore DEBUG is true
                    tspent = this.stopwatch.stopAndResult();
                }
                const result: T = req.result;
                resolve(
                    result === void 0? null as unknown as T: result
                );
                if (DEBUG) log(`getAsync - \u{23F1}(ms): %s, key="${key}"`, tspent);
            };
        });
    }
    delete(key: IDBValidKey, callback?: (e: Event) => void): void {
        _pfStart(this.stopwatch);
        const req: IDBRequest = this.getTable("readwrite").delete(key);
        req.onsuccess = (e) => {
            _pfReport(this.stopwatch, "delete", req);
            log(`key="${key}" deleted.`);
            callback && callback(e);
        };
        req.onerror = HANDLE_ERROR;
    }
    getKeys(done: (keys: IDBValidKey[]) => void): void {
        _pfStart(this.stopwatch);
        const req: IDBRequest<IDBValidKey[]> = this.getTable("readonly").getAllKeys();
        req.onsuccess = () => {
            _pfReport(this.stopwatch, "getKeys", req);
            done(req.result);
        };
    }
    getKeysAsync(): Promise<IDBValidKey[]> {
        _pfStart(this.stopwatch);
        const req: IDBRequest<IDBValidKey[]> = this.getTable("readonly").getAllKeys();
        return new Promise<IDBValidKey[]>((resolve, reject) => {
            req.onerror = function (e) {
                log(e);
                reject(null);
            };
            req.onsuccess = () => {
                _pfReport(this.stopwatch, "getKeysAsync", req);
                const result: IDBValidKey[] = req.result;
                resolve(
                    result === void 0? null as unknown as IDBValidKey[]: result
                );
            };
        });
    }
}
export namespace IDBWrapper {
    export let DB_VERSION = 1;
    export async function useTables(
        dbName: string,
        upgradeHandler: (db: IDBDatabase) => any,
        version: number = 1
    ): Promise<void> {
        IDBWrapper.DB_VERSION = version;
        const req: IDBOpenDBRequest = indexedDB.open(dbName, version);
        return new Promise<string>((resolve, reject) => {
            req.onerror = (e) => {
                log(e);
                closeDB(e);
                reject(`error: ${req.error}`);
            };
            req.onsuccess = (e) => {
                closeDB(e);
                resolve("onsuccess: version increment needed.");
            };
            req.onupgradeneeded = (e) => {
                const db = (e.target as IDBRequest<IDBDatabase>).result;
                resolve(
                    upgradeHandler(db)
                );
            };
        })
        .then(msg => log(msg))
        .catch(reason => console.warn(reason));
    }
    export async function deleteDatabase(dbName: string): Promise<void> {
        const req: IDBOpenDBRequest = indexedDB.deleteDatabase(dbName);
        await new Promise<string>((resolve, reject) => {
            req.onerror = function (e) {
                log(e);
                reject(`error: ${req.error}`);
            };
            req.onsuccess = () => {
                if (DEBUG) log("onsuccess called.");
                resolve(`onsuccess: database="${dbName}" deleted.`);
            };
        })
        .then(msg => log(msg))
        .catch(reason => console.warn(reason));
    }
    export async function exportTables(
        dbName: string, tableNames: string[], version: number = 1
    ): Promise<string> {
        let result: Record<string, any> = onil();
        for (const tableName of tableNames) {
            const tableData: Record<string, any> = onil();
            const idb = new IDBWrapper(dbName, tableName, { version });
            await idb.waitForUntilDBAvailable();
            const keys = await idb.getKeysAsync();
            for (const key of keys ) {
                let data = await idb.getAsync(key);
                if (typeof data === "string") {
                    data = JSON.parse(data);
                }
                tableData[key as string] = data;
            }
            result[tableName] = tableData;
        }
        return JSON.stringify({ [dbName]: result }, null, 2);
    }
    export async function importFrom(
        json: Record<string, any>, version: number = 1
    ): Promise<void> {
        if (typeof json !== "object") {
            throw new ReferenceError("json data is invalid");
        }
        for (const dbName of Object.keys(json)) {
            const dbData = json[dbName];
            for (const tableName of Object.keys(dbData)) {
                const idb = new IDBWrapper(dbName, tableName, { version });
                await idb.waitForUntilDBAvailable();
                let tableData = dbData[tableName];
                for (const key of Object.keys(tableData)) {
                    idb.put(tableData[key], key);
                }
            }
        }
    }
}
declare global {
    interface Window {
        IndexedDBWrapper: typeof IDBWrapper;
    }
}
window["IndexedDBWrapper"] = IDBWrapper;