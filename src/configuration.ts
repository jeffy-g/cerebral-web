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
import { BaseConfig } from "./raw-configs";
import { IDBWrapper } from "@util/db/indexed-db";
import { Store } from "@util/indexed-db-store";
import { TEVEAppCredentials } from "@eve/oauth/";
import * as mf from "@util/misc-functions";
const DEBUG = 0;
const log = console.log;
declare global {
    type TAppProperties = Omit<
        typeof BaseConfig,
        | "xUserAgent"
        | "get"
        | "author_email"
        | "contributor_email"
        | "contract_completed_statuses"
        | "cache_policies"
    >;
    type TAppPropertiesSetter = Omit<
        TAppProperties,
        | "datasourceList"
        | "shared_db_name"
        | "app_db_tables"
        | "currentDatabaseName"
        | "app_config_table_name"
    >;
}
const dbUpgradeHandler = (db: IDBDatabase) => {
    const appDBTables = BaseConfig.app_db_tables;
    for (let tableName of appDBTables) {
        let options: IDBObjectStoreParameters | undefined = void 0;
        if (tableName.includes(":")) {
            const [tn, keyPath] = tableName.split(":");
            tableName = tn;
            options = { keyPath };
        }
        if (!db.objectStoreNames.contains(tableName)) {
            db.createObjectStore(tableName, options);
        }
    }
    DEBUG && log(db);
    return `onupgradeneeded: ${appDBTables.length} table created.`;
};
export const shiftDatabase = async (afterShifted: () => Promise<any>) => {
    const dbName = BaseConfig.currentDatabaseName;
    Store.setSharedDBName(dbName);
    await IDBWrapper.useTables(dbName, dbUpgradeHandler);
    await afterShifted();
};
type TPageConfigGetter = typeof BaseConfig["get"];
export const getConfig: TPageConfigGetter = (key, fallback?) => {
    return BaseConfig.get(key, fallback);
};
export const get = <K extends (keyof TAppProperties)>(key: K): TAppProperties[K] => {
    return BaseConfig[key];
};
export const set = <K extends keyof TAppPropertiesSetter>(key: K, value: TAppPropertiesSetter[K]): void => {
    (BaseConfig[key] as TAppPropertiesSetter[K]) = value;
};
export const getAppCredentials = async () => {
    return await import("@/global/shared-storage").then(
        m => m.SharedStorage.getAsync<TEVEAppCredentials>("eve-credentials", onil<TEVEAppCredentials>())
    );
};
export const dumpAppConfig = () => {
    exportAppConfigFromDB().then(
        jsonString => log(jsonString)
    );
};
const exportAppConfigFromDB = (): Promise<string> => {
    return IDBWrapper.exportTables(BaseConfig.currentDatabaseName, [BaseConfig.app_config_table_name]);
};
export const exportAppConfig = () => {
    exportAppConfigFromDB().then(
        jsonString => {
            const prefix = mf.dateStringForFile();
            if (mf.copyToClipboard(jsonString)) {
                EVEApp.marshalling({
                    "notify.done": "application config json data was copied to clipboard!"
                });
            }
            mf.createLocalFile(jsonString, prefix + "-app-config.json", "application/json");
        }
    );
};
const validateAppConfigJson = (jsonString: string) => {
    try {
        const json = JSON.parse(jsonString) as Record<string, any>;
        const entries = [
            "auth-characters", "farmCharacters", "settings"
        ];
        for (const dbName of Object.keys(json)) {
            const dbData = json[dbName] as Record<string, any>;
            for (const tableName of Object.keys(dbData)) {
                if (tableName !== "app-config") {
                    return null;
                }
                for (const entry of Object.keys(dbData[tableName])) {
                    if (!entries.includes(entry)) {
                        return null;
                    }
                }
            }
        }
        return json;
    } catch (e) {
        console.error(e);
        return null;
    }
};
export const importAppConfig = (jsonString: string, forceReload: boolean = true): void => {
    const data = validateAppConfigJson(jsonString);
    if (data) {
        IDBWrapper.importFrom(data).then(
            () => {
                log("application config import successfully...");
                forceReload && location.reload.emitDefer(999, location, true);
            }
        ).catch(reason => log(reason));
    } else {
        EVEApp.marshalling({
            "notify.error": "incorrect data for application config json"
        });
    }
};