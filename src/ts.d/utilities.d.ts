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