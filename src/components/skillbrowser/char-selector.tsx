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