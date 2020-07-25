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
import * as mf from "@util/misc-functions";
import { createDebugLogger } from "@util/logger";
const _DEBUG = 1;
const debugLog = createDebugLogger("[TransitionCurtain]", _DEBUG, "color: green");
export type TTransitionCurtainProps = {
    enable: boolean;
    interval: number;
    transitionDuration?: number;
    ravine: () => void;
    cancelOnVisiblityChange?: boolean;
    curtainInterface?: ITransitionCurtain;
};
export interface ITransitionCurtain {
    readonly running: boolean;
    transitionCurtainRef: R.RefObject<HTMLDivElement>;
    setEnable: (is: boolean) => void;
}
const cancelTimer = (timerIdRef: R.MutableRefObject<number | undefined>): void => {
    if (timerIdRef.current) {
        window.clearInterval(timerIdRef.current);
        timerIdRef.current = void 0;
        debugLog("cancelTimer");
    }
};
function setUpTransitionCurtainAccessor(
    cif: ITransitionCurtain,
    setEnable: (is: boolean) => void,
    tcRef: R.RefObject<HTMLDivElement>,
    runningStateRef: R.RefObject<boolean>,
) {
    if (cif.setEnable !== setEnable) {
        cif.setEnable = setEnable;
        cif.transitionCurtainRef = tcRef;
        if (cif["running"] === void 0) {
            Object.defineProperty(cif, "running", {
                get: () => runningStateRef.current,
                configurable: false,
                enumerable: true,
            });
        }
    }
}
function setUpVisibilityChange(setEnable: (is: boolean) => void, cancelOnVisiblityChange?: boolean) {
    R.useEffect((): (() => void) | void => {
        const handleVisiblityChange = () => {
            debugLog("visibilitychange, document.hidden -", document.hidden);
            setEnable(!document.hidden);
        };
        if (cancelOnVisiblityChange) {
            document.addEventListener("visibilitychange", handleVisiblityChange);
            return () => document.removeEventListener("visibilitychange", handleVisiblityChange);
        }
    }, [setEnable, cancelOnVisiblityChange]);
}
function useTransitionCuatainTask(
    transitionDuration: number, isEnable: boolean,
) {
    const timerIdRef           = R.useRef<number>();
    const transitionCurtainRef = R.useRef<HTMLDivElement>(null);
    const defaultBackgroundRef = R.useRef("inherit");
    const runningStateRef      = R.useRef(false);
    const baseStyles = R.useMemo(() => {
        return {
            backgroundColor: "rgba(0, 0, 0, 0.15)",
            transition: `background-color ${transitionDuration}ms ease`,
            position: "fixed",
            width: "100vw", height: "100vh",
        } as R.CSSProperties;
    }, [transitionDuration]);
    debugLog("is enable:", isEnable);
    if (!isEnable) {
        cancelTimer(timerIdRef);
    }
    const emitTask = (dom: HTMLElement, ravine: () => void) => () => {
        const black = "rgb(0, 0, 0)";
        const ds = dom.style;
        runningStateRef.current = true;
        dom.addEventListener("transitionend", () => {
            ravine();
            debugLog("ravine");
            dom.addEventListener("transitionend", () => {
                runningStateRef.current = false;
                debugLog("all transition event done!");
            }, mf.LISTENER_OPTION_ONCE);
            ds.backgroundColor = defaultBackgroundRef.current;
            debugLog("fire 2nd transition event");
        }, mf.LISTENER_OPTION_ONCE);
        ds.transition = baseStyles.transition!;
        ds.backgroundColor === black && (ds.backgroundColor = baseStyles.backgroundColor!);
        requestAnimationFrame(() => {
            ds.backgroundColor = black;
            debugLog("fire 1st transition event");
        });
    };
    return [
        timerIdRef,
        transitionCurtainRef,
        defaultBackgroundRef,
        runningStateRef,
        baseStyles,
        emitTask
    ] as [
        typeof timerIdRef,
        typeof transitionCurtainRef,
        typeof defaultBackgroundRef,
        typeof runningStateRef,
        typeof baseStyles,
        typeof emitTask
    ];
}
export const TransitionCurtain = (props: TTransitionCurtainProps) => {
    const {
        enable,
        interval, transitionDuration = 3000,
        ravine,
        curtainInterface: cif,
        cancelOnVisiblityChange
    } = props;
    const [sign, forceRedraw] = R.useState(false);
    const currentEnableRef = R.useRef(enable);
    const setEnable = R.useCallback((is: boolean) => {
        currentEnableRef.current = is;
        forceRedraw(!sign);
    }, [sign]);
    const [
        tidRef,
        tcRef,
        defaultBackgroundRef,
        runningStateRef,
        baseStyles,
        emitTask
    ] = useTransitionCuatainTask(transitionDuration, currentEnableRef.current);
    R.useEffect(() => {
        const dom = tcRef.current;
        if (dom) {
            defaultBackgroundRef.current = (currentEnableRef.current)? baseStyles.backgroundColor!: "inherit";
            if (currentEnableRef.current) {
                if (!tidRef.current) {
                    tidRef.current = window.setInterval(emitTask(dom, ravine), interval);
                    debugLog("curtain task started");
                } else {
                    debugLog("curtain task is alive");
                }
            } else {
                cancelTimer(tidRef);
                const ds = dom.style;
                ds.transition = "background-color 800ms ease";
                ds.backgroundColor = defaultBackgroundRef.current;
            }
            debugLog("timerIdRef.current:", tidRef.current);
        }
    });
    if (typeof cif === "object") {
        setUpTransitionCurtainAccessor(
            cif, setEnable, tcRef, runningStateRef
        );
    }
    setUpVisibilityChange(setEnable, cancelOnVisiblityChange);
    return <div className="transition-curtain"
        style={baseStyles as R.CSSProperties} ref={tcRef}
    />;
};