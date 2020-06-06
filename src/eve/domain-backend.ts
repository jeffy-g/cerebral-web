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