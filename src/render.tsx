import * as R from "react";
import * as ReactDOM from "react-dom";
import { EVEToolIcon } from "@com/tiny/extras";
import { Application } from "@com/app";
import * as mf from "@util/misc-functions";
let animateSplashPane: TStdFunction;
ERUSOLC: {
    const esiTaskIndicatorSelector = "eve-esiTask-enable";
    const runningIconSelector = "task-running-icon";
    const runningHandSelector = "task-running-hand";
    const esiTaskToggleKeyStroke = "ctrl alt x";
    const esiTaskImageSelector = `.${esiTaskIndicatorSelector} img`;
    animateSplashPane = (): void => {
        const nextStage = () => {
            spc.removeEventListener("animationiteration", nextStage);
            spc.classList.remove("fade-in-with-swing");
            spc.classList.add("fade-out-up");
            const splashPane = $dom("splash_pane");
            splashPane.addEventListener("animationend", () => {
                (() => {
                    splashPane.remove();
                    animateSplashPane = null as unknown as TStdFunction;
                    if (EVEApp.EVETypeIdMap === void 0) {
                        import("./eve/api/typeid-map");
                    }
                    enableESITasks(!mf.isDevelopment());
                }).emitDefer(400);
            }, mf.LISTENER_OPTION_ONCE);
            splashPane.classList.add("fade-out");
        };
        const spc = $dom("splash_content");
        spc.addEventListener("animationiteration", nextStage);
    };
    const handleVisiblityChange = () => {
        const e = $query(`span.needle-shape.${runningHandSelector}`);
        if (e) {
            const css = document.hidden? "animation-play-state: paused!important;": "";
            e.style.cssText = css;
            $query(esiTaskImageSelector).style.cssText = css;
            console.log("ESI task indicator -", document.hidden? "paused": "running");
        }
    };
    const fireCharacterQueries = EVEApp.Providers.Task.fireCharacterQueries;
    async function enableESITasks(on: boolean) {
        const img = $query(esiTaskImageSelector);
        if (img) {
            const method = on ? "add" : "remove";
            const indicator = $query("span.needle-shape");
            const listenerMethod = mf.listenerMethod(on);
            indicator[listenerMethod]("animationiteration", fireCharacterQueries);
            indicator.classList[method](runningHandSelector);
            img.classList[method](runningIconSelector);
            document[listenerMethod]("visibilitychange", handleVisiblityChange);
            EVEApp.Providers.Task.enableESITasks(on);
            on && fireCharacterQueries.emitDefer(777);
        } else {
            console.warn("cannot access EVEToolIcon");
        }
    }
    AppStartupHelper.addStartUpTask({
        run(): void {
            EVEApp.marshalling({
                "navier.extraButton": {
                    tip: `toggle ESI request task enable. [${esiTaskToggleKeyStroke}]`,
                    icon: <><EVEToolIcon type="charactersheet" /><span className="needle-shape"></span></>,
                    additionalButtonClass: esiTaskIndicatorSelector,
                    clickHandler: () => {
                        enableESITasks(
                            !$query(esiTaskImageSelector).classList.contains(runningIconSelector)
                        );
                    }
                } as ExtraButtonDetail
            });
            EVEApp.shiftFacialByDatasource("tranquility");
            const moveHistory = (direction: 1 | -1) => {
                const h = window.history;
                if (direction === -1 && h.state?.firstPage) {
                    console.log("cannot move history...");
                } else {
                    h.go(direction);
                }
            };
            DomEventsUtil.registerShortcutKeys([{
                    stroke: esiTaskToggleKeyStroke,
                    listener: () => $query(`button.${esiTaskIndicatorSelector}`).click(),
                    description: "toggle ESI request task enable"
                }, {
                    stroke: "ctrl alt f",
                    listener: () => moveHistory(1),
                    description: "handle history.forward()"
                }, {
                    stroke: "ctrl alt b",
                    listener: () => moveHistory(-1),
                    description: "handle history.back()"
                }, {
                    stroke: "ctrl alt s",
                    listener: (e: KeyboardEvent) => {
                        $consumeEvent(e);
                        EVEApp.marshalling({
                            "notify.info": 'this feature is disabled because "REMOVING DATASOURCE SINGULARITY"\nsee https://developers.eveonline.com/blog/article/removing-datasource-singularity'
                        });
                    },
                    description: "!shift ESI datasource, tq or sisi"
                }, {
                    stroke: "ctrl alt g",
                    listener: (() => {
                        let show = true;
                        return (e: KeyboardEvent) => {
                            $consumeEvent(e);
                            EVEApp.Providers.Task.esiRequestGauge(show);
                            show = !show;
                        };
                    })(),
                    description: "show/hide ESI request gauge"
                }
            ], false);
        }
    });
}
export const renderUI = (): void => {
    DomEventsUtil.initGlobalEvent("keyup");
    AppStartupHelper.onStartUp();
    ReactDOM.render(
        <Application />, $dom("App"), () => {
            EVEApp.updateTheme("dark");
            EVEStatus.run();
            register_shortcut_keys: {
                const marshaller = DomEventsUtil.createTransitionEventMarshaller(
                    $query(".app-right-container"), "hide", {
                        beforeTrigger: (dom: HTMLElement, onklazz: boolean) => {
                            onklazz && (dom.style.display = "block");
                        },
                        transitionEnd: (e: TransitionEvent, onklazz: boolean) => {
                            onklazz && ((e.currentTarget as HTMLElement).style.display = "none");
                        }
                    }
                );
                DomEventsUtil.registerShortcutKey("ctrl alt h", () => {
                    marshaller.fireTransition();
                }, "show/hide page contents");
            }
            console.log(" ------------------ EVE Cerebral started! ---------------------");
            animateSplashPane!.emitDefer(333);
            window.history.pushState({ firstPage: 1 }, "firstPage");
        }
    );
};