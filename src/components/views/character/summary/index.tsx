import * as R from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import * as Extras from "@com/tiny/extras";
import * as CharProvider from "@eve/models/char-provider";
import { MainSummayPane } from "./main-summary";
import { JumpCloneSummaryPane } from "./jumpclone-summary";
import { JumpFatiguePane } from "./jump-fatigue";
import { createActiveImplantList, listItemClasses, listItemTextClasses } from "./extras";
import { SkillQueuePane } from "./skill-queue-details";
import { LoyaltyPointsPane } from "./loyalty-points";
const ActiveImplantsTitle = <ListItem classes={listItemClasses}>
    <ListItemText
        primary="Active Implants"
        secondary="implant injected in the current clone"
        classes={listItemTextClasses}
    />
</ListItem>;
export class EVECharacterSummary extends R.Component<EVEComponentPropsBase> {
    render() {
        const char = CharProvider.getCharacter(this.props.characterId);
        if (char === void 0) {
            return null;
        }
        return <div className="flex-ct">
            {}
            <div className="flex-item-card" style={{ width: "48%" }}>
                <MainSummayPane character={char}/>
                <JumpCloneSummaryPane character={char}/>
            </div>
            <div className="flex-item-card">
                {  }
                <JumpFatiguePane character={char}/>
                {  }
                <Extras.CustomExpansionPanel
                    listItemContent={ActiveImplantsTitle}
                    detailsContent={createActiveImplantList(char.implants, false, "No Active Implants")}
                />
                {  }
                <SkillQueuePane character={char}/>
                {}
                <LoyaltyPointsPane loyalty_points={char.loyalty_points}/>
            </div>
        </div>;
    }
}