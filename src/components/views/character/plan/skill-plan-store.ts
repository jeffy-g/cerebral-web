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
import { Store } from "@util/indexed-db-store";
import { Timer } from "@util/timer";
declare global {
    type PlanSummary = {
        id: string;
        name: string;
    };
    type PlanData = {
        queue: PlanQueueItem[];
        name: string;
        lastSaved: number;
    };
    type PlanResitry = {
        [uuid: string]: PlanData;
    };
    type CharacterPlans = {
        [eveId: string]: PlanResitry;
    };
    type SkillPlanDataType = {
        version: number;
        plans: CharacterPlans
    };
}
let skillPlans: SkillPlanDataType["plans"];
let rowDataStore: Store<SkillPlanDataType>;
const KEY_NAME = "skillplans-store";
let tol = 0;
const now = (): number => {
    return Date.now();
};
const use = async (force: boolean = false) => {
    tol = now();
    if (skillPlans === void 0 || force) {
        const retrieved = await rowDataStore.getAsync(KEY_NAME);
        if (retrieved !== void 0 && retrieved.version === 1) {
            skillPlans = retrieved.plans;
        } else {
            skillPlans = onil();
        }
    }
};
const task = () => {
    rowDataStore.set({ version: 1, plans: skillPlans }, KEY_NAME);
};
const save = (immediately: boolean = true) => {
    if (skillPlans !== void 0) {
        task.cancelPreviously();
        if (immediately) {
            task();
        } else {
            task.emitDefer(3000);
        }
    }
};
export async function init() {
    if (rowDataStore === void 0) {
        rowDataStore = new Store({
            name: "misc",
            onChangeDatabase: async () => {
                await use(true);
            }
        });
    }
}
const MAINTENANCE_INTERVAL = 20 * 1e3;
const doMaintenance = () => {
    if (skillPlans !== void 0 && (tol + 10000 < now())) {
        save();
        (<TBD<SkillPlanDataType["plans"]>>skillPlans) = void 0;
        console.log("\u2620 SkillPlanStore:: local cache has been purge.");
    }
};
const timer = new Timer({
    interval: MAINTENANCE_INTERVAL,
    runBody: doMaintenance,
    stopBody: save
});
export const run = (): void => {
    timer.run();
    console.log("🏃‍♂️ SkillPlanStore:: maintenance timer running.");
};
export const stop = (): void => {
    timer.stop();
    console.log("⏹️ SkillPlanStore:: maintenance timer has been stop.");
};
    export async function getSkillPlan(characterId: EVEId, planId: string) {
        await use();
        tol = now();
        if (skillPlans[characterId] && skillPlans[characterId][planId]) {
            return skillPlans[characterId][planId];
        }
        return null;
    }
    export async function storeSkillPlan(characterId: EVEId, planId: string, name: string, queue: PlanQueueItem[]) {
        await use();
        let plans = skillPlans[characterId];
        if (plans === void 0) {
            plans = skillPlans[characterId] = onil();
        }
        if (
            /^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/.test(planId)
        ) {
            let plan = plans[planId];
            if (!plan) {
                plan = onil() as PlanData;
            }
            plan.queue = Array.from(queue);
            plan.name = name;
            plan.lastSaved = now();
            plans[planId] = plan;
        }
        tol = now();
        save(false);
    }
    export async function deleteSkillPlan(characterId: EVEId, planId: string) {
        await use();
        if (!skillPlans[characterId] === void 0) {
            skillPlans[characterId] = onil();
        }
        let mustSave = false;
        if (skillPlans[characterId][planId]) {
            mustSave = delete skillPlans[characterId][planId];
        }
        tol = now();
        mustSave && save(false);
        return mustSave;
    }
    export async function doesPlanExist(characterId: EVEId, planId: string) {
        await use();
        if (!skillPlans[characterId]) {
            skillPlans[characterId] = onil();
        }
        return !!skillPlans[characterId][planId];
    }
    export async function containsByName(characterId: EVEId, planName: string) {
        await use();
        let is_same = false;
        const plans = skillPlans[characterId];
        if (plans !== void 0) {
            for (const uuid in plans) {
                if (plans[uuid]) {
                    is_same = plans[uuid].name === planName;
                    if (is_same) {
                        break;
                    }
                }
            }
        }
        tol = now();
        return is_same;
    }
    export async function getSkillPlansForCharacter(characterId: EVEId) {
        await use();
        const summaries: PlanSummary[] = [];
        const plans = skillPlans[characterId];
        if (plans !== void 0) {
            for (const uuid in plans) {
                if (plans[uuid]) {
                    summaries.push({ id: uuid, name: plans[uuid].name });
                }
            }
        }
        tol = now();
        return summaries.sort((a, b) => a.name.localeCompare(b.name));
    }