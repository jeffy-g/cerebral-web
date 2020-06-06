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
import * as R from "react";
const DEBUG = {
    useTimer: true,
};
export type UseTimerOptions = {
    repeat?: boolean;
    needTimerId?: boolean;
};
export type UseTimerIdRef = R.MutableRefObject<number>;
export const useTimer = <
    O extends UseTimerOptions,
    R extends O["needTimerId"] extends true? UseTimerIdRef: void
    // @ts-ignore R is ts2366
>(callable: Function, delay: number, options?: O): R => {
    const { repeat = true, needTimerId = false } = options || onil<O>();
    const discarder = repeat? "clearInterval": "clearTimeout";
    const refTid = R.useRef<number>();
    R.useEffect(() => {
        const setter = repeat? "setInterval": "setTimeout";
        if (refTid.current !== void 0) {
            window[discarder](refTid.current);
            refTid.current = void 0;
            DEBUG.useTimer && console.log("useTimer:: timer canceled");
        }
        if (delay > 0) {
            refTid.current = window[setter](callable, delay);
        }
    }, [delay]);
    R.useEffect(() => {
        return () => {
            window[discarder](refTid.current);
            DEBUG.useTimer && console.log("useTimer:: timer canceled (unmount)");
        };
    }, []);
    if (needTimerId) {
        return refTid as R;
    }
};
export const useSignal = () => {
    const [count, udate] = R.useState(0);
    return () => { udate(count + 1); };
};
export function useSetState<T extends {}>(state: T = {} as T) {
    const [cacheState, update] = R.useState<T>(state);
    const merge = (newState: Partial<Parameters<typeof update>[0]>) => {
        update(
            prev => Object.assign({}, prev, typeof newState === "function" ? newState(prev) : newState)
        );
    };
    return [cacheState, merge] as [T, typeof merge];
}