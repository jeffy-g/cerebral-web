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
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import CardHeader from "@material-ui/core/CardHeader";
import * as Extras from "@com/tiny/extras";
import * as CharProvider from "@eve/models/char-provider";
import * as mf from "@util/misc-functions";
type TSkillLevelSquaresCell = ReactInstanceType<"td">;
const image_props = {
    alt: ".", className: "square"
};
let LEVEL_025: TSkillLevelSquaresCell[] = [];
let LEVEL_024_H: TSkillLevelSquaresCell[] = [];
 {
    const SkillLevelSquares = (id: number, trained_level: number, half_trained = false) => {
        const squares: JSX.Element[] = [];
        let counter = 0;
        for (let lvl = trained_level; lvl--;) {
            squares[counter] = <img {...image_props} key={`${id}#${counter++}`} src="./images/filled-square.png" />;
        }
        if (half_trained) {
            squares[counter++] = <img {...image_props} key={"half-filled-square"} src="./images/half-filled-square.png" />;
        }
        for (
            let lvl = 5 - trained_level - (+half_trained); lvl--;
        ) {
            squares[counter] = <img {...image_props} key={`${id}#${counter++}`} src="./images/empty-square.png" />;
        }
        return <td className="level-squares-cell">{squares}</td> as ReactInstanceType<"td">;
    };
    const id = Date.now();
    for (let level = 0, end = 5; level <= end;) {
        LEVEL_025[level] = SkillLevelSquares(id, level++);
    }
    for (let level = 0, end = 5; level < end;) {
        LEVEL_024_H[level] = SkillLevelSquares(id, level++, true);
    }
}
const openState: Record<string, boolean> = onil();
let totalPoints = 0;
let skillNames: string[] = [];
const resetSkillSelection = () => {
    totalPoints = 0;
    skillNames.length = 0;
};
const clearSkillSelectionClasses = () => {
    const trs = $queryAll(".skill-group-details tr.selected");
    for (let i = 0, end = trs.length; i < end;) {
        trs[i++].classList.remove("selected");
    }
};
const handleRowSelected = (e: React.MouseEvent) => {
    const _this = e.currentTarget as HTMLElement;
    const classList = _this.classList;
    const point = +$query(".skill-points", _this).textContent!.replace(/,/g, "");
    const selected = classList.contains("selected");
    totalPoints += (selected && totalPoints > 0)? -point: point;
    const on = classList.toggle("selected");
    const skillName = $query(".skill-name", _this).textContent!;
    if (on) {
        skillNames.push(skillName);
    } else {
        skillNames = skillNames.filter(name => skillName !== name);
    }
    console.log("current totalPoints: %s", totalPoints, skillNames);
};
const SkillGroupDetails = (group: SkillGroup) => {
    const skillElements: ReactInstanceType<"tr">[] = [];
    for (let index = 0, skills = group.skills, end = skills.length; index < end;) {
        const skill = skills[index];
        const trained_level = skill.trained_skill_level;
        const cn = skillNames.includes(skill.skill_name)? "selected": void 0;
        skillElements[index++] =
            <tr key={skill.skill_id} onClick={handleRowSelected} className={cn}>
                {}
                {skill.half_trained? LEVEL_024_H[trained_level]: LEVEL_025[trained_level]}
                <td className="skill-name">{skill.skill_name}</td>
                <td className="skill-points">
                    {}
                    {mf.formatNumber(skill.skillpoints_in_skill)}
                </td>
            </tr>;
    }
    return <table className="skill-group-details">
        <tbody>{skillElements}</tbody>
    </table>;
};
type TSkillCardOpenStateHook = React.Dispatch<React.SetStateAction<boolean>>;
const hookRegistry: Record<string, TSkillCardOpenStateHook> = onil();
type SkillCardProps = {
    group: SkillGroup;
    characterId: EVEId;
};
const SkillCard = ({ group, characterId }: SkillCardProps) => {
    const groupName = group.name;
    const [collapseOpen, updateOpenState] = R.useState(openState[groupName]);
    const toggleOpen = () => {
        const current = !!openState[groupName];
        updateOpenState(openState[groupName] = !current);
    };
    R.useEffect(() => {
        if (hookRegistry[groupName] === void 0) {
            hookRegistry[groupName] = updateOpenState;
        }
        return () => {
            hookRegistry[groupName] = void 0 as unknown as TSkillCardOpenStateHook;
        };
    }, []);
    return <Extras.CollapseCard data-group={groupName}
        title={groupName} subheader={`${mf.toLocaleString(group.total_sp, "SP")}`}
        onClick={toggleOpen}
        classes={{
            root: `collapse-cardheader-root${collapseOpen ? " open" : ""}`,
            title: "cardHeader-title", subheader: "list-item-secondary-text", action: "group-card-action"
        }}
        avatar={
            <Avatar src={`./images/skill-groups/${groupName.toLocaleLowerCase().replace(" ", "-")}.png`}/>
        }
        action={
            <IconButton className="padding-6px">
                <Icon className={`expander-icon${collapseOpen? " open": ""}`}>expand_more</Icon>
            </IconButton>
        }
        open={collapseOpen}
        compare={characterId}
        collapseWrapperClasse="collapse-wrapper"
    >
        {}
        {SkillGroupDetails(group)}
    </Extras.CollapseCard>;
};
let expandCache = false;
const handleContextMenu = (e: React.MouseEvent) => {
    if (e.ctrlKey) {
        $consumeEvent(e.nativeEvent);
        const groupNames = Object.keys(hookRegistry);
        const timeout = 33;
        expandCache = !expandCache;
        for (let index = 0, end = groupNames.length; index < end;) {
            const groupName = groupNames[index++];
            const hook = hookRegistry[groupName];
            if (hook) {
                openState[groupName] = expandCache;
                window.setTimeout(() => hook(expandCache), timeout * index);
            }
        }
    }
};
const EVECharacterSkills = (props: EVEComponentPropsBase) => {
    const characterId = props.characterId;
    const skillTree = CharProvider.getCharacter(characterId)!.createSkillTree();
    resetSkillSelection();
    clearSkillSelectionClasses();
    if (skillTree === undefined || skillTree.length === 0) {
        return (
            <CardHeader
                title="Skills"
                subheader="Sorry, could not find this character&apos;s skill sheet, please try again after the next skills refresh occurs (~15 minutes max)."
            />
        );
    }
    return (
        <div className="skill-card-list" onContextMenu={handleContextMenu} title="special command: [ctrl + right click] o7">{
            skillTree.map(group => <SkillCard key={group.name} group={group} characterId={characterId}/>)
        }</div>
    );
};
export const Skills = R.memo(EVECharacterSkills, (pp, np) => pp.characterId === np.characterId);