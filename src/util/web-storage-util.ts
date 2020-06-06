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
export class LocalStorage<ValueType extends {}> {
    constructor(
        private key: string,
        private defaultValue: ValueType
    ) {}
    load(raw?: boolean): ValueType {
        try {
            const data = localStorage.getItem(this.key);
            if (data === null) {
                localStorage.setItem(this.key, raw ? this.defaultValue + "" : JSON.stringify(this.defaultValue));
                return this.defaultValue as ValueType;
            } else {
                return (
                    raw ? data : JSON.parse(data || "null")
                ) as unknown as ValueType;
            }
        } catch {
            return this.defaultValue as ValueType;
        }
    }
    save(value: ValueType, raw?: boolean) {
        try {
            const data = raw ? value + "" : JSON.stringify(value);
            localStorage.setItem(this.key, data);
        } catch (e) {
            console.error(e);
        }
    }
    merge(value: Partial<ValueType>) {
        const data = this.load();
        this.save({ ...data, ...value } as ValueType);
    }
}