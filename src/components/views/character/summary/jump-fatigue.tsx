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