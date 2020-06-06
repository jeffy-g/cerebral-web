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
import {
    SkinMap, TSkinMapKey
} from "./skin-map";
export const ATTRIBUTE_KEYS = ["perception", "memory", "willpower", "intelligence", "charisma"] as EVECharacterAttributesKeys[];
export const decideCharStateIcon = (char: IEVECharacter, base: string = "./images") => {
    return `${base}/${char.isOmega() ? "omega.png" : "alpha.png"}`;
};
export const ESI_BASE = "https://esi.evetech.net";
const eisu = "https://imageserver.eveonline.com";
export const EVE_IMAGE_SERVER_URL = eisu;
const neisu = "https://images.evetech.net";
export const NEW_EVE_IMAGE_SERVER_URL = neisu;
export const getEVEImageUrl = (
    kinds: "character" | "corporation" | "alliance" | "faction",
    id: EVEId,
    size = 32
) => {
    const path = kinds === "character"? "portrait": "logo";
    return `${neisu}/${kinds}s/${id}/${path}?size=${size}`;
};
export const resolveTypeImageURL = (typeId: number | string, size: number = 32) => {
    const skinNumber: number = SkinMap[typeId as TSkinMapKey];
    if (skinNumber) {
        return `./images/skin-icons/${skinNumber}.png`;
    } else {
        const groupName = lcogn(typeId as unknown as number);
        return `https://images.evetech.net/types/${typeId}/${groupName.includes("Blueprint")? "bpc": "icon"}?size=${size}`;
    }
};
const lcogn = (typeId: number, isCategory = false) => {
    const { typeIDs, groupIDs, categoryIDs } = EVEApp.EVETypeIdMap;
    const gid = typeIDs[typeId];
    if (gid === void 0) {
        return "- Unknown -";
    }
    if (isCategory) {
        return categoryIDs[
            groupIDs[gid].c
        ];
    } else {
        return groupIDs[gid].n;
    }
};
export const lookupCategoryOrGroupName = lcogn;
export const getSkillGroupImagePath = (skillId: number) => {
    const groupName = lcogn(skillId);
    return `./images/skill-groups/${groupName.toLowerCase().replace(" ", "-")}.png`;
};
export const SkillPointTable = [
    [0],
    [250,500,750,1000,1250,1500,1750,2000,2250,2500,2750,3000,3250,3500,3750,4000],
    [1415,2829,4243,5657,7072,8486,9900,11314,12728,14143,15557,16971,18385,19799,21214,22628],
    [8000,16000,24000,32000,40000,48000,56000,64000,72000,80000,88000,96000,104000,112000,120000,128000],
    [45255,90510,135765,181020,226275,271530,316784,362039,407294,452549,497804,543059,588313,633568,678823,724078],
    [256000,512000,768000,1024000,1280000,1536000,1792000,2048000,2304000,2560000,2816000,3072000,3328000,3584000,3840000,4096000]
];
export const isCriticalDowntimeZone = () => {
    const now = new Date();
    const m = now.getUTCMinutes();
    return now.getUTCHours() === 11 && (m >= 0 && m <= 5);
};
type TEVECharacterComparator = (a: IEVECharacter, b: IEVECharacter) => number;
export const defaultCharacterComparator: TEVECharacterComparator = (a , b) => {
    const tsp_a = a.getTotalSp();
    const tsp_b = b.getTotalSp();
    return tsp_a > tsp_b? -1: +(tsp_a < tsp_b);
};
export const calcSkillPointPerHours = (charAttrs: EVECharacterAttributesFragment, skillData: SkillDataBaseEntry) => {
    if (skillData) {
        const primaryAttr = skillData.p_attr;
        const secondaryAttr = skillData.s_attr;
        const pri: number = charAttrs[primaryAttr] || 0;
        const sec: number = charAttrs[secondaryAttr] || 0;
        return (pri + (sec / 2)) * 60;
    }
    return 0;
};
export const calucAgentResearch = (agent: EVEAgentResearch) => {
    const days = (Date.now() - new Date(agent.started_at).getTime()) / (24 * 60 * 60 * 1000);
    return agent.points_per_day * days + agent.remainder_points;
};