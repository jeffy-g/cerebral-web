import * as R from "react";
import red from "@material-ui/core/colors/red";
import green from "@material-ui/core/colors/green";
import SortableTree, { TreeItem } from "react-sortable-tree";
import { SkillDB } from "@eve/models/eve-skills";
import * as CharProvider from "@eve/models/char-provider";
import * as DateTimeUtil from "@util/date-time-util";
import { PlanCharacter } from "@eve/models/plan-character";
type SkillTreeProps = {
    characterId: string;
    selectedType: number;
};
type SkillTreeState = {
    treeData: TBC<TreeItem[]>;
};
const DEBUG = !1;
export class SkillTree extends R.Component<SkillTreeProps, SkillTreeState> {
    private character!: IEVECharacter;
    private planCharacter!: PlanCharacter;
    private isCharIdChange: boolean;
    private isTypeChange: boolean;
    constructor(props: SkillTreeProps) {
        super(props);
        this.state = {
            treeData: null,
        };
        this.isCharIdChange = this.isTypeChange = false;
        const { characterId } = this.props;
        if (CharProvider.isCharacterAvailable(characterId)) {
            this.character = CharProvider.getCharacter(characterId)!;
            this.planCharacter = new PlanCharacter(characterId);
        }
    }
    shouldComponentUpdate(np: Readonly<SkillTreeProps>, ns: Readonly<SkillTreeState>): boolean {
        if (DEBUG) console.log("SkillTree::shouldComponentUpdate", arguments);
        this.isCharIdChange = np.characterId !== this.props.characterId;
        this.isTypeChange = np.selectedType !== this.props.selectedType;
        return this.isTypeChange || this.isCharIdChange || ns.treeData !== this.state.treeData;
    }
    getTreeNode(skillId: number, lvl?: number): TreeItem {
        const targetSkill = SkillDB.skills[skillId];
        const title = targetSkill.name;
        let subtitle: R.ReactNode = "";
        if (lvl !== undefined && lvl > 0) {
            subtitle = `Required Level: ${lvl}`;
        }
        if (this.character !== undefined) {
            const charSkill = this.character.skills.find(sk => (sk.skill_id === skillId));
            if (charSkill !== undefined && charSkill.trained_skill_level !== undefined) {
                const spanProps = {
                    style: { color: green[600] }, children: ""
                };
                if (charSkill.trained_skill_level >= lvl!) {
                    spanProps.children = `${subtitle}, Trained Level: ${charSkill.trained_skill_level}`;
                } else if (lvl === undefined || lvl === 0) {
                    spanProps.children = `Trained Level: ${charSkill.trained_skill_level}`;
                } else {
                    this.planCharacter.planSkill(skillId, lvl, 0);
                    const time = DateTimeUtil.niceCountdown(this.planCharacter.time);
                    this.planCharacter.reset();
                    spanProps.children = `${subtitle}, Trained Level: ${charSkill.trained_skill_level} (${time})`;
                    // @ts-ignore 2020/3/19 - style.color to be uniq?
                    spanProps.style.color = red[500];
                }
                subtitle = <span {...spanProps} />;
            } else {
                const tlvl = lvl !== undefined && lvl > 0 ? lvl : 1;
                this.planCharacter.planSkill(skillId, tlvl, 0);
                const time = DateTimeUtil.niceCountdown(this.planCharacter.time);
                this.planCharacter.reset();
                subtitle = <span style={{ color: red[500] }}>
                    {`${subtitle ? `${subtitle}, ` : ""}Trained Level: 0 (${time})`}
                </span>;
            }
        }
        const item: TreeItem = {
            title,
            subtitle,
            expanded: true,
            noDragging: true,
        };
        if (targetSkill.rq_skills.length > 0) {
            const skChildren: TreeItem[] = [];
            for (const requiredSkill of targetSkill.rq_skills) {
                skChildren.push(this.getTreeNode(requiredSkill.id, requiredSkill.level));
            }
            item.children = skChildren;
        }
        return item;
    }
    render() {
        const { characterId, selectedType } = this.props;
        if (characterId !== "0") {
            if (this.isCharIdChange) {
                this.character = CharProvider.getCharacter(characterId)!;
                this.planCharacter = new PlanCharacter(characterId);
            }
        }
        if (+!!selectedType === 0) {
            return null;
        }
        let treeData: TreeItem[] = this.state.treeData!;
        if (treeData === null || this.isTypeChange || this.isCharIdChange) {
            this.isCharIdChange = this.isTypeChange = false;
            treeData = [this.getTreeNode(selectedType)];
        }
        return (
            <div style={{ padding: "2px 6px" }}>
                <SortableTree
                    style={{ height: "100%", color: "#303030" }}
                    treeData={treeData}
                    onChange={treeData => this.setState({ treeData })}
                    isVirtualized={false}
                    canDrag={false}
                />
            </div>
        );
    }
}