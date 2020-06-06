import * as TypeVolumeMap from "./type-volume-map";
declare global {
    interface IAssetNodeBase {
        name: string;
        hidden: boolean;
        add(node: IAssetNode): void;
        getChildCount(): number;
        [key: string]: any;
    }
    interface IAssetNode extends IAssetNodeBase {
        asset: EVEAssetEx;
        quantity: number;
        groupName: string;
        formalCategoryName: string;
        volume: number;
        volumeString: string;
        actualVolume: number;
        capacity: number;
        capacityUsage: number;
        usedVolume: number;
        children?: IAssetNode[];
        displayableCount: number;
        hasDisplayableChildren(): boolean;
    }
    type TriStructures = "station" | "solar_system" | "structure" | "unknown";
    type AssetRootNodeChildrenKeys = "space" | "hangar";
    type AssetRootNodeChildrens = {
        [k in AssetRootNodeChildrenKeys]?: IAssetNode[];
    };
    interface IAssetRootNode extends IAssetNodeBase, AssetRootNodeChildrens {
        type: TriStructures;
        getAssetNodes(): TBD<IAssetNode[]>;
        cloneWith(children: IAssetNode[]): IAssetRootNode;
        jumpLength?: number;
    }
    type AssetTreeSortOption<T> = {
         sortBy: T;
         ascending: boolean;
    };
    type AssetTreeFilterOptions = {
        nameFilter?: string | RegExp;
        itemIdFilter?: number | ((id: number) => boolean);
    };
}
const ASSET_PLACE_TOKENs: { [k in TriStructures]: AssetRootNodeChildrenKeys } = {
    station: "hangar",
    solar_system: "space",
    structure: "hangar",
    unknown: "hangar",
};
const intlOption: Intl.NumberFormatOptions = {
    maximumFractionDigits: 4
};
class AssetNode implements IAssetNode {
    public children!: IAssetNode[];
    constructor(
        public asset: EVEAssetEx,
        public hidden: boolean = false
    ) {}
    public get name() {
        return this.asset.additionalData.name;
    }
    public get quantity() {
        return this.asset.quantity;
    }
    public get groupName() {
        return this.asset.additionalData.group_name;
    }
    public get formalCategoryName() {
        return this.asset.additionalData.formal_category_name;
    }
    private getv(one = true) {
        const asset = this.asset;
        let actual = TypeVolumeMap.getValue(asset.type_id, asset.is_singleton);
        return actual * 1e4 * (one ? 1: asset.quantity) / 1e4;
    }
    public get actualVolume() {
        return this.getv(false);
    }
    public get volume() {
        return this.getv();
    }
    public get volumeString() {
        return this.getv().toLocaleString(void 0, intlOption);
    }
    public get capacity() {
        const value = TypeVolumeMap.getCapacity(this.asset.type_id);
        return value * 1e4 / 1e4;
    }
    public get capacityUsage() {
        const total = this.usedVolume / this.capacity * 100;
        return total > 100 ? 100: total;
    }
    public get usedVolume() {
        const nodes = this.children;
        if (nodes && nodes.length) {
            let total = 0;
            for (const node of nodes) {
                total += node.actualVolume;
            }
            return total;
        }
        return 0;
    }
    getChildCount(): number {
        const nodes = this.children;
        return nodes? nodes.length: 0;
    }
    add(node: IAssetNode): void {
        let nodes = this.children;
        if (nodes === void 0) {
            this.children = nodes = [];
        }
        nodes.push(node);
    }
    get displayableCount(): number {
        const nodes = this.children;
        let count = 0;
        let last: number;
        if (nodes && (last = nodes.length)) {
            for (let index = 0; index < last;) {
                if (!nodes[index++].hidden) count++;
            }
        }
        return count;
    }
    hasDisplayableChildren(): boolean {
        return !!this.displayableCount;
    }
}
class AssetRootNode implements IAssetRootNode {
    "hangar"?: IAssetNode[];
    "space"?: IAssetNode[];
    constructor(
        public type: TriStructures,
        public name: string,
        public hidden: boolean = false
    ) {
        const tk = ASSET_PLACE_TOKENs[type];
        this[tk] = [] as IAssetNode[];
    }
    getAssetNodes(): TBD<IAssetNode[]> {
        return this[
            ASSET_PLACE_TOKENs[this.type]
        ];
    }
    getChildCount(): number {
        const childNodes = this.space || this.hangar;
        return childNodes? childNodes.length: 0;
    }
    add(node: IAssetNode): void {
        const childNodes = this[
            ASSET_PLACE_TOKENs[this.type]
        ]!;
        childNodes.push(node);
    }
    cloneWith(children: IAssetNode[]) {
        const type = this.type;
        const rootNodeCopy = new AssetRootNode(type, this.name);
        rootNodeCopy[
            ASSET_PLACE_TOKENs[type]
        ] = children;
        return rootNodeCopy;
    }
}
const collectAssetNodes = (anode: IAssetNode, assets: TBC<EVEAssetEx>[]) => {
    const item_id = anode.asset.item_id;
    for (let index = 0, end = assets.length; index < end; index++) {
        const ea = assets[index];
        if (ea !== null) {
            if (item_id === ea.location_id) {
                const childNode = new AssetNode(ea);
                anode.add(childNode);
                assets[index] = null;
                if (ea.is_singleton && ea.quantity === 1) {
                    collectAssetNodes(childNode, assets);
                }
            }
        }
    }
};
const collectTopLevelAssets = (tnode: IAssetRootNode, assets: TBC<EVEAssetEx>[]) => {
    for (
        let index = 0, end = assets.length;
        index < end;
        index++
    ) {
        const asset = assets[index];
        if (asset !== null) {
            const addtional = asset.additionalData;
            if (addtional.location !== void 0) {
                const location_name = addtional.location.name;
                if (tnode.name === location_name) {
                    const anode = new AssetNode(asset);
                    tnode.add(anode);
                    assets[index] = null;
                    if (asset.is_singleton && asset.quantity === 1) {
                        collectAssetNodes(anode, assets);
                    }
                }
            }
        }
    }
};
const locationNameSort = (rootNodes: IAssetRootNode[], ascending: boolean) => {
    rootNodes.sort(
        ascending
        ? (a: IAssetRootNode, b: IAssetRootNode) => a.name.localeCompare(b.name)
        : (a: IAssetRootNode, b: IAssetRootNode) => b.name.localeCompare(a.name)
    );
    const nameSorter = (a: IAssetNode, b: IAssetNode) => {
        let na: IAssetNode, nb: IAssetNode;
        if (ascending) {
            na = a, nb = b;
        } else {
            na = b, nb = a;
        }
        const diff = na.groupName.localeCompare(nb.groupName);
        return diff? diff: na.name.localeCompare(nb.name);
    };
    const sortChildren = (children: IAssetNode[]) => {
        children.sort(nameSorter);
        for (const node of children) {
            if (node.children) {
                sortChildren(node.children);
            }
        }
    };
    for (const tnode of rootNodes) {
        const children = tnode.hangar || tnode.space;
        if (children) {
            sortChildren(children);
        }
    }
};
const itemCountSort = (rootNodes: IAssetRootNode[], ascending: boolean) => {
    const childCountOrNameSorter = (a: IAssetNodeBase, b: IAssetNodeBase): number => {
        let na: IAssetNodeBase, nb: IAssetNodeBase;
        if (ascending) {
            na = a, nb = b;
        } else {
            na = b, nb = a;
        }
        const diff = na.getChildCount() - nb.getChildCount();
        if (diff === 0) {
            if (na["quantity"] && nb["quantity"]) {
                const qdiff = na["quantity"] - nb["quantity"];
                if (qdiff !== 0) return qdiff;
            }
            return na.name.localeCompare(nb.name);
        } else {
            return diff;
        }
    };
    const applySorter = (children: IAssetNode[]) => {
        children.sort(childCountOrNameSorter);
        for (const node of children) {
            if (node.children) {
                applySorter(node.children);
            }
        }
    };
    rootNodes.sort(childCountOrNameSorter);
    for (const tnode of rootNodes) {
        const children = tnode.hangar || tnode.space;
        if (children) {
            applySorter(children);
        }
    }
};
const filterChildNodes = (nodes: IAssetNode[], options: AssetTreeFilterOptions): number => {
    let outerCount = 0;
    Object.keys(options).forEach(filterName => {
        switch (filterName) {
            case "nameFilter": {
                const filter = options.nameFilter;
                if (!filter) break;
                const applyFilter = (name: string) => {
                    if (typeof filter === "string") {
                        return name.indexOf(filter) !== -1;
                    } else {
                        return filter.test(name);
                    }
                };
                const walkNodes = (_nodes: IAssetNode[]) => {
                    let visibleCount = 0;
                    for (const node of _nodes) {
                        let visibleChildren = 0;
                        if (node.children) {
                            visibleChildren = walkNodes(node.children);
                        }
                        !(
                            node.hidden = visibleChildren === 0 && !applyFilter(node.name)
                        ) && visibleCount++;
                    }
                    return visibleCount;
                };
                outerCount = walkNodes(nodes);
                break;
            }
        }
    });
    return outerCount;
};
export enum AssetNodeSortOrder {
    Name,
    ItemCount,
    Jump
}
export type TAssetTreeSortOption = AssetTreeSortOption<AssetNodeSortOrder>;
    const DEBUG = false;
    export const createTree = (
        assets: EVEAssetEx[],
    ): IAssetRootNode[] => {
        const rootNodes: IAssetRootNode[] = [];
        assets = assets.slice();
        console.time("AssetTree::createTree::solve-nodes");
        for (const asset of assets) {
            if (asset !== null) {
                const addtional = asset.additionalData;
                if (addtional.location !== void 0) {
                    const location_name = addtional.location.name;
                    if (!rootNodes.find(tnode => tnode.name === location_name)) {
                        const type = (<EVEStructure>addtional.location).solar_system_id ? "structure" : (
                            (addtional.location as UniverseNamesFragmentLocation).category || "unknown"
                        );
                        const rootNode = new AssetRootNode(type, location_name);
                        rootNodes.push(rootNode);
                        collectTopLevelAssets(rootNode, assets);
                    }
                }
            }
        }
        console.timeEnd("AssetTree::createTree::solve-nodes");
        const lostAssets = assets.filter(value => value !== null);
        {
            const ss_base = "background-color: #343434; padding: 3px; color:";
            lostAssets.length && console.log(
`%cIt seems that some assets cannot be referenced,
because %clogout in space %cor %cprotected by EVE game system%c as Asset safety.
and/or %clocation_id%c is %cCustoms Offices`,
                `${ss_base} white`,
                `${ss_base} gold; text-decoration: underline`, `${ss_base} white`,
                `${ss_base} #07fb10; text-decoration: underline`, `${ss_base} white`,
                `${ss_base} silver;`, `${ss_base} white`, `${ss_base} #0088FF; text-decoration: underline`,
                lostAssets
            );
        }
        return rootNodes;
    };
    export function sortAssetNodes(
        rootNodes: IAssetRootNode[],
        sortOrder: TAssetTreeSortOption
    ): void {
        switch (sortOrder.sortBy) {
            case AssetNodeSortOrder.Name:
                locationNameSort(rootNodes, sortOrder.ascending);
                break;
            case AssetNodeSortOrder.ItemCount:
                itemCountSort(rootNodes, sortOrder.ascending);
                break;
            case AssetNodeSortOrder.Jump: {
                let jumpLengthSorter = (a: IAssetRootNode, b: IAssetRootNode) => {
                    const diff = a.jumpLength! - b.jumpLength!;
                    return diff ? diff: a.name.localeCompare(b.name);
                };
                rootNodes.sort((a, b) => {
                    return sortOrder.ascending? jumpLengthSorter(a, b): jumpLengthSorter(b, a);
                });
                break;
            }
            default: break;
        }
    }
    export function filterAssetNodes(rootNodes: IAssetRootNode[], options: AssetTreeFilterOptions): IAssetRootNode[] {
        rootNodes.forEach(rn => {
            const visibleCount = filterChildNodes(
                (rn.hangar || rn.space) as IAssetNode[], options
            );
            rn.hidden = visibleCount === 0;
        });
        return rootNodes;
    }
    export function revertHiddenFlagOf(rootNodes: IAssetRootNode[]): void {
        const _reverter = (nodes: IAssetNode[]): void => {
            for (const node of nodes) {
                node.hidden = false;
                if (node.children) {
                    _reverter(node.children);
                }
            }
        };
        DEBUG && console.time("AssetTree::revertHiddenFlagOf");
        for (const root of rootNodes) {
            root.hidden = false;
            const children = root.hangar || root.space;
            if (children) _reverter(children);
        }
        DEBUG && console.timeEnd("AssetTree::revertHiddenFlagOf");
    }