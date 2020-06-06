import * as R from "react";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import * as DateTimeUtil from "@util/date-time-util";
import * as CharProvider from "@eve/models/char-provider";
import * as AuthProvider from "@eve/models/auth-provider";
import * as mf from "@util/misc-functions";
import * as constants from "@eve/models/constants";
import {
    enableAuthStateUpdate, AuthStateIcon,
    AuthStateIconManager
} from "./auth-state-icon";
import { EVEAvatar, EVEChip } from "../tiny/extras";
import { NumericAnimation } from "../tiny/numeric-anim";
import { ModalDialog } from "../dialogs/";
import { SortOrderPane, TOrderState } from "@com/tiny/sort-order-pane";
type CharactersOverviewTableProps = {
};
type TCharacterSortOrderKeys = "totalSp" | "balance" | "birthday" | "security";
type TCharacterOrderState = TOrderState<TCharacterSortOrderKeys>;
const SORT_ORDER_TOKENs = [
    "totalSp",
    "balance",
    "birthday",
    "security",
] as TCharacterSortOrderKeys[];
type CharactersOverviewTableState = EVEComponentStateBase & {
    openAlert?: boolean;
    removeCharacterId: TBC<EVEId>;
    orders: TCharacterOrderState;
};
const COLID_PREFIX0 = "totalsp_";
const COLID_PREFIX1 = "remsp_";
const commitSortOrder = (characters: IEVECharacter[], orders: TCharacterOrderState) => {
    let comparator: TComparator<IEVECharacter>;
    const { sortBy, ascending } = orders;
    switch (sortBy) {
        case "balance":
            comparator = ascending? (a, b) => a.balance - b.balance: (a, b) => b.balance - a.balance;
            break;
        case "birthday":
            comparator = ascending? (a, b) => +a.getDateOfBirth() - +b.getDateOfBirth(): (a, b) => +b.getDateOfBirth() - +a.getDateOfBirth();
            break;
        case "security":
            comparator = (a, b) => {
                let first: IEVECharacter, second: IEVECharacter;
                if (ascending) {
                    first = a, second = b;
                } else {
                    first = b, second = a;
                }
                return first.security_status < second.security_status? -1: +(first.security_status > second.security_status);
            };
            break;
        default:
            comparator = ascending? (a, b) => a.getTotalSp() - b.getTotalSp(): (a, b) => b.getTotalSp() - a.getTotalSp();
            break;
    }
    characters.sort(comparator);
};
function formatCharStat(char: IEVECharacter) {
    if (char.balance === void 0) {
        return null;
    }
    const walletAndSkillPoint = [
        mf.toLocaleString(char.balance, "ISK", 2),
        mf.toLocaleString(char.getTotalSp(false), "SP", 3)
    ];
    const currentSkill = char.getCurrentTrainingSkill();
    const skillTrainDetails = [
        (currentSkill ? `${currentSkill.skill_name} ${currentSkill.finished_level}` : "<span style='color: orange'>Not Training</span>"),
        (currentSkill ? DateTimeUtil.timeUntil(new Date(currentSkill.finish_date)) : "")
    ];
    return { walletAndSkillPoint, skillTrainDetails };
}
let prevDetailCache: Record<string, ReturnType<typeof formatCharStat>>;
const bindTrainingDetail = async (char: IEVECharacter) => {
    const texts = formatCharStat(char);
    if (texts === null) return;
    const cid = char.character_id;
    const cell0 = $dom(COLID_PREFIX0 + cid);
    const cell1 = $dom(COLID_PREFIX1 + cid);
    if (cell0 === null || cell1 === null) {
        console.warn("Cannot access DOM element...");
        return;
    }
    let prev = prevDetailCache[cid];
    let needUpdate1: boolean, needUpdate2: boolean;
    if (!prev) {
        prevDetailCache[cid] = prev = texts;
        needUpdate1 = true;
        needUpdate2 = true;
    } else {
        needUpdate1 = !mf.arrayEquals(prev.walletAndSkillPoint, texts.walletAndSkillPoint);
        needUpdate2 = !mf.arrayEquals(prev.skillTrainDetails, texts.skillTrainDetails);
    }
    needUpdate1 && mf.replaceContentAsDiv(cell0, texts.walletAndSkillPoint);
    needUpdate2 && mf.replaceContentAsDiv(cell1, texts.skillTrainDetails);
};
const tick = (characters: IEVECharacter[]): void => {
    for (let i = 0, end = characters.length; i < end; i++) {
        bindTrainingDetail(characters[i]);
    }
};
const getCharacterTitle = (char: IEVECharacter): string => {
    const uniqeName = char.ship ? char.ship.ship_name: "error";
    const typeName = (char.ship && char.ship.type) ? char.ship.type.name : "error";
    const details = char.getCurrentLocationDetails();
    return `character id: ${char.character_id}
current ship: ${uniqeName} (${typeName})

region: ${details.region.r} < ${details.region.c}
location: ${details.currentLocation}
`;
};
const createTableRowComponent = (
    char: IEVECharacter,
    handleClick: (e: R.MouseEvent<HTMLElement>) => void,
    handleDeleteRequest: (e: R.MouseEvent<HTMLElement>) => void,
): JSX.Element | null => {
    const character_id = char.character_id; {
        const auth = AuthProvider.getEVEOAuthCharacter(character_id);
        if (auth === void 0) {
            console.log('=============> createTableRowComponent error: character_id=%s, name="%s" auth data not found', character_id, char.name);
            return null;
        }
    }
    return (
        <TableRow
            key={character_id}
            className="overview-row -x-axis-rotate"
            onClick={handleClick}
        >
            <TableCell className="overview-avatar-cell">
                <EVEAvatar character={char}
                    title="Go to character summary page."
                    onClick={handleClick}
                />
            </TableCell>
            <TableCell className="overview-icons-cell">
                <div className="overview-icons-cell__icons">
                    <AuthStateIcon characterId={character_id}/>
                    <img alt="Omega?" src={constants.decideCharStateIcon(char)} width={32}/>
                    <img alt="Corp" src={constants.getEVEImageUrl("corporation", char.corporation_id)} width={32}/>
                </div>
            </TableCell>
            <TableCell className="overview-cell" title={getCharacterTitle(char)}>
                <div className="character-name">{
                    char.name
                }<span className="character-name__security-status">{
                    char.security_status.toLocaleString(void 0, { maximumFractionDigits: 6 })
                }</span></div>
                <div className="ellipsis">
                    {`${char.corporation ? char.corporation.name : "ERROR"} / ${char.alliance_id ? char.alliance!.name : "- - -"}`}
                </div>
            </TableCell>
            {}
            <TableCell className="overview-cell" id={COLID_PREFIX0 + character_id} />
            {}
            <TableCell className="overview-cell" id={COLID_PREFIX1 + character_id} />
            <TableCell className="overview-cell">
                <IconButton className="overview-cell__delete-button"
                    aria-label="Delete" color="inherit" title="unsubscribe this character."
                    data-removeid={character_id}
                    onClick={handleDeleteRequest}
                >
                    <Icon>delete</Icon>
                </IconButton>
            </TableCell>
            <TableCell/>
        </TableRow>
    );
};
export class CharactersOverviewTable<
    P extends CharactersOverviewTableProps = CharactersOverviewTableProps,
    S extends CharactersOverviewTableState = CharactersOverviewTableState
