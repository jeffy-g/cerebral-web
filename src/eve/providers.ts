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
import * as _R from "react";
import * as _RD from "react-dom";
export const R = _R;
export const RD = _RD;
import {
    Types,
    Station,
    Structure,
    System,
} from "./api/esi-universe-request";
import * as ap from "./models/auth-provider";
import * as cp from "./models/char-provider";
import * as esi from "@eve/api/esi-client";
import * as prog from "@com/tiny/progress";
import * as mf from "@util/misc-functions";
import { restrictor } from "mini-semaphore";
const DEBUG = true;
export const AuthProvider = ap;
export const CharProvider = cp;
export const NsESIClient = esi;
export {
    Types,
    Station,
    Structure,
    System,
    Location,
    Universal,
} from "./api/esi-universe-request";
export namespace Task {
    const cc = cp.getCharacterClass();
    export function enableESITasks(enable: boolean): void {
        const method = enable? "run": "stop";
        cc.enableTask(enable);
        Types[method]();
        Station[method]();
        Structure[method]();
        System[method]();
        if (DEBUG) console.warn("ESI request task enable:", enable);
    }
    export const setESITaskInterval = async (sec: number) => {
        sec < 30 && (sec = 30);
        if (cc.isTaskRunning()) {
            EVEApp.marshalling({
                "notify.warn": "currently, ESI task running so this operation later"
            });
            await cc.waitForTaskDone();
            setESITaskInterval(sec);
        } else {
            const ss = document.body.style;
            ss.setProperty(
                "--esi-request-interval", `${sec}s`
            );
        }
    };
    const grp = NsESIClient.getRequestPending;
    const progress = new prog.ProgressComponent(
        "esi-request-stat", "running esi request", 500,
        () => grp()
    );
    progress.css = "--progbar-component-top: 10px; --progbar-component-right: 210px; --progbar-component-width: 230px; line-height: 10px;";
    progress.barHeight = mf.isChrome ? 6 : 4;
    export const esiRequestGauge = (show = true, interval = 33) => {
        const opt = { show, interval };
        progress.operation(opt);
    };
    export const fireCharacterQueries = () => {
        return cc.regularInquiries();
    };
    export function isESITaskEnable(): boolean {
        return cc.isESITaskEnable();
    }
    export function isESITaskRunning(): boolean {
        return cc.isTaskRunning();
    }
    export const runMiniSemaphoreCleanupTask = (run: boolean, timeSpan = 180) => {
        BackgroundTaskManager.operateTimerTask("mini-sema-cleanup", {
            action: run ? "start": "remove", interval: 60 * 1000
        }, () => {
            restrictor.cleanup(timeSpan, DEBUG).then(purged => {
                mf.log(`Mini Semaphore restrictor cleanup: ${purged}`);
            });
        });
    };
}