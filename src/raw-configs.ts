import * as ls from "@/global/shared-storage";
export const LOWEST_OMEGA_SP = 5_000_000;
export const SP_PER_EXTRACTOR = 500_000;
declare global {
    namespace ConfigTypes {
        type PageConfig = {
            "application-name": string;
            "force-inspect": boolean;
            "sde-version": string;
            "/eve/oauth-client": OAuthClientConfig;
            "/app/bg-slide-setting": SlideShowConfig;
            "/components/wallet-table": WalletTableConfig;
            "/components/assets-table": AssetsTableConfig;
            "/eve/esi-task": ESITaskConfig;
        };
        type WalletTableConfig = {
            popupOptions: PopupConfig;
            pageSizeOptions: number[];
        };
        type AssetsTableConfig = {
            tagHeight: number;
        };
        type PopupConfig = {
            id: string;
            className: string;
            contextSelector: string;
            targetSelector: string;
        };
        type SlideShowConfig = {
            images: string[];
            interval: number;
        };
        type OAuthClientConfig = {
            phpEVEAuthRoot: string;
        };
        type ESITaskConfig = {
            esiTaskDebug: boolean;
            esiTaskParallelity: boolean;
            esiTaskPerformanceReport: boolean;
        };
    }
}
const pageJson: ConfigTypes.PageConfig = (() => {
    const json: HTMLScriptElement = <HTMLScriptElement>document.getElementById("page-config");
    return json? JSON.parse(json.text) : onil<ConfigTypes.PageConfig>();
})();
const getESIBoolValue = <Property extends keyof ConfigTypes.ESITaskConfig>(storageKey: string, propName: Property) => {
    let bool = localStorage.getItem(storageKey);
    if (bool === null) {
        bool = pageJson["/eve/esi-task"][propName] === true? "true": "";
        localStorage.setItem(storageKey, bool);
    }
    return !!bool;
};
let cacheUA: string;
export const BaseConfig = {
    version: "1.0.0-beta",
    author_email: "prometheussatyen@gmail.com",
    contributor_email: "hirotom1107@gmail.com",
    get: <K extends keyof ConfigTypes.PageConfig, T extends ConfigTypes.PageConfig[K]>(key: K, fallback?: T): T => {
        let value = pageJson[key];
        if (value === void 0) {
            value = fallback || onil<T>();
        }
        return <T>value;
    },
    get xUserAgent() {
        if (cacheUA === void 0) {
            const m = /Electron\/\d+.\d+.\d/.exec(navigator.userAgent);
            cacheUA = `Cerebral-web/${this.version} (${this.author_email}, contributor jeffy-g)${m? ` ${m[0]}`: ""}`;
        }
        return cacheUA;
    },
    datasourceList: [
        "tranquility", "singularity"
    ] as ESIDatasourceToken[],
    shared_db_name: {
        tranquility: "eve-app-cerebral",
        singularity: "eve-app-cerebral[sisi]",
    },
    set selectedDatasource(source: ESIDatasourceToken) {
        ls.set("esi_datasource", source);
    },
    get selectedDatasource() {
        return ls.get("esi_datasource", "tranquility") as ESIDatasourceToken;
    },
    get currentDatabaseName() {
        return this.shared_db_name[this.selectedDatasource];
    },
    app_db_tables: [
        "esi-assets:id",
        "esi-universe",
        "esi-characters",
        "esi-others",
        "misc",
        "app-config"
    ],
    app_config_table_name: "app-config",
    set esiTaskDebug(debug: boolean) {
        localStorage.setItem("esi_task_debug", debug? "true": "");
    },
    get esiTaskDebug() {
        return getESIBoolValue("esi_task_debug", "esiTaskDebug");
    },
    set esiTaskParallelity(parallelity: boolean) {
        localStorage.setItem("esi_task_parallelity", parallelity? "true": "");
    },
    get esiTaskParallelity() {
        return getESIBoolValue("esi_task_parallelity", "esiTaskParallelity");
    },
    set esiTaskPerformanceReport(needReport: boolean) {
        localStorage.setItem("esi_task_performance_report", needReport? "true": "");
    },
    get esiTaskPerformanceReport() {
        return getESIBoolValue("esi_task_performance_report", "esiTaskPerformanceReport");
    },
    contract_completed_statuses: [
        "outstanding",
        "in_progress",
        "finished_issuer",
        "finished_contractor",
        "finished",
        "cancelled",
        "rejected",
        "failed",
        "deleted",
        "reversed"
    ],
    cache_policies: {
        types: {
            base: 2592000,
            deviation: 604800,
            invalid_before: 1524052913
        }
    }
};
Object.freeze(BaseConfig);