import { Store } from "@util/indexed-db-store";
import { defaultCharacterComparator } from "@eve/models/constants";
import { LOWEST_OMEGA_SP } from "@/raw-configs";
declare global {
    type FarmFragment = {
        id: EVEId;
        baseSp: number;
    };
}
type FarmData = {
    [id: string]: number;
};
const ENTRY_NAME = "farmCharacters";
let farmCharacters: FarmData;
let appConfigStore: Store<FarmData>;
const subscribedComponents: React.Component[] = [];
export const init = async () => {
    const fetchData = async () => {
        farmCharacters = await appConfigStore.getAsync(ENTRY_NAME, {});
    };
    if (appConfigStore === void 0) {
        appConfigStore = new Store({
            name: "app-config",
            onChangeDatabase: fetchData
        });
    }
    if (farmCharacters === undefined) {
        await fetchData();
    }
};
const getSortedFarmFragments = () => {
    const clazz = EVEApp.Providers.CharProvider.getCharacterClass();
    const availableCharacters: IEVECharacter[] = [];
    for (const cid in farmCharacters) {
        const char = clazz.get(cid);
        char && availableCharacters.push(char);
    }
    availableCharacters.sort(defaultCharacterComparator);
    const newFarmFragments: FarmFragment[] = [];
    for (const char of availableCharacters) {
        const character_id = char.character_id;
        newFarmFragments.push(
            { id: character_id, baseSp: farmCharacters[character_id] }
        );
    }
    return newFarmFragments;
};
const notifySubscribers = () => {
    const characters = getSortedFarmFragments();
    for (const component of subscribedComponents) {
        component.setState({ characters });
    }
};
export const getAll = (): FarmFragment[] => {
    return getSortedFarmFragments();
};
export const get = (id: EVEId): TBD<FarmFragment> => {
    const baseSp = farmCharacters[id];
    return baseSp === void 0 ? undefined: { id, baseSp };
};
export const orderBy = (id: EVEId, baseSp = LOWEST_OMEGA_SP) => {
    if (id > "0") {
        farmCharacters[id] = baseSp;
        appConfigStore.set(farmCharacters, ENTRY_NAME);
        notifySubscribers();
    } else {
        EVEApp.marshalling({
            "notify.error": `invalid character_id, value=${id}`
        });
    }
};
export const cancelOf = (id: EVEId) => {
    if (farmCharacters[id] !== void 0) {
        delete farmCharacters[id];
        appConfigStore.set(farmCharacters, ENTRY_NAME);
        notifySubscribers();
    }
};
export const subscribe = (component: React.Component) => {
    if (component) {
        subscribedComponents.push(component);
    }
};
export const unsubscribe = (component: React.Component) => {
    const index = subscribedComponents.indexOf(component);
    if (index !== -1) {
        subscribedComponents.splice(index, 1);
    }
};