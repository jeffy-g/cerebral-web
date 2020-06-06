import * as R from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import grey from "@material-ui/core/colors/grey";
import { BorderedCardHeader } from "../tiny/extras";
import { SkillDB } from "@eve/models/eve-skills";
import * as CharProvider from "@eve/models/char-provider";
import * as DateTimeUtil from "@util/date-time-util";
import { PlanCharacter } from "@eve/models/plan-character";
import * as constatns from "@eve/models/constants";
const styles = {
    trainingTable: {
        color: grey[500],
        margin: "0px 8px",
    },
};
export const ROMAN_NUMERALS = [
    "",
    "Ⅰ",
    "Ⅱ",
    "Ⅲ",
    "Ⅳ",
    "Ⅴ",
];
let LEVEL_CELLs: ReactInstanceType<"td">[] = [];
const getSkillLevelCell = (level: number) => {
    let levels = LEVEL_CELLs;
    if (levels.length === 0) {
        const cn = "skill-train-explain-ordinal";
        LEVEL_CELLs = levels = [
            <td className={cn}>{ROMAN_NUMERALS[1]}</td>,
            <td className={cn}>{ROMAN_NUMERALS[2]}</td>,
            <td className={cn}>{ROMAN_NUMERALS[3]}</td>,
            <td className={cn}>{ROMAN_NUMERALS[4]}</td>,
            <td className={cn}>{ROMAN_NUMERALS[5]}</td>,
        ];
    }
    return levels[level - 1];
};
const ALREAD_OK_CELL = <td colSpan={2} className="skill-train-explain-cell">Already trained</td>;
type SkillInfoCardProps = {
    characterId: string;
    selectedType: number;
    style?: R.CSSProperties;
 };
export class SkillInfoCard extends R.Component<SkillInfoCardProps> {
    private type: number;
    private skillName: string;
    private skillDescription: string;
    private skillSubTitle: string;
    private character!: IEVECharacter;
    private planCharacter!: PlanCharacter;
    private trainingTableRows: JSX.Element[] | undefined;
    constructor(props: SkillInfoCardProps) {
        super(props);
        this.state = {};
        this.type = props.selectedType;
        this.skillName = "";
        this.skillDescription = "";
        this.skillSubTitle = "";
        const cid = props.characterId;
        if (CharProvider.isCharacterAvailable(cid)) {
            this.character = CharProvider.getCharacter(cid)!;
            this.planCharacter = new PlanCharacter(cid);
        }
    }
    shouldComponentUpdate(np: SkillInfoCardProps) {
        const { props } = this;
        let upchar = false;
        let uptype = false;
        const nextCharacterId = np.characterId;
        if (nextCharacterId !== props.characterId) {
            if (nextCharacterId !== void 0 && nextCharacterId != "0") {
                this.character = CharProvider.getCharacter(nextCharacterId)!;
                this.planCharacter = new PlanCharacter(nextCharacterId);
            } else {
                this.character = void 0 as unknown as IEVECharacter;
                this.planCharacter = void 0 as unknown as PlanCharacter;
            }
            upchar = true;
        }
        if (np.selectedType !== props.selectedType) {
            if (np.selectedType !== void 0 && np.selectedType !== 0) {
                this.type = np.selectedType;
                uptype = true;
            }
        }
        return upchar || uptype;
    }
    updateTexts() {
        const skillData = SkillDB.skills[this.type];
        this.skillName = skillData !== void 0 ? skillData.name : "";
        this.skillDescription = skillData !== void 0 ? skillData.desc : "";
        this.skillSubTitle = "";
        this.trainingTableRows = void 0;
        if (skillData) {
            const primaryAttr = skillData.p_attr;
            const secondaryAttr = skillData.s_attr;
            const rank = skillData.ttm;
            const attrs: EVECharacterAttributes = (this.character && this.character.attributes) || void 0;
            if (attrs) {
                const spPerHour = constatns.calcSkillPointPerHours(attrs, skillData);
                this.skillSubTitle = `${primaryAttr} / ${secondaryAttr} (Rank ${rank}) @${spPerHour} SP/hour`;
                const rows: JSX.Element[] = [];
                const sprq = constatns.SkillPointTable;
                const pc = this.planCharacter;
                let lastTime = pc.time;
                pc.planSkill(this.type, 0);
                for (let lvl = 1; lvl <= 5; lvl++) {
                    pc.planSkill(this.type, lvl);
                    const levelCell = getSkillLevelCell(lvl);
                    const point = sprq[lvl][rank - 1];
                    const pointCell = <td className="skill-train-explain-cell">{`${point.toLocaleString()} SP`}</td>;
                    let extraCell: JSX.Element;
                    if ((pc.time - lastTime) > 0) {
                        const forLevel = DateTimeUtil.niceCountdown(pc.time - lastTime);
                        const forPrevious = lastTime > 0 ? `(+${DateTimeUtil.niceCountdown(lastTime)})` : "";
                        extraCell =<>
                            <td className="skill-train-explain-cell">{forLevel}</td>
                            <td className="skill-train-explain-cell">{forPrevious}</td>
                        </>;
                    } else {
                        extraCell = ALREAD_OK_CELL;
                    }
                    rows.push(
                        <tr key={lvl}>
                            {levelCell}
                            {pointCell}
                            {extraCell}
                        </tr>
                    );
                    lastTime = pc.time;
                }
                this.trainingTableRows = rows;
                pc.reset();
            } else {
                this.skillSubTitle = `${primaryAttr} / ${secondaryAttr} (Rank ${rank})`;
            }
        }
    }
    render() {
        this.updateTexts();
        const skillDescElement = <div className="skill-description-view">{
            this.skillDescription
        }</div>;
        return (
            <Card className="margin10" style={this.props.style}>
                <BorderedCardHeader
                    title={this.skillName} subheader={this.skillSubTitle}
                />
                <CardContent style={{ padding: "10px 18px" }}>
                    {skillDescElement}
                    {
                        this.trainingTableRows !== undefined ? (
                            <table style={styles.trainingTable}>
                                <tbody>
                                    {this.trainingTableRows}
                                </tbody>
                            </table>
                        ) : ""
                    }
                </CardContent>
            </Card>
        );
    }
}