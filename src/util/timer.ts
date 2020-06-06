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