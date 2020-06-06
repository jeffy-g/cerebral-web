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
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import * as Extras from "@com/tiny/extras";
import * as DateTimeUtil from "@util/date-time-util";
import * as hooks from "@util/react-hooks";
import * as constants from "@eve/models/constants";
import { SummaryPara, listItemClasses } from "./extras";
type SkillQueueLineBaseProps = {
    skill: EVESkillQueueEx;
    remainingTime?: string;
    signal?: TStdFunction;
    className?: string;
};
type QueueListBaseProps = {
    character: IEVECharacter;
};
const queueListItemTextClasses = { primary: "ellipsis-text", secondary: "list-item-secondary-text" };
const getSkillLength = (skill: EVESkillQueue) => {
    return DateTimeUtil.skillLength(skill.start_date, skill.finish_date);
};
const isTrainedSkill = (skill: EVESkillQueue) => {
    return new Date(skill.finish_date) < new Date();
};
const SkillQueueLineBase = (props: SkillQueueLineBaseProps) => {
    const { skill, remainingTime = getSkillLength(skill) } = props;
    const skillSummary = `${skill.skill_name}\u2002-\u2002${skill.finished_level}`;
    return <div className="flex-lc">
        <img alt="gn" className="eve-image-icon x24 is-inline" src={constants.getSkillGroupImagePath(skill.skill_id)}/>
        <span className={`skillqueue-detail flex-left-right-layout ${props.className || ""}`}>
            <span>{skillSummary}</span>
            <span className="skillqueue-detail__point">{
                `${skill.training_start_sp.toLocaleString()} / ${skill.level_end_sp.toLocaleString()} SP`
            }</span>
        </span><span className="skillqueue-timespan">
            {remainingTime}
        </span>
    </div>;
};
const FirstSkillQueueLine = ({ skill, signal }: SkillQueueLineBaseProps) => {
    const [remainingTime, up] = R.useState(getSkillLength(skill));
    R.useEffect(() => {
        const update = () => {
            if (isTrainedSkill(skill) && signal) {
                signal();
            } else {
                up(getSkillLength(skill));
            }
        };
        BackgroundTaskManager.operateTimerTask<string>("skill-queue-timer", {
            action: "start", interval: 1e3
        }, update);
        return () => {
            BackgroundTaskManager.operateTimerTask("skill-queue-timer", { action: "remove" });
            console.log("FirstSkillQueueLine::UNMOUNTED");
        };
    }, [skill]);
    return <SkillQueueLineBase className="is-first-queue"
        skill={skill} remainingTime={remainingTime}
    />;
};
const useSkillQueueList = (character: IEVECharacter) => {
    const signal = hooks.useSignal();
    const trainingSkill = character.getCurrentTrainingSkill();
    let remaining: string;
    let queueContent: JSX.Element;
    if (trainingSkill === void 0) {
        remaining = "0d 0h 0m 0s";
        queueContent = <SummaryPara>No Skills in Queue</SummaryPara>;
    } else {
        remaining = DateTimeUtil.timeUntil(new Date(character.getLastSkill().finish_date));
        const cid = character.character_id;
        queueContent = <>{
            character.skillQueue.map(skill => {
                if (isTrainedSkill(skill)) {
                    return void 0;
                }
                const key = `${cid}|${skill.skill_id}|${skill.finished_level}`;
                const isFirstSkillQueue = trainingSkill === skill;
                const QueueLineComponent = isFirstSkillQueue? FirstSkillQueueLine: SkillQueueLineBase;
                return <QueueLineComponent key={key} skill={skill} signal={isFirstSkillQueue? signal: void 0}/>;
            })
        }</>;
    }
    return [
        remaining, queueContent
    ] as [
        typeof remaining, typeof queueContent
    ];
};
export const SkillQueuePane = ({ character }: QueueListBaseProps) => {
    const [remaining, skillQueueList] = useSkillQueueList(character);
    return <Extras.CustomExpansionPanel
        listItemContent={
            <ListItem classes={listItemClasses}>
                <ListItemText primary={`Skill Queue${character.skillQueue.length? ` (${character.skillQueue.length} items in queue)` : ""}`}
                    secondary={remaining}
                    classes={queueListItemTextClasses}
                />
            </ListItem>
        }
        detailsContent={skillQueueList}
        defaultExpanded={true}
        autoHeight={false}
    />;
};