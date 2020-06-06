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