import * as EURGarage from "./_esi-universe-request-garage";
import * as NsESI from "./esi-client";
import { restrictor } from "mini-semaphore";
import { MS_ONE_DAY } from "@util/date-time-util";
export type IESIUniverseRequest<T> = EURGarage.IESIUniverseRequest<T>;
export enum LocationTypes {
    Station = 0,
    System,
    Structure,
    Other
}
let KnownStructures: number[];
const fetchStructures = async (force: boolean = false) => {
    if (KnownStructures !== void 0 && !force) {
        return;
    }
    const checkStructureEntries = [
        { id: 1_022_348_007_732, name: "Frarn - Use ICY Sotiyo in system" },
        { id: 1_023_164_547_009, name: "Perimeter - IChooseYou Trade Hub" },
        { id: 1_025_824_394_754, name: "Botane - ICY Market and Industry" },
        { id: 1_028_439_987_377, name: "Frarn - IChooseYou Sotiyo Market" },
    ];
    fetch(`${NsESI.ESI_BASE}/latest/universe/structures`).then(res => res.json() as Promise<number[]>).then(ids => {
        checkStructureEntries.forEach(e => {
            let msg: string;
            if (!ids.includes(e.id)) {
                ids.push(e.id);
                msg = e.name + " added";
            } else {
                msg = e.name + " is well known!";
            }
            console.log(msg);
        });
        KnownStructures = ids.sort();
        console.log("Fetched KnownStructures, size: %s", ids.length);
    });
};
AppStartupHelper.addStartUpTask({
    run() {
        fetchStructures();
    }
});
const STD_REFRESH_INTERVAL = MS_ONE_DAY * 7;
const groupCache: Record<number, EVEGroupEco> = onil();
export const Types = new class Types extends EURGarage.ESIUniverseBase<EVETypeEx> {
    async processResolve(id: EVEId): Promise<EVETypeEx> {
        let etype: EVETypeEx, gid: number; {
            const {
                name,
                type_id,
                group_id,
                description,
                dogma_attributes,
            } = await this.fetchEndpoint<EVEType>(`universe/types/${id}`);
            etype = {
                name,
                type_id,
                group_id,
                description,
                dogma_attributes,
            } as EVETypeEx;
            gid = group_id;
        }
        etype.group = await restrictor.one("g" + gid, async () => {
            let gp: TBD<EVEGroupEco>;
            gp = groupCache[gid];
            if (!gp) {
                const {
                    name, group_id, category_id,
                } = await this.fetchEndpoint<EVEGroupEco>(`universe/groups/${gid}`);
                groupCache[gid] = gp = {
                    name, group_id, category_id,
                };
            }
            return gp;
        });
        this.esiData![id] = etype;
        return etype;
    }
}("types-data", STD_REFRESH_INTERVAL);
export const Station = new class Station extends EURGarage.ESIUniverseBase<EVEStation> {
    async processResolve(id: EVEId): Promise<EVEStation> {
        const station = await this.fetchEndpoint<EVEStation>(`universe/stations/${id}`);
        this.esiData![id] = station;
        station.system = await System.resolve(station.system_id);
        station.type = await Types.resolve(station.type_id);
        delete station.max_dockable_ship_volume;
        return station;
    }
}("stations-data");
export const System = new class System extends EURGarage.ESIUniverseBase<EVESystem> {
    async processResolve(id: EVEId): Promise<EVESystem> {
        const system = await this.fetchEndpoint<EVESystem>(`universe/systems/${id}`);
        delete system.planets;
        delete system.stargates;
        (this.esiData as Record<string, EVESystem>)[id] = system;
        return system;
    }
}("systems-data");
export const FORBIDDEN_STRUCTURE_NAME = "NONEXISTENT OR FORBIDDEN STRUCTURE";
const STRUCTURE_REFRESH_INTERVAL = MS_ONE_DAY;
type EVEStructureEx = EVEStructure & {
    error?: string;
    lastErrorAt?: number;
};
export const Structure = new class Structure extends EURGarage.ESIUniverseBase<EVEStructureEx> {
    protected verifyData(value: EVEStructureEx): boolean {
        if (value !== void 0) {
            const lastErrorAt = value.lastErrorAt;
            if (lastErrorAt === void 0) {
                return true;
            } else {
                return (lastErrorAt + STRUCTURE_REFRESH_INTERVAL) >= Date.now();
            }
        }
        return false;
    }
    async processResolve(id: EVEId, esi: NsESI.IESIClient): Promise<EVEStructure> {
            let struct: TBC<EVEStructureEx> = null;
            try {
                struct = await esi.get<EVEStructure>(`universe/structures/${id}`, "latest", { ignoreError: true, auth: true });
                this.esiData![id] = struct;
            } catch (e) {
                console.warn(e);
            }
            if (struct !== null && struct.error === void 0) {
                struct.system_id = struct.solar_system_id;
                await Promise.all([
                    System.resolve(struct.system_id),
                    Types.resolve(struct.type_id!)
                ]).then(datas => {
                    struct!.system = datas[0];
                    struct!.type = datas[1];
                });
            } else {
                !struct && (struct = onil<EVEStructureEx>());
                struct.lastErrorAt = Date.now();
                struct.name = `${FORBIDDEN_STRUCTURE_NAME} - ${id}`;
            }
            return struct;
    }
}("structures-data", STRUCTURE_REFRESH_INTERVAL);
export type NsUniversal = typeof Universal;
export namespace Universal {
    export function isNpcCorporationId(id: number): boolean {
        return id >= 1_000_000 && id <= 2_000_000;
    }
    export function isUserCorporationId(id: number): boolean {
        return id >= 98_000_000 && id <= 99_000_000;
    }
    export function isCorporationId(id: number): boolean {
        return isNpcCorporationId(id) || isUserCorporationId(id);
    }
}
export type NsLocation = typeof Location;
export namespace Location {
    export function isSystemType(system_id: string|number): boolean {
        return system_id >= 30_000_000 && system_id <= 33_000_000;
    }
    export function isStructureType(structure_id: number | string, force: boolean = false): boolean {
        structure_id = +structure_id;
        if (KnownStructures === void 0) {
            fetchStructures();
            throw new Error(`
structure data was not initialized.
Please suspend current processing and restart later or contact your administrator.
`);
        }
        if (force) {
            const ids = KnownStructures;
            return ids[0] <= structure_id && structure_id <= ids[ids.length - 1];
        }
        return KnownStructures.includes(structure_id);
    }
    export async function resolve(id: number, esi?: NsESI.IESIClient, forceStructure: boolean = false) {
        switch (getLocationType(id, forceStructure)) {
            case LocationTypes.Station:
                return Station.resolve(id);
            case LocationTypes.System:
                return System.resolve(id);
            case LocationTypes.Structure:
                return Structure.resolve(id, esi);
            default:
                return null;
        }
    }
    export function getLocationType(id: string | number, forceStructure: boolean = false): LocationTypes {
        id = +id;
        if (id >= 60_000_000 && id < 64_000_000) {
            return LocationTypes.Station;
        }
        if (isSystemType(id)) {
            return LocationTypes.System;
        }
        if (isStructureType(id, forceStructure)) {
            return LocationTypes.Structure;
        }
        return LocationTypes.Other;
    }
}