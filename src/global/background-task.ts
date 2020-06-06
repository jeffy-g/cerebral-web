import * as mf from "@util/misc-functions";
import * as backgroundTask from "@util/background-task-mgr";
declare global {
    const BackgroundTaskManager: typeof backgroundTask;
    interface Window {
        BackgroundTaskManager: typeof BackgroundTaskManager;
    }
}
mf.globalize(backgroundTask, "BackgroundTaskManager");