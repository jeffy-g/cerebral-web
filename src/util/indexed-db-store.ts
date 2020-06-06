import { IDBWrapper } from "@util/db/indexed-db";
type TIndexedDBStoreOptions = {
    name: string;
    dbOptions?: IDBWrapper.SimpleIndexedDBOptions;
    onChangeDatabase?: () => Promise<void>;
};
let pc = 0;
let sharedDBName: string;
export class Store<T = {}> {
    private idb: IDBWrapper;
    private options: TIndexedDBStoreOptions;
    constructor(options?: TIndexedDBStoreOptions) {
        options = options || onil<TIndexedDBStoreOptions>();
        let tableName = options.name || `some-store-${pc++}`;
        this.idb = new IDBWrapper(sharedDBName, tableName, options.dbOptions);
        this.options = options;
    }
    onShiftStorageRoot(context: IDBWrapper.DBConnectionContext): void {
        const callback = context.callback;
        context.callback = async (msg: string) => {
            const handler = this.options.onChangeDatabase;
            handler && await handler();
            callback && callback(msg);
        };
        this.idb.reconnectBy(context);
    }
    set(value: T, key?: IDBValidKey, callback?: (e: Event) => void): void {
        this.idb.waitForUntilDBAvailable().then(() => {
            this.idb.put(value, key, callback);
        });
    }
    async getAsync(key: IDBValidKey, defaultValue?: T) {
        const idb = this.idb;
        await idb.waitForUntilDBAvailable();
        defaultValue === void 0 && (defaultValue = {} as T);
        const data = await idb.getAsync<T>(key);
        return data === null? defaultValue: data;
    }
    get(key: IDBValidKey, callback: (data: T) => void): void {
        this.idb.waitForUntilDBAvailable().then(() => {
            this.idb.get<T>(key, callback);
        });
    }
    delete(key: IDBValidKey, callback?: (e: Event) => void): void {
        this.idb.waitForUntilDBAvailable().then(() => {
            this.idb.delete(key, callback);
        });
    }
}
export namespace Store {
    export type TDBStoreOptions = TIndexedDBStoreOptions;
    export function setSharedDBName(dbName: string): void {
        sharedDBName = dbName;
    }
}