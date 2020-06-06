import * as R from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
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
                <ExpansionPanel square TransitionProps={TransitionProps} key={jClone.jump_clone_id} className="jumpclone-details">
                    <ExpansionPanelSummary classes={PanelSummaryClasses}>
                        <p className="jumpclone-details__title"><strong>Name: </strong>{jname || "N/A"}</p>
                    </ExpansionPanelSummary>
                    {}
                    <ExpansionPanelDetails className="expansion-panel-details padding-0">
                        {LocationIcon}{JumpCloneLocationDetail}
                        {
                            createActiveImplantList(jClone.implants, true, "No Implants Installed")
                        }
                    </ExpansionPanelDetails>
                </ExpansionPanel>
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