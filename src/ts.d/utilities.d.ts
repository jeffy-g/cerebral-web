interface ISimpleWorkingGauge {
    explain(text: string): void;
    workUp(message?: string): void;
    isDidWork(): boolean;
    reset(message?: string, ...extraArgs: any[]): void;
    [x: string]: any;
}
interface IDetailedProgress<TTerget, TDetail> {
    explain(text: string): void;
    setStepUnitBy(target: TTerget): void;
    setStepUnitByAll(target: TTerget[]): void;
    nextStatge(detail?: TDetail): void;
    progress(value?: number): void;
    done(): void;
}
type UniverseNamesFragment<T> = {
    name: string;
    category: T;
};
type UniverseNamesFragmentDefault = UniverseNamesFragment<EVEUniverseNamesCategory>;
type UniverseNamesFragmentLocation = UniverseNamesFragment<"station" | "solar_system" | "structure">;