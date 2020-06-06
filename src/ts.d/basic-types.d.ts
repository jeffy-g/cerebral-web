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
type TBD<T> = T | undefined;
type TBC<T> = T | null;
type JsonValueTypes = string | number | boolean | object | (number | string | boolean | object)[];
type InterfaceType<T> = {
    [P in keyof T]: T[P];
};
type TStdFunction<R = any> = (...args: any[]) => R;
type RequiredPick<T, K extends keyof T> = Required<Pick<T, K>>;
type PartialPick<T, K extends keyof T> = Partial<Pick<T, K>>;
type ExcludePick<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Flip<T, K extends keyof T> = {
    [P in Exclude<keyof T, K>]: T[P];
};
type PickProperties<P, T> = { [K in keyof T]-?: T[K] extends P ? K : never }[keyof T];
type PickNumberProperties<T> = PickProperties<number, T>;
type PickStringProperties<T> = PickProperties<string, T>;
type NonFunctionPropertyNames<T> = { [K in keyof T]-?: T[K] extends Function ? never : K }[keyof T];
type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;
type NorSFunctions<T> = { [K in keyof T]: T[K] extends (() => number | string) ? K : never }[keyof T];
type QueryValueTypes = string | number | boolean;
type DateString = string;
type TQuerySelector = string;
type NumberMap<T> = {
    [index: number]: T;
};
type UndefableStringMap<T> = TBD<Record<string, T>>;
interface ITypedCtor<T> {
    new(...args: any[]): T;
    prototype: T;
}
type TypedCtor<T> = {
    new(...args: any[]): T;
    prototype: T;
};
declare type TComparator<T> = (a: T, b: T) => number;