> extends R.Component<P, S> {
    constructor(props: P) {
        super(props);
        this.state = {
            characters: CharProvider.getCharacterClass().getCharacters(false),
            ticking: true,
            openAlert: false,
            removeCharacterId: null,
            orders: {
                sortBy: "totalSp",
                ascending: false
            }
        } as S;
        prevDetailCache = onil();
    }
    // @ts-ignore unused parameter
    shouldComponentUpdate(np: P, ns: S) {
        const nextTicking = !!ns.ticking;
        enableAuthStateUpdate(nextTicking);
        return nextTicking;
    }
    componentDidMount() {
        BackgroundTaskManager.operateTimerTask("character-overview-tick", {
            action: "start", interval: 1e3
        }, () => {
            this.tick();
        });
        CharProvider.getCharacterClass().subscribe(this);
    }
    componentWillUnmount() {
        BackgroundTaskManager.operateTimerTask("character-overview-tick", { action: "remove" });
        CharProvider.getCharacterClass().unsubscribe(this);
    }
    tick = () => {
        this.state.ticking && tick(this.state.characters);
    }
    handleClick = (e: R.MouseEvent<HTMLElement>): void => {
        const element = e.target as HTMLElement;
        let characterId: string | undefined;
        if (element instanceof HTMLImageElement) {
            const m = /\d+/.exec(element.src);
            if (m) {
                characterId = m[0];
            }
        } else {
            characterId = element.dataset.id;
        }
        if (characterId) {
            e.stopPropagation();
            EVEApp.marshalling({ "redirect.character.page": characterId });
            return;
        }
        if (e.altKey) {
            console.log("sorry, not supported in this package.");
        }
    }
    handleDeleteRequest = (e: R.MouseEvent<HTMLElement>): void => {
        $consumeEvent(e.nativeEvent);
        this.setState({
            openAlert: true,
            removeCharacterId: e.currentTarget.dataset.removeid!
        });
    }
    private holder: TBD<Partial<S>>;
    onDialogExited = () => {
        if (this.holder) {
            mf.mergeStateDirectly(this, this.holder);
            this.holder = void 0;
        }
    }
    decideWhether2Delete = (agree: boolean) => {
        const _process = async () => {
            const { removeCharacterId = "" } = this.state;
            if (agree && removeCharacterId) {
                await CharClass.remove(removeCharacterId, ({ name, success }) => {
                    success && delete prevDetailCache[removeCharacterId];
                    console.log("delete data of '%s', success: ", name, success);
                });
            }
            this.holder = { removeCharacterId: null } as Partial<S>;
            this.setState({
                openAlert: false,
            });
        };
        const CharClass = CharProvider.getCharacterClass();
        if (CharClass.isTaskRunning()) {
            EVEApp.marshalling({
                "notify.info": "Currently, ESI request task running...\nyour request will be executed reliably after completion of processing."
            });
            CharClass.waitForTaskDone().then(() => {
                _process.emitDefer(1200);
            });
        } else {
            _process();
        }
    }
    private scheduleSortOrders = (orders: TCharacterOrderState) => {
        this.setState({ orders });
    }
    render() {
        const { openAlert, characters, removeCharacterId, orders } = this.state;
        commitSortOrder(characters, orders);
        const rows: TBC<R.ReactElement>[] = [];
        for (let index = 0, end = characters.length; index < end; index++) {
            rows.push(
                createTableRowComponent(characters[index], this.handleClick, this.handleDeleteRequest)
            );
        }
        return (
            <>
                <ModalDialog
                    open={!!openAlert}
                    mainTitle="Unsubscribe EVE character?"
                    content={
                        <span>You are about to exile this person...&#x0a;&#x0a;<EVEChip id={removeCharacterId as EVEId} /></span>
                    }
                    onCloseHandler={this.decideWhether2Delete}
                    onExited={this.onDialogExited}
                />
                {}
                <div className="flex-cc overview-table-controller">
                    <SortOrderPane
                        defaultAscending={false}
                        orderKeys={SORT_ORDER_TOKENs}
                        sortBy={orders.sortBy}
                        commitOrders={this.scheduleSortOrders}
                        hidden={rows.length < 2}
                    />
                </div>
                <Table >
                    <TableBody >
                        {rows}
                        {}
                    </TableBody>
                </Table>
                <AuthStateIconManager
                />
                <div className="total-fund">Total Fund: <NumericAnimation
                    className="total-fund__isk"
                    duration={777}
                    start={CharProvider.getTotalFund()}
                    intlOption={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
                /> ISK</div>
            </>
        );
    }
}