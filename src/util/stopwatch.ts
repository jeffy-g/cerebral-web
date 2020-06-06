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
export class Stopwatch {
    constructor(public st: number = 0, public ed: number = 0) { }
    start(): void {
        this.st = performance.now();
    }
    stop(): void {
        this.ed = performance.now();
    }
    stopAndResult(): string {
        return (performance.now() - this.st).toFixed(8);
    }
    getResult(): string {
        return (this.ed - this.st).toFixed(6);
    }
    toString(): string {
        return "\u{23F1}(ms)=" + this.getResult();
    }
}