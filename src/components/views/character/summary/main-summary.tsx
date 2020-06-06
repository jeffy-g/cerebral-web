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
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import * as Extras from "@com/tiny/extras";
import * as RaceModel from "@eve/models/races-and-bloodlines";
import * as DateTimeUtil from "@util/date-time-util";
import * as mf from "@util/misc-functions";
import { listItemClasses, listItemTextClasses, nextListItemClasses } from "./extras";
import { ATTRIBUTE_KEYS } from "@/eve/models/constants";
const RaceImages = R.memo(
    ({ char }: { char: IEVECharacter }) => {
        const races = RaceModel.createRacesContext(char);
        return <>
            <img
                className="eve-image-icon x32"
                src={`./images/bloodlines/${races.bloodline}.png`}
                title={`Bloodline: ${mf.capitalizeToken(races.bloodline)}`}
            />
            <img
                className="eve-image-icon x32"
                src={`./images/ancestries/${races.ancestry.iconFile}`}
                title={`Ancestry: ${races.ancestry.name}`}
            />
        </>;
    },
    (pp, np) => pp.char.ancestry_id === np.char.ancestry_id
);
const createRacesExplain = (char: IEVECharacter) => {
    const races = RaceModel.createRacesContext(char);
    return `Race: ${mf.capitalizeToken(races.race)}, Bloodline: ${mf.capitalizeToken(races.bloodline)}, Ancestry: ${races.ancestry.name}`;
};
const getShipDescription = (ship: IEVECharacter["ship"]): string => {
    let shipName: string, name: string;
    if (ship) {
        shipName = ship.ship_name;
        name = ship.type ? ship.type.name : "error";
    } else {
        shipName = "error";
        name = "error";
    }
    return `${shipName} (${name})`;
};
const getLocationDetails = (char: IEVECharacter) => {
    const details = char.getCurrentLocationDetails();
    return <>
        {`${details.region.r}\u2002<\u2002${details.region.c}\u2002<\u2002${details.currentLocation}`}
        {}
        {}
    </>;
};
const getOnlineDetails = (online: IEVECharacter["online"]) => {
    return `logins: ${
        online.logins && online.logins.toLocaleString() || "0"
    }, last login: ${
        online.last_login? DateTimeUtil.relative(new Date(online.last_login)): "N/A"
    }, last logout: ${
        online.last_logout? DateTimeUtil.relative(new Date(online.last_logout)): "N/A"
    }`;
};
const getHomeLocationDetails = (home: EVEHomeLocation) => {
    const whichLocation = home.location;
    if (whichLocation) {
        let name = whichLocation.name;
        return whichLocation.type? `${name} (${whichLocation.type.name}`: name;
    }
    return "Unknown Structure";
};
const getAttributesDetail = (attrs: EVECharacterAttributes) => {
    const attributeLines = [] as ReactInstanceType<"div">[];
    for (let index = 0, end = ATTRIBUTE_KEYS.length; index < end;) {
        const attribute = ATTRIBUTE_KEYS[index];
        attributeLines[index++] = <div key={attribute}>
            <img className="is-image-bottom" alt="." width={20}
                src={`./images/native/${attribute}.png`}
            />&nbsp;{`${attribute}: ${attrs[attribute]}`}
        </div>;
    }
    return <>{attributeLines}</>;
};
const createSummayRow = (title: React.Key, content: React.ReactNode): ReactInstanceType<"div"> => {
    return <div className="main-summary__detail-line" key={title}>
        <span className="main-summary__detail-line__item -detail-title">{title}</span>
        <span className="main-summary__detail-line__item -detail-content">{content}</span>
    </div>;
};
export const MainSummayPane = ({ character }: { character: IEVECharacter }): TBC<React.ReactElement> => {
    const attrs = character.attributes;
    let detailsContent: TBC<JSX.Element[]>;
    try {
        const ss = character.security_status;
        detailsContent = [
            createSummayRow("Character ID", character.character_id as string),
            createSummayRow("Date of Birth", character.getDateOfBirth().toLocaleString(navigator.language)),
            createSummayRow("Race details", createRacesExplain(character)),
            createSummayRow("Security Status", `${mf.toLocaleString(ss, void 0, 2)} (${ss})`),
            createSummayRow("Wallet Balance", mf.toLocaleString(character.balance, "ISK", 2)),
            createSummayRow("Corporation", character.corporation.name),
            createSummayRow("Alliance", character.alliance !== undefined ? character.alliance.name : "N/A"),
            createSummayRow("Home Location", getHomeLocationDetails(character.home_location)),
            createSummayRow("Current Location", getLocationDetails(character)),
            createSummayRow("Current Ship", getShipDescription(character.ship)),
            createSummayRow("Online details", getOnlineDetails(character.online)),
            createSummayRow("Unallocated SP", character.unallocated_sp ? character.unallocated_sp.toLocaleString() : "0"),
            createSummayRow("Bonus Remaps", attrs.bonus_remaps),
            createSummayRow("Next Remap",
                (() => {
                    const d = character.getNextYearlyRemapDate();
                    if (d === true) {
                        return "Now";
                    } else {
                        return d.toLocaleString(navigator.language);
                    }
                })()
            ),
            createSummayRow("Attributes", getAttributesDetail(attrs))
        ];
    } catch (e) {
        console.warn(e);
        return null;
    }
    return <Extras.CustomExpansionPanel
        listItemContent={
            <ListItem classes={listItemClasses}>
                <ListItemAvatar>
                    <Extras.EVEAvatar character={character} />
                </ListItemAvatar>
                <ListItemText
                    primary={character.name}
                    secondary={`${mf.toLocaleString(character.getTotalSp(), "SP")}`}
                    classes={listItemTextClasses}
                />
                <ListItemText
                    primary={<RaceImages char={character}/>}
                    className="main-summary__race-images"
                    classes={nextListItemClasses}
                />
            </ListItem>
        }
        detailsContent={detailsContent}
        defaultExpanded={true}
    />;
};