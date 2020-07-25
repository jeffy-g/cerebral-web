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
import * as Configration from "./configuration";
import "./global/js-extensions";
import "./global/startup-helper";
import "./global/dom-events-util";
import "./global/background-task";
declare global {
    interface IInitializable {
        init?(): Promise<void>;
    }
}
let atomicModules: TBC<Promise<IInitializable>[]> = [
    import(        "./eve/ids-to-names").then((mod: IInitializable) => mod),
    import(   "./global/shared-storage").then((mod: IInitializable) => mod),
    import(   "./eve/api/esi-scheduler").then((mod: IInitializable) => mod),
    import("./eve/models/auth-provider").then((mod: IInitializable) => mod),
];
export const initAtomic = async () => {
    if (typeof process !== "undefined") {
        const isDevMode = (
            process.execPath !== void 0 && process.execPath.match(/[\\/]electron/)
        ) || Configration.getConfig("force-inspect", false);
        if (isDevMode) {
            import("./util/inspect/").then(m => m.debug(true));
        }
    }
    const after = async () => {
        const modules: Promise<void>[] = [];
        for (const mod of atomicModules!) {
            const initable = await mod.then();
            if (typeof initable.init === "function") {
                modules.push(initable.init());
            }
        }
        await Promise.all(modules).then(() => {
            import("./eve/models/eve-status");
            atomicModules = null;
        });
    };
    await Configration.shiftDatabase(after);
};