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
    TransitionCurtain
} from "./tiny/transition-curtain";
import {
    QueueableSnackbars, MessageState,
} from "./tiny/queueable-snackbars";
import { themes } from "./theme";
import * as ss from "./slide-show";
import * as mf from "@util/misc-functions";
const messageStateMap = {
    "notify.done": "check_circle",
    "notify.info": "info",
    "notify.warn": "warning",
    "notify.error": "error",
};
const accessibleComponents: Record<string, IReactDecorator> = onil();
const MainContainerSelector = "app-right-container";
const raf = mf.getRafFunction();
type EVEApplicationStub = Pick<IEVEApplication, "setTheme" | "getCurrentTheme" | "notify" | "forceUpdate">;
let navier: Navier;
let appInstance: EVEApplicationStub;
let currentTheme: Theme;
const eveStatusWidgetProxy: IEVEStatusWidgetProxy = {
    enableTimer: () => {}
};
const additionalButtonClass = "eve-status-widget-opener";
const buttonIconSelector = `button.${additionalButtonClass}`;
const toggleStatusWidgetVisibility = () => {
    $query(buttonIconSelector).click();
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
                listener: ss.handleSlideshowToggle,
                description: "toggle enabe/disable slideshow (dark"
            }
        ], false);
    }
});
let qsRef: QueueableSnackbars;
const referenceSnackbars = (instance: QueueableSnackbars) => qsRef = instance;
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
        const domStyleChange = () => {
            const bodyStyle = document.body.style;
            bodyStyle.color = theme.palette.text.primary;
            bodyStyle.backgroundColor = theme.palette.background.default;
            const isCurtainEnable = ($dom("App").dataset.theme = theme.palette.type) === "dark" && !ss.isCurtainSuspended();
            ss.updateBgImage(isCurtainEnable);
            ss.curtainIf.setEnable(isCurtainEnable);
            console.log("application theme changed.");
        };
        if (currentTheme === theme) {
            domStyleChange();
            return;
        }
        currentTheme = theme;
        this.forceUpdate(() => {
            raf(domStyleChange);
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
        ss.initImages();
        ss.installBackgroundImagePane();
    }
    public forceUpdate(callback?: () => void) {
        navier.beforeThemeChange();
        super.forceUpdate(callback);
    }
    componentDidMount() {
        mf.eventListener(
            "click", ss.handleSlideshowToggle, "div.sde-version"
        );
    }
    componentWillUnmount() {
        mf.eventListener(
            "click", ss.handleSlideshowToggle, "div.sde-version", 1
        );
    }
    render() {
        return (
            <HashRouter hashType="slash">
                <ThemeProvider theme={currentTheme}>
                    {}
                    <TransitionCurtain
                        enable={ss.isCurtainEnable()}
                        curtainInterface={ss.curtainIf}
                        interval={ss.getInterval()}
                        ravine={ss.transitionEndHandler}
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
