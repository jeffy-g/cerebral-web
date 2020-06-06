/*!
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  <one line to give the program's name and a brief idea of what it does.>
  Copyright (C) 2019 jeffy-g hirotom1107@gmail.com

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
import * as NsOAuthClient from "@eve/oauth/oauth-client";
declare global {
    interface ISimplifiedTask {
        run(): void;
    }
    interface Window {
        AppStartupHelper: typeof _AppStartupHelper;
    }
    const AppStartupHelper: typeof _AppStartupHelper;
}
type TEVEAppCredentials = NsOAuthClient.TEVEAppCredentials;
namespace _AppStartupHelper {
    const startUpTasks: ISimplifiedTask[] = [];
    export const addStartUpTask = (task: ISimplifiedTask): void => {
        startUpTasks.push(task);
    };
    export const onStartUp = () => {
        while (startUpTasks.length) {
            startUpTasks.shift()!.run();
        }
        (() => {
            const success = delete window["AppStartupHelper"];
            console.log("AppStartupHelper::onStartUp, delete:", success);
        }).emitDefer(800);
    };
}
window["AppStartupHelper"] = _AppStartupHelper;
AppStartupHelper.addStartUpTask({
    async run() {
        EVEApp.addListener(
            "eve-credentials.changed", async (appCredentials) => {
                NsOAuthClient.setConfiguration({ appCredentials });
            }
        );
        const appCredentials = await import("@/global/shared-storage").then(
            m => m.SharedStorage.getAsync<TEVEAppCredentials>("eve-credentials", onil())
        );
        NsOAuthClient.setConfiguration({
            appCredentials,
        });
    }
});
export default void 0;