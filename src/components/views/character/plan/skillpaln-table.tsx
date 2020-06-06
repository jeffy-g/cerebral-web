import * as R from "react";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import Popover from "@material-ui/core/Popover";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import Paper from "@material-ui/core/Paper";
import {
    SortableContainer,
    SortEvent, SortEventWithTag,
    SortableContainerProps
} from "react-sortable-hoc";
import { SortablePlanItem, SortableItemAProps } from "./plan-item";
import { LabeledCheckBox } from "@com/tiny/extras";
import * as DateTimeUtil from "@util/date-time-util";
import * as mf from "@util/misc-functions";
import inspect, { enter } from "@util/inspect/";
type SortableListTBodyProps = {
    children: R.ReactNode;
} & SortableContainerProps;
const SortablePlanQueueTableBody = SortableContainer(
    (props: SortableListTBodyProps) => {
        return <TableBody>{props.children}</TableBody>;
    }
);
// @ts-ignore
SortablePlanQueueTableBody["muiName"] = "TableBody";
const planTableStyles = {
    queueItemsPaper: {
        overflow: "auto",
        maxHeight: "calc(100vh - 168px)",
    },
    popover: {
        display: "flex",
        flexDirection: "column",
    }
} as Record<string, R.CSSProperties>;
function shouldCancelStart<T extends SortEvent | SortEventWithTag>(e: T) {
    const iconToken = (e.target as HTMLElement).textContent || "";
    return ["delete", "mode_edit"].indexOf(iconToken.toLowerCase()) !== -1;
}
const additionalDetails = (items: PlanQueueItem[], selectedIndices: number[]) => {
    const detailHead = items.reduce((total, item) => {
        return total + +(item.type === "skill");
    }, 0) + " queues";
    if (selectedIndices && selectedIndices.length > 1) {
        return `${detailHead} (${selectedIndices.length} selected - ${
            DateTimeUtil.niceCountdown(
                selectedIndices.reduce((totalTime, itemIndex) => {
                    const qi = items[itemIndex];
                    return totalTime + (qi && qi.type === "skill" ? qi.time : 0);
                }, 0,)
            )})`;
    }
    return detailHead;
};
type SkillPlanTableProps = Pick<SortableItemAProps, "onRemove"> & {
    skillPlanId: string;
    items: PlanQueueItem[];
    unknownSkills?: number;
    totalTime: number;
    onEdit: (index: number) => void;
    onSkillMove: (old: number, newIndex: number, selection: number[]) => void;
    onSelectionChange?: (selection: number[]) => void;
};
type SkillPlanTableState = RequiredPick<SkillPlanTableProps, "skillPlanId" | "items" | "totalTime"> & {
    openCC: boolean;
    columnAttributesChecked?: boolean;
    columnSPhsStyleChecked?: boolean;
    columnLastRemapChecked?: boolean;
    attributesCellStyle?: R.CSSProperties;
    sPhsCellStyle?: R.CSSProperties;
    lastRemapCellStyle?: R.CSSProperties;
    columnConfigAnchor?: R.MouseEvent<HTMLButtonElement>["currentTarget"];
};
@inspect.injectAspect(enter)
export class SkillPlanTable extends R.Component<SkillPlanTableProps, SkillPlanTableState> {
    private selection: number[] = [];
    constructor(props: SkillPlanTableProps) {
        super(props);
        this.state = {
            skillPlanId: "0",
            items: [],
            totalTime: 0,
            openCC: false,
            columnAttributesChecked: true,
            columnSPhsStyleChecked: true,
            columnLastRemapChecked: true,
            attributesCellStyle: void 0,
            sPhsCellStyle: void 0,
            lastRemapCellStyle: void 0,
        };
        this.handleSortEnd = this.handleSortEnd.bind(this);
        this.updateSelection = this.updateSelection.bind(this);
    }
    static getDerivedStateFromProps(np: Readonly<SkillPlanTableProps>, ps: SkillPlanTableState): TBC<Partial<SkillPlanTableState>> {
        let modified = false;
        const newState: Partial<SkillPlanTableState> = onil();
        if (np.skillPlanId !== ps.skillPlanId || np.items !== ps.items) {
            newState.skillPlanId = np.skillPlanId;
            newState.items = np.items;
            modified = true;
        }
        if (np.totalTime !== ps.totalTime) {
            newState.totalTime = np.totalTime;
            modified = true;
        }
        return modified? newState: null;
    }
    // @ts-ignore unused parameter
    shouldComponentUpdate(np: Readonly<SkillPlanTableProps>, ns: Readonly<SkillPlanTableState>): boolean {
        const state = this.state;
        if (
            ns.skillPlanId !== state.skillPlanId || state.items.length === 0
        ) {
            this.selection.length = 0;
        }
        return true;
    }
    updateSelection(index: number, e: R.MouseEvent<HTMLElement>) {
        $consumeEvent(e.nativeEvent);
        let copies = this.selection.slice();
        const testIndex = copies.indexOf(index);
        if (e.shiftKey && copies.length === 1) {
            const selectedOne = copies[0];
            if (selectedOne > index) {
                for (let i = index; i < selectedOne; i++) {
                    copies.push(i);
                }
            } else {
                for (let i = index; i > selectedOne; i--) {
                    copies.push(i);
                }
            }
        } else if (e.ctrlKey || e.metaKey || copies.length === 0) {
            if (testIndex !== -1) {
                copies.splice(testIndex, 1);
            } else {
                copies.push(index);
            }
        } else if (testIndex === -1) {
            copies = [index];
        }
        copies.length > 1 && copies.sort(mf.PrimativeComparator);
        this.selection = copies;
        this.forceUpdate();
        requestAnimationFrame(() => {
            const handler = this.props.onSelectionChange;
            typeof handler === "function" && handler(copies);
        });
    }
    handleSortEnd({ oldIndex, newIndex }: { oldIndex: number, newIndex: number }) {
        const sel = this.selection;
        this.props.onSkillMove(oldIndex, newIndex, sel.slice());
        sel.length = 0;
    }
    showColumnConfig = (e: R.MouseEvent<HTMLButtonElement>) => {
        this.setState({
            openCC: true,
            columnConfigAnchor: e.currentTarget,
        });
    }
    handleChangeEvents = (e: R.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        let newState: SkillPlanTableState = onil();
        let styleKey: "attributesCellStyle" | "sPhsCellStyle" | "lastRemapCellStyle";
        switch (e.currentTarget.value) {
            case "columnAttributesChecked":
                styleKey = "attributesCellStyle";
                newState.columnAttributesChecked = checked;
                break;
            case "columnSPhsStyleChecked":
                styleKey = "sPhsCellStyle";
                newState.columnSPhsStyleChecked = checked;
                break;
            default:
                styleKey = "lastRemapCellStyle";
                newState.columnLastRemapChecked = checked;
                break;
        }
        newState[styleKey] = checked ? void 0 : { color: "transparent" };
        this.setState(newState);
    }
    private renderPlanItems() {
        const {
            items,
            sPhsCellStyle,
            lastRemapCellStyle,
            attributesCellStyle,
        } = this.state;
        const onRemove = this.props.onRemove;
        const sel = this.selection;
        console.time("SkillPlanTable::renderPlanItems");
        const rows: ReactInstanceType<typeof SortablePlanItem>[] = [];
        const ignoreHighlight = sel.length === 0;
        for (let index = 0, end = items.length; index < end; index++) {
            const value = items[index];
            const highlighted = ignoreHighlight? !1: sel.includes(index);
            rows[index] = (
                <SortablePlanItem
                    key={value.type === "skill" ? value.title : `item-${index}`}
                    index={index}
                    idx={index}
                    highlighted={highlighted}
                    value={value}
                    onEdit={this.props.onEdit}
                    onMouseDown={this.updateSelection}
                    onRemove={onRemove}
                    columnAttributes={attributesCellStyle}
                    columnSPhs={sPhsCellStyle}
                    columnLastRemap={lastRemapCellStyle}
                />
            );
        }
        console.timeEnd("SkillPlanTable::renderPlanItems");
        return rows;
    }
    render() {
        const state = this.state;
        const margin = { margin: "0 3px 0 2px" } as R.CSSProperties;
        const theme = EVEApp.getTheme();
        const stickyStyle = {
            // @ts-ignore typescript cannot detect css var
            "--sticky-bg": theme.palette.background.paper
        } as Record<string, R.CSSProperties>;
        return (
            <Paper className="margin10" style={planTableStyles.queueItemsPaper}>
                <Popover
                    open={state.openCC}
                    anchorEl={state.columnConfigAnchor}
                    container={() => $query("div.app")}
                    anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    onClose={() => this.setState({ openCC: false })}
                >
                    <div className="margin10" style={planTableStyles.popover}>
                        {}
                        <LabeledCheckBox style={margin}
                            label="Attributes"
                            value="columnAttributesChecked"
                            checked={state.columnAttributesChecked}
                            onChange={this.handleChangeEvents}
                        />
                        <LabeledCheckBox style={margin}
                            label="SP/h"
                            value="columnSPhsStyleChecked"
                            checked={state.columnSPhsStyleChecked}
                            onChange={this.handleChangeEvents}
                        />
                        <LabeledCheckBox style={margin}
                            label="Remap"
                            value="columnLastRemapChecked"
                            checked={state.columnLastRemapChecked}
                            onChange={this.handleChangeEvents}
                        />
                    </div>
                </Popover>
                {}
                {}
                <Table className="skillplan-table">
                    <TableHead>
                        {}
                        <tr className="plan-header-row plans-horizontal-layout" style={stickyStyle}>
                            <TableCell children="Skill"/>
                            <TableCell children="Training Time"/>
                            <TableCell children="Group"/>
                            <TableCell style={state.attributesCellStyle} children="Attributes"/>
                            <TableCell style={state.sPhsCellStyle} children="SP/H"/>
                            <TableCell style={state.lastRemapCellStyle} children="Since remap"/>
                            <TableCell/>{}
                            <TableCell>
                                <IconButton title="show column config"
                                    className="padding-4px"
                                    onClick={this.showColumnConfig}
                                >
                                    <Icon>dehaze</Icon> {}
                                </IconButton>
                            </TableCell>
                        </tr>
                    </TableHead>
                    {}
                    <SortablePlanQueueTableBody
                        distance={3} lockAxis="y"
                        shouldCancelStart={shouldCancelStart}
                        onSortEnd={this.handleSortEnd}
                    >{state.items.length? this.renderPlanItems(): null}</SortablePlanQueueTableBody>
                    <TableFooter>
                        <tr className="plan-footer-row" style={stickyStyle}>
                            <TableCell>
                                {`${additionalDetails(state.items, this.selection)}${this.props.unknownSkills? ` - unknown skills(${this.props.unknownSkills})`: ""}`}
                            </TableCell>
                            <TableCell colSpan={7}>
                                {DateTimeUtil.niceCountdown(state.totalTime)}
                            </TableCell>
                        </tr>
                    </TableFooter>
                </Table>
            </Paper>
        );
    }
}