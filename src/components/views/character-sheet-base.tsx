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