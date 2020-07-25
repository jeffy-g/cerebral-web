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
import * as mf from "@util/misc-functions";
import { IdsToNames } from "@eve/ids-to-names";
import * as eur from "./esi-universe-request";
import { SkillPointTable } from "@eve/models/constants";
import { IESIClient } from "./esi-client";
import { BaseConfig } from "@/raw-configs";
export const Universal = eur.Universal;
const {
    Types,
    Station,
    Structure,
    System,
    Location,
} = eur;
const DEBUG = {
    loyalties: 0,
    mails: 0,
};
const _resolveImplant = async (imp: ImplantData) => {
    const eveTypeData = await Types.resolve(imp.id);
    imp.name = eveTypeData.name;
    const dogmaAttrs: DogmaAttribute | undefined = eveTypeData.dogma_attributes?.find(attr => attr.attribute_id === 331);
    if (dogmaAttrs) {
        imp.slot = dogmaAttrs.value;
    }
};
const marshallImplantData = (srcImplantIds: EVEImplantIDs, destImplants: ImplantData[]): Promise<void>[] => {
    const promises: Promise<void>[] = [];
    let index = 0, implantData: ImplantData;
    for (let id: number; id = srcImplantIds[index];) {
        destImplants[index++] = { id } as ImplantData;
    }
    index = 0;
    for (;implantData = destImplants[index];) {
        promises[index++] = _resolveImplant(implantData);
    }
    return promises;
};
const getResolverOf = (location_type: "station" | "structure"): eur.IESIUniverseRequest<EVEStation | EVEStructure> => {
    return location_type === "station" ? Station : Structure;
};
export const get_characters_character_id = async (char: IEVECharacter, info: EVECharacterInfo) => {
    if (info.security_status === void 0) {
        console.warn("character `%s` security_status is undefined...", info.name);
        info.security_status = 0;
    }
    Object.assign(char, info);
    console.log("character_info done, name:", char.name);
};
export const get_characters_character_id_skills = async (char: IEVECharacter, skillData: EVESkills) => {
    if (skillData.unallocated_sp === void 0) {
        skillData.unallocated_sp = 0;
    }
    char.total_sp = skillData.total_sp;
    char.unallocated_sp = skillData.unallocated_sp;
    const skills = skillData.skills;
    if (!char.validateSkills(skills)) {
        const sprq = SkillPointTable;
        const promises: Promise<void>[] = [];
        for (const skl of skills as EVESkillEx[]) {
            promises.push(
                Types.resolve(skl.skill_id).then((res) => {
                    skl.skill_name = res.name;
                    skl.skill_group_name = res.group.name;
                    skl.half_trained = !sprq[skl.trained_skill_level].includes(skl.skillpoints_in_skill);
                })
            );
        }
        char.skills = skills as EVESkillEx[];
        await Promise.all(promises);
    }
};
export const get_characters_character_id_skillqueue = async (char: IEVECharacter, skillQueue: EVESkillQueue[]) => {
    char.skillQueue = skillQueue as EVESkillQueueEx[];
    const promises: Promise<void>[] = [];
    for (const skd of skillQueue as EVESkillQueueEx[]) {
        promises.push(
            Types.resolve(skd.skill_id).then(res => {
                skd.skill_name = res.name;
            })
        );
    }
    await Promise.all(promises);
};
export const get_characters_character_id_ship = async (char: IEVECharacter, ship: EVEShip) => {
    char.ship = ship;
    (<EVETypeEx>ship.type) = await Types.resolve(ship.ship_type_id);
};
export const get_characters_character_id_implants = async (char: IEVECharacter, implantIds: EVEImplantIDs) => {
    const imps: ImplantData[] = [];
    char.implants = imps;
    await Promise.all(
        marshallImplantData(implantIds, imps)
    );
};
export const get_characters_character_id_clones = async (char: IEVECharacter, cloneData: EVEClones, esi?: IESIClient) => {
    char.last_clone_jump_date = cloneData.last_clone_jump_date;
    char.last_station_change_date = cloneData.last_station_change_date;
    const home = cloneData.home_location;
    char.home_location = home;
        const resolver = getResolverOf(home.location_type);
        const locationData = await resolver.resolve(home.location_id, esi);
        if (locationData === undefined) {
            throw new Error("Error: cannot resolve home_location type!");
        }
        home["location"] = locationData;
    let promises: Promise<void>[] = [];
    const jumpClones: EVEJumpCloneEx[] = [];
    char.jumpClones = jumpClones;
    for (const jumpCloneData of cloneData.jump_clones) {
        const jumpClone2: Partial<EVEJumpCloneEx> & { implants: ImplantData[] } = {
            implants: []
        };
        promises = promises.concat(
            marshallImplantData(jumpCloneData.implants, jumpClone2.implants)
        );
        // @ts-ignore Temporary response to "TS2790: The operand of a 'delete' operator must be optional." (200722
        delete jumpCloneData.implants;
        Object.assign(jumpClone2, jumpCloneData);
        jumpClones.push(jumpClone2 as EVEJumpCloneEx);
    }
    for (const jclone2 of jumpClones) {
        const resolver = getResolverOf(jclone2.location_type);
        if (resolver) {
            promises.push(
                resolver.resolve(jclone2.location_id, esi).then(stationOrStructure => {
                    if (stationOrStructure !== undefined) {
                        jclone2.location = stationOrStructure;
                    }
                })
            );
        }
    }
    await Promise.all(promises);
    for (let index = 0, jc: typeof jumpClones[0]; jc = jumpClones[index++];) {
        jc.implants.sort((a, b) => a.slot - b.slot);
    }
};
export const get_characters_character_id_location = async (char: IEVECharacter, locationData: EVELocation, esi?: IESIClient) => {
    char.location = locationData;
    locationData.system_id = locationData.solar_system_id as number;
    locationData.system = await System.resolve(locationData.solar_system_id as number);
    delete locationData.solar_system_id;
    if (locationData.station_id !== undefined) {
        const station = await Station.resolve(locationData.station_id, esi);
        locationData.location = station;
    } else if (locationData.structure_id !== undefined) {
        const structure = await Structure.resolve(locationData.structure_id, esi);
        if (structure !== undefined) {
            locationData.location = structure;
        }
    }
};
export const get_characters_character_id_loyalty_points = async (char: IEVECharacter, loyalties: EVELoyaltyPoints[], esi?: IESIClient) => {
    char.loyalty_points = loyalties;
    if (loyalties.length && esi) {
        await mf.asyncProcess(loyalties, async loyalty => {
            return esi.get<EVECorporation>(`corporations/${loyalty.corporation_id}`, "latest")
                .then(value => { loyalty.corporation = value; });
        }, (values) => {
            loyalties.sort((a, b) => a.corporation.name.localeCompare(b.corporation.name));
            if (DEBUG.loyalties) console.log(values);
        });
    }
};
export const get_characters_character_id_contracts = async (char: IEVECharacter, contractsData: EVEContracts, esi?: IESIClient) => {
    char.contracts = contractsData;
    const resolver = new IdsToNames();
    const ccs = BaseConfig.contract_completed_statuses;
    char.contractSlotsUsed = 0;
    for (const contract of contractsData) {
        resolver.addIds([
            contract.issuer_id,
            contract.issuer_corporation_id,
            contract.assignee_id,
            contract.acceptor_id,
        ]);
        if (
            (!ccs.includes(contract.status))
            && (contract.issuer_id + "" === char.character_id)
            && (contract.for_corporation === false)
            && (contract.availability !== "corporation")
        ) {
            char.contractSlotsUsed += 1;
        }
    }
    resolver.size() > 0 && await resolver.resolve(esi);
    for (const contract of contractsData) {
        contract.issuer = resolver.get(contract.issuer_id);
        contract.issuer_corporation = resolver.get(contract.issuer_corporation_id);
        contract.assignee = resolver.get(contract.assignee_id);
        contract.acceptor = resolver.get(contract.acceptor_id);
        if (contract.start_location_id !== undefined) {
            contract.start_location = await Location.resolve(
                contract.start_location_id, esi, true
            );
        }
        if (contract.end_location_id !== undefined) {
            contract.end_location = await Location.resolve(
                contract.end_location_id, esi, true
            );
        }
    }
};
export const get_characters_character_id_mail_lists = async (char: IEVECharacter, mailingLists: EVEMailingLists[]) => {
    const lists: NumberMap<EVEMailingLists> = onil();
    for (const list of mailingLists) {
        lists[list.mailing_list_id] = list;
    }
    char.mailingLists = lists;
};
const consoleStyle: string = "color:gray ;background-color: #ededed;";
export const get_characters_character_id_mail = async (char: IEVECharacter, mailData: EVEMailDataEx[]) => {
    char.mails = mailData;
    const resolver = new IdsToNames();
    for (const mail of mailData) {
        if (DEBUG.mails) console.info("%cprocessing mail :<%s>", consoleStyle, mail.subject);
        const recipientsFirst = mail.recipients[0];
        if (recipientsFirst.recipient_type === "mailing_list" && recipientsFirst.recipient_id === mail.from) {
            mail.from_name = "Welcome ML";
        } else {
            resolver.addId(mail.from);
        }
        for (const recipient of mail.recipients) {
                switch (recipient.recipient_type) {
                    case "character":
                    case "corporation":
                    case "alliance": resolver.addId(recipient.recipient_id); break;
                    default:
                        break;
                }
        }
        const labelNames: string[] = [];
        const labelDatas: EVEMailLabel[] | undefined = char.mailLabels!.labels;
        if (labelDatas) { for (const labelId of mail.labels) {
            for (const ld of labelDatas) {
                if (ld.label_id === labelId) {
                    labelNames.push(ld.name);
                }
            }
        }
        }
        mail.label_names = labelNames;
        mail.is_sent = !!mail.is_sent;
        mail.is_read = !!mail.is_read;
        mail.subject = mf.normalizeEntity(mail.subject);
    }
    if (DEBUG.mails) console.info("%c - processing mail recipient ids, mail entry count: %d", consoleStyle, mailData.length);
resolver.size() > 0 && await resolver.resolve();
    if (DEBUG.mails) console.info("%c - mail recipient ids solved.", consoleStyle);
    for (const mail of mailData) {
        const md = resolver.get(mail.from);
        if (md !== undefined) {
            mail.from_name = md.name;
        } else if ((<NumberMap<EVEMailingLists>>char.mailingLists)[mail.from] !== undefined) {
            mail.from_name = (<NumberMap<EVEMailingLists>>char.mailingLists)[mail.from].name;
        } else {
            mail.from_name = "*Unknown*";
        }
        for (const recipient of mail.recipients) {
            if (recipient.recipient_type !== undefined && recipient.recipient_id !== undefined) {
                switch (recipient.recipient_type) {
                    case "character":
                    case "corporation":
                    case "alliance": {
                        const data = resolver.get(recipient.recipient_id);
                        recipient.recipient_name = data ? data.name : "*Unknown*";
                    }
                    break;
                    case "mailing_list": {
                        const data = (<NumberMap<EVEMailingLists>>char.mailingLists)[recipient.recipient_id];
                        recipient.recipient_name = data !== undefined ? data.name : "*Unknown Mailing List*";
                    }
                    break;
                    default:
                        recipient.recipient_name = "*Unknown*";
                        break;
                }
            }
        }
        if (DEBUG.mails) console.info("%cmail :<%s>, did assign resolve types.", consoleStyle, mail.subject);
        if (DEBUG.mails) console.info("%cmail :<%s>, done.", consoleStyle, mail.subject);
    }
};