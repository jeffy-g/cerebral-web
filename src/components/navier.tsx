import * as R from "react";
import { Redirect } from "react-router";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem, { ListItemProps } from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import { NavierOptionButtons } from "./navier-option-buttons";
import * as Extras from "./tiny/extras";
import * as CharProvider from "@eve/models/char-provider";
import * as mf from "@util/misc-functions";
type NavierProps = {
};
type NavierState = EVEComponentStateBase & {
    redirectPath?: string;
    currentSelect: string | number;
    openDrawer?: boolean;
    drawerPined?: boolean;
    isPinRequest?: boolean;
};
type NavierRoute = {
    path: string;
    iconType: string;
    index: number;
};
const log = console.log;
const DrawerPaper_CLASS_NAME = "drawer-child";
const extraButtonDetails: ExtraButtonDetail[] = [];
const generalRouteList: Record<string, NavierRoute> = {
    "Managed Characters": {
        path: "/",
        iconType: "recruitment",
        index: 0,
    },
    "Skill Browser": {
        path: "/skill-browser",
        iconType: "other",
        index: 1,
    },
    "Contracts": {
        path: "/contracts",
        iconType: "contracts",
        index: 3,
    },
    "Settings": {
        path: "/settings",
        iconType: "settings",
        index: 4,
    },
};
const detectCurrentSelected = () => {
    const hashFragment = location.hash.substring(1);
    WHEN_CHARACTER: {
        const m = /characters\/(\d+)/.exec(hashFragment);
        if (m) return m[1];
    }
    const routes = Object.values(
        generalRouteList
    ).filter(entry => entry.path === hashFragment);
    if (routes.length) {
        return routes[0].index;
    }
    return "/";
};
const emitMoveListenerHandlers = (that: Navier): mf.TMoveEventListener => {
    let handlers: mf.TMoveEventListener;
    const OPEN_DELTA_X = 30;
    const handleMouseGesture = (thresholdX: number) => {
        const { openDrawer } = that.state;
        if (thresholdX <= OPEN_DELTA_X && !openDrawer) {
            that.processDrawer();
        }
    };
    handlers = {
        mousemove: (e: MouseEvent): any => {
            handleMouseGesture(e.clientX);
        },
        touchmove: (e: TouchEvent): any => {
            handleMouseGesture(e.targetTouches[0].clientX);
        }
    };
    return handlers;
};
const purgedState: Partial<NavierState> = { redirectPath: void 0, newcomer: false };
type GeneralListItemProps = ListItemProps & {
    name: string;
};
const GeneralListItem = R.memo((props: GeneralListItemProps) => {
        const { name, selected, onClick } = props;
        return <ListItem button
            selected={selected}
            onClick={onClick as ((event: R.MouseEvent<HTMLElement>) => void)}
            classes={styleProps.generalItemClasses}
        >
            <Extras.EVEToolIcon type={generalRouteList[name].iconType} />
            <ListItemText
                style={styleProps.generalItemStyle}
                primary={name}
                primaryTypographyProps={generalItemTypoProps}
            />
        </ListItem>;
    },
    (pp, np) => pp.selected === np.selected
);
const createGeneralListItems = (
    currentSelect: NavierState["currentSelect"],
    clickHandler: (event: R.MouseEvent<HTMLElement>) => void
) => {
    const items: R.ReactNode[] = [];
    const itemNames = Object.keys(generalRouteList);
    for (const name of itemNames) {
        items.push(
            <GeneralListItem key={name} name={name}
                selected={currentSelect === generalRouteList[name].index}
                onClick={clickHandler}
            />
        );
    }
    return items;
};
const createCharacterList = (
    currentSelect: NavierState["currentSelect"],
    clickHandler: (e: R.MouseEvent<HTMLElement>) => void,
    characters: IEVECharacter[],
) => {
    const list: ReactInstanceType<typeof ListItem>[] = [];
    for (const char of characters) {
        const charId = char.character_id;
        list.push(
            <ListItem button key={charId} title={charId}
                data-cid={charId}
                selected={currentSelect === charId}
                onClick={clickHandler}
                classes={styleProps.charcterListItemClasses}
            >
                <ListItemAvatar>
                    <Extras.EVEAvatar character={char}/>
                </ListItemAvatar>
                <ListItemText primary={char.name}
                    secondary={mf.toLocaleString(char.balance, "ISK", 2)}
                    classes={styleProps.eveAvatarClasses}
                    primaryTypographyProps={generalItemTypoProps}
                />
            </ListItem>
        );
    }
    return list;
};
const DEBUG = 0;
export class Navier extends R.Component<NavierProps, NavierState> {
    static registerButtonComponent(detail: ExtraButtonDetail) {
        extraButtonDetails.push(detail);
    }
    private fireThemeChange = false;
    beforeThemeChange() {
        this.fireThemeChange = !!0;
    }
    protected moveHandlers: mf.TMoveEventListener;
    constructor(props: NavierProps) {
        super(props);
        this.state = {
            characters: CharProvider.getCharacterClass().getCharacters(),
            currentSelect: detectCurrentSelected(),
            openDrawer: false,
            drawerPined: false
        };
        this.moveHandlers = emitMoveListenerHandlers(this);
    }
    // @ts-ignore unused var
    shouldComponentUpdate(np: NavierProps, ns: NavierState): boolean {
        if (DEBUG) log("Navier::shouldComponentUpdate");
        const stat = this.state;
        let nextRedirectPath = ns.redirectPath;
        if (nextRedirectPath !== void 0 && stat.redirectPath === nextRedirectPath) {
            ns.redirectPath = nextRedirectPath = void 0;
        }
        if (stat.drawerPined && !ns.openDrawer) {
            ns.openDrawer = true;
        }
        return this.fireThemeChange
            || stat.ticking === false && ns.ticking
            || (ns.newcomer && (nextRedirectPath === void 0 || nextRedirectPath === "/"))
            || stat.openDrawer !== ns.openDrawer
            || stat.currentSelect !== ns.currentSelect
            || stat.characters.length !== ns.characters.length
            || stat.drawerPined !== ns.drawerPined;
    }
    private onPopState = (e: PopStateEvent) => {
        $consumeEvent(e);
        const currentSelect = detectCurrentSelected();
        if (this.state.currentSelect !== currentSelect) {
            this.setState({ currentSelect });
        }
    }
    componentDidMount() {
        if (DEBUG) log("Navier::componentDidMount");
        CharProvider.getCharacterClass().subscribe(this);
        mf.bindMouseOrTouchEvent(this.moveHandlers);
        this.componentDidUpdate();
        window.addEventListener("popstate", this.onPopState);
        DomEventsUtil.registerShortcutKey("ctrl alt d", () => {
                const { openDrawer, drawerPined } = this.state;
                if (!drawerPined) {
                    this.processDrawer(!openDrawer);
                }
            },
            "toggle Drawer open state(not pinned"
        );
    }
    componentDidUpdate() {
        if (DEBUG) log("    Navier::componentDidUpdate");
        this.fireThemeChange = false;
        EVEApp.marshalling({ "drawer.open": !!this.state.openDrawer });
        mf.mergeStateDirectly(this, purgedState);
    }
    componentWillUnmount() {
        if (DEBUG) log("Navier::componentWillUnmount");
        CharProvider.getCharacterClass().unsubscribe(this);
        mf.bindMouseOrTouchEvent(this.moveHandlers, true);
        window.removeEventListener("click", this.outOfRangeDetection, false);
        window.removeEventListener("popstate", this.onPopState);
    }
    navigateTo(target: string) {
        const {
            path = `/characters/${target}`,
            index = target
        } = /^\d+$/.test(target)? onil() : generalRouteList[target];
        if (this.state.currentSelect !== index) {
            this.setState({
                redirectPath: path,
                currentSelect: index,
            });
        }
    }
    private handleNavigateTo = (e: R.MouseEvent<HTMLElement>) => {
        const target = e.currentTarget as HTMLElement;
        const characterId = target.dataset.cid;
        this.navigateTo(
            characterId? characterId: target.textContent!.trim()
        );
    }
    processDrawer(open = true) {
        this.setState({ openDrawer: open }, () => {
            mf.bindMouseOrTouchEvent(this.moveHandlers, open);
            // @ts-ignore 
            document[mf.listenerMethod(open)]("click", this.outOfRangeDetection, false);
        });
    }
    outOfRangeDetection = (e: MouseEvent): any => {
        const path = e.composedPath();
        for (const element of path) {
            const he: Element = element as Element;
            if (he.classList && he.classList.contains(DrawerPaper_CLASS_NAME)) {
                return;
            }
        }
        this.processDrawer(false);
    }
    pinRequest = (drawerPined: boolean): void => {
        this.setState({ drawerPined }, () => {
            if (drawerPined) {
                mf.bindMouseOrTouchEvent(this.moveHandlers, true);
            }
            // @ts-ignore typescript cannot detect function signature..
            window[mf.listenerMethod(!drawerPined)]("click", this.outOfRangeDetection, false);
        });
    }
    render() {
        const stat = this.state;
        const drawerElement = <Drawer
            open={stat.openDrawer}
            variant="persistent"
            anchor="left"
            classes={styleProps.drawerClasses}
            PaperProps={{ elevation: 2 }}
        >
            <NavierOptionButtons
                pined={!!stat.drawerPined}
                pinRequest={this.pinRequest}
                extraButtons={extraButtonDetails}
            />
            <Extras.TitledDivider text="General"/>
            <List classes={styleProps.itemRootClasses} children={
                createGeneralListItems(stat.currentSelect, this.handleNavigateTo)
            }/>
            <Extras.TitledDivider text="Character list"/>
            <List classes={styleProps.itemRootClasses} style={styleProps.characterListStyle}>{
                createCharacterList(stat.currentSelect, this.handleNavigateTo, stat.characters)
            }</List>
        </Drawer>;
        if (stat.redirectPath) {
            return <>
                {drawerElement}
                <Redirect push to={stat.redirectPath} />
            </>;
        }
        return drawerElement;
    }
}
const styleProps = {
    drawerClasses: {
        paper: DrawerPaper_CLASS_NAME
    },
    itemRootClasses: {
        root: "list-items"
    },
    generalItemClasses: {
        root: "list-item has-icon",
        selected: "selected"
    },
    generalItemStyle: {
        padding: "0 12px"
    } as R.CSSProperties,
    charcterListItemClasses: {
        root: "list-item has-avatar",
        selected: "selected"
    },
    eveAvatarClasses: {
        primary: "ellipsis-text",
        secondary: "list-item-secondary-text"
    },
    characterListStyle: {
        overflowY: "auto"
    } as R.CSSProperties
};
const generalItemTypoProps = {
    classes: {
        root: "narrow-width-text-std"
    }
};