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