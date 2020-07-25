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
import * as mf from "@util/misc-functions";
import { IESIClient } from "@eve/api/esi-client";
export type ESIResponseProcessor<T> = (char: IEVECharacter, data: T, esi?: IESIClient) => Promise<void>;
type EmptyProcessor = () => void;
type ESIRequestParam = {
    endpoint: string;
    bindName?: string;
    handler?: ESIResponseProcessor<any> | EmptyProcessor | null;
    esiQuery?: Record<string, any>;
};
export type SimplifiedESIRequestEntry = {
    interval: number;
    operationId: string;
    summary: string;
    context: ESIRequestParam
    scope?: string;
};
type EVEESIRequestConfig = {
    requestEntries: SimplifiedESIRequestEntry[];
    knownScopes: Record<string, string>;
};
export function lookUpRequestByOperationId(operationId: string, copy: boolean = true): SimplifiedESIRequestEntry {
    for (let e of ESIRequestConfig.requestEntries) {
        if (e.operationId === operationId) {
            if (copy) {
                e = mf.deepClone(e);
                e.context.endpoint = "latest" + e.context.endpoint;
            }
            return e;
        }
    }
    throw new Error(`invalid operationId: ${operationId}`);
}
const operationsNotTask = [
    "get_characters_character_id_assets",
];
type TESIRequestEntriesParam = {
    forTask: boolean,
    shouldCopy: boolean
};
export function getESIRequestEnties(
    options?: TESIRequestEntriesParam
): SimplifiedESIRequestEntry[] {
    const copyEntries: SimplifiedESIRequestEntry[] = [];
    const { forTask = true, shouldCopy = true } = options || onil<TESIRequestEntriesParam>();
    outer: for (let e of ESIRequestConfig.requestEntries) {
        if (forTask) {
            for (const excludeTag of operationsNotTask) {
                if (e.operationId === excludeTag) {
                    continue outer;
                }
            }
        }
        if (shouldCopy) {
            e = mf.deepClone(e);
            e.context.endpoint = "latest" + e.context.endpoint;
        }
        copyEntries.push(e);
    }
    return copyEntries;
}
export function getRefreshInterval(operationId: string, asMs: boolean = false): number {
    const { interval } = lookUpRequestByOperationId(operationId, false);
    return asMs? interval * 1000: interval;
}
export type SimplifiedEntry = {
    interval: number;
    summary: string;
};
export type SimplifiedEntryMap = {
    [operationId: string]: SimplifiedEntry;
};
export function getSimplifiedEntries(): SimplifiedEntryMap {
    const entries = getESIRequestEnties({ forTask: false, shouldCopy: false });
    const entriesNoContext: SimplifiedEntryMap = onil();
    for (const e of entries) {
        entriesNoContext[e.operationId] = {
            interval: e.interval,
            summary: e.summary
        };
    }
    return entriesNoContext;
}
export function getKnownScopes<W extends undefined | false, T extends (W extends undefined? string[]: Record<string, string>)>(tokens?: W): T {
    tokens === void 0 && (tokens = true as W);
    return <T>(tokens ? Object.keys(ESIRequestConfig.knownScopes) : ESIRequestConfig.knownScopes);
}
const ESIRequestConfig: EVEESIRequestConfig = {
    requestEntries: [
        {
            interval: 3600,
            operationId: "get_alliances_alliance_id",
            summary: "Get alliance information",
            context: {
                bindName: "alliance",
                endpoint: "/alliances/{alliance_id}/"
            }
        },
        {
            interval: 86400,
            operationId: "get_characters_character_id",
            summary: "Get character's public information",
            context: {
                handler: null,
                endpoint: "/characters/{character_id}/"
            }
        },
        {
            interval: 3600,
            operationId: "get_corporations_corporation_id",
            summary: "Get corporation information",
            context: {
                bindName: "corporation",
                endpoint: "/corporations/{corporation_id}/"
            }
        },
        {
            interval: 3600,
            operationId: "get_characters_character_id_agents_research",
            summary: "Get agents research",
            context: {
                bindName: "agents_research",
                endpoint: "/characters/{character_id}/agents_research/"
            },
            scope: "esi-characters.read_agents_research.v1"
        },
        {
            interval: 3600,
            operationId: "get_characters_character_id_assets",
            summary: "Get character assets",
            context: {
                handler: null,
                endpoint: "/characters/{character_id}/assets/"
            },
            scope: "esi-assets.read_assets.v1"
        },
        {
            interval: 120,
            operationId: "get_characters_character_id_attributes",
            summary: "Get character attributes",
            context: {
                bindName: "attributes",
                endpoint: "/characters/{character_id}/attributes/"
            },
            scope: "esi-skills.read_skills.v1"
        },
        {
            interval: 120,
            operationId: "get_characters_character_id_clones",
            summary: "Get clones",
            context: {
                handler: null,
                endpoint: "/characters/{character_id}/clones/"
            },
            scope: "esi-clones.read_clones.v1"
        },
        {
            interval: 300,
            operationId: "get_characters_character_id_contacts",
            summary: "Get contacts",
            context: {
                bindName: "contacts",
                endpoint: "/characters/{character_id}/contacts/"
            },
            scope: "esi-characters.read_contacts.v1"
        },
        {
            interval: 300,
            operationId: "get_characters_character_id_contacts_labels",
            summary: "Get contact labels",
            context: {
                bindName: "contacts_labels",
                endpoint: "/characters/{character_id}/contacts/labels/"
            },
            scope: "esi-characters.read_contacts.v1"
        },
        {
            interval: 300,
            operationId: "get_characters_character_id_contracts",
            summary: "Get contracts",
            context: {
                handler: null,
                endpoint: "/characters/{character_id}/contracts/"
            },
            scope: "esi-contracts.read_character_contracts.v1"
        },
        {
            interval: 300,
            operationId: "get_characters_character_id_fatigue",
            summary: "Get jump fatigue",
            context: {
                bindName: "fatigue",
                endpoint: "/characters/{character_id}/fatigue/"
            },
            scope: "esi-characters.read_fatigue.v1"
        },
        {
            interval: 300,
            operationId: "get_characters_character_id_fittings",
            summary: "Get fittings",
            context: {
                bindName: "fittings",
                endpoint: "/characters/{character_id}/fittings/"
            },
            scope: "esi-fittings.read_fittings.v1"
        },
        {
            interval: 120,
            operationId: "get_characters_character_id_implants",
            summary: "Get active implants",
            context: {
                handler: null,
                endpoint: "/characters/{character_id}/implants/"
            },
            scope: "esi-clones.read_implants.v1"
        },
        {
            interval: 300,
            operationId: "get_characters_character_id_industry_jobs",
            summary: "List character industry jobs",
            context: {
                bindName: "industry_jobs",
                esiQuery: {
                    include_completed: true
                },
                endpoint: "/characters/{character_id}/industry/jobs/"
            },
            scope: "esi-industry.read_character_jobs.v1"
        },
        {
            interval: 60,
            operationId: "get_characters_character_id_location",
            summary: "Get character location",
            context: {
                handler: null,
                endpoint: "/characters/{character_id}/location/"
            },
            scope: "esi-location.read_location.v1"
        },
        {
            interval: 3600,
            operationId: "get_characters_character_id_loyalty_points",
            summary: "Get loyalty points",
            context: {
                handler: null,
                endpoint: "/characters/{character_id}/loyalty/points/"
            },
            scope: "esi-characters.read_loyalty.v1"
        },
        {
            interval: 60,
            operationId: "get_characters_character_id_mail",
            summary: "Return mail headers",
            context: {
                handler: null,
                endpoint: "/characters/{character_id}/mail/"
            },
            scope: "esi-mail.read_mail.v1"
        },
        {
            interval: 60,
            operationId: "get_characters_character_id_mail_labels",
            summary: "Get mail labels and unread counts",
            context: {
                bindName: "mailLabels",
                endpoint: "/characters/{character_id}/mail/labels/"
            },
            scope: "esi-mail.read_mail.v1"
        },
        {
            interval: 120,
            operationId: "get_characters_character_id_mail_lists",
            summary: "Return mailing list subscriptions",
            context: {
                handler: null,
                endpoint: "/characters/{character_id}/mail/lists/"
            },
            scope: "esi-mail.read_mail.v1"
        },
        {
            interval: 60,
            operationId: "get_characters_character_id_online",
            summary: "Get character online",
            context: {
                bindName: "online",
                endpoint: "/characters/{character_id}/online/"
            },
            scope: "esi-location.read_online.v1"
        },
        {
            interval: 1200,
            operationId: "get_characters_character_id_orders",
            summary: "List open orders from a character",
            context: {
                bindName: "orders",
                endpoint: "/characters/{character_id}/orders/"
            },
            scope: "esi-markets.read_character_orders.v1"
        },
        {
            interval: 3600,
            operationId: "get_characters_character_id_orders_history",
            summary: "List historical orders by a character",
            context: {
                bindName: "orders_history",
                endpoint: "/characters/{character_id}/orders/history/"
            },
            scope: "esi-markets.read_character_orders.v1"
        },
        {
            interval: 60,
            operationId: "get_characters_character_id_ship",
            summary: "Get current ship",
            context: {
                handler: null,
                endpoint: "/characters/{character_id}/ship/"
            },
            scope: "esi-location.read_ship_type.v1"
        },
        {
            interval: 120,
            operationId: "get_characters_character_id_skillqueue",
            summary: "Get character's skill queue",
            context: {
                handler: null,
                endpoint: "/characters/{character_id}/skillqueue/"
            },
            scope: "esi-skills.read_skillqueue.v1"
        },
        {
            interval: 120,
            operationId: "get_characters_character_id_skills",
            summary: "Get character skills",
            context: {
                handler: null,
                endpoint: "/characters/{character_id}/skills/"
            },
            scope: "esi-skills.read_skills.v1"
        },
        {
            interval: 120,
            operationId: "get_characters_character_id_wallet",
            summary: "Get a character's wallet balance",
            context: {
                bindName: "balance",
                endpoint: "/characters/{character_id}/wallet/"
            },
            scope: "esi-wallet.read_character_wallet.v1"
        },
        {
            interval: 3600,
            operationId: "get_characters_character_id_wallet_journal",
            summary: "Get character wallet journal",
            context: {
                bindName: "wallet_journal",
                endpoint: "/characters/{character_id}/wallet/journal/"
            },
            scope: "esi-wallet.read_character_wallet.v1"
        },
        {
            interval: 3600,
            operationId: "get_characters_character_id_wallet_transactions",
            summary: "Get wallet transactions",
            context: {
                bindName: "wallet_transactions",
                endpoint: "/characters/{character_id}/wallet/transactions/"
            },
            scope: "esi-wallet.read_character_wallet.v1"
        }
    ],
    knownScopes: {
        "esi-assets.read_assets.v1": "Return a list of the characters assets",
        "esi-assets.read_corporation_assets.v1": "Return a list of the corporation assets",
        "esi-characters.read_agents_research.v1": "Return a list of agents research information for a character.",
        "esi-characters.read_contacts.v1": "Read character contacts and contacts labels",
        "esi-characters.read_fatigue.v1": "Return a character’s jump activation and fatigue information",
        "esi-characters.read_loyalty.v1": "Return a list of loyalty points for all corporations the character has worked for",
        "esi-clones.read_clones.v1": "A list of the character’s clones",
        "esi-clones.read_implants.v1": "Return implants on the active clone of a character",
        "esi-contracts.read_character_contracts.v1": "Returns contracts available to a character",
        "esi-fittings.read_fittings.v1": "Return fittings of a character",
        "esi-fittings.write_fittings.v1": "Delete a fitting from a character",
        "esi-industry.read_character_jobs.v1": "List industry jobs placed by a character etc",
        "esi-location.read_location.v1": "Information about the characters current location",
        "esi-location.read_online.v1": "Checks if the character is currently online",
        "esi-location.read_ship_type.v1": "Get the current ship type, name and id",
        "esi-mail.organize_mail.v1": "organize mail of character",
        "esi-mail.read_mail.v1": "Return the 50 most recent mail headers belonging to the character that match the query criteria",
        "esi-mail.send_mail.v1": "Create and send a new mail",
        "esi-markets.read_character_orders.v1": "List open market orders placed by a character",
        "esi-markets.structure_markets.v1": "Return all orders in a structure",
        "esi-search.search_structures.v1": "Search for entities that match a given sub-string.",
        "esi-skills.read_skillqueue.v1": "List the configured skill queue for the given character",
        "esi-skills.read_skills.v1": "List all trained skills for the given character",
        "esi-ui.write_waypoint.v1": "Set a solar system as waypoint.",
        "esi-universe.read_structures.v1": "Read Dockable Structure Information",
        "esi-wallet.read_character_wallet.v1": "Read character’s wallet balance, journal(going 30 days back), transactions"
    }
};