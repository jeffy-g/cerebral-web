type Callable = (...args: any) => void;
type TimerOptions = {
    interval?: number;
    runBody: Callable;
    stopBody?: Callable;
};
export class Timer {
    private tid: number | undefined = void 0;
    protected interval: number;
    protected runBody: Callable;
    protected stopBody?: Callable;
    constructor(options?: TimerOptions) {
        const {
            interval = 1e3,
            runBody = () => {},
            stopBody = void 0
        } = options || onil<TimerOptions>();
        this.interval = interval > 5? interval: 6;
        this.runBody = runBody;
        if (typeof stopBody === "function") {
            this.stopBody = stopBody;
        }
    }
    run() {
        if (this.tid) {
            window.clearInterval(this.tid);
        }
        this.tid = window.setInterval(this.runBody, this.interval);
    }
    stop() {
        window.clearInterval(this.tid);
        this.tid = void 0;
        const fn = this.stopBody;
        typeof fn === "function" && fn();
    }
}