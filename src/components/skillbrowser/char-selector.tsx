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
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import * as CharProvider from "@eve/models/char-provider";
type CharacterSelectorProps = {
    onCharacterChange: (value: string) => void;
};
type MenuItemArray = ReactInstanceType<typeof MenuItem>[];
export const ManagedCharacterSelect = R.memo((props: CharacterSelectorProps) => {
        const [characterId, setCharacterId] = R.useState("0");
        const handleCharacterChange = R.useCallback((e: R.ChangeEvent<MuiSelectContext>) => {
            const characterId = e.target.value as string;
            setCharacterId(characterId);
            props.onCharacterChange(characterId);
        }, []);
        const charMenuItems: MenuItemArray = []; {
            const charMap = CharProvider.getCharactersMap();
            Object.keys(charMap).forEach((cid) => {
                charMenuItems.push(
                    <MenuItem key={cid} value={cid} children={charMap[cid].name}/>
                );
            });
            charMenuItems.sort(
                (a, b) => (a.props.children as string).localeCompare(b.props.children as string)
            ).unshift(
                <MenuItem key="0" value="0" children="-- nothing selected --"/>
            );
        }
        return <FormControl className="char-selector-form-root">
            <InputLabel htmlFor="skillbrowser-character-selector">available characters:</InputLabel>
            <Select id="skillbrowser-character-selector"
                value={characterId}
                onChange={handleCharacterChange}
                SelectDisplayProps={{ style: { height: 17 } }}
                MenuProps={{
                    MenuListProps: {
                        classes: { root: "char-selector-item" }
                    }
                }}
                children={charMenuItems}
            />
        </FormControl>;
    },
    () => true
);