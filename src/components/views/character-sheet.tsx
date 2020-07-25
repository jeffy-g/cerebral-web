import * as R from "react";
import { Route } from "react-router";
import * as CharacterSheetApi from "./character-sheet-api";
import {
    CharacterSheetsProps,
    CharacterSheetsState,
    CharacterPageEntryProps,
} from "./character-sheet-api";
const DEBUG = 1;
const log = console.log;
class CharacterSheets extends R.Component<CharacterSheetsProps, CharacterSheetsState> {
    constructor(props: CharacterSheetsProps) {
        super(props);
        this.state = {
            currentPage: "Summary",
        };
        if (DEBUG) log("CharacterSheets::ctor");
    }
    render() {
        if (DEBUG) log("CharacterSheets::render");
        const { characterId } = this.props.match!.params;
        const { currentPage } = this.state;
        const props: CharacterPageEntryProps = {
            characterId
        };
        const [buttons, PageComponent] = CharacterSheetApi.getComponents(currentPage, this);
        if (PageComponent === void 0) {
            throw new ReferenceError("Could not get page component!");
        }
        return <>
            <div className="sheets-button-container">{buttons}</div>
            <PageComponent { ...props }/>
        </>;
    }
}
export const CharacterSheetRoute = () => <Route path="/characters/:characterId" component={CharacterSheets} />;
