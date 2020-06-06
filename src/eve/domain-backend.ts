export namespace DomainBackendTypes {
    export type TResult<T extends any = any> = {
        error?: T;
    };
}
export interface IDomainBackend<ID extends string> {
    name: ID;
}
export interface IEVEApiBackend extends IDomainBackend<"eve-online"> {
}
export interface IPersistStorage {
    load<T>(name: string, callback: (data: T) => void): void;
    loadAsync<T>(name: string): Promise<T>;
    save<T>(name: string, data: T, callback?: (result?: DomainBackendTypes.TResult) => void): void;
    saveAsync<T>(name: string, data: T): Promise<DomainBackendTypes.TResult>;
}
export interface IEVEApiBackend {
    storage: IPersistStorage;
}