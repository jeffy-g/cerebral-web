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
import { Character as c } from "./character";
export const getCharacterClass = () => {
    return c;
};
export const getCharacter = (charId: EVEId): IEVECharacter | undefined => {
    return c.get(charId);
};
export const getCharactersMap = (): Record<string, IEVECharacter> => {
    return c.getAll();
};
export const getCharacterName = (charId: EVEId): string | "unknown" => {
    const char = getCharacter(charId);
    return char === void 0? "unknown": char.name;
};
export const getCharacterProperyOf = <K extends NonFunctionPropertyNames<IEVECharacter>>(
    charId: EVEId, propertyName: K
): IEVECharacter[K] | undefined => {
    const char = c.get(charId);
    return char? char[propertyName]: void 0;
};
export const isCharacterAvailable = (charId: EVEId): boolean => {
    return getCharacter(charId) !== void 0;
};
export const getTotalFund = () => {
    const characters = c.getCharacters();
    let total = 0;
    for (let index = 0, len = characters.length; index < len;) {
        total += characters[index++].balance;
    }
    return total;
};