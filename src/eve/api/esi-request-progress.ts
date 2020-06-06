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