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