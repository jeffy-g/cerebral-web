import * as R from "react";
import { Theme } from "@material-ui/core/styles/";
import * as _Providers from "@eve/providers";
import * as Configration from "@/configuration";
import { TEVETypeIdMap } from "@eve/api/typeid-map";
import { TEVEAppCredentials } from "@eve/oauth/";
import * as mf from "@util/misc-functions";
declare global {
    type AppProps = {
        accessibleComponents?: Record<string, IReactDecorator>;
    };
    interface IReactDecorator {
    }
    type ExtraButtonDetail = {
        tip: string;
        icon: JSX.Element;
        additionalButtonClass: string;
        clickHandler: (e: R.MouseEvent<HTMLElement>) => void;
    };
    interface EVEAppEventTypeMap {
        "drawer.open": boolean;
        "redirect.character.page": string;
        "notify.done": unknown;
        "notify.info": unknown;
        "notify.warn": unknown;
        "notify.error": unknown;
        "eve.onlinestatus.show": boolean;
        "navier.extraButton": ExtraButtonDetail;
        "datasource.change": ESIDatasourceToken;
        "eve-credentials.changed": TEVEAppCredentials;
    }
    type MarshallingData = {
        [TEvent in keyof EVEAppEventTypeMap]: EVEAppEventTypeMap[TEvent extends infer T? T: never]
    };
    type ESIDatasourceToken = "tranquility" | "singularity";
    const EVEApp: typeof EVEApplication;
    interface Window {
        EVEApp: typeof EVEApplication;
    }
    type AppListenrTypeMap = Pick<EVEAppEventTypeMap, "datasource.change" | "eve-credentials.changed"> & {
        "datasource.change.done": void;
        "theme.changed": Theme;
    };
    type AppListenrTypeMapKeys = keyof AppListenrTypeMap;
    type AppEventValidatorFunction<T = Promise<boolean>> = () => T;
    type TypedListener<K extends AppListenrTypeMapKeys> = (source: AppListenrTypeMap[K]) => void | Promise<void>;
    type DataSourceChangeListener = TypedListener<"datasource.change">;
    type DataSourceChangeDoneListener = TypedListener<"datasource.change.done">;
    type TypedListenerResitry = Record<string, TBD<TypedListener<AppListenrTypeMapKeys>>[]>;
    interface INavierRouter {
        navigateTo(target: string): void;
    }
    interface IEVEApplication extends INavierRouter {
        forceUpdate(callback?: () => void): void;
        setTheme(themeIndex: number | string): void;
        getCurrentTheme(): Theme;
        notify(message: unknown, state: unknown): void;
        getNotifyState(type: unknown): unknown;
        addAccessibleComponent(c: IReactDecorator, tag: string): void;
        getAccessibleComponent<T extends IReactDecorator>(tag: string): T;
        addNavierButton(buttonDetail: ExtraButtonDetail): void;
    }
}
let eveAppInstance: IEVEApplication;
export const injectAppImplementation = (instance: IEVEApplication) => {
    eveAppInstance = instance;
};
export const getAppImplementation = () => {
    return eveAppInstance;
};
const AppContentSelector = "body > div.app";
namespace EVEApplication {
    export const Providers = _Providers;
    export const Config = Configration;
    export let EVETypeIdMap: TEVETypeIdMap;
    export const enum Widgets {
        ESIProgressBar = "ESIProgressBar",
        EVEStatusWidget = "EVEStatusWidget",
    }
    export const getTheme = (): Theme => {
        return eveAppInstance.getCurrentTheme();
    };
    export const updateTheme = (themeIndex: number | string) => {
        eveAppInstance.setTheme(themeIndex);
        const listeners: TypedListener<"theme.changed">[] = eventListenerRgistry.getListeners("theme.changed");
        if (listeners) {
            const theme = eveAppInstance.getCurrentTheme();
            for (const listener of listeners) {
                listener && listener(theme);
            }
        }
    };
    export const updateSingletonInstance = () => {
        if (eveAppInstance !== void 0) {
            eveAppInstance.forceUpdate(() => {
                console.log("application force update.");
            });
        }
    };
    export const addAccessibleComponent = (c: IReactDecorator, tag: string): void => {
        eveAppInstance.addAccessibleComponent(c, tag);
    };
    export const getAccessibleComponent = <T extends IReactDecorator>(tag: string): T => {
        return eveAppInstance.getAccessibleComponent(tag);
    };
    const datasourceEventValidators: AppEventValidatorFunction[] = [];
    export const addDatasourceEventValidator = (validator: AppEventValidatorFunction) => {
        datasourceEventValidators.push(validator);
    };
    const eventListenerRgistry = DomEventsUtil.createListenerRegistry<TypedListener<AppListenrTypeMapKeys>>();
    export const addListener = <K extends AppListenrTypeMapKeys>(etoken: K, listener: TypedListener<K>): TBD<TypedListener<K>> => {
        return eventListenerRgistry.add(etoken, listener as TypedListener<AppListenrTypeMapKeys>);
    };
    export const addListeners = <K extends AppListenrTypeMapKeys>(listeners: {
        [TEvent in K]: TypedListener<TEvent extends infer T? T: never>
    }): TBD<TypedListener<K>>[] => {
        const ids: TBD<TypedListener<K>>[] = [];
        for (const type of Object.keys(listeners) as K[]) {
            ids.push(
                eventListenerRgistry.add(type, listeners[type] as TypedListener<AppListenrTypeMapKeys>)
            );
        }
        return ids;
    };
    export const removeListener = <K extends AppListenrTypeMapKeys>(event: K, lintenerId?: TypedListener<K>): void => {
        eventListenerRgistry.remove(event, lintenerId as TypedListener<AppListenrTypeMapKeys>);
    };
    export const marshalling = <K extends keyof EVEAppEventTypeMap>(data: {
        [TEvent in K]: EVEAppEventTypeMap[TEvent extends infer T? T: never]
    }): void => {
        for (const type of Object.keys(data) as K[]) {
            switch (type) {
                case "eve-credentials.changed": {
                    const listeners: TypedListener<"eve-credentials.changed">[] = eventListenerRgistry.getListeners(type);
                    if (listeners) {
                        const secret = data[type] as EVEAppEventTypeMap["eve-credentials.changed"];
                        for (const listener of listeners) {
                            listener && listener(secret);
                        }
                    }
                    break;
                }
                case "drawer.open": {
                    const containers = $queryAll(`${AppContentSelector} > div.app-right-container, ${AppContentSelector} > div.progbar`);
                    if (containers.length > 0) {
                        const method = data[type] === true ? "add" : "remove";
                        for (const c of containers) {
                            c.classList[method]("push");
                        }
                    }
                    break;
                }
                case "redirect.character.page": {
                    eveAppInstance.navigateTo(data[type] as EVEAppEventTypeMap["redirect.character.page"]);
                    break;
                }
                case "notify.done":
                case "notify.info":
                case "notify.warn":
                case "notify.error": {
                    eveAppInstance.notify(data[type], eveAppInstance.getNotifyState(type));
                    break;
                }
                case "navier.extraButton": {
                    eveAppInstance.addNavierButton(data[type] as EVEAppEventTypeMap["navier.extraButton"]);
                    break;
                }
                default: {
                    eveAppInstance.notify("ERROR: invalid type marshalling detected, type=" + type, "error");
                    break;
                }
            }
        }
    };
    export const shiftFacialByDatasource = (datasource: ESIDatasourceToken) => {
        $query(".datasource-indicator").dataset.datasource! = datasource;
    };
}
mf.globalize(EVEApplication, "EVEApp");