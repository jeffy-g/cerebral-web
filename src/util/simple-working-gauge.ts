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
export abstract class SimpleWorkingGauge implements ISimpleWorkingGauge {
    protected count = 0;
    constructor(protected debug = true) {
    }
    workUp(msg = "") {
        this.count += 1;
        if (this.debug) console.info("%cworkUp, counter=%d, msg: [%s]", SimpleWorkingGauge.STYLE, this.count, msg);
    }
    isDidWork() {
        return this.count > 0;
    }
    reset(msg = "") {
        this.count = 0;
        if (this.debug) console.info("counter=%s, msg: [%s]", this.count, msg);
    }
    abstract explain(text: string): void;
}
export namespace SimpleWorkingGauge {
    export const STYLE: string = "color:green ;background-color: #e8e8e8;";
}