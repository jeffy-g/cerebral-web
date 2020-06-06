import * as R from "react";
import * as mf from "@util/misc-functions";
import { createDebugLogger } from "@util/logger";
const _DEBUG = 0;
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
    setInterrupt: (is: boolean) => void;
}
const cancelTimer = (timerIdRef: R.MutableRefObject<number | undefined>): void => {
    if (timerIdRef.current) {
        window.clearInterval(timerIdRef.current);
        timerIdRef.current = void 0;
        debugLog("cancelTimer");
    }
};
const debugLog = createDebugLogger("[TransitionCurtain]", _DEBUG, "color: green");
function setUpTransitionCurtainAccessor(
    setInterrupt: (is: boolean) => void,
    tcRef: R.RefObject<HTMLDivElement>,
    runningStateRef: R.RefObject<boolean>,
    cif: ITransitionCurtain,
) {
    if (cif.setInterrupt !== setInterrupt) {
        cif.setInterrupt = setInterrupt;
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
function setUpVisibilityChange(setInterrupt: (is: boolean) => void, cancelOnVisiblityChange?: boolean) {
    R.useEffect((): (() => void) | void => {
        const handleVisiblityChange = () => {
            debugLog("visibilitychange, document.hidden -", document.hidden);
            setInterrupt(document.hidden);
        };
        if (cancelOnVisiblityChange) {
            document.addEventListener("visibilitychange", handleVisiblityChange);
            return () => document.removeEventListener("visibilitychange", handleVisiblityChange);
        }
    }, [cancelOnVisiblityChange]);
}
function useTransitionCuatainTask(
    transitionDuration: number, wasInterrupt: boolean,
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
    debugLog("isInterrupt:", wasInterrupt);
    if (wasInterrupt) {
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
    const [wasInterrupt, setInterrupt] = R.useState(false);
    const [
        tidRef,
        tcRef,
        defaultBackgroundRef,
        runningStateRef,
        baseStyles,
        emitTask
    ] = useTransitionCuatainTask(transitionDuration, wasInterrupt);
    R.useEffect(() => {
        const dom = tcRef.current;
        if (dom) {
            defaultBackgroundRef.current = enable? baseStyles.backgroundColor!: "inherit";
            if (enable && !wasInterrupt) {
                if (!tidRef.current) {
                    tidRef.current = window.setInterval(emitTask(dom, ravine), interval);
                    debugLog("curtain task resumed");
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
            setInterrupt, tcRef, runningStateRef, cif
        );
    }
    setUpVisibilityChange(setInterrupt, cancelOnVisiblityChange);
    return <div className="transition-curtain"
        style={baseStyles as R.CSSProperties} ref={tcRef}
    />;
};