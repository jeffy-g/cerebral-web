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
    makeStyles
} from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Theme } from "@material-ui/core/styles/";
import { ModalDialog, ButtonsFlag } from "../dialogs/";
type ReactElementsRefs = R.MutableRefObject<R.ReactNode[] | undefined>;
const createDialogElements = (depsElementsRef: ReactElementsRefs, shortCutElementsRef: ReactElementsRefs) => {
    const createFlexLine = (lstr: string, rstr: string, key: string) => {
        return <div key={key} className="flex-lc">
            <div className={`flex-item-half-width ${lstr[0] === "!"? "is-disabled-text": ""}`}>{lstr}</div>
            <div className="flex-item-half-width">{rstr}</div>
        </div>;
    };
    const fetchDepsList = async () => {
        const deps = await import("../../dependencies").then(m => m.dependencies) as Record<string, string>;
        const depsElements: R.ReactNode[] = [];
        for (const packageName of Object.keys(deps)) {
            depsElements.push(
                createFlexLine(packageName, deps[packageName], packageName)
            );
        }
        depsElementsRef.current = depsElements;
    };
    fetchDepsList().then(() => {
        const shortcuts = DomEventsUtil.getRegisteredShortcutContexts();
        const selements: R.ReactNode[] = [];
        for (const shortcut of shortcuts) {
            selements.push(
                createFlexLine(shortcut.description, shortcut.stroke, shortcut.stroke)
            );
        }
        shortCutElementsRef.current = selements;
    });
};
const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: 561,
        height: 310,
        backgroundColor: theme.palette.background.paper,
        "& .has-margin" : {
            marginBottom: 14
        }
    },
}));
const AboutContents = () => {
    const classes = useStyles();
    const [tabIndex, setTabIndex] = R.useState(0);
    // @ts-ignore unused parameter
    const handleTabChange = (event: R.ChangeEvent<{}>, newValue: number) => {
        setTabIndex(+newValue);
    };
    const shortCutElementsRef = R.useRef<R.ReactNode[]>();
    const depsElementsRef = R.useRef<R.ReactNode[]>();
    R.useLayoutEffect(() => {
        createDialogElements(depsElementsRef, shortCutElementsRef);
    }, []);
    const appName = EVEApp.Config.getConfig("application-name");
    const contents: JSX.Element[] = [
        <div className="notice-sentence">{`EVE Online and the EVE logo are the registered trademarks of CCP hf.
All rights are reserved worldwide.

All other trademarks are the property of their respective owners.
EVE Online, the EVE logo, EVE and all associated logos and designs are the intellectual property of CCP hf. All artwork, screenshots, characters, vehicles, storylines, world facts or other recognizable features of the intellectual property relating to these trademarks are likewise the intellectual property of CCP hf.

CCP hf. has granted permission to `}<code>{appName}</code>{" to use EVE Online and all associated logos and designs for promotional and information purposes on its website but does not endorse, and is not in any way affiliated with, "}<code>{appName}</code>.{`

CCP is in no way responsible for the content on or functioning of this website, nor can it be liable for any damage arising from the use of this website.
`}
</div>,
        <div className="notice-sentence has-margin">
            {depsElementsRef.current}
        </div>,
        <div className="notice-sentence has-margin">
            {shortCutElementsRef.current}
        </div>,
    ];
    return (
        <div className={classes.root}>
            <AppBar position="static" color="default">
                <Tabs
                    value={tabIndex}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    scrollButtons="auto"
                    centered
                >
                    <Tab label="CCP Copyright Notice" />
                    <Tab label="Package dependencies" />
                    <Tab label="Shortcut keys" />
                </Tabs>
            </AppBar>
            {}
                {contents[tabIndex]}
            {}
        </div>
    );
};
function _About() {
    let [open, setOpenState] = R.useState(false);
    const VersionElement = R.useMemo(() => {
        return <div className="sde-version"
            onClick={e => {
                $consumeEvent(e.nativeEvent);
                setOpenState(true);
            }}
        >{EVEApp.Config.getConfig("sde-version")}</div>;
    }, []);
    return <>
        <ModalDialog
            open={open}
            buttons={ButtonsFlag.AGREE}
            mainTitle={`Cerebral web - ${EVEApp.Config.get("version")}`}
            content={<AboutContents/>}
            onCloseHandler={() => setOpenState(false)}
        />
        {VersionElement}
    </>;
}
export const About = R.memo(_About, () => true);