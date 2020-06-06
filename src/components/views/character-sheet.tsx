import * as R from "react";
import { Route } from "react-router";
import * as CharacterSheetBase from "./character-sheet-base";
const DEBUG = 0;
const log = console.log;
class CharacterSheets extends R.Component<CharacterSheetBase.CharacterSheetsProps, CharacterSheetBase.CharacterSheetsState> {
    constructor(props: CharacterSheetBase.CharacterSheetsProps) {
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
        const props: CharacterSheetBase.CharacterPageEntryProps = {
            characterId
        };
        const [buttons, PageComponent] = CharacterSheetBase.getComponents(currentPage, this);
        return <>
            <div className="sheets-button-container">{buttons}</div>
            <PageComponent { ...props }/>
        </>;
    }
}
export const CharacterSheetRoute = () => <Route path="/characters/:characterId" component={CharacterSheets} />;