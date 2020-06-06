/// <reference path="./basic-types.d.ts"/>
interface IdleRequestOptions {
    timeout: number;
}
interface IdleDeadline {
    timeRemaining(): number;
    readonly didTimeout: boolean;
}
interface Function {
    __timeoutId__: TBD<number>;
    emitDefer(time?: number, this_p?: any, ...args: any[]): void;
    cancelPreviously(): void;
    reemitDefer(time?: number, this_p?: any, ...args: any[]): void;
}
interface String {
    startsWith(this: string, ss: string, position?: number): boolean;
    includes(search: string, start?: number): boolean;
}
interface Array<T> {
    includes(searchElement: T, fromIndex?: number): boolean;
    randomSort(copy?: boolean): T[];
    bnSearch(value: T): number;
    bnIncludes(value: T): boolean;
}
declare interface Window {
    requestIdleCallback(callback: (deadline: IdleDeadline) => void, options?: IdleRequestOptions): number;
    cancelIdleCallback(id: number): void;
    $dom<E extends HTMLElement>(id: string): E;
    $queryAll<T extends Element>(selector: string, context?: ParentNode): NodeListOf<T>;
    $query<T extends HTMLElement>(selector: string, context?: ParentNode): T;
    $consumeEvent<E extends Event>(e: E, immediate?: boolean): void;
    onil<T>(): T;
}
declare function $dom<E extends HTMLElement>(id: string): E;
declare function $queryAll<T extends Element>(selector: string, context?: ParentNode): NodeListOf<T>;
declare function $query<T extends HTMLElement>(selector: string, context?: ParentNode): T;
declare function $consumeEvent<E extends Event>(e: E, immediate?: boolean): void;
declare const onil: <T>() => T;