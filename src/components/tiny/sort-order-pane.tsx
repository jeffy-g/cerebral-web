import * as R from "react";
import {
    DenseRadioGroup,
    AscendDescendButton,
} from "./extras";
export type TOrderState<Keys extends any> = {
    sortBy: Keys;
    ascending: boolean;
};
export type SortOrderPaneProps<Keys extends any> = {
    orderKeys: Keys[];
    sortBy: Keys;
    defaultAscending?: boolean;
    commitOrders: (orders: TOrderState<Keys>) => void;
    hasBorder?: boolean;
    hidden?: boolean;
};
export function SortOrderPane<Keys extends any>(props: SortOrderPaneProps<Keys>) {
    const { orderKeys, sortBy, defaultAscending = true, hasBorder = true, commitOrders, hidden } = props;
    const [currentOrder, updateOrders] = R.useState({
        sortBy, ascending: defaultAscending
    } as TOrderState<Keys>);
    const orderFixer = R.useCallback((subject: unknown) => {
        const newOrders: Partial<TOrderState<Keys>> = onil();
        if (typeof subject === "boolean") {
            newOrders.ascending = subject;
        } else {
            const event = subject as R.ChangeEvent<HTMLInputElement>;
            event.stopPropagation();
            newOrders.sortBy = event.currentTarget.value as unknown as Keys;
        }
        updateOrders((prev: TOrderState<Keys>) => {
            const nextState = { ...prev, ...newOrders };
            commitOrders(nextState);
            return nextState;
        });
    }, []);
    return <div className={`sortorder-button-container${hasBorder? " has-border": "" }`}
        data-hidden={hidden}
        onClick={e => {
            $consumeEvent(e.nativeEvent);
        }}
    >
        <AscendDescendButton
            ascending={currentOrder.ascending}
            updateOrder={orderFixer}
            marginLeft={2}
            marginRight={8}
        />
        <DenseRadioGroup
            name="sort-order-radios"
            lableClassName="fs0866"
            onChange={orderFixer}
        >{
            () => {
                return (orderKeys as unknown as string[]).map(label => {
                    return new Proxy({ label, value: "", checked: false }, {
                        get: (_this, prop) => prop === "checked"? currentOrder.sortBy === (_this.label as unknown as Keys): _this.label
                    });
                }) as ReturnType<Parameters<typeof DenseRadioGroup>[0]["children"]>;
            }
        }</DenseRadioGroup>
    </div>;
}