import * as R from "react";
import { RouteChildrenProps } from "react-router";
import Card from "@material-ui/core/Card";
import Paper from "@material-ui/core/Paper";
import CardContent from "@material-ui/core/CardContent";
import grey from "@material-ui/core/colors/grey";
import { BorderedCardHeader } from "../tiny/extras";
import { ManagedCharacterSelect } from "../skillbrowser/char-selector";
import { FilterableSkillList } from "../skillbrowser/filterable-skill-list";
import { SkillInfoCard } from "../skillbrowser/skill-info-card";
import { SkillTree } from "../skillbrowser/skill-tree";
import * as DateTimeUtil from "@util/date-time-util";
import * as CharProvider from "@eve/models/char-provider";
import { PlanCharacter } from "@eve/models/plan-character";
type SkillBrowserState = {
    selectedType: number,
    characterId: string,
};
export class SkillBrowser extends R.Component<RouteChildrenProps, SkillBrowserState> {
    private queue: QueueItemKind<"skill">[];
    constructor(props: RouteChildrenProps) {
        super(props);
        this.state = {
            selectedType: 0,
            characterId: "0",
        };
        this.queue = [];
    }
    private processSkillSelectionChange(
        cid: string = this.state.characterId,
        stype: number = this.state.selectedType
    ) {
        if (CharProvider.isCharacterAvailable(cid)) {
            const pc = new PlanCharacter(cid);
            pc.planSkill(stype, 1);
            this.queue = pc.queue as QueueItemKind<"skill">[];
        } else {
            this.queue = [];
        }
    }
    handleSkillListSelection = (selectedType: number): void => {
        this.processSkillSelectionChange(void 0, selectedType);
        this.setState({ selectedType });
    }
    handleCharacterChange = (value: string): void => {
        this.processSkillSelectionChange(value);
        this.setState({ characterId: value });
    }
    private createSkillBreakdownContent() {
        const skills = this.queue;
        const elements = skills.map((skill) => {
            const skillExplainLine = `${skill.name} ${skill.level}`;
            return <div key={skillExplainLine}>
                {skillExplainLine} - <div style={{ color: grey[500], display: "inline" }}>{`${DateTimeUtil.niceCountdown(skill.time)}`}</div>
            </div>;
        });
        const total = skills.reduce((total, skill) => total + skill.time, 0);
        return <>
            {elements}
            <div style={{ marginTop: 10 }}>{`🕛 Totals: ${DateTimeUtil.niceCountdown(total)}`}</div>
        </>;
    }
    render() {
        const { characterId, selectedType } = this.state;
        return (
            <table>
                <tbody>
                    <tr>
                        <td className="skill-browser__leftContent">
                            <Card classes={{ root: "skill-browser__leftContent__topElement" }}>
                                <ManagedCharacterSelect onCharacterChange={this.handleCharacterChange} />
                            </Card>
                            <Card className="skill-browser__leftContent__bottomElement">
                                <FilterableSkillList
                                    characterId={characterId}
                                    onSkillSelectionChange={this.handleSkillListSelection}
                                    selectedType={selectedType}
                                />
                            </Card>
                        </td>
                        <td className="skill-browser__rightContent">
                            <div>
                                {selectedType !== 0
                                    && <SkillInfoCard characterId={characterId} selectedType={selectedType} />
                                }
                                <Paper className="margin10">
                                    <SkillTree characterId={characterId} selectedType={selectedType} />
                                </Paper>
                            </div>
                            {this.queue.length > 0 && (
                                <Card className="margin10">
                                    <BorderedCardHeader
                                        title="Individual skill breakdown"
                                    />
                                    <CardContent style={{ padding: "10px 32px" }}>
                                        {this.createSkillBreakdownContent()}
                                    </CardContent>
                                </Card>
                            )}
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}