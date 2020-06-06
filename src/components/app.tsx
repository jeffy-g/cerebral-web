import * as R from "react";
import { Route } from "react-router";
import { HashRouter } from "./router/hash-router";
import {
    Theme, ThemeProvider,
} from "@material-ui/core/styles";
import * as NsGlobalApp from "../global/eve-application";
import { Navier } from "./navier";
import { Overview } from "./views/characters-overview";
import { SkillBrowser } from "./views/skill-browser";
import { Contracts } from "./views/contracts";
import { Settings } from "./views/settings";
import { CharacterSheetRoute } from "./views/character-sheet";
import * as Extras from "./tiny/extras";
import { About } from "./tiny/about";
import {
    EVEStatusWidget, IEVEStatusWidgetProxy
} from "./chart/eve-status-widget";
import { BufferProgressBar } from "./progress/linear-buffer";
import {
    TransitionCurtain, ITransitionCurtain
} from "./tiny/transition-curtain";
import {
    QueueableSnackbars, MessageState,
} from "./tiny/queueable-snackbars";
import { themes } from "./theme";
import * as ls from "@/global/shared-storage";
import * as mf from "@util/misc-functions";
const messageStateMap = {
    "notify.done": "check_circle",
    "notify.info": "info",
    "notify.warn": "warning",
    "notify.error": "error",
};
const accessibleComponents: Record<string, IReactDecorator> = onil();
const MainContainerSelector = "app-right-container";
const CURTAIN_ConfKey = "disable-curtain";
type EVEApplicationStub = Pick<IEVEApplication, "setTheme" | "getCurrentTheme" | "notify" | "forceUpdate">;
let navier: Navier;
let appInstance: EVEApplicationStub;
let currentTheme: Theme;
let ssConfig: ConfigTypes.SlideShowConfig;
const curtainIf: ITransitionCurtain = onil() as ITransitionCurtain;
let forceCurtainDisable = ls.get(CURTAIN_ConfKey, false);
const isCurtainEnable = () => {
    return forceCurtainDisable? false: currentTheme.palette.type === "dark";
};
let transitionEndHandler: () => void; {
    let index = 1;
    transitionEndHandler = () => {
        if (currentTheme.palette.type === "dark") {
            const nextIndex = (index++) % ssConfig.images.length;
            updateBgImage(true, nextIndex);
        }
    };
}
const updateBgImage = (enable: boolean, index: number = 0) => {
    const ss = document.body.style;
    const sdeVersion = $query("div.sde-version");
    const handler = () => {
        ss.setProperty(
            "--bg-image",
            enable? `url("../images/bg-images/${ssConfig.images[index]}")`: "none"
        );
        if (!enable) {
            initImages();
        }
    };
    const binary = (+enable) + "";
    if (sdeVersion) {
        sdeVersion.dataset.enablecurtain = binary;
        sdeVersion.title = enable? "slideshow task running": "";
    }
    // @ts-ignore 
    enable && !handler()
    || document.body.addEventListener("transitionend", handler, mf.LISTENER_OPTION_ONCE);
    ss.setProperty("--bg-opacity", binary);
};
const eveStatusWidgetProxy: IEVEStatusWidgetProxy = {
    enableTimer: () => {}
};
const additionalButtonClass = "eve-status-widget-opener";
const buttonIconSelector = `button.${additionalButtonClass}`;
const toggleStatusWidgetVisibility = () => {
    $query(buttonIconSelector).click();
};
const initImages = () => {
    (ssConfig = EVEApp.Config.getConfig("/app/bg-slide-setting")).images.randomSort(false);
};
const installBackgroundImagePane = () => {
    if (!$query("body > .bg-image-pane")) {
        const body = document.body;
        body.style.setProperty("--bg-image", "none");
        body.style.setProperty("--bg-opacity", "1");
        const div = document.createElement("div");
        div.className = "bg-image-pane";
        div.style.cssText = `
background-image: var(--bg-image);
opacity: var(--bg-opacity);
transition: opacity 800ms ease;
top: 0; left: 0; bottom: 0; right: 0;
position: fixed;
background-size: cover;
background-position: center center;
background-repeat: no-repeat;
background-attachment: local;
background-origin: border-box;
`;
        body.insertBefore(div, body.firstElementChild);
    }
};
const handleSlideshowToggle = (e: UIEvent) => {
    if (e instanceof MouseEvent) {
        if (e.offsetX < 0) {
            e.stopPropagation();
        } else {
            return;
        }
    }
    setTimeout(async () => {
        const theme = EVEApp.getTheme();
        let message: string;
        if (theme.palette.type === "dark") {
            if (curtainIf.running) {
                setTimeout(() => {
                    EVEApp.marshalling({
                        "notify.warn": "currently, transition curtain is active.\nexecute the requested command after event completes."
                    });
                });
                await mf.waitForObject(curtainIf, "running", 500);
            }
            ls.set(CURTAIN_ConfKey, forceCurtainDisable = !forceCurtainDisable);
            updateBgImage(!forceCurtainDisable);
            curtainIf.setInterrupt(forceCurtainDisable);
            message = "TransitionCurtaion enable:";
        } else {
            message = "TransitionCurtaion disable event ignored:";
        }
        console.log(message, !forceCurtainDisable);
    });
};
AppStartupHelper.addStartUpTask({
    run(): void {
        const StatusWidgetToggleKeyStroke = "ctrl alt e";
        EVEApp.marshalling({
            "navier.extraButton": {
                tip: `toggle EVE online status widget. [${StatusWidgetToggleKeyStroke}]`,
                icon: <Extras.EVEToolIcon type="satellite"/>,
                additionalButtonClass,
                clickHandler() {
                    const visible = $query(buttonIconSelector + " img[src*=satellite]").classList.toggle("swing-icon");
                    eveStatusWidgetProxy.enableTimer(visible);
                }
            }
        });
        DomEventsUtil.registerShortcutKeys([{
                stroke: StatusWidgetToggleKeyStroke,
                listener: toggleStatusWidgetVisibility,
                description: "toggle EVE online status widget"
            }, {
                stroke: "ctrl alt c",
                listener: handleSlideshowToggle,
                description: "toggle enabe/disable slideshow (dark"
            }
        ], false);
    }
});
let qsRef: QueueableSnackbars;
const referenceSnackbars = (instance: TBC<QueueableSnackbars>) => qsRef = instance!;
const referenceProgress = (progressInstance: BufferProgressBar) => {
    import("../util/decorator/linear-buffer-decorator").then(mod => {
        accessibleComponents[EVEApp.Widgets.ESIProgressBar] = new mod.ProgressManipulator(progressInstance);
    });
};
currentTheme = themes[1];
NsGlobalApp.injectAppImplementation({
    navigateTo(target: string) {
        navier.navigateTo(target);
    },
    setTheme(themeIndex: number | string) {
        appInstance.setTheme(themeIndex);
    },
    getCurrentTheme() {
        return appInstance.getCurrentTheme();
    },
    notify(message: string, state: MessageState) {
        appInstance.notify(message, state);
    },
    forceUpdate(callback?: () => void) {
        appInstance.forceUpdate(callback);
    },
    getNotifyState(type: keyof typeof messageStateMap) {
        return messageStateMap[type];
    },
    addAccessibleComponent(c: IReactDecorator, tag: string) {
        accessibleComponents[tag] = c;
    },
    getAccessibleComponent<T extends IReactDecorator>(tag: string) {
        return accessibleComponents[tag] as T;
    },
    addNavierButton(buttonDetail: ExtraButtonDetail) {
        Navier.registerButtonComponent(buttonDetail);
    }
});
export class Application extends R.PureComponent<AppProps, {}> {
    notify(message: string, state: MessageState) {
        qsRef.notify(message, state);
    }
    getCurrentTheme() {
        return currentTheme;
    }
    setTheme(themeIndex: number | string) {
        if (typeof themeIndex === "string") {
            themeIndex = +(themeIndex === "dark");
        }
        const theme = themes[themeIndex];
        const app = $dom("App");
        const ss = document.body.style;
        const domStyleChange = () => {
            ss.color = theme.palette.text.primary;
            ss.backgroundColor = theme.palette.background.default;
            updateBgImage(
                (app.dataset.theme = theme.palette.type) === "dark" && !forceCurtainDisable
            );
            console.log("application theme changed.");
        };
        if (currentTheme === theme) {
            domStyleChange();
            return;
        }
        currentTheme = theme;
        this.forceUpdate(() => {
            window.requestAnimationFrame(domStyleChange);
        });
    }
    constructor(props: AppProps) {
        super(props);
        appInstance = this;
        const accessibles = props.accessibleComponents;
        if (accessibles !== void 0) {
            const keys = Object.keys(accessibles);
            for (const tag of keys) {
                accessibleComponents[tag] = accessibles[tag];
            }
        }
        initImages();
        installBackgroundImagePane();
    }
    public forceUpdate(callback?: () => void) {
        navier.beforeThemeChange();
        super.forceUpdate(callback);
    }
    componentDidMount() {
        mf.eventListener(
            "click", handleSlideshowToggle, "div.sde-version"
        );
    }
    componentWillUnmount() {
        mf.eventListener(
            "click", handleSlideshowToggle, "div.sde-version", 1
        );
    }
    render() {
        return (
            <HashRouter hashType="slash">
                <ThemeProvider theme={currentTheme}>
                    {}
                    <TransitionCurtain
                        enable={isCurtainEnable()}
                        curtainInterface={curtainIf}
                        interval={ssConfig.interval}
                        ravine={transitionEndHandler}
                        cancelOnVisiblityChange
                    />
                    <div id="portalSpace"></div>
                    <About/>
                    <QueueableSnackbars ref={referenceSnackbars} />
                    <Navier ref={nv => navier = nv!}/>
                    <div className={MainContainerSelector}>
                        {}
                        {
                        }
                        <Route exact path="/" component={Overview} />
                        <Route path="/skill-browser" component={SkillBrowser} />
                        <Route path="/contracts" component={Contracts} />
                        <Route path="/settings" component={Settings} />
                        <CharacterSheetRoute />
                        {}
                    </div>
                    <EVEStatusWidget useSeconds
                        proxy={eveStatusWidgetProxy}
                        handleClose={toggleStatusWidgetVisibility}
                    />
                    <BufferProgressBar ref={referenceProgress}/>
                </ThemeProvider>
            </HashRouter>
        );
    }
}