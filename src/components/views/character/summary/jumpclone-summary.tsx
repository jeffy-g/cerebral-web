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
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import * as Extras from "@com/tiny/extras";
import { createActiveImplantList, listItemClasses, listItemTextClasses } from "./extras";
const LocationIcon = <span className="material-icons icon-location--inline">place</span>;
const TransitionProps = { unmountOnExit: true, mountOnEnter: true };
const PanelSummaryClasses = {
    root: "expantion-panel-summary-root-narrow",
    content: "expantion-panel-summary-root-narrow__content"
};
const createJumpCloneDetails = (jClones: EVEJumpCloneEx[]) => {
    if (jClones.length === 0) {
        return "No Jump Clones";
    } else {
        const elements: ReactInstanceType<"div">[] = [];
        for (const jClone of jClones) {
            const jname = jClone.name;
            const jlocation = jClone.location;
            const JumpCloneLocationDetail = jlocation && jlocation.name || "Unknown Location";
            elements.push(
                <Accordion square TransitionProps={TransitionProps} key={jClone.jump_clone_id} className="jumpclone-details">
                    <AccordionSummary classes={PanelSummaryClasses}>
                        <p className="jumpclone-details__title"><strong>Name: </strong>{jname || "N/A"}</p>
                    </AccordionSummary>
                    {}
                    <AccordionDetails className="expansion-panel-details padding-0">
                        {LocationIcon}{JumpCloneLocationDetail}
                        {
                            createActiveImplantList(jClone.implants, true, "No Implants Installed")
                        }
                    </AccordionDetails>
                </Accordion>
            );
        }
        return elements;
    }
};
export const JumpCloneSummaryPane = ({ character }: { character: IEVECharacter }): TBC<React.ReactElement> => {
    const cloneJumpAvailable = character.getCloneJumpAvailable();
    let contentBody: TBD<React.ReactFragment>;
    try {
        contentBody = <>
            {createJumpCloneDetails(character.jumpClones)}
        </>;
    } catch (e) {
        console.warn(e);
        return null;
    }
    const timeRelative = cloneJumpAvailable.relative;
    return <Extras.CustomExpansionPanel
        listItemContent={
            <ListItem classes={listItemClasses}>
                <ListItemText
                    primary={`Jump Clones (${character.jumpClones.length}/${character.getMaxClones()})`}
                    secondary={
                        <>
                            <strong>Next Clone Jump Availability - </strong>{timeRelative} {
                                timeRelative !== "Now" ? `(${cloneJumpAvailable.date!.toLocaleString(navigator.language)})` : void 0
                            }
                        </>
                    }
                    classes={listItemTextClasses}
                />
            </ListItem>
        }
        detailsContent={contentBody}
        defaultExpanded={true}
    />;
};