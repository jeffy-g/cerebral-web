import * as R from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import deepOrange from "@material-ui/core/colors/deepOrange";
import lightBlue from "@material-ui/core/colors/lightBlue";
import * as Extras from "@com/tiny/extras";
import { listItemClasses } from "./extras";
const listItemTextClasses = { primary: "ellipsis-text" };
const JumpTitle = <ListItem classes={listItemClasses}>
    <ListItemText primary="Jump Fatigue" classes={listItemTextClasses} />
</ListItem>;
type JumpFatiguePaneProps = {
    character: IEVECharacter;
};
export const JumpFatiguePane = ({ character }: JumpFatiguePaneProps) => {
    const fatigue = character.getFatigueInfo();
    if (fatigue === void 0) {
        return null;
    }
    return <Extras.CustomExpansionPanel
        listItemContent={JumpTitle}
        detailsContent={
            <table style={{ width: "100%", textAlign: "left" }}>
                <tbody>
                    <tr>
                        <th>Last Jump:</th>
                        <td>{fatigue.last_jump.relative}</td>
                        <td>{fatigue.last_jump.date.toLocaleString(navigator.language)}</td>
                    </tr>
                    <tr>
                        <th>Red Timer:</th>
                        <td style={{ color: deepOrange[400] }}>{fatigue.red_timer_expiry.relative}</td>
                        <td>{
                            fatigue.red_timer_expiry.relative !== "None"
                                ? fatigue.red_timer_expiry.date.toLocaleString(navigator.language)
                                : ""
                        }</td>
                    </tr>
                    <tr>
                        <th>Blue Timer:</th>
                        <td style={{ color: lightBlue[400] }}>{fatigue.blue_timer_expiry.relative}</td>
                        <td>{
                            fatigue.blue_timer_expiry.relative !== "None"
                                ? fatigue.blue_timer_expiry.date.toLocaleString(navigator.language)
                                : ""
                        }</td>
                    </tr>
                </tbody>
            </table>
        }
    />;
};