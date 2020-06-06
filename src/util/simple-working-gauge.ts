export abstract class SimpleWorkingGauge implements ISimpleWorkingGauge {
    protected count = 0;
    constructor(protected debug = true) {
    }
    workUp(msg = "") {
        this.count += 1;
        if (this.debug) console.info("%cworkUp, counter=%d, msg: [%s]", SimpleWorkingGauge.STYLE, this.count, msg);
    }
    isDidWork() {
        return this.count > 0;
    }
    reset(msg = "") {
        this.count = 0;
        if (this.debug) console.info("counter=%s, msg: [%s]", this.count, msg);
    }
    abstract explain(text: string): void;
}
export namespace SimpleWorkingGauge {
    export const STYLE: string = "color:green ;background-color: #e8e8e8;";
}