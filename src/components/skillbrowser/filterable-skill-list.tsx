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
import Icon from "@material-ui/core/Icon";
import Collapse from "@material-ui/core/Collapse";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import TextField from "@material-ui/core/TextField";
import { SkillDB } from "@eve/models/eve-skills";
import * as CharPrivider from "@eve/models/char-provider";
import { ROMAN_NUMERALS } from "./skill-info-card";
type SkillListProps = {
    characterId: EVEId;
    onSkillSelectionChange: (index: number, e: R.MouseEvent) => any;
    selectedType?: number;
    filter: string;
    adjustHeight?: number;
};
type SkillListState = {
    open: Record<string, boolean>;
};
type FilteredSkillListProps = ExcludePick<SkillListProps, "filter">;
type FilteredSkillListState = {
    filterText: string;
};
const lookupSkillLevel = (skills: EVESkillEx[], skill: SkillDataBaseEntry): number => {
    let skillLevel = 0;
    if (skills) {
        const target = skills.find(s => s.skill_id === skill.tid);
        target && (skillLevel = target.trained_skill_level);
    }
    return skillLevel;
};
const createSkillListItem = (
    skill: SkillDataBaseEntry, skillLevel: number,
    handleSkillListSelection: (id: number, e: R.MouseEvent) => void,
    guttersClass: string, listItemTextClass: string,
    selectedType?: number
): ReactInstanceType<typeof ListItem> => {
    return <ListItem button key={skill.tid}
        selected={selectedType === skill.tid}
        onClick={e => handleSkillListSelection(skill.tid, e)}
        classes={{ gutters: guttersClass }}
        title={`${skill.name}, rank ${skill.ttm}`}
    >
        <ListItemText
            primary={skill.name}
            primaryTypographyProps={{
                // @ts-ignore cannot detect dataset property
                "data-rank": skill.ttm
            }}
            classes={{ primary: `ellipsis-text ${listItemTextClass}` }}
        />
        {skillLevel === 0 ? "" : <ListItemSecondaryAction className="own-skill-level" children={ROMAN_NUMERALS[skillLevel]}/>}
    </ListItem>;
};
let completeDBInit = false;
const initSkillDatabase = () => {
    if (!completeDBInit) {
        const sdb = SkillDB;
        const groups = sdb.groups;
        groups.sort((a, b) => a.name.localeCompare(b.name));
        for (const group of groups) {
            const groupMembers: SkillDataBaseEntry[] = [];
            for (const typeId of group.types) {
                const skill = sdb.skills[typeId];
                skill && groupMembers.push(skill);
            }
            groupMembers.sort((a, b) => a.name.localeCompare(b.name));
            group.children = groupMembers;
        }
        completeDBInit = true;
    }
};
class SkillList extends R.Component<SkillListProps, SkillListState> {
    constructor(props: SkillListProps) {
        super(props);
        this.state = {
            open: onil()
        };
        initSkillDatabase();
    }
    private renderSkillItems() {
        const {
            characterId,
            onSkillSelectionChange,
            selectedType,
        } = this.props;
        const knownSkills = CharPrivider.getCharacterProperyOf(characterId, "skills")!;
        const sGroups = SkillDB.groups;
        const filter = this.props.filter.toLowerCase();
        const { open } = this.state;
        const items: R.ReactElement[] = [];
        if (filter.length > 2) {
            const searchTokens = filter.indexOf("|") > 2 ? filter.split("|"): void 0;
            sGroups.forEach(skillGroup => {
                skillGroup.children!.forEach(skill => {
                    const skillName = skill.name;
                    const lowerName = skillName.toLowerCase();
                    let hit = false;
                    if (searchTokens) {
                        for (const token of searchTokens) {
                            if (token.length > 1 && lowerName.includes(token)) {
                                hit = true;
                                break;
                            }
                        }
                    } else if (lowerName.includes(filter)) {
                        hit = true;
                    }
                    hit && items.push(
                        createSkillListItem(skill, lookupSkillLevel(knownSkills, skill), onSkillSelectionChange, "group-top search-result", "skill-name search-result", selectedType)
                    );
                });
            });
            items.sort((a, b) => a.props["title"].localeCompare(b.props["title"]));
        } else {
            console.log("selectedType: ", selectedType);
            sGroups.forEach(skillGroup => {
                const nestedItems: R.ReactElement[] = [];
                skillGroup.children!.forEach(skill => {
                    nestedItems.push(
                        createSkillListItem(skill, lookupSkillLevel(knownSkills, skill), onSkillSelectionChange, "group-nested", "skill-name", selectedType)
                    );
                });
                const groupName = skillGroup.name;
                const miconToken = open[groupName] ? "expand_less": "expand_more";
                items.push(
                    <R.Fragment key={groupName}>
                        <ListItem button
                            onClick={() => {
                                open[groupName] = !open[groupName];
                                this.setState({ open });
                            }}
                            classes={{ gutters: "group-top" }}
                            // @ts-ignore cannot detect var property
                            style={{ "--group-icon": `url("../images/skill-groups/${groupName.toLowerCase().replace(" ", "-")}.png")` }}
                        >
                            <ListItemText
                                primary={groupName} classes={{ primary: "ellipsis-text skill-group" }}/>
                            <Icon>{miconToken}</Icon>
                        </ListItem>
                        <Collapse in={open[groupName]} timeout="auto" unmountOnExit >
                            <List  disablePadding>
                                {nestedItems}
                            </List>
                        </Collapse>
                    </R.Fragment>
                );
            });
        }
        return items;
    }
    render() {
        let listStyle: TBD<R.CSSProperties>;
        const adjust = this.props.adjustHeight;
        if (typeof adjust === "number") {
            listStyle = {
                height: `calc(100vh - ${adjust}px)`
            };
        }
        return <List className="filterable-skill-list" style={listStyle}>{this.renderSkillItems()}</List>;
    }
}
export class FilterableSkillList extends R.Component<FilteredSkillListProps, FilteredSkillListState> {
    constructor(props: FilteredSkillListProps) {
        super(props);
        this.state = {
            filterText: "",
        };
    }
    handleFilterTextChange = (e: R.ChangeEvent<HTMLInputElement>): void => {
        this.setState({ filterText: e.target.value });
    }
    render() {
        const {
            characterId,
            onSkillSelectionChange,
            selectedType,
            adjustHeight
        } = this.props;
        return <>
            <TextField classes={{ root: "search-text-container" }}
                placeholder="Search..."
                label="Search by some text for skill"
                autoComplete="off"
                type="search"
                onChange={this.handleFilterTextChange}
            />
            <SkillList
                characterId={characterId}
                selectedType={selectedType}
                onSkillSelectionChange={onSkillSelectionChange}
                filter={this.state.filterText}
                adjustHeight={adjustHeight}
            />
        </>;
    }
}