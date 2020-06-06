import * as era from "./esi-request-aggregator";
import { SimpleWorkingGauge } from "@util/simple-working-gauge";
declare global {
    type IESIRequestProgress = ISimpleWorkingGauge & IDetailedProgress<string, string>;
}
export class ESIRequestProgress extends SimpleWorkingGauge implements IDetailedProgress<string, string> {
    private bufferStep: number = 0;
    private step: number = 0;
    private progbar?: IBufferableProgress;
    constructor() {
        super(false);
    }
    workUp(msg = ""): void {
        super.workUp(msg);
        const p = this.progbar;
        p && p.progress(this.step);
    }
    reset(msg = "", charIds?: string[]): void {
        super.reset(msg);
        const p: IBufferableProgress = EVEApp.getAccessibleComponent(EVEApp.Widgets.ESIProgressBar);
        p.reset();
        if (charIds !== void 0) {
            p.prepare();
            let needUpdateCharCount = era.getNeedUpdateCharCount(charIds);
            needUpdateCharCount === 0 && (needUpdateCharCount = charIds.length);
            this.bufferStep = 100 / needUpdateCharCount;
            this.progbar = p;
        } else {
            this.progbar = void 0;
        }
    }
    done(): void {
        const p = this.progbar;
        p && p.done();
    }
    setStepUnitBy(charId: string): void {
        const count = era.getCurrentlyRequestCount(charId);
        this.step = count === 0 ? NaN: this.bufferStep / count;
    }
    setStepUnitByAll(charIds: string[]): void {
        let count = 0;
        for (const charId of charIds) {
            count += era.getCurrentlyRequestCount(charId);
        }
        this.step = count === 0 ? NaN: 100 / count;
    }
    nextStatge() {
        const p = this.progbar;
        p && p.progressBuffer(this.bufferStep);
    }
    explain(explain: string): void {
        const p = this.progbar;
        p && p.showText(explain);
    }
    progress(): void {
        throw new Error("Method not implemented.");
    }
}