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
import {
    ComponentType,
    Component,
    ReactNode
} from "react";
import { RouteChildrenProps } from "react-router";
import Button from "@material-ui/core/Button";
import { EVECharacterSummary as Summary } from "./character/summary/";
import { Skills } from "./character/skills";
import { Plans } from "./character/plan/";
import { Contracts } from "./character/contracts";
import { Mails, Wallets } from "./character/mails+wallets";
import { Api } from "./character/api";
import { EVEToolIcon } from "../tiny/extras";
export type PageEntryNames =
    | "Summary"
    | "Skills"
    | "Plans"
    | "Mails"
    | "Contracts"
    | "Wallets"
    | "Api";
export type CharacterPageEntryProps = EVEComponentPropsBase & Record<string, any>;
export type CharacterPageEntry = {
    page: ComponentType<CharacterPageEntryProps>;
    iconName: string;
    name: PageEntryNames;
};
export type CharacterSheetsProps = RouteChildrenProps<{ characterId: string }>;
export type CharacterSheetsState = {
   currentPage: PageEntryNames;
};
type PageButtonProps = {
    pageEntry: CharacterPageEntry;
    disabled: boolean;
    sheet: Component<CharacterSheetsProps, CharacterSheetsState>;
};
const pageEntries: CharacterPageEntry[] = [
    { page: Summary,   name: "Summary",   iconName: "charactersheet" },
    { page: Skills,    name: "Skills",    iconName: "skills" },
    { page: Plans,     name: "Plans",     iconName: "notepad" },
    { page: Mails,     name: "Mails",     iconName: "evemail" },
    { page: Contracts, name: "Contracts", iconName: "contracts" },
    { page: Wallets,   name: "Wallets",   iconName: "wallet"},
    { page: Api,       name: "Api",       iconName: "info" },
];
const pageButtonClasses = {
    root: "sheets-button-container__page-button",
    contained: "-page-button-contained"
};
const PageButton = R.memo((props: PageButtonProps) => {
        const { pageEntry, disabled, sheet } = props;
        const pageName = pageEntry.name;
        return <Button variant="contained"
            title={pageName}
            data-firstletter={pageName[0]}
            classes={pageButtonClasses}
            disabled={disabled}
            onClick={() => {
                switchPage(sheet, pageName);
            }}
        >{<EVEToolIcon type={pageEntry.iconName}/>}{pageName}</Button>;
    },
    (pp, np) => pp.disabled === np.disabled
);
export function getComponents(
    currentPage: PageEntryNames,
    sheet: Component<CharacterSheetsProps, CharacterSheetsState>
) {
    let component: TBD<ComponentType<EVEComponentPropsBase>>;
    const buttons: ReactNode[] = [];
    for (const entry of pageEntries) {
        const pageName = entry.name;
        const isPage = currentPage === pageName;
        if (isPage) {
            component = entry.page;
        }
        buttons.push(
            <PageButton key={pageName}
                pageEntry={entry} disabled={isPage} sheet={sheet}
            />
        );
    }
    return [
        buttons,
        component!
    ] as [typeof buttons, ComponentType<EVEComponentPropsBase>];
}
export function switchPage(
    sheet: Component<CharacterSheetsProps, CharacterSheetsState>,
    newPage: PageEntryNames,
) {
    const newState: CharacterSheetsState = {
        currentPage: newPage
    };
    sheet.setState(newState);
}