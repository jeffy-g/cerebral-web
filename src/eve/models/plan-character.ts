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
import { SkillDB } from "@eve/models/eve-skills";
import * as CharProvider from "./char-provider";
import * as constants from "./constants";
declare global {
    type EVECharacterAttributesFragment = Flip<EVECharacterAttributes, "bonus_remaps" | "accrued_remap_cooldown_date" | "last_remap_date">;
    interface IPlanCharacter {
        attributes: EVECharacterAttributesFragment;
        lastRemap: number;
        queue: PlanQueueItem[];
        reset(newQueue?: PlanQueueItem[]): void;
        addItemToQueue(sqItem: PlanQueueItem): void;
        addItemsToQueue(sqItems: PlanQueueItem[]): void;
    }
    type NoteItem = {
        details: string;
    };
    type RemapItem = {
        attributes: EVECharacterAttributesFragment;
        implants: number;
    };
    type SkillItem = {
        id: number;
        level: number;
        name: string;
        sp: number;
        spTotal: number;
        spHour: number;
        time: number;
        lastRemap: number;
        required_skills: Requiredskill[];
        pattr: string;
        sattr: string;
        attributeTitle: string;
    };
    type SkillItemKindMap = {
        skill: SkillItem;
        remap: RemapItem;
        note: NoteItem;
    };
    type QueueItemKind<TToken extends keyof SkillItemKindMap> = SkillItemKindMap[TToken] & {
        type: TToken;
        title: string;
    };
    type PlanQueueItem = QueueItemKind<"skill"> | QueueItemKind<"remap"> | QueueItemKind<"note">;
    type PlanSkillEntry = {
        trained_skill_level?: number;
        skillpoints_in_skill?: number;
        planned_skill_level?: number;
        planned_skillpoints_in_skill?: number;
    } & SkillDataBaseEntry;
}
const skillRegistry: Record<string, SkillDataBaseEntry> = SkillDB.skills;
const ATTRIBUTE_KEYS = constants.ATTRIBUTE_KEYS;
class InvalidCharacterIdError extends Error {}
const VOID = void 0;
function processRemapItem(
    pc: IPlanCharacter, attributes: EVECharacterAttributesFragment, implants: number,
    index: number = -1,
    update: boolean = false
) {
    const cpyAttrs = {...attributes} as EVECharacterAttributesFragment;
    ATTRIBUTE_KEYS.forEach((attribute) => {
        cpyAttrs[attribute] += implants;
    });
    pc.attributes = cpyAttrs;
    const remapItem: QueueItemKind<"remap"> = {
        attributes: {...attributes},
        implants,
        type: "remap",
        title: `Remap - P${cpyAttrs.perception} M${cpyAttrs.memory} W${cpyAttrs.willpower} I${cpyAttrs.intelligence} C${cpyAttrs.charisma}`,
    };
    if (index !== -1) {
        const newQueue = pc.queue.slice();
        pc.reset();
        if (update) {
            newQueue[index] = remapItem;
        } else {
            newQueue.splice(index, 0, remapItem);
        }
        pc.addItemsToQueue(newQueue);
    } else {
        pc.lastRemap = 0;
        pc.queue.push(remapItem);
    }
}
export class PlanCharacter implements IPlanCharacter {
    private origin: IEVECharacter;
    attributes!: EVECharacterAttributesFragment;
    lastRemap!: number;
    time!: number;
    queue!: PlanQueueItem[];
    skills!: NumberMap<PlanSkillEntry>;
    bannedSkills?: number[] = void 0;
    bannedSkill?: number = void 0;
    bannedSkillLevel?: number = void 0;
    constructor(charId: EVEId) {
        if (CharProvider.isCharacterAvailable(charId)) {
            this.origin = CharProvider.getCharacter(charId)!;
            this.init();
        } else {
            throw new InvalidCharacterIdError(`Missing character id, value=${charId}`);
        }
    }
    private restWithAttributes(origin?: IEVECharacter, now: number = Date.now(), newQueue?: PlanQueueItem[]) {
        origin === void 0 && (origin = this.origin);
        const characterAttributes = {...origin.attributes};
        this.lastRemap = characterAttributes.last_remap_date !== VOID ? (now - (+new Date(characterAttributes.last_remap_date))) : 0;
        this.attributes = characterAttributes;
        this.queue = newQueue || [];
        this.time = 0;
    }
    private init() {
        const origin = this.origin;
        const now = Date.now();
        this.restWithAttributes(origin, now);
        const copySkills = onil() as Record<number, PlanSkillEntry>;
        const currentSkill = origin.getCurrentTrainingSkill();
        const finishedSkills = origin.getFinishedSkillsInQueue(now);
        const stypeIds = Object.keys(skillRegistry);
        this.skills = copySkills;
        for (let index = 0, end = stypeIds.length; index < end;) {
            const sid = +(stypeIds[index++]);
            const cpyskill: PlanSkillEntry = {
                ...skillRegistry[sid],
                trained_skill_level: 0, skillpoints_in_skill: 0
            };
            copySkills[sid] = cpyskill;
            const trainedSkill = origin.skills.find(s => s.skill_id === sid);
            if (trainedSkill) {
                let trainedSkillLevel = trainedSkill.trained_skill_level;
                let skillPointsInSkill = trainedSkill.skillpoints_in_skill;
                if (currentSkill && currentSkill.skill_id === sid) {
                    const additionalTrainedSp = (now - (+new Date(currentSkill.start_date))) * origin.getCurrentSpPerMillisecond();
                    skillPointsInSkill = (currentSkill.training_start_sp + additionalTrainedSp);
                } else if (finishedSkills.length) {
                    const finishedSkill = finishedSkills.find(o => o.skill_id === sid);
                    if (finishedSkill) {
                        trainedSkillLevel = finishedSkill.finished_level;
                        skillPointsInSkill = finishedSkill.level_end_sp;
                    }
                }
                cpyskill.trained_skill_level = trainedSkillLevel;
                cpyskill.skillpoints_in_skill = skillPointsInSkill;
            }
            cpyskill.planned_skill_level = 0;
            cpyskill.planned_skillpoints_in_skill = 0;
        }
    }
    getOrigin() {
        return this.origin;
    }
    get characterId(): string {
        const c = this.origin;
        return c.character_id || "0";
    }
    reset(newQueue?: PlanQueueItem[]) {
        this.restWithAttributes(void 0, void 0, newQueue);
        const skills = this.skills;
        const skillIDs = Object.keys(skills);
        for (let index = 0, end = skillIDs.length; index < end;) {
            const skill = skills[
                skillIDs[index++] as unknown as number
            ];
            skill.planned_skill_level = 0;
            skill.planned_skillpoints_in_skill = 0;
        }
    }
    addItemToQueue(sqItem: PlanQueueItem) {
        if (sqItem.type === "skill") {
            this.planSkill(sqItem.id, sqItem.level);
        } else if (sqItem.type === "remap") {
            this.addRemap(sqItem.attributes, sqItem.implants);
        } else {
            this.addNote(sqItem.title, sqItem.details);
        }
    }
    addItemsToQueue(sqItems: PlanQueueItem[]) {
        for (const sqItem of sqItems) {
            this.addItemToQueue(sqItem);
        }
    }
    canMoveSkillToPosition(oldIndex: number, newIndex: number): boolean {
        const skillToMove = this.queue[oldIndex] as QueueItemKind<"skill">;
        if (skillToMove.type !== "skill") {
            return false;
        }
        let illegalMove = false;
        if (oldIndex < newIndex) {
            const queueSubset = this.queue.slice(oldIndex + 1, newIndex + 1) as QueueItemKind<"skill">[];
            illegalMove = queueSubset.some((skill) => {
                if (skill.type !== "skill") {
                    return true;
                }
                if (skill.id === skillToMove.id && skill.level > skillToMove.level) {
                    return true;
                }
                if (skill.required_skills.length > 0
                    && skill.required_skills.some(
                        req => req.id === skillToMove.id && req.level >= skillToMove.level,
                    )) {
                    return true;
                }
                return false;
            });
        } else {
            const queueSubset = this.queue.slice(newIndex, oldIndex).reverse() as QueueItemKind<"skill">[];
            illegalMove = queueSubset.some((skill) => {
                if (skill.type !== "skill") {
                    return true;
                }
                if (skillToMove.id === skill.id && skill.level < skillToMove.level) {
                    return true;
                }
                if (skillToMove.required_skills.length > 0 &&
                    skillToMove.required_skills.some(
                        req => req.id === skill.id && skill.level <= req.level
                    )
                ) {
                    return true;
                }
                return false;
            });
        }
        return !illegalMove;
    }
    moveQueuedItemByPosition(oldIndex: number, newIndex: number, forceMoveByRebuild: boolean) {
        const canMove = this.canMoveSkillToPosition(oldIndex, newIndex);
        const q = canMove? this.queue: forceMoveByRebuild? this.queue.slice(): void 0;
        if (q) {
            if (newIndex >= q.length) {
                (<any[]>q).fill(void 0, q.length, newIndex);
            }
            q.splice(newIndex, 0, q.splice(oldIndex, 1)[0]);
            if (forceMoveByRebuild) {
                this.reset();
                this.addItemsToQueue(q);
            }
        }
    }
    moveQueuedItemsByPosition(oldIndex: number,  newIndex: number, itemsToMove: number[]) {
        if (itemsToMove.length > 0) {
            const newQueue = this.queue.slice();
            let nIndex = newIndex;
            const itemsToInsert: typeof newQueue = [];
            for (let i = itemsToMove.length - 1; i >= 0;) {
                const index = itemsToMove[i--];
                if (index < nIndex && index !== oldIndex) {
                    nIndex--;
                }
                itemsToInsert.unshift(newQueue[index]);
                newQueue.splice(index, 1);
            }
            for (let i = 0, k = 0, l = itemsToInsert.length; i < l;) {
                newQueue.splice(nIndex + (k++), 0, itemsToInsert[i++]);
            }
            this.reset();
            this.addItemsToQueue(newQueue);
        }
    }
    addNote(title: string, details: string, index?: number) {
        if (title !== VOID) {
            const item: QueueItemKind<"note"> = {
                details,
                title,
                type: "note",
            };
            const q = this.queue;
            if (index !== void 0) {
                q.splice(index, 0, item);
            } else {
                q.push(item);
            }
        }
    }
    editNoteAtPosition(title: string, details: string, index: number) {
        if (title !== VOID && details !== VOID && index !== VOID) {
            const note = this.queue[index];
            if (note && note.type === "note") {
                note.details = details;
                note.title = title;
            }
        }
    }
    isQueueItemTypeOf(index: number, type: keyof SkillItemKindMap) {
        return this.queue[index]?.type === type;
    }
    addRemap(attributes: EVECharacterAttributesFragment, implants: number, index?: number) {
        processRemapItem(this, attributes, implants, index);
    }
    editRemapAtPosition(attributes: EVECharacterAttributesFragment, implants: number, index: number) {
        if (this.queue[index].type === "remap") {
            processRemapItem(this, attributes, implants, index, true);
        }
    }
    getSuggestedAttributesForRemapAt(
        index: number,
        implantBonus: number = (this.queue[index] as QueueItemKind<"remap">).implants
    ) {
        const q = this.queue;
        let lastIndex = q.length;
        for (let i = index + 1, len = lastIndex; i < len; i++) {
            if (q[i].type === "remap") {
                lastIndex = i;
                break;
            }
        }
        const IneligibleSkills = q.slice(0, index);
        const skillsToRemap = q.slice(index + 1, lastIndex);
        const attributes = ATTRIBUTE_KEYS.reduce((acc, attributeKey) => {
            return acc[attributeKey] = 17 + implantBonus, acc;
        }, onil() as EVECharacterAttributesFragment);
        const rpc = new PlanCharacter(this.characterId);
        rpc.queue = IneligibleSkills.slice();
        type TTimeOrder = {
            [0]: EVECharacterAttributesKeys;
            [1]: number;
        } & Array<any>;
        let availablePoints = 14;
        do {
            const times: TTimeOrder[] = [];
            ATTRIBUTE_KEYS.forEach(attributeKey => {
                const refAttrs = { ...attributes };
                rpc.attributes = refAttrs;
                refAttrs[attributeKey] += 1;
                skillsToRemap.forEach(skill => {
                    skill.type === "skill" && rpc.planSkill(skill.id, skill.level);
                });
                refAttrs[attributeKey] -= 1;
                times.push([attributeKey, rpc.time]);
                rpc.reset(
                    IneligibleSkills.slice()
                );
            });
            const order = times.sort((a, b) => {
                const diff = a[1] - b[1];
                return diff < 0? -1: +(diff > 0);
            });
            const attrKey = order[0][0];
            if (attributes[attrKey] < 27 + implantBonus) {
                attributes[attrKey] += 1;
            } else {
                attributes[order[1][0]] += 1;
            }
        } while (--availablePoints);
        ATTRIBUTE_KEYS.forEach((attribute) => {
            attributes[attribute] -= implantBonus;
        });
        return attributes;
    }
    planSkill(typeId: number, lvl: number, preReqLvl?: number) {
        const skill = this.skills[typeId] as Required<PlanSkillEntry>;
        if (
            skill && (
                (skill.trained_skill_level < lvl && skill.planned_skill_level < lvl) || lvl === 0
            )
        ) {
            const currentLvl = skill.trained_skill_level > skill.planned_skill_level ? skill.trained_skill_level : skill.planned_skill_level;
            if (skill.rq_skills.length > 0) {
                skill.rq_skills.forEach((requiredSkill) => {
                    const targetLvl = preReqLvl !== VOID && preReqLvl > requiredSkill.level ? preReqLvl : requiredSkill.level;
                    if (!(this.bannedSkills !== VOID && this.bannedSkills.includes(requiredSkill.id))) {
                        if (
                            !(this.bannedSkill !== VOID && this.bannedSkill === requiredSkill.id && this.bannedSkillLevel! <= requiredSkill.level)
                        ) {
                            this.planSkill(requiredSkill.id, targetLvl, preReqLvl);
                        } else {
                            if (this.bannedSkills === VOID) {
                                this.bannedSkills = [];
                            }
                            this.bannedSkills.push(skill.tid);
                        }
                    } else {
                        if (this.bannedSkills === VOID) {
                            this.bannedSkills = [];
                        }
                        this.bannedSkills.push(skill.tid);
                    }
                });
            }
            let spPerHour = (this.attributes[skill.p_attr] + (this.attributes[skill.s_attr] / 2)) * 60;
            if (!this.origin.isOmega()) {
                spPerHour *= 0.5;
            }
            for (let i = currentLvl + 1; i <= lvl; i++) {
                if (
                    !(this.bannedSkills !== VOID && this.bannedSkills.includes(skill.tid)) && !(
                        (this.bannedSkill !== VOID && this.bannedSkill === skill.tid) &&
                        (this.bannedSkillLevel !== VOID && this.bannedSkillLevel <= i)
                    )
                ) {
                    const currentSP = skill.skillpoints_in_skill > skill.planned_skillpoints_in_skill ? skill.skillpoints_in_skill : skill.planned_skillpoints_in_skill;
                    const spForLevel = 250 * skill.ttm * (Math.sqrt(32) ** (i - 1));
                    const missingSPforLevel = spForLevel - currentSP;
                    const time = missingSPforLevel * (3600 / spPerHour) * 1e3;
                    this.time += time;
                    this.lastRemap += time;
                    skill.planned_skill_level = i;
                    skill.planned_skillpoints_in_skill = spForLevel;
                    this.queue.push({
                        id: typeId,
                        type: "skill",
                        name: skill.name,
                        level: i,
                        title: `${skill.name} ${i}`,
                        sp: missingSPforLevel,
                        spTotal: spForLevel,
                        spHour: spPerHour,
                        lastRemap: this.lastRemap,
                        pattr: skill.p_attr,
                        sattr: skill.s_attr,
                        attributeTitle: `${skill.p_attr.substring(0, 3)}/${skill.s_attr.substring(0, 3)}`,
                        required_skills: skill.rq_skills,
                        time,
                    });
                }
            }
        }
    }
    removeItemByPosition(index: number) {
        const newQueue: PlanQueueItem[] = this.queue.slice();
        const qitem = newQueue[index];
        if (qitem.type !== "skill") {
            newQueue.splice(index, 1);
        } else {
            this.bannedSkills = [];
            this.bannedSkill = qitem.id;
            this.bannedSkillLevel = qitem.level;
        }
        this.reset();
        this.addItemsToQueue(newQueue);
        if (qitem.type === "skill") {
            this.bannedSkills = VOID;
            this.bannedSkill = VOID;
            this.bannedSkillLevel = VOID;
        }
    }
}