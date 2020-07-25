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
///<reference types="react"/>
///<reference types="jquery"/>
///<reference path="./basic-types.d.ts"/>
interface DedicatedWorkerGlobalScope {
  onmessage: ((this: DedicatedWorkerGlobalScope, ev: MessageEvent) => any) | null;
  postMessage(message: any): void;
  setInterval(handler: TimerHandler, timeout?: number, ...args: any[]): number;
  clearInterval(handle?: number): void;
}
type LastRefresh = {
    date: Date;
    success: boolean;
    shouldRetry?: boolean;
    error?: any;
};
type ScopeInfo = {
    name: string;
    description: string;
    isGranted: boolean;
};
interface EVESkillEx extends EVESkill {
    skill_name: string;
    skill_group_name: string;
    half_trained: boolean;
}
interface EVESkillQueueEx extends EVESkillQueue {
    skill_name: string;
}
interface SkillGroup {
    name: string;
    skills: EVESkillEx[];
    total_sp: number;
}
interface ImplantData {
    id: number;
    name: string;
    slot: number;
    dogmaAttributes?: {
      attribute_id: number;
      value: number;
    }[];
}
type EVEJumpCloneEx = ExcludePick<EVEJumpClone, "implants"> & {
    implants: ImplantData[];
    location: EVEStation | EVEStructure;
};
type EVEMailBodyEx = EVEMailBody & {
      last_accessed: Date | string;
      links?: string[];
      htmlBody?: string;
      characterIdsAttempted?: EVEId[];
      failed?: boolean;
};
type MailingListsData = Record<string, EVEMailingLists>;
type EVEGroupEco = Pick<EVEGroup, "name" | "group_id" | "category_id">;
type EVETypeEx = EVEType & {
    group: EVEGroupEco;
};
type AssetAdditionalData = {
    name: string;
    group_name: string;
    formal_category_name: string;
    modified_name?: string;
    location?: EVEStructure | UniverseNamesFragmentLocation & {
        position?: {
            x: number;
            y: number;
            z: number;
        };
    };
    v?: number | string;
    pv?: number | string;
};
type EVEAssetEx = EVEAsset & {
    additionalData: AssetAdditionalData;
};
type EVEMailDataEx = EVEMailData & {
  from_name: string;
};
type EVECharacterData = EVECharacterInfo & {
    character_id: EVEId;
    name: string;
    alliance?: EVEAlliance;
    online: EVECharacterOnline;
    attributes: EVECharacterAttributes;
    implants: ImplantData[];
    agents_research: EVEAgentResearch[];
    skills: EVESkillEx[];
    skillQueue: EVESkillQueueEx[];
    fatigue?: EVEFatigue;
    fittings?: EVEFitting[];
    industry_jobs?: EVEIndustryJob[];
    contracts: EVEContracts;
    contractSlotsUsed: number;
    contacts?: EVEContact[];
    contacts_labels?: EVEContactLabel[];
    mails?: EVEMailDataEx[];
    mailLabels?: EVEMailLabels;
    mailingLists?: NumberMap<EVEMailingLists>;
    loyalty_points: EVELoyaltyPoints[];
    balance: number;
    location: EVELocation;
    home_location: EVEHomeLocation;
    ship?: EVEShip;
    jumpClones: EVEJumpCloneEx[];
    total_sp: number;
    last_clone_jump_date?: DateString;
    last_station_change_date?: DateString;
    wallet_journal: EVEWalletJournal[];
    wallet_transactions: EVEWalletTransactions[];
    orders: EVECharacterOrder[];
    orders_history: EVECharacterOrderHistory[];
};
type DateTimeDistance = {
    date: Date;
    relative: string;
};
type EVEFatigueInfo = {
    last_jump: DateTimeDistance;
    blue_timer_expiry: DateTimeDistance;
    red_timer_expiry: DateTimeDistance;
};