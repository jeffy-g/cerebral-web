import { Store } from "@util/indexed-db-store";
import * as NsESIClient from "./api/esi-client";
const DEBUG = 1;
const log = console.log;
const ENTRY_NAME = "universe-names";
type UnameRegistry = Record<string, UniverseNamesFragmentDefault>;
let unameRegistry: UnameRegistry;
let unameStore: Store<UnameRegistry>;
export async function init() {
    const fetchData = async () => {
        unameRegistry = await unameStore.getAsync(ENTRY_NAME, {});
    };
    if (unameStore === void 0) {
        unameStore = new Store<UnameRegistry>({
            name: "esi-universe",
            onChangeDatabase: fetchData
        });
    }
    if (unameRegistry === void 0) {
        await fetchData();
    }
}
let saveTid: number | undefined;
function persistent() {
    if (unameRegistry !== void 0) {
        if (saveTid !== void 0) {
            window.clearTimeout(saveTid);
        }
        saveTid = window.setTimeout(() => {
            saveTid = void 0;
            unameStore.set(unameRegistry, ENTRY_NAME);
        }, 100);
    }
}
export class IdsToNames {
    private resolving: boolean = false;
    constructor(private ids: number[] = []) {}
    addId(typeId: number): number {
        if (this.resolving) return -1;
        const ids = this.ids;
        if (typeId > 0 && !ids.includes(typeId) && !unameRegistry[typeId]) {
            return ids.push(typeId);
        }
        return ids.length;
    }
    addIds(typeIds: number[]): number {
        if (this.resolving) return -1;
        const sids = new Set([...this.ids, ...typeIds]);
        const filtered = [...sids].filter(id => !unameRegistry[id]);
        return (this.ids = filtered).length;
    }
    async resolve(esi?: NsESIClient.IESIClient) {
        const eveIds = this.ids;
        if (this.resolving || eveIds.length === 0) {
            return false;
        }
        this.resolving = true;
        let newcomer = false;
        if (eveIds.length > 0) {
            !esi && (esi = await NsESIClient.getInstance(0));
            type TEVEUniverseNames = EVEUniverseNames[];
            const promises: Promise<TEVEUniverseNames>[] = [];
            for (
                let ptr = 0, last = 1e3, l = eveIds.length, idx = 0;
                ptr < l;
                ptr = last, last += 1e3
            ) {
                DEBUG && log("IdsToNames::resolve.esi.post, index: %s, size: %s", ptr, l);
                const task = esi.post<TEVEUniverseNames>("latest/universe/names/", void 0, { body: eveIds.slice(ptr, last) }).then(universes => {
                    DEBUG && log("IdsToNames::resolve.esi.post - done(index: %s, size: %s)", ptr, l);
                    if (universes) {
                        for (const u of universes) {
                            unameRegistry[u.id] = {
                                name: u.name,
                                category: u.category
                            };
                        }
                    }
                }).catch(reason => {
                    log("IdsToNames::resolve.esi.post - failed, range=%s to %s", ptr, last);
                    return reason;
                });
                promises[idx++] = task;
            }
            await Promise.all(promises).then(() => {
                persistent();
                newcomer = true;
            });
        }
        eveIds.length = 0;
        this.resolving = false;
        return newcomer;
    }
    get(id: EVEId, copy?: boolean): TBD<UniverseNamesFragmentDefault> {
        const data = unameRegistry[id];
        if (data) {
            return copy? { ...data }: data;
        }
        return void 0;
    }
    getIDs(): number[] {
        return this.ids.slice();
    }
    size(): number {
        return this.ids.length;
    }
    clear(): void {
        if (this.resolving) {
            log("running resolve process, so cannot clear.");
            return;
        }
        this.ids.length = 0;
    }
}