/*!
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  <one line to give the program's name and a brief idea of what it does.>
  Copyright (C) 2019 jeffy-g hirotom1107@gmail.com

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
import * as R from "react";
import Card from "@material-ui/core/Card";
import { FilterableSkillList } from "@com/skillbrowser/filterable-skill-list";
import {
    PlansController,
    TPlanActionState,
    IPlanModel,
} from "./plans-controller";
import { SkillPlanTable } from "./skillpaln-table";
import { PlanCharacter } from "@eve/models/plan-character";
import * as mf from "@util/misc-functions";
import inspects, {
    time,
} from "@util/inspect/";
const VOID: undefined = void 0;
type PlansState = {
    items: PlanQueueItem[];
    planSummaries: PlanSummary[];
    skillPlanId: string;
    skillPlanName: string;
};
type TSkillPlanStore = typeof import("./skill-plan-store");
let SkillPlanStore: TSkillPlanStore;
const initStore = async () => {
    if (SkillPlanStore === void 0) {
        SkillPlanStore = await import("./skill-plan-store");
        await SkillPlanStore.init();
        SkillPlanStore.run();
    }
};
type TPlansMethodKeys = Exclude<keyof Plans, keyof R.Component<any> | "updateControlState">;
const bindMethodsNames = [
    "handleSkillSelected",
    "onLevelSelected",
    "onAddRemap",
    "onGetOptimalAttributes",
    "handleItemMove",
    "handleItemRemove",
    "handleSkillPlanAdd",
    "handleSkillPlanRename",
    "handleSkillPlanShift",
    "handleSkillPlanDuplicate",
    "handleSkillPlanDelete",
    "onImport",
    "handleItemEdit",
] as TPlansMethodKeys[];
@inspects.injectAspect(time)
export class Plans
    extends R.Component<EVEComponentPropsBase, PlansState> implements IPlanModel {
    private planCharacter: PlanCharacter;
    fireNextAction!: IPlanModel["fireNextAction"];
    constructor(props: EVEComponentPropsBase) {
        super(props);
        initStore();
        this.state = {
            items: [],
            planSummaries: [],
            skillPlanId: "0",
            skillPlanName: "",
        };
        this.planCharacter = new PlanCharacter(this.props.characterId);
        for (let index = 0, end = bindMethodsNames.length; index < end; index++) {
            const method = bindMethodsNames[index];
            // @ts-ignore 
            this[method] = this[method].bind(this);
        }
    }
    private updateStoreIf = () => {
        const state = this.state;
        if (state.skillPlanId !== "0") {
            SkillPlanStore.storeSkillPlan(
                this.props.characterId,
                state.skillPlanId,
                state.skillPlanName,
                this.planCharacter.queue,
            );
        }
    }
    private asyncSetState<P = EVEComponentPropsBase, S = PlansState>(
        state: (
            (prevState: Readonly<S>, props: Readonly<P>) => (Pick<S, keyof S> | S | null)
        ) | (
            Pick<S, keyof S> | S | null
        ),
    ) {
        // @ts-ignore typescript type assertion is unstable
        requestAnimationFrame(() => this.setState(state, this.updateStoreIf));
    }
    shouldComponentUpdate(np: EVEComponentPropsBase) {
        let shouldUpdate = true;
        const characterId = np.characterId;
        if (
            characterId !== VOID && characterId !== "0" &&
            characterId !== this.props.characterId
        ) {
            shouldUpdate = false;
            const pc: PlanCharacter = new PlanCharacter(characterId);
            this.planCharacter = pc;
            SkillPlanStore.getSkillPlansForCharacter(characterId).then(plans => {
                this.setState({
                    items: pc.queue,
                    planSummaries: plans,
                    skillPlanId: "0",
                    skillPlanName: "",
                });
            });
        }
        return shouldUpdate;
    }
    async componentDidMount() {
        if (SkillPlanStore === void 0) {
            console.time("SkillPlanStore.load");
            do {
                await mf.sleep(16);
            } while (SkillPlanStore === void 0);
            console.timeEnd("SkillPlanStore.load");
        }
        SkillPlanStore.getSkillPlansForCharacter(this.props.characterId).then(plans => {
            this.setState({
                planSummaries: plans
            });
        });
    }
    componentWillUnmount() {
        if (SkillPlanStore) {
            SkillPlanStore.stop();
            (SkillPlanStore as TBD<TSkillPlanStore>) = void 0;
            console.log("SkillPlanStore has been purge.");
        }
    }
    handleItemMove(oldIndex: number, newIndex: number, selectedRowIndexes: number[]) {
        if (oldIndex === newIndex) return;
        const pc = this.planCharacter;
        if (selectedRowIndexes === VOID || selectedRowIndexes.length <= 1) {
            pc.moveQueuedItemByPosition(oldIndex, newIndex, true);
        } else if (selectedRowIndexes !== VOID && selectedRowIndexes.length > 1) {
            pc.moveQueuedItemsByPosition(oldIndex, newIndex, selectedRowIndexes);
        }
        this.asyncSetState({
            items: pc.queue,
        });
    }
    private selectedTypeId: number = 0;
    handleSkillSelected(selectedTid: number, e: R.MouseEvent) {
        this.selectedTypeId = selectedTid;
        this.fireNextAction({
            action: "LEVEL",
            anchorEl: (e.currentTarget as HTMLElement),
        });
    }
    onLevelSelected(level: number, prereqs?: number) {
        this.fireNextAction({
            open: false,
            action: "LEVEL",
        });
        const pc = this.planCharacter;
        pc.planSkill(this.selectedTypeId, level, prereqs);
        this.asyncSetState({
            items: pc.queue,
        });
    }
    handleItemRemove(index: number) {
        const pc = this.planCharacter;
        pc.removeItemByPosition(index);
        this.currentSelection.length = 0;
        this.asyncSetState({
            items: pc.queue,
        });
    }
    private currentSelection: number[] = [];
    getSelectedPlanItemIndex() {
        let insertIndex: number | undefined;
        const selection = this.currentSelection;
        if (selection.length) {
            insertIndex = selection[0];
            selection.length = 0;
        }
        return insertIndex;
    }
    onAddRemap(attributes?: EVECharacterAttributesFragment, implants?: number, index?: number) {
        const asNew = index === VOID;
        asNew && (index = this.getSelectedPlanItemIndex());
        this.fireNextAction({
            action: "ADD_REMAP",
            open: false,
            attributes,
            implants,
            editIndex: index,
        });
        if (attributes !== VOID) {
            let newState: Partial<PlansState> = onil();
            const pc = this.planCharacter;
            if (asNew || index !== VOID && !pc.isQueueItemTypeOf(index, "remap")) {
                pc.addRemap(attributes, implants!, index);
            } else {
                pc.editRemapAtPosition(attributes, implants!, index!);
            }
            newState.items = pc.queue;
            this.asyncSetState(newState as PlansState);
        }
    }
    handleSelectionChange = (selection: number[]) => {
        this.currentSelection = selection? selection: [];
    }
    applyNoteContents = (title?: string, details?: string, index?: number) => {
        if (title !== VOID) {
            const pc = this.planCharacter;
            if (index === VOID) {
                pc.addNote(title, details!, this.getSelectedPlanItemIndex());
            } else {
                pc.editNoteAtPosition(title, details!, index);
            }
            this.asyncSetState({
                items: pc.queue,
            });
        }
        this.fireNextAction({
            open: false,
            action: "ADD_NOTE",
        });
    }
    onGetOptimalAttributes(index: number, implants: number) {
        const { state: { items = [] } } = this;
        const item = items[index] as QueueItemKind<"remap">;
        item && this.fireNextAction({
            action: "ADD_REMAP",
            attributes: this.planCharacter.getSuggestedAttributesForRemapAt(index, implants),
            implants: item.implants,
            editIndex: index,
        });
    }
    handleSkillPlanShift(e: R.ChangeEvent<MuiSelectContext>) {
        e.stopPropagation();
        const skillPlanId = e.target.value as string;
        if (skillPlanId === VOID) {
            return;
        }
        const pc = this.planCharacter;
        if (skillPlanId === "0") {
            pc.reset();
            this.setState({
                skillPlanId,
                items: pc.queue,
                skillPlanName: "",
            });
        } else {
            SkillPlanStore.getSkillPlan(this.props.characterId, skillPlanId).then(plan => {
                if (plan !== null) {
                    pc.reset();
                    console.time("PlanCharacter::addItemsToQueue");
                    pc.addItemsToQueue(plan.queue);
                    console.timeEnd("PlanCharacter::addItemsToQueue");
                    this.setState({
                        skillPlanId,
                        items: pc.queue,
                        skillPlanName: plan.name,
                    });
                }
            });
        }
    }
    async handleSkillPlanAdd(name: string) {
        if (name === VOID || !name.length) {
            return;
        }
        const { characterId } = this.props;
        if (await SkillPlanStore.containsByName(characterId, name)) {
            EVEApp.marshalling({
                "notify.error": `Plan name '${name}' is already exists.\nSo cannot create this requested plan...`
            });
            return;
        }
        const newUuid = mf.createUUID();
        const pc = this.planCharacter;
        pc.reset();
        await SkillPlanStore.storeSkillPlan(characterId, newUuid, name, pc.queue);
        const plans = await SkillPlanStore.getSkillPlansForCharacter(characterId);
        this.setState({
            items: pc.queue,
            planSummaries: plans,
            skillPlanId: newUuid,
            skillPlanName: name,
        });
    }
    async handleSkillPlanRename(name?: string) {
        if (name === VOID || !name.length) {
            return;
        }
        const { props: { characterId }, state: { skillPlanId } } = this;
        const errorMsg =
            skillPlanId === "0"? "currently editing plan is dummy so cannot rename":
            await SkillPlanStore.containsByName(characterId, name)? `Plan name '${name}' is already exists.\nSo cannot apply this requested name...`: "";
        if (errorMsg) {
            EVEApp.marshalling({ "notify.error": errorMsg });
            return;
        }
        SkillPlanStore.doesPlanExist(characterId, skillPlanId).then(exist => {
            if (exist) {
                SkillPlanStore.storeSkillPlan(
                    characterId, skillPlanId, name, this.planCharacter.queue,
                ).then(async () => {
                    const planSummaries = await SkillPlanStore.getSkillPlansForCharacter(characterId);
                    this.setState({
                        planSummaries, skillPlanName: name
                    });
                });
            }
        });
    }
    handleSkillPlanDelete() {
        const sid = this.state.skillPlanId;
        const pc = this.planCharacter;
        if (sid !== "0" || pc.queue.length) {
            pc.reset();
            const newState = {
                skillPlanId: "0",
                items: [],
                skillPlanName: ""
            } as Partial<PlansState>;
            if (sid !== "0") {
                const cid = this.props.characterId;
                SkillPlanStore.deleteSkillPlan(cid, sid).then(deleted => {
                    if (deleted) {
                        SkillPlanStore.getSkillPlansForCharacter(cid).then(planSummaries => {
                            newState.planSummaries = planSummaries;
                            this.setState(newState as PlansState);
                        });
                    }
                });
            } else {
                this.asyncSetState(newState as PlansState);
            }
        }
    }
    handleSkillPlanDuplicate() {
        const { state } = this;
        const { characterId } = this.props;
        if (state.skillPlanId !== "0") {
            SkillPlanStore.doesPlanExist(characterId, state.skillPlanId).then(exists => {
                if (exists) {
                    const newId = mf.createUUID();
                    const newName = `Copy of ${state.skillPlanName}`;
                    const pc = this.planCharacter;
                    SkillPlanStore.storeSkillPlan(
                        characterId, newId, newName, pc.queue,
                    ).then(() => {
                        SkillPlanStore.getSkillPlansForCharacter(characterId).then(plans => {
                            this.setState({
                                items: pc.queue,
                                planSummaries: plans,
                                skillPlanId: newId,
                                skillPlanName: newName,
                            });
                        });
                    });
                }
            });
        }
    }
    onImport(name?: string, dataType?: string, planData?: PlanDatas.CerebralSkillImportFormat) {
        const pc = this.planCharacter;
        let skillPlanName = "";
        let impossible: TBD<number>;
        if (name !== VOID && dataType !== VOID && planData !== VOID && planData.queue.length > 0) {
            pc.addNote(name, `Imported from ${dataType}`);
            skillPlanName = planData.planName;
            planData.queue.forEach(item => {
                if (item.type === "skill") {
                    pc.planSkill(item.typeId, item.level);
                }
                else if (item.type === "remap") {
                    pc.addRemap(item.attributes, item.implants);
                } else {
                    pc.addNote(item.title, item.details);
                }
            });
        } else if (name === "skillQueue") {
            skillPlanName = "current skill queue - " + Date.now();
            const origin = pc.getOrigin();
            for (const skill of origin.skillQueue) {
                pc.planSkill(skill.skill_id, skill.finished_level);
            }
        } else {
            impossible = 1;
            planData === void 0 && EVEApp.marshalling({
                "notify.error": "Processing was interrupted\nbecause an attempt was made to import invalid plan data."
            });
        }
        if (!impossible) {
            if (this.state.skillPlanName.length) {
                this.asyncSetState({
                    items: pc.queue,
                });
            } else {
                const { characterId } = this.props;
                const newId = mf.createUUID();
                SkillPlanStore.storeSkillPlan(
                    characterId, newId, skillPlanName, pc.queue,
                ).then(() => {
                    SkillPlanStore.getSkillPlansForCharacter(characterId).then(planSummaries => {
                        this.setState({
                            items: pc.queue,
                            skillPlanId: newId,
                            planSummaries,
                            skillPlanName,
                        });
                    });
                });
            }
        }
    }
    handleItemEdit(index: number) {
        const item = this.state.items[index];
        if (item === VOID) return;
        let nextAction: TBD<TPlanActionState>;
        if (item.type === "remap") {
            nextAction = {
                action: "ADD_REMAP",
                attributes: {...item.attributes},
                implants: item.implants,
            };
        } else if (item.type === "note") {
            nextAction = {
                action: "ADD_NOTE",
                title: item.title,
                details: item.details,
            };
        }
        if (nextAction) {
            nextAction.editIndex = index;
            this.fireNextAction(nextAction);
        }
    }
    filterKnownSkills() {
        const skills = this.planCharacter.getOrigin().skills;
        const items = this.state.items;
        const filtered: QueueItemKind<"skill">[] = [];
        items.forEach(item => {
            if (item.type === "skill" && !filtered.find(filteredItem => filteredItem.id === item.id)) {
                !skills.find(skill => item.id === skill.skill_id) && filtered.push(item);
            }
        });
        return filtered.length? filtered.sort((a, b) => a.name.localeCompare(b.name)): void 0;
    }
    render() {
        const state = this.state;
        const { items, skillPlanId } = state;
        const unknownSkills = this.filterKnownSkills();
        console.time("<Plans>");
        const jsx = <>
            <PlansController
                planName={state.skillPlanName}
                items={items}
                shoppingListItems={unknownSkills}
                planSummaries={state.planSummaries}
                skillPlanId={skillPlanId}
                planInterface={this}
            />
            <table style={{ tableLayout: "fixed" }}>
                <tbody>
                    <tr>
                        <td className="skill-browser__leftContent">
                            <Card className="skill-browser__leftContent__bottomElement">
                                <FilterableSkillList
                                    adjustHeight={248}
                                    characterId={this.props.characterId}
                                    onSkillSelectionChange={this.handleSkillSelected}
                                    selectedType={this.selectedTypeId}
                                />
                            </Card>
                        </td>
                        <td className="skill-browser__rightContent">
                            {
                            }
                            <SkillPlanTable
                                items={items}
                                onEdit={this.handleItemEdit}
                                onRemove={this.handleItemRemove}
                                totalTime={this.planCharacter.time}
                                skillPlanId={skillPlanId}
                                onSkillMove={this.handleItemMove}
                                unknownSkills={unknownSkills?.length}
                                onSelectionChange={this.handleSelectionChange}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        </>;
        console.timeEnd("<Plans>");
        return jsx;
    }
}