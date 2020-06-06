type TTimerTaskName = string;
type TTimerTaskRecord = Record<TTimerTaskName, TTimerTaskPayLoad>;
export type TimerTaskActions = "start" | "stop" | "remove" | "list";
export type TTimerTaskPayLoad = {
    action: TimerTaskActions;
    interval?: number;
    taskBody?: (() => any) | string;
};
export type TTimerTaskResponse<T extends any = any> = {
    task: string;
    result: T;
};
export type TBackgroundTaskOptions = {
    name: string;
    code: Function;
    workerOptions?: WorkerOptions;
};
const timerTaskCode = function (this: DedicatedWorkerGlobalScope) {
    const tidRecord = {} as Record<TTimerTaskName, TBD<number>>;
    const cancel = (timerName: TTimerTaskName) => {
        const tid = tidRecord[timerName];
        tid && (
            this.clearInterval(tid),
            tidRecord[timerName] = void 0
        );
    };
    this.onmessage = function (e) {
        const record: TTimerTaskRecord = e.data;
        const timerName = Object.keys(record)[0];
        const payload = record[timerName];
        const action = payload.action;
        if (action === "list") {
            console.log(tidRecord);
            return;
        }
        cancel(timerName);
        if (action === "remove") {
            delete tidRecord[timerName];
            return;
        }
        if (action === "start") {
            !payload.taskBody && (payload.taskBody = "() => () => undefined");
            const task = eval("(" + payload.taskBody + ")")() as TStdFunction;
            const timertask = emitTimerTask(task, timerName);
            timertask();
            tidRecord[timerName] = this.setInterval(timertask, payload.interval);
        }
    };
    const emitTimerTask = (task: TStdFunction, timerName: string) => async () => {
        const response = {
            task: timerName, result: await task()
        } as TTimerTaskResponse;
        this.postMessage(response);
    };
};
const taskRegistry: Record<string, Worker | undefined> = {};
export enum BasicServices {
    TimerTask = "TimerTask"
}
const getTaskNames = (isUser = true) => {
    const services = Object.values(BasicServices);
    return Object.keys(taskRegistry).filter(name => {
        return isUser !== services.includes(name as BasicServices);
    });
};
const isServiceTask = (name: string) => {
    return getTaskNames(false).includes(name);
};
export const getServiceNames = () => getTaskNames(false);
export const getUserTaskNames = () => getTaskNames();
export const createTask = (options: TBackgroundTaskOptions) => {
    const m = /^(?:function)?\s*\w*\s*\([^)]*\)\s*(?:=>)?\s*{([\w\W]*?)}$/.exec(
        options.code + ""
    );
    if (m) {
        const inlineWorker = new Worker(
            "data:application/javascript," + encodeURIComponent(m[1]),
            options.workerOptions
        );
        taskRegistry[options.name] = inlineWorker;
        return inlineWorker;
    }
    throw new SyntaxError("worker code is invalid or other cause");
};
export const removeTask = (name: string) => {
    if (!isServiceTask(name)) {
        const worker = taskRegistry[name];
        if (worker) {
            delete taskRegistry[name];
            worker.terminate();
            return true;
        }
    }
    return false;
};
export const getTask = (name: string) => {
    return isServiceTask(name)? void 0: taskRegistry[name];
};
type TCallback<T = any> = (data: TTimerTaskResponse<T>["result"]) => void;
const callbackRecord: Record<string, TCallback | undefined> = {};
export const operateTimerTask = <T = any>(
    timerName: string,
    payload: TTimerTaskPayLoad,
    callback?: TCallback<T>,
) => {
    const timerWorker = taskRegistry[BasicServices.TimerTask]!;
    const isFire = payload.action === "start";
    if (isFire && (!payload.interval || payload.interval < 5)) {
        payload.interval = 5;
    }
    isFire && (
        callbackRecord[timerName] = callback!,
        (typeof payload.taskBody === "function") && (
            payload.taskBody = `() => ${payload.taskBody! + ""}`
        ) || 1
    ) || (
        payload.taskBody = void 0,
        payload.action !== "list" && delete callbackRecord[timerName]
    );
    timerWorker.postMessage({ [timerName]: payload });
};
createTask({
    name: BasicServices.TimerTask, code: timerTaskCode,
    workerOptions: { name: BasicServices.TimerTask }
}).onmessage = e => {
    const data = e.data as TTimerTaskResponse;
    const callback = callbackRecord[data.task];
    callback && (
        e.stopImmediatePropagation(),
        callback(data.result)
    );
};