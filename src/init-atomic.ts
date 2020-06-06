import * as Configration from "./configuration";
import "./global/js-extensions";
import "./global/startup-helper";
import "./global/dom-events-util";
import "./global/background-task";
declare global {
    interface IInitializable {
        init?(): Promise<void>;
    }
}
let atomicModules: TBC<Promise<IInitializable>[]> = [
    import(        "./eve/ids-to-names").then((mod: IInitializable) => mod),
    import(       "./eve/farm-producer").then((mod: IInitializable) => mod),
    import(   "./global/shared-storage").then((mod: IInitializable) => mod),
    import(   "./eve/api/esi-scheduler").then((mod: IInitializable) => mod),
    import("./eve/models/auth-provider").then((mod: IInitializable) => mod),
];
export const initAtomic = async () => {
    if (typeof process !== "undefined") {
        const isDevMode = (
            process.execPath !== void 0 && process.execPath.match(/[\\/]electron/)
        ) || Configration.getConfig("force-inspect", false);
        if (isDevMode) {
            import("./util/inspect/").then(m => m.debug(true));
        }
    }
    const after = async () => {
        const modules: Promise<void>[] = [];
        for (const mod of atomicModules!) {
            const initable = await mod.then();
            if (typeof initable.init === "function") {
                modules.push(initable.init());
            }
        }
        await Promise.all(modules).then(() => {
            import("./eve/models/eve-status");
            atomicModules = null;
        });
    };
    await Configration.shiftDatabase(after);
};