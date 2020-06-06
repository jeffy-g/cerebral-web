import * as R from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {
    BorderedCardHeader,
    DenseRadioGroup,
} from "@com/tiny/extras";
import { IdsToNames } from "@eve/ids-to-names";
import * as esiScheduler from "@eve/api/esi-scheduler";
import * as CharProvider from "@eve/models/char-provider";
import { MailTable } from "@com/tables/mail-table";
import { WalletTable, WalletTypeToken } from "@com/tables/wallet-table";
import { Location } from "@eve/api/esi-universe-request";
import * as NsESIClient from "@eve/api/esi-client";
const log = console.log;
export const Mails = (props: EVEComponentPropsBase) => {
    const { characterId } = props;
    const mails = CharProvider.getCharacterProperyOf(characterId, "mails");
    return <Card className="margin10">
        <BorderedCardHeader
            fontSize="1.3rem"
            title="Mails"
            subheader={esiScheduler.explainOfLastTimeSchedule(characterId, "get_characters_character_id_mail")}
        />
        <CardContent>
            <MailTable
                mails={mails}
                characterId={characterId}
            />
        </CardContent>
    </Card>;
};
interface ISimpleProcessingIndicator<K> {
    on(id: K): void;
    off(id: K): void;
}
type WalletsState = {
    selectedType: WalletTypeToken;
};
type TorO = { type_id: number, location_id: number, client_id?: number };
const unr: Record<number, string> = onil();
type TIndicatorId = Exclude<keyof TorO, "location_id">;
type TProcessingIndicator = ISimpleProcessingIndicator<TIndicatorId>;
const emitPIMethod = (method: "time" | "timeEnd") => {
    const value = method === "time"? "1": "";
    return (id => {
        const dom = $query(".wallet-subheader-content");
        if (dom) {
            const dataset = dom.dataset;
            let dataname: string, timetag: string;
            if (id === "type_id") {
                dataname = "typeprocess";
                timetag = "indicator::type_id";
            } else  {
                dataname = "clientprocess";
                timetag = "indicator::client_id";
            }
            console[method](timetag);
            requestAnimationFrame(() => dataset[dataname] = value);
        }
    }) as TProcessingIndicator["on"];
};
const indicator = {
    on: emitPIMethod("time"),
    off: emitPIMethod("timeEnd")
} as TProcessingIndicator;
const processResolve = async (
    trxsOrOrders: TorO[], tag: "type_id" | "client_id",
    r: IdsToNames, esi: NsESIClient.IESIClient
) => {
    const ids = r.getIDs();
    indicator.on(tag);
    return r.resolve(esi).then(() => {
        for (const t_or_o of trxsOrOrders) {
            let id = t_or_o[tag];
            if (id && !unr[id]) {
                unr[id] = r.get(id)!.name;
            }
        }
    }).catch(reason => {
        console.warn(reason);
        for (const id of ids) {
            if (!unr[id]) {
                const un = r.get(id);
                unr[id] = un? un.name: `${tag}: ${id}, /universe/names/ request failed`;
            }
        }
    }).finally(() => {
        indicator.off(tag);
    });
};
const resolveTransactionsAndOrdersKind = async (trxsOrOrders: TorO[], esi: NsESIClient.IESIClient) => {
    if (trxsOrOrders.length > 0) {
        log("->> resolveTransactionsAndOrdersKind processing");
        const typeResolver = new IdsToNames();
        const resolver = new IdsToNames();
        const promises: Promise<void>[] = [];
        const locationQueue: number[] = [];
        for (const t_or_o of trxsOrOrders) {
            let anyId: number;
            !unr[anyId = t_or_o.type_id] && typeResolver.addId(anyId);
            (anyId = t_or_o.client_id!) && !unr[anyId] && resolver.addId(anyId);
            if (!unr[anyId = t_or_o.location_id] && !locationQueue.includes(anyId)) {
                locationQueue.push(anyId);
                promises.push(
                    new Promise<void>(async resolve => {
                        log("- ->> Location.resolve -", anyId);
                        const location = await Location.resolve(anyId, esi, true);
                        let locationName: string;
                        location && (locationName = location.name) || (
                            (locationName = `!!failed fetch location, id=${anyId}`), console.warn(locationName)
                        );
                        unr[anyId] = locationName;
                        resolve();
                    })
                );
            }
        }
        log("->> resolveTransactionsAndOrdersKind, resolver.size=%s, typeResolver.size=%s", resolver.size(), typeResolver.size());
        promises.push(
            processResolve(trxsOrOrders, "client_id", resolver, esi), processResolve(trxsOrOrders, "type_id", typeResolver, esi)
        );
        return Promise.all(promises);
    }
    return;
};
const resolveTypesKindsFor = async (charId: EVEId) => {
    const char = CharProvider.getCharacter(charId)!;
    const esi = await NsESIClient.getInstance(charId);
    const data: TorO[] = char["wallet_transactions"];
    return resolveTransactionsAndOrdersKind(
        data.concat(char["orders"]).concat(char["orders_history"]),
        esi
    );
};
export class Wallets extends R.Component<EVEComponentPropsBase, WalletsState> {
    constructor(props: EVEComponentPropsBase) {
        super(props);
        this.state = {
            selectedType: "wallet_journal"
        };
    }
    private updating: boolean = false;
    shouldComponentUpdate(np: EVEComponentPropsBase, ns: WalletsState): boolean {
        if (1) log("Wallets::shouldComponentUpdate - updating=%s,", this.updating, arguments);
        if (this.updating || ns.selectedType !== this.state.selectedType) {
            return true;
        }
        if (np.characterId !== this.props.characterId) {
            this.updating = true;
            resolveTypesKindsFor(np.characterId).then(
                () => this.setState(
                    { selectedType: ns.selectedType }, () => this.updating = false
                )
            );
        }
        return false;
    }
    componentDidMount() {
        resolveTypesKindsFor(this.props.characterId);
    }
    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedType = e.currentTarget.value as WalletTypeToken;
        const p = (selectedType !== "wallet_journal")? resolveTypesKindsFor(this.props.characterId):
                    Promise.resolve() as unknown as ReturnType<typeof resolveTypesKindsFor>;
        p.then(
            () => this.setState({ selectedType })
        );
    }
    render() {
        const { characterId } = this.props;
        const { selectedType } = this.state;
        const walletData = CharProvider.getCharacterProperyOf(characterId, selectedType);
        const titleContainer = <div className="flex-left-right-layout">
            <div>Wallet Journal and Transactions</div>
            <div>
                {}
                <DenseRadioGroup name="type-choose-buttons" lableClassName="fs09" onChange={this.handleChange}>{
                    () => {
                        const labelMap = {
                            "wallet_journal": "Journal",
                            "orders": "Orders",
                            "orders_history": "Orders History",
                            "wallet_transactions": "Transactions",
                        } as Record<WalletTypeToken, string>;
                        return Object.keys(labelMap).map(value => {
                            return new Proxy({ value, label: "", checked: false }, {
                                get: (_this, prop) => prop === "checked"? selectedType === _this.value:
                                    prop === "label"? labelMap[_this.value as WalletTypeToken]: _this.value
                            });
                        }) as ReturnType<Parameters<typeof DenseRadioGroup>[0]["children"]>;
                    }
                }</DenseRadioGroup>
            </div>
        </div>;
        const refreshType = "get_characters_character_id_" + selectedType;
        return <Card className="margin10">
            <BorderedCardHeader
                fontSize="1.3rem"
                title={titleContainer}
                subheader={esiScheduler.explainOfLastTimeSchedule(characterId, refreshType)}
                subTitleClassName="wallet-subheader-content"
            />
            <CardContent>
                <WalletTable
                    walletType={selectedType} walletData={walletData}
                    nameRegistry={unr}
                />
            </CardContent>
        </Card>;
    }
}