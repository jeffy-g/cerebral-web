import * as R from "react";
import Popover from "@material-ui/core/Popover";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import Divider from "@material-ui/core/Divider";
import { PopoverOrigin } from "@material-ui/core/Popover";
import * as SkillPlanSerializer from "@eve/serialization";
import * as mf from "@util/misc-functions";
export type PlanPopoverProps<P> = {
    open: boolean;
    anchorEl: HTMLElement;
    onClose: () => void;
} & Partial<P> & TransitionEventTriggers;
type PlanPopoverState<S> = {
    open: boolean;
    anchorEl?: HTMLElement;
} & Partial<S>;
const defaultAnchorOrigin: Readonly<PopoverOrigin> = {
    vertical: "bottom",
    horizontal: "left",
};
const defaultTransformOrigin: Readonly<PopoverOrigin> = {
    vertical: "top",
    horizontal: "left",
};
abstract class PlanPopover<P, S = {}> extends R.Component<PlanPopoverProps<P>, PlanPopoverState<S>> {
    abstract createMenuList(): ReactInstanceType<typeof MenuList>;
    private anchorOrigin = defaultAnchorOrigin;
    private transformOrigin = defaultTransformOrigin;
    constructor(props: PlanPopoverProps<P>) {
        super(props);
        this.state = {
            open: props.open,
            anchorEl: props.anchorEl,
        } as PlanPopoverState<S>;
    }
    protected setAnchors(anchors: { origin?: PopoverOrigin, transform?: PopoverOrigin}) {
        const { origin, transform } = anchors;
        origin && (this.anchorOrigin = origin);
        transform && (this.transformOrigin = transform);
    }
    shouldComponentUpdate(np: PlanPopoverProps<P>, ns: PlanPopoverState<S>) {
        const { props } = this;
        const { state } = this;
        let need_up = false;
        if (np.open !== props.open || np.open !== state.open) {
            ns.open = np.open;
            need_up = true;
        }
        if (np.anchorEl !== props.anchorEl || np.anchorEl !== state.anchorEl) {
            ns.anchorEl = np.anchorEl;
            need_up = true;
        }
        return need_up || ns.open !== state.open || ns.anchorEl !== state.anchorEl;
    }
    protected handleRequestClose = () => {
        this.setState(
            { open: false } as PlanPopoverState<S>,
            this.props.onClose
        );
    }
    render() {
        const { open, anchorEl } = this.state;
        return (
            <Popover
                open={open}
                elevation={9}
                anchorEl={anchorEl}
                anchorOrigin={this.anchorOrigin}
                transformOrigin={this.transformOrigin}
                onClose={this.handleRequestClose}
                onExited={this.props.onExited}
            >
                {this.createMenuList()}
            </Popover >
        );
    }
}
export type ExportPlanPopoverProps = {
    planName: string;
    items: PlanQueueItem[];
    shoppingListItems?: PlanQueueItem[];
};
export class ExportPlanPopover extends PlanPopover<ExportPlanPopoverProps> {
    handleMenuItemClick = (e: R.MouseEvent<HTMLElement>) => {
        const dataset = e.currentTarget.dataset;
        const format = dataset.format as PlanDatas.TSerializeFormat;
        const { shoppingListItems, items } = this.props;
        const actualItems = format === "shoppinglist" ? shoppingListItems: items;
        this.handleRequestClose();
        SkillPlanSerializer.serialize(format, actualItems, dataset.planname);
    }
    createMenuList() {
        const { items = [], shoppingListItems, planName } = this.props;
        const disabled = items.length === 0;
        return <MenuList>
            <MenuItem data-format="json" onClick={this.handleMenuItemClick} disabled={disabled} data-planname={planName}>Cerebral Plan</MenuItem>
            <MenuItem data-format="clipboard" onClick={this.handleMenuItemClick} disabled={disabled}>Clipboard (first 50)</MenuItem>
            <MenuItem data-format="shoppinglist" onClick={this.handleMenuItemClick} disabled={shoppingListItems === void 0}>Clipboard (Shopping List)</MenuItem>
        </MenuList>;
    }
}
export type ImportPlanPopoverProps = {
    onImport: (name?: string, sourceType?: string, planData?: PlanDatas.CerebralSkillImportFormat) => void;
};
export class ImportPlanPopover extends PlanPopover<ImportPlanPopoverProps> {
    createMenuList() {
        return <MenuList>
            <MenuItem data-format="json" data-accepts=".json,.cerebral_plan" onClick={this.handleMenuItemClick} >Cerebral Plan</MenuItem>
            <MenuItem data-format="xml" data-accepts=".xml" onClick={this.handleMenuItemClick} >EVEMon Plan</MenuItem>
            {}
            <MenuItem data-format="skillQueue" onClick={this.handleMenuItemClick} >from skillQueue</MenuItem>
            <MenuItem disabled >Fitting</MenuItem>
            <MenuItem disabled >Clipboard EVE format</MenuItem>
        </MenuList>;
    }
    handleMenuItemClick = (e: R.MouseEvent<HTMLElement>) => {
        const dataset = e.currentTarget.dataset;
        const format = dataset.format as PlanDatas.TSerializeFormat;
        this.handleRequestClose();
        if (format === "skillQueue") {
            this.props.onImport!("skillQueue");
            return;
        }
        mf.showOpenFileDialog(dataset.accepts).then(async files => {
            if (files !== null && files.length) {
                const plan = SkillPlanSerializer.deserialize(
                    format, await mf.readTextFromFile(files[0])
                );
                this.props.onImport!(`Import of "${files[0].name}"`, format, plan);
            }
        }).catch(reason => {
            console.log(reason);
        });
    }
}
export type PlanLevelPopoverProps = {
    onLevelSelected: (level: number, prerqs?: number) => void;
};
export class PlanLevelPopover extends PlanPopover<PlanLevelPopoverProps> {
    constructor(props: PlanPopoverProps<PlanLevelPopoverProps>) {
        super(props);
        this.setAnchors({
            origin: { horizontal: "right", vertical: "center" },
            transform: { horizontal: "left", vertical: "center" }
        });
    }
    handleMenuItemClick = (e: R.MouseEvent<HTMLElement>) => {
        const handler = this.props.onLevelSelected;
        if (typeof handler === "function") {
            const dataset = e.currentTarget.dataset;
            const level = dataset.level;
            if (level) {
                handler(+level);
                return;
            }
            const prerqs = dataset.prerqs;
            if (prerqs) {
                handler(0, +prerqs);
            }
        }
    }
    createMenuList() {
        return <MenuList>
            {
                [1, 2, 3, 4, 5].map(n => {
                    return <MenuItem key={n} className="plan-level-element" data-level={n} onClick={this.handleMenuItemClick}>{`Level ${n}`}</MenuItem>;
                })
            }
            <Divider/>
            {
                [3, 4, 5].map(n => {
                    return <MenuItem key={n} className="plan-level-element" data-prerqs={n} onClick={this.handleMenuItemClick}>{`Prereqs ${n}`}</MenuItem>;
                })
            }
        </MenuList>;
    }
}