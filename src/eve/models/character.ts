import { Store } from "@util/indexed-db-store";
import * as era from "@eve/api/esi-request-aggregator";
import { getJWTPayload } from "@eve/oauth/oauth-client";
import * as Auth from "./auth-provider";
import * as Cfg from "@/raw-configs";
import * as mf from "@util/misc-functions";
import * as constants from "@eve/models/constants";
import * as DateTimeUtil from "@util/date-time-util";
import * as region from "./region";
import * as Extras from "@com/tiny/extras";
import { alphaSkillMap, TAlphaSkillMapKey } from "./alphaskill-map";
declare global {
    type TEVECharacter = InterfaceType<typeof C>;
    type IEVECharacter = InterfaceType<TEVECharacter["prototype"]>;
}
let rqp: IESIRequestProgress;
const DEBUG = true;
const log = console.log;
const INFO = mf.getLogStyle("info");
const LIGHTWARN = mf.getLogStyle("lightwarn");
const KEY_NAME = "characters";
let charRegistry: UndefableStringMap<IEVECharacter>;
let store: Store<Record<string, IEVECharacter>>;
const subscribedComponents: React.Component<{}, EVEComponentStateBase>[] = [];
let bTaskRunning = false;
let bTaskEnable = false;
let bDebugLog: boolean;
const esiLog = (message?:any, ...args: any[]) => {
    bDebugLog && log(message, ...args);
};
const beforeInquiries = async (newcomer: boolean) => {
    if (
        constants.isCriticalDowntimeZone()
    ) {
        log("%c- Its time for maintenance to start, so we cancel the task execution. -", LIGHTWARN);
        return false;
    }
    let msg: string | undefined;
    const esiOk = await EVEStatus.isCurrentEnabled();
    if (bTaskEnable) {
        if (bTaskRunning) {
            msg = "%c- Previous task is not yet complete? -";
        }
        else if (!esiOk) {
            msg = "%c- ESI server is temporarily unavailable -";
        }
    } else {
        msg = "%c- ESI Task disabled -";
    }
    if (msg) {
        log(msg, LIGHTWARN);
        if (
            !bTaskEnable && !newcomer
            ||
            bTaskRunning || !esiOk
        ) {
            return false;
        }
    }
    return true;
};
const afterInquiries = (msg = "done") => {
    bTaskRunning = false;
    era.cleanup();
    era.setPerformanceReportEnable(false);
    esiLog(`%cprocess regularInquiries ${msg}!`, INFO);
    return msg === "done";
};
const parallelProcessing = async (charIds: string[]) => {
    rqp.setStepUnitByAll(charIds);
    const tasks: Promise<void>[] = [];
    for (const charId of charIds) {
        let char: IEVECharacter = charRegistry![charId];
        if (char === void 0) {
            char = new C(charId);
            charRegistry![charId] = char;
        }
        rqp.nextStatge();
        esiLog(`%ccharacter_id=${charId}, start processing...`, INFO);
        tasks.push(
            era.process(char).then(() => {
                esiLog(`%ccharacter_id=${charId}, esi process done.`, INFO);
            }).catch(reason => console.warn(reason))
        );
    }
    await Promise.all(tasks);
};
const serialProcessing = async (charIds: string[]): Promise<void> => {
    for (const charId of charIds) {
        let char: IEVECharacter = charRegistry![charId];
        if (char === void 0) {
            char = new C(charId);
            charRegistry![charId] = char;
        }
        rqp.setStepUnitBy(charId);
        rqp.nextStatge();
        esiLog(`%ccharacter_id=${charId}, start processing...`, INFO);
        try {
            await era.process(char).then(() => {
                esiLog(`%ccharacter_id=${charId}, esi process done.`, INFO);
            });
        } catch (e) {
            log(e);
        }
    }
};
const saveTask = (name: string) => {
    store.set(charRegistry!, KEY_NAME, () => {
        DEBUG && log("EVE character database updated (scheduled by \"%s\")", name);
    });
};
const DUMMY_ONLINE_STATE: EVECharacterOnline = {
    last_login: "-",
    last_logout: "-",
    logins: 0,
    online: false,
};
class C implements EVECharacterData {
    character_id: string = "";
    alliance_id?: number;
    ancestry_id!: number;
    birthday!: DateString;
    bloodline_id!: number;
    corporation_id: number = 0;
    corporation: EVECorporation = {
        name: "unknown corp"
    } as EVECorporation;
    description!: string;
    faction_id?: number;
    gender: string = "";
    name: string = "---";
    race_id: number = 16;
    security_status = 0;
    alliance?: EVEAlliance;
    last_clone_jump_date?: DateString;
    last_station_change_date?: DateString;
    ship!: EVEShip;
    online: EVECharacterOnline = DUMMY_ONLINE_STATE;
    attributes: EVECharacterAttributes = {} as EVECharacterAttributes;
    implants: ImplantData[] = [];
    agents_research: EVEAgentResearch[] = [];
    skills: EVESkillEx[] = [];
    total_sp: number = 0;
    unallocated_sp: number = 0;
    skillQueue: EVESkillQueueEx[] = [];
    fatigue?: EVEFatigue;
    fittings?: EVEFitting[];
    industry_jobs?: EVEIndustryJob[];
    contracts: EVEContracts = [];
    contractSlotsUsed: number = 0;
    contacts?: EVEContact[];
    contacts_labels?: EVEContactLabel[];
    mails?: EVEMailDataEx[];
    mailLabels?: EVEMailLabels;
    mailingLists?: MailingListsData;
    loyalty_points: EVELoyaltyPoints[] = [];
    balance: number = 0;
    location: EVELocation = {
        system_id: 0,
        system: {} as EVESystem
    };
    home_location: EVEHomeLocation = {
        location_id: 0, location_type: "station"
    };
    jumpClones: EVEJumpCloneEx[] = [];
    wallet_journal: EVEWalletJournal[] = [];
    wallet_transactions: EVEWalletTransactions[] = [];
    orders: EVECharacterOrder[] = [];
    orders_history: EVECharacterOrderHistory[] = [];
    constructor(id?: EVEId, name?: string) {
        if (id !== undefined) {
            this.character_id = id + "";
        }
        name && (this.name = name);
    }
    getCurrentLocationDetails() {
        const location = this.location;
        const current = location["location"] && location.location.name || `${location.system.name} (Undocked)`;
        return {
            region: region.lookupRegionWithConstellationNameByConstellationId(location.system.constellation_id),
            currentLocation: current
        };
    }
    saveImmediately() {
        if (charRegistry !== undefined) {
            charRegistry[this.character_id] = this;
            saveTask.reemitDefer(33, null, this.name);
        }
    }
    createSkillTree() {
        const groups: Record<string, EVESkillEx[]> = onil();
        for (const skill of this.skills) {
            let skillGroup = groups[skill.skill_group_name];
            if (!skillGroup) {
                groups[skill.skill_group_name] = skillGroup = [];
            }
            skillGroup.push(skill);
        }
        const groupsArray: SkillGroup[] = [];
        const sorter = (a: EVESkillEx, b: EVESkillEx) => a.skill_name.localeCompare(b.skill_name);
        const reducer = (total: number, skill: EVESkillEx) => total + skill.skillpoints_in_skill;
        for (const name of Object.keys(groups)) {
            const skills = groups[name];
            groupsArray.push({
                name,
                skills,
                total_sp: skills.sort(sorter).reduce(reducer, 0)
            });
        }
        return groupsArray.sort((a, b) => a.name.localeCompare(b.name));
    }
    validateSkills(newSkills: EVESkill[]) {
        const skills = this.skills;
        let last: number;
        if (newSkills && (last = newSkills.length)) {
            if (skills.length !== last) {
                return false;
            }
            const skillProperties = ["active_skill_level", "skillpoints_in_skill", "trained_skill_level"] as (keyof ExcludePick<EVESkill, "skill_id">)[];
            const sprq = constants.SkillPointTable;
            for (let index = 0; index < last;) {
                const nskill = newSkills[index++];
                const cskill = skills.find(sk => nskill.skill_id === sk.skill_id);
                if (!cskill) {
                    return false;
                }
                for (const property of skillProperties) {
                    cskill[property] !== nskill[property] && (cskill[property] = nskill[property]);
                }
                cskill.half_trained = !sprq[cskill.trained_skill_level].includes(cskill.skillpoints_in_skill);
            }
            return true;
        }
        throw new Error("new skill data is invalid!");
    }
    getCurrentTrainingSkill(): TBD<EVESkillQueueEx> {
        const now = new Date();
        const queues = this.skillQueue;
        for (const sk of queues) {
            if (sk.finish_date && (new Date(sk.finish_date) > now)) {
                return sk;
            }
        }
        return undefined;
    }
    getFinishedSkillsInQueue(now?: number): EVESkillQueueEx[] {
        !now && (now = Date.now());
        return this.skillQueue.filter((sk) => {
            return sk.finish_date && (+new Date(sk.finish_date) < now!);
        });
    }
    getMails(): EVEMailData[] | undefined {
        return this.mails;
    }
    getMailLabels(): EVEMailLabels | undefined {
        return this.mailLabels;
    }
    getLastSkill(): EVESkillQueueEx {
        let lastDate = new Date();
        let lastSkill: TBD<EVESkillQueueEx> = void 0;
        for (const sk of this.skillQueue) {
            if (sk.finish_date && (new Date(sk.finish_date) > lastDate)) {
                lastSkill = sk;
                lastDate = new Date(sk.finish_date);
            }
        }
        return <EVESkillQueueEx>lastSkill;
    }
    getCurrentSpPerMillisecond() {
        const current = this.getCurrentTrainingSkill();
        if (!current) {
            return 0;
        }
        return (
            current.level_end_sp - current.training_start_sp
        ) / (
            (+new Date(current.finish_date)) - (+new Date(current.start_date))
        );
    }
    getCurrentSpPerHour() {
        return Math.round(this.getCurrentSpPerMillisecond() * 1000 * 3600);
    }
    getInjectorsReady(baseSp = Cfg.LOWEST_OMEGA_SP) {
        return Math.max(0, ((this.getTotalSp() - baseSp) / Cfg.SP_PER_EXTRACTOR) | 0);
    }
    getNextInjectorDate(baseSp = 5e6): Date {
        const currentSp = this.getTotalSp();
        const nextInjectorTotalSp = baseSp + ((this.getInjectorsReady(baseSp) + 1) * Cfg.SP_PER_EXTRACTOR);
        const spNeeded = nextInjectorTotalSp - currentSp;
        const millisecondsToTrainSp = spNeeded / this.getCurrentSpPerMillisecond();
        return new Date(Date.now() + millisecondsToTrainSp);
    }
    getTotalSp(floor: boolean = true): number {
        const currentSkill = this.getCurrentTrainingSkill();
        let totalSp = this.total_sp;
        if (currentSkill === undefined) {
            return totalSp;
        } else {
            const now = Date.now();
            const finishedSkills = this.getFinishedSkillsInQueue(now);
            if (finishedSkills.length) {
                for (const finishedSkill of finishedSkills) {
                    totalSp += (finishedSkill.level_end_sp - finishedSkill.training_start_sp);
                }
            }
            totalSp += (
                now - (+new Date(currentSkill.start_date))
            ) * this.getCurrentSpPerMillisecond();
        }
        return floor? ~~totalSp: totalSp;
    }
    isOmega(): boolean {
        const skills_local = this.skills;
        if (skills_local.find(o => o.trained_skill_level > o.active_skill_level) !== undefined) {
            return false;
        }
        if (
            skills_local.find(skillData => {
                const alphaLevel = alphaSkillMap[skillData.skill_id as TAlphaSkillMapKey];
                if (alphaLevel === void 0) {
                    return true;
                }
                const activeLevel = skillData.active_skill_level;
                return activeLevel > 0 && activeLevel > alphaLevel;
            }) !== undefined
        ) {
            return true;
        }
        const findHandler = (sk: EVESkillQueue) => +new Date(sk.start_date) > (Date.now() + DateTimeUtil.MS_ONE_DAY) && !!sk.finish_date;
        return this.skillQueue.find(findHandler) !== undefined;
    }
    getFatigueInfo(): TBD<EVEFatigueInfo> {
        const fatigue = this.fatigue;
        if (fatigue === undefined || fatigue.last_jump_date === undefined) {
            return undefined;
        }
        const lastJumpDate = new Date(fatigue.last_jump_date);
        const blueTimerExpiryDate = new Date(fatigue.jump_fatigue_expire_date!);
        const redTimerExpiryDate = new Date(fatigue.last_update_date!);
        const curDate = new Date();
        return {
            last_jump: {
                date: lastJumpDate,
                relative: `${DateTimeUtil.timeSince(lastJumpDate)} ago `,
            },
            blue_timer_expiry: {
                date: blueTimerExpiryDate,
                relative: (blueTimerExpiryDate > curDate) ? DateTimeUtil.timeUntil(blueTimerExpiryDate) : "None",
            },
            red_timer_expiry: {
                date: redTimerExpiryDate,
                relative: (redTimerExpiryDate > curDate) ? DateTimeUtil.timeUntil(redTimerExpiryDate) : "None",
            },
        };
    }
    getCloneJumpAvailable(): { relative: "Now" | string } & PartialPick<DateTimeDistance, "date"> {
        const synchro = this.skills.find(o => o.skill_name === "Infomorph Synchronizing");
        const millisecReduction = synchro ? synchro.active_skill_level * 3600 * 1e3 : 0;
        let nextJumpDate: Date | undefined;
        if (this.last_clone_jump_date) {
            nextJumpDate = new Date(new Date(this.last_clone_jump_date).getTime() + DateTimeUtil.MS_ONE_DAY - millisecReduction);
        }
        return {
            date: nextJumpDate,
            relative: (nextJumpDate && nextJumpDate > new Date()) ? DateTimeUtil.timeUntil(nextJumpDate) : "Now"
        };
    }
    getMaxClones() {
        const psycho = this.skills.find(o => o.skill_name === "Infomorph Psychology");
        if (psycho) {
            const normal = psycho.active_skill_level;
            if (normal === 5) {
                const advPsycho = this.skills.find(o => o.skill_name === "Advanced Infomorph Psychology");
                return advPsycho? normal + advPsycho.active_skill_level: normal;
            }
            return normal;
        }
        return 0;
    }
    getMaxContracts() {
        const contracting = this.skills.find(o => o.skill_name === "Contracting");
        if (contracting !== undefined) {
            return 1 + (contracting.active_skill_level * 4);
        }
        return 1;
    }
    getDateOfBirth() {
        return new Date(this.birthday);
    }
    getNextYearlyRemapDate(): Date|true {
        const remapAvailable = new Date(this.attributes.accrued_remap_cooldown_date);
        return remapAvailable > new Date() ? remapAvailable : true;
    }
    static async regularInquiries(newcomer = false, character_id?: EVEId): Promise<boolean> {
        if (!await beforeInquiries(newcomer)) {
            return false;
        }
        let cids:       string[];
        let config:     typeof EVEApp.Config;
        let updated:    TBD<number>;
        let errorCount: number;
        bTaskRunning = true;
        config = EVEApp.Config;
        bDebugLog = config.get("esiTaskDebug");
        era.setPerformanceReportEnable(
            config.get("esiTaskPerformanceReport")
        );
        cids = character_id? [character_id + ""]: Auth.getEVEOAuthCharacterIds();
        rqp.reset("", cids);
        if (!newcomer) {
            rqp.explain("access token check process is running...");
            console.time("Auth.checkTokenExpiresAll");
            try {
                updated = await Auth.checkTokenExpiresAll(rqp.explain.bind(rqp));
            } catch (e) {
                console.trace("some error occurred at `checkTokenExpiresAll`", e);
                return afterInquiries("failed");
            } finally {
                console.timeEnd("Auth.checkTokenExpiresAll");
            }
            rqp.explain("Access Token check is done, Number of updated access tokens: " + updated);
        }
        C.suspendSubscribers();
        esiLog("%c- start regularInquiries -", INFO);
        await era.beforeProcessing(bDebugLog);
        if (config.get("esiTaskParallelity")) {
            await parallelProcessing(cids);
        } else {
            await serialProcessing(cids);
        }
        errorCount = era.afterProcessed();
        esiLog("%c- all esi request task done -", INFO);
        if (rqp.isDidWork()) {
            Extras.syncEVEAvatarState();
            C.updateStore();
            era.performanceReport();
        }
        C.resumeSubscribers(newcomer);
        setTimeout(() => {
            rqp.explain(errorCount? "⚠️ Some error occurred in ESI request ": "✅ ESI request completed successfully ");
            setTimeout(() => {
                rqp.done();
                rqp.reset.emitDefer(1000, rqp);
            }, 777);
        }, 555);
        return afterInquiries();
    }
    static isTaskRunning() {
        return bTaskRunning;
    }
    static async enableTask(enable: boolean): Promise<void> {
        if (bTaskRunning) {
            log("*********** ESI task running, call waitForTaskDone...");
            await C.waitForTaskDone();
            log("*********** ESI task done.");
            bTaskRunning = false;
        }
        bTaskEnable = enable;
        if (enable) {
            log("%cESI request task available", INFO);
        }
    }
    static isESITaskEnable(): boolean {
        return bTaskEnable;
    }
    static async waitForTaskDone() {
        while (bTaskRunning) {
            await mf.sleep(200);
        }
    }
    static getAll(): Record<string, IEVECharacter> {
        return { ...charRegistry };
    }
    static getCharacterIds(): string[] {
        return Object.keys(charRegistry!);
    }
    static getCharacters(defaultSort: boolean = true) {
        const characters = Object.values(charRegistry!);
        return defaultSort? characters.sort(constants.defaultCharacterComparator): characters;
    }
    static getAllContracts(complete: boolean = false): EVEContractData[] {
        const contracts: EVEContractData[] = [];
        const contractIds: number[] = [];
        const ccs = Cfg.BaseConfig.contract_completed_statuses;
        for (const charId in charRegistry) {
            if (charRegistry[charId]) {
                const char = charRegistry[charId];
                if (char.contracts !== undefined) {
                    for (const contract of char.contracts) {
                        if (complete === true && !ccs.includes(contract.status)) {
                            continue;
                        } else if (complete === false && ccs.includes(contract.status)) {
                            continue;
                        }
                        if (!contractIds.includes(contract.contract_id)) {
                            contracts.push(contract);
                            contractIds.push(contract.contract_id);
                        }
                    }
                }
            }
        }
        return contracts;
    }
    static get(id: string | number): TBD<IEVECharacter> {
        return charRegistry![id as unknown as string];
    }
    static async remove(
        charId: EVEId,
        callback?: ({ name, success }: { name: string, success: boolean }) => void
    ) {
        let success = false;
        if (await Auth.remove(charId)) {
            C.suspendSubscribers();
            const name = charRegistry![charId].name;
            success = delete charRegistry![charId];
            store.set(charRegistry!, KEY_NAME, () => {
                EVEApp.updateSingletonInstance();
                C.resumeSubscribers();
                callback && callback({ name, success });
            });
        }
    }
    static async load(force: boolean = false) {
        const initRegistry = async () => {
            const rowCharDatas: Record<string, EVECharacterData> = await store.getAsync(KEY_NAME, onil());
            const newCharRegistry: Record<string, IEVECharacter> = onil();
            const authCharIds = Auth.getEVEOAuthCharacterIds();
            const charIds = Object.keys(rowCharDatas);
            if (charIds.length > 0) {
                for (const charId of charIds) {
                    if (authCharIds.includes(charId)) {
                        const char = new C();
                        newCharRegistry[charId] = char;
                        Object.assign(char, rowCharDatas[charId]);
                    }
                }
            } else {
                for (const id of authCharIds) {
                    era.esiScheduler.register(id, true);
                    const oauthChar = Auth.getEVEOAuthCharacter(id);
                    const jwtPayload = getJWTPayload(oauthChar.accessToken);
                    newCharRegistry[id] = new C(id, jwtPayload.name);
                }
            }
            charRegistry = newCharRegistry;
        };
        if (store === void 0) {
            store = new Store({
                name: "esi-characters",
                onChangeDatabase: initRegistry
            });
        }
        if (charRegistry === undefined || force) {
            await initRegistry();
        }
        if (rqp === void 0) {
            era.getRequestProgress().then(progress => rqp = progress);
        }
    }
    static updateStore() {
        if (charRegistry !== undefined) {
            store.set(charRegistry, KEY_NAME, () => {
                DEBUG && log("EVE character database updated.");
            });
        }
    }
    static subscribe(
        component: React.Component<{}, EVEComponentStateBase>
    ) {
        if (!subscribedComponents.includes(component)) {
            subscribedComponents.push(component);
        }
    }
    static unsubscribe(component: React.Component<{}, EVEComponentStateBase>) {
        const index = subscribedComponents.findIndex(c => c === component);
        if (index !== -1) {
            subscribedComponents.splice(index, 1);
        }
    }
    static suspendSubscribers(newState = { ticking: false }) {
        for (const component of subscribedComponents) {
            component.setState(newState);
        }
    }
    static resumeSubscribers(newcomer: boolean = false) {
        const characters = C.getCharacters();
        const newState = {
            characters,
            ticking: true,
            newcomer
        };
        for (const component of subscribedComponents) {
            component.setState(newState);
        }
    }
}
export const Character = C;
export const init = async (force: boolean = false): Promise<void> => {
    return Character.load(force).then(() => {
        log("%cESI request task not yet run.", LIGHTWARN);
    });
};
