/*!
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  <one line to give the program's name and a brief idea of what it does.>
  Copyright (C) 2018 jeffy-g hirotom1107@gmail.com

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