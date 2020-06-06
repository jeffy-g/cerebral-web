import { Store } from "@util/indexed-db-store";
import * as NsESI from "./esi-client";
import { Timer } from "@util/timer";
import { create, restrictor } from "mini-semaphore";
export interface IESIUniverseRequest<T> {
    resolve(id: EVEId, esi?: NsESI.IESIClient): Promise<T>;
    run(): void;
    stop(): void;
}
const MAINTENANCE_INTERVAL = 15 * 1e3;
const PURGE_SPAN = 12 * 1e3;
const log = console.log;
let _esi: NsESI.IESIClient; {
    NsESI.getInstance(0).then(instance => _esi = instance);
}
export abstract class ESIUniverseBase<TType extends unknown>
    extends Timer implements IESIUniverseRequest<TType> {
    protected esiData: TBD<Record<string, TType>>;
    protected dataStore: Store<Record<string, TType>>;
    private tol: number = 0;
    private s = create(1);
    constructor(protected entry_name: string, private refreshRate: number = 0) {
        super({
            interval: MAINTENANCE_INTERVAL,
            runBody: (): void => {
                if (this.esiData !== void 0 && (this.tol + PURGE_SPAN < Date.now())) {
                    this.persistentImmediately(true);
                }
            },
            stopBody: () => {
                this.persistentImmediately(true);
            }
        });
        this.dataStore = new Store({
            name: "esi-universe", onChangeDatabase: async () => {
                await this.fetchData();
            }
        });
    }
    private fetching = false;
    private crtc = 0;
    private dbg = true;
    get debug() {
        return this.dbg;
    }
    set debug(is: boolean) {
        this.dbg = is;
    }
    protected async require(): Promise<Record<string, TType>> {
        if (!this.esiData) {
            const dbg = this.dbg;
            let tag: TBD<string>;
            if (dbg) {
                const prefix = ` - ${this.entry_name}.require`;
                if (this.fetching) {
                    tag = "⏳" + prefix + " wait #" + this.crtc++;
                } else {
                    this.fetching = true;
                    tag = "⚠️" + prefix + " fetch";
                }
            }
            dbg && console.time(tag);
                await this.s.acquire();
                if (!this.esiData) {
                    await this.fetchData();
                    this.fetching = false;
                }
                this.s.release();
            dbg && console.timeEnd(tag);
        }
        this.tol = Date.now();
        return this.esiData!;
    }
    private async fetchData() {
        const fallback = {} as Record<string, TType> & { lastRefresh?: number };
        const data = await this.dataStore.getAsync(this.entry_name, fallback);
        let purge = false;
        if (this.refreshRate > 3e4) {
            const lastRefresh = data.lastRefresh as number;
            const now = Date.now();
            if (lastRefresh === void 0 || lastRefresh + this.refreshRate < now) {
                this.esiData = fallback;
                fallback.lastRefresh = now;
                purge = true, log(`${this.entry_name}:: database has been purge`);
            }
        }
        !purge && (this.esiData = data);
        this.crtc = 0;
    }
    protected abstract async processResolve(id: EVEId, esi?: NsESI.IESIClient): Promise<TType>;
    protected verifyData(value: TType): boolean {
        return value !== void 0;
    }
    private lock: boolean = false;
    async resolve(id: EVEId, esi?: NsESI.IESIClient): Promise<TType> {
        this.lock = true;
        const data = await restrictor.one(
            id, async () => {
                let d = (await this.require())[id];
                if (!this.verifyData(d)) {
                    d = await this.processResolve(id, esi) as unknown as TType;
                }
                return d;
            }
        );
        this.lock = false;
        return data;
    }
    protected async fetchEndpoint<T>(endpoint: string) {
        return _esi.get<T>("latest/" + endpoint);
    }
    protected persistentImmediately(purge = false) {
        if (this.esiData) {
            this.dataStore.set(this.esiData, this.entry_name, () => {
                if (this.lock) {
                    log(`🖌️ ${this.entry_name}:: purge process deferred next because data is in use`);
                } else if (purge) {
                    this.esiData = void 0;
                    log(`☠️ ${this.entry_name}:: cache has been purge`);
                } else {
                    log(`🆙 ${this.entry_name}:: data has been saved`);
                }
            });
        }
    }
}