/*!
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  <one line to give the program's name and a brief idea of what it does.>
  Copyright (C) 2018 jeffy-g hirotom1107@gmail.com

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