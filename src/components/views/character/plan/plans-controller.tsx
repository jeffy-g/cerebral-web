import * as R from "react";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import Button, {
} from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import {
    ExportPlanPopover, ImportPlanPopover, PlanLevelPopover,
    PlanPopoverProps, ImportPlanPopoverProps, PlanLevelPopoverProps, ExportPlanPopoverProps
} from "./plan-popovers";
import { TextFieldPopover, TextFieldPopoverProps } from "@com/popovers/text-field-popover";
import { NoteDialog, NoteDialogProps } from "@com/dialogs/note-dialog";
import { RemapDialog, RemapDialogProps } from "./remap-dialog";
type TPlanComponentPropsKeysMap = {
    ADD_NOTE: "open" | "title" | "details";
    ADD_REMAP: "open" | "attributes" | "implants" | "editIndex";
    EXPORT: "open" | "anchorEl" | "planName" | "items" | "shoppingListItems";
    IMPORT: "open" | "anchorEl";
    LEVEL: "open" | "anchorEl";
    NEW_PLAN: "open" | "anchorEl" | "placeholder" | "text" | "onEnter";
    RENAME: TPlanComponentPropsKeysMap["NEW_PLAN"];
    NONE: never;
};
type TPlanActions = keyof TPlanComponentPropsKeysMap;
export type TPlanPopoverPropsSet =
    Partial<ExportPlanPopoverProps> &
    PartialPick<TextFieldPopoverProps, "placeholder" | "onEnter"> &
    PartialPick<IPlanModel, "onImport" | "onLevelSelected" | "onAddRemap" | "onGetOptimalAttributes" | "applyNoteContents"> & {
    open?: boolean;
    anchorEl?: PlanPopoverProps<unknown>["anchorEl"];
    editIndex?: number;
    attributes?: EVECharacterAttributesFragment;
    implants?: number;
    text?: string;
    details?: NoteDialogProps["details"];
    title?: string;
    onClose?: TStdFunction;
} & TransitionEventTriggers;
export type TPlanActionState = TPlanPopoverPropsSet & {
    action: TPlanActions;
};
export type TPlanComponentProps<Action extends TPlanActions> = Pick<TPlanPopoverPropsSet, TPlanComponentPropsKeysMap[Action]>;
export type TPlanComponentAction<Action extends TPlanActions> = {
    action: Action;
} & TPlanComponentProps<Action>;
export interface IPlanModel {
    fireNextAction<E extends TPlanActions>(
        nextAction: TPlanComponentAction<E>
    ): void;
    getSelectedPlanItemIndex(): number | undefined;
    onLevelSelected: PlanLevelPopoverProps["onLevelSelected"];
    applyNoteContents: NoteDialogProps["applyNoteContents"];
    onAddRemap(attributes?: EVECharacterAttributesFragment, implants?: number, index?: number): void;
    onGetOptimalAttributes: RemapDialogProps["onGetOptimalAttributes"];
    handleSkillPlanAdd(name: string): Promise<void>;
    handleSkillPlanShift(e: R.ChangeEvent<MuiSelectContext>): void;
    handleSkillPlanRename(name?: string): Promise<void>;
    handleSkillPlanDelete(): void;
    handleSkillPlanDuplicate(): void;
    onImport: ImportPlanPopoverProps["onImport"];
}
type TPlanSetStateAction = R.Dispatch<R.SetStateAction<TPlanActionState>>;
function usePlanController(state: TPlanActionState, model: IPlanModel) {
    const [controlState, updateControlState] = R.useState(state);
    const onClose = R.useCallback(() => {
        updateControlState(prev => {
            return { ...prev, open: false };
        });
    }, []);
    const onExited = R.useCallback(() => {
        requestAnimationFrame(() => updateControlState({ action: "NONE" }));
    }, []);
    let componentProps: TPlanPopoverPropsSet;
    let componentCtor: R.ComponentClass<any> | undefined;
    const { action, ...remains } = controlState;
    if (action !== "NONE") {
        (componentProps = remains).onExited = onExited;
        if (typeof componentProps.open !== "boolean") {
            componentProps.open = true;
        }
    } else {
        componentProps = onil();
    }
    switch (action) {
        case "ADD_NOTE": {
            componentCtor = NoteDialog;
            componentProps.applyNoteContents = model.applyNoteContents;
            break;
        }
        case "ADD_REMAP": {
            componentCtor = RemapDialog;
            if (componentProps.editIndex === void 0) {
                componentProps.editIndex = model.getSelectedPlanItemIndex();
            }
            componentProps.onAddRemap = model.onAddRemap;
            componentProps.onGetOptimalAttributes = model.onGetOptimalAttributes;
            break;
        }
        case "EXPORT":
        case "IMPORT": {
            if (action === "IMPORT") {
                componentCtor = ImportPlanPopover;
                componentProps.onImport = model.onImport;
            } else {
                componentCtor = ExportPlanPopover;
            }
            componentProps.onClose = onClose;
            break;
        }
        case "LEVEL": {
            componentCtor = PlanLevelPopover;
            componentProps.onClose = onClose;
            componentProps.onLevelSelected = model.onLevelSelected;
            break;
        }
        case "NEW_PLAN":
        case "RENAME": {
            componentCtor = TextFieldPopover;
            break;
        }
        default: {
            break;
        }
    }
    return [componentProps, componentCtor, onClose, updateControlState] as [
        TPlanPopoverPropsSet,
        typeof componentCtor,
        typeof onClose,
        IPlanModel["fireNextAction"],
    ];
}
const createButton = (
    text: string,
    clickHandler: (event: R.MouseEvent<HTMLElement>) => void,
    disableRipple: boolean = false,
) => {
    return <Button variant="outlined"
        className="legacy-button"
        disableRipple={disableRipple}
        onClick={clickHandler}
        children={text}
    />;
};
type PlansControllerProps = {
    planName: string;
    items: PlanQueueItem[];
    shoppingListItems?: PlanQueueItem[];
    planSummaries: PlanSummary[];
    skillPlanId: string;
    planInterface: IPlanModel;
};
const emitEnterHandler = (model: IPlanModel, method: "handleSkillPlanAdd" | "handleSkillPlanRename", onClose: TStdFunction) => {
    return (text => {
        onClose();
        if (text && text.length) {
            model[method](text);
        }
    }) as TPlanActionState["onEnter"];
};
const ensurePreviouState = (
    prevWithoutOpen: ExcludePick<TPlanActionState, "open">,
    newState: TPlanActionState
) => {
    const mergedState = {...prevWithoutOpen, ...newState} as TPlanActionState;
    const keys = Object.keys(mergedState) as (keyof TPlanActionState)[];
    for (let index = 0, end = keys.length; index < end;) {
        const key = keys[index++];
        if (key !== "open") {
            if (mergedState[key] === void 0) {
                (mergedState[key] as TPlanActionState[typeof key]) = prevWithoutOpen[key];
            }
        }
    }
    return mergedState;
};
export const PlansController: R.FunctionComponent<PlansControllerProps> = (props: PlansControllerProps) => {
    console.time("<PlansController>");
    const model = props.planInterface;
    const [popoverProps, PopoverComponent, onClose, fireAction] = usePlanController({ action: "NONE", open: false }, model);
    if (model.fireNextAction === void 0) {
        model.fireNextAction = (newState: TPlanActionState) => {
            (fireAction as TPlanSetStateAction)((prev: TPlanActionState) => {
                const { open, ...stateWithOutOpen } = prev;
                return ensurePreviouState(stateWithOutOpen, newState);
            });
        };
    }
    const jsx = <>
        {PopoverComponent? <PopoverComponent {...popoverProps}/>: null}
        <Paper className="plan-control-container">
            {}
            <FormControl style={{
                margin: "0 0 0 6px"
            }}>
                <InputLabel htmlFor="eve-skillPlan-selector">Skill Plans List</InputLabel>
                <Select autoFocus
                    id="eve-skillPlan-selector"
                    style={{ width: 268, marginTop: 16 }}
                    value={props.skillPlanId}
                    onChange={model.handleSkillPlanShift}
                >
                    <MenuItem value="0" >- blank plan -</MenuItem>
                    {props.planSummaries.map(plan => {
                        return (<MenuItem key={plan.id} value={plan.id}>{plan.name}</MenuItem>);
                    })}
                </Select>
            </FormControl>
            <div style={{
                display: "inline-block", marginLeft: 24
            }}>
                <div>
                    {createButton("New Plan", (e: R.MouseEvent<HTMLElement>) => fireAction({
                        action: "NEW_PLAN",
                        anchorEl: e.currentTarget,
                        placeholder: "New plan name",
                        text: props.planName,
                        onEnter: emitEnterHandler(model, "handleSkillPlanAdd", onClose)
                    }), true)}
                    {createButton("Rename", (e: R.MouseEvent<HTMLElement>) => fireAction({
                        action: "RENAME",
                        anchorEl: e.currentTarget,
                        placeholder: "Edit plan name",
                        text: props.planName,
                        onEnter: emitEnterHandler(model, "handleSkillPlanRename", onClose)
                    }), true)}
                    {createButton("Import", e => fireAction({
                        action: "IMPORT",
                        anchorEl: e.currentTarget,
                    }))}
                </div>
                <div>
                    {createButton("Duplicate", model.handleSkillPlanDuplicate)}
                    {createButton("Delete", model.handleSkillPlanDelete)}
                    {createButton("Export", e => fireAction({
                        action: "EXPORT",
                        anchorEl: e.currentTarget,
                        planName: props.planName,
                        items: props.items,
                        shoppingListItems: props.shoppingListItems
                    }))}
                </div>
            </div>
            <div className="flex-padding-item"></div>
            <div className="buttons-last-box">
                <div>
                    {createButton("Add Remap", () => fireAction({ action: "ADD_REMAP" }))}
                </div>
                <div>
                    {createButton("Add Note", () => fireAction({ action: "ADD_NOTE" }))}
                </div>
            </div>
        </Paper>
    </>;
    console.timeEnd("<PlansController>");
    return jsx;
};
PlansController.displayName = "PlansController";