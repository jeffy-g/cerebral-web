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
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { EVEImage } from "@com/tiny/eve-image-icon";
import { CustomExpansionPanel, CustomExpansionPanelProps } from "@com/tiny/extras";
import { SortOrderPane, TOrderState } from "@com/tiny/sort-order-pane";
import * as mf from "@util/misc-functions";
import { LocalStorage } from "@util/web-storage-util";
import { SummaryPara, listItemClasses, listItemTextClasses } from "./extras";
type TLoyaltySortOrderKeys = "name" | "points";
type TLoyaltyOrderState = TOrderState<TLoyaltySortOrderKeys>;
const SORT_ORDER_TOKENs = [
    "name",
    "points",
] as TLoyaltySortOrderKeys[];
type LoyaltyPointsComponentState = {
    orders: TLoyaltyOrderState;
    loyalty_points: EVELoyaltyPoints[];
};
type TLoyaltyComponentStorage = {
    expanded: boolean;
    orders: TLoyaltyOrderState;
};
const ls = new LocalStorage(
    "/summary/loyalty-config", {
        expanded: false,
        orders: {
            sortBy: "name",
            ascending: true
        }
    } as TLoyaltyComponentStorage
);
const renderRow = (loyalty: EVELoyaltyPoints) => {
    try {
        const corporation_id = loyalty.corporation_id;
        return <tr key={corporation_id}>
            <td>
                <EVEImage path={`/corporations/${corporation_id}/logo?size=32`} inline/>
                {}
                {loyalty.corporation.name}
            </td>
            <td style={{ textAlign: "right" }}>{mf.toLocaleString(loyalty.loyalty_points)}</td>
        </tr>;
    } catch (e) {
        return <tr key={loyalty.corporation_id}>
            <td style={{ textAlign: "left" }}>Error:</td>
            <td style={{ whiteSpace: "pre" }}>{JSON.stringify(loyalty, null, 2)}</td>
        </tr>;
    }
};
const commitSortOrder = (loyalty_points: EVELoyaltyPoints[], orders: TLoyaltyOrderState) => {
    let comparator: TComparator<EVELoyaltyPoints>;
    const { sortBy, ascending } = orders;
    switch (sortBy) {
        case "name":
            comparator = ascending? (a, b) => a.corporation.name.localeCompare(b.corporation.name): (a, b) => b.corporation.name.localeCompare(a.corporation.name);
            break;
        default:
            comparator = ascending? (a, b) => a.loyalty_points - b.loyalty_points: (a, b) => b.loyalty_points - a.loyalty_points;
            break;
    }
    loyalty_points.sort(comparator);
};
const LoyaltyPointsDitail = ({ loyaltyData }: { loyaltyData: EVELoyaltyPoints[] }) => {
    if (loyaltyData.length > 0) {
        return <table className="loyalty-table">
            <tbody>{loyaltyData.map(renderRow)}</tbody>
        </table>;
    }
    return <SummaryPara>No Loyalty Points</SummaryPara>;
};
export const LoyaltyPointsPane = ({ loyalty_points }: { loyalty_points: EVELoyaltyPoints[] }) => {
    const data = ls.load();
    const [state, updateState] = R.useState({
        orders: data.orders,
        loyalty_points
    } as LoyaltyPointsComponentState);
    const workingLoyaltyData = R.useRef(state.loyalty_points);
    const commiter = R.useCallback((orders: TLoyaltyOrderState) => {
        updateState(prev => {
            ls.merge({ orders });
            workingLoyaltyData.current = prev.loyalty_points.slice();
            return { orders, loyalty_points: prev.loyalty_points };
        });
    }, []);
    R.useEffect(() => {
        if (state.loyalty_points !== loyalty_points) {
            updateState(prev => {
                workingLoyaltyData.current = loyalty_points.slice();
                return { orders: prev.orders, loyalty_points };
            });
        }
    });
    const loyaltyData = workingLoyaltyData.current;
    commitSortOrder(loyaltyData, state.orders);
    const orderPane = <SortOrderPane
        defaultAscending={state.orders.ascending}
        hasBorder={false}
        orderKeys={SORT_ORDER_TOKENs}
        sortBy={state.orders.sortBy}
        commitOrders={commiter}
        hidden={loyaltyData.length === 0}
    />;
    return <CustomExpansionPanel
        listItemContent={
            <ListItem classes={listItemClasses}>
                <ListItemText
                    primary="Loyalty Points"
                    secondary="work reward"
                    classes={listItemTextClasses}
                />
                <ListItemText primary={orderPane} classes={{ root: "loyalty-point-sortpane" }}/>
            </ListItem>
        }
        detailsContent={<LoyaltyPointsDitail loyaltyData={loyaltyData}/>}
        defaultExpanded={data.expanded}
        TransitionProps={transitionProps}
    />;
};
const transitionProps = {
    addEndListener: (node, done) => {
        const onTransitionend = () => {
            const parent = node.parentElement;
            done();
            setTimeout(() => {
                parent && ls.merge({
                    expanded: parent.childElementCount === 2
                });
            }, 77);
        };
        node.addEventListener("transitionend", onTransitionend, mf.LISTENER_OPTION_ONCE);
    }
} as CustomExpansionPanelProps["TransitionProps"];