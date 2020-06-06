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
import { Column, ComponentPropsGetterRC } from "react-table";
import red from "@material-ui/core/colors/red";
import green from "@material-ui/core/colors/green";
import * as mf from "@util/misc-functions";
import * as DateTimeUtil from "@util/date-time-util";
import { rmwc } from "@eve/models/region";
import {
    getEVEImageUrl,
    resolveTypeImageURL
} from "@eve/models/constants";
import { Universal, FORBIDDEN_STRUCTURE_NAME } from "@eve/api/esi-universe-request";
function emitComponentPropsGetterRC(endPointToken: "type" | "character" | "corporation", property: string): ComponentPropsGetterRC {
    // @ts-ignore unused parameter
    return (finalState, rowInfo) => {
        if (rowInfo === void 0) return onil();
        const id = rowInfo.original[property] as number;
        let url: string;
        let finalEndpointToken = endPointToken;
        if (finalEndpointToken === "type") {
            url = resolveTypeImageURL(id, 64);
        } else {
            if (Universal.isCorporationId(id)) {
                finalEndpointToken = "corporation";
            }
            url = getEVEImageUrl(finalEndpointToken, id, 64);
        }
        return { "data-thumbnail": url };
    };
}
function createDateColumn(header: string, accessor: string): Column {
    return {
        Header: header,
        accessor,
        headerStyle: {
            textAlign: "center",
        },
        id: "date_cols",
        Cell: (data: ReactTableRowData<string>) => mf.toDateLocaleString(data.value),
        sortMethod: (a: string, b: string) => (+new Date(a) > +new Date(b) ? 1 : -1),
        width: 130,
        maxWidth: 130,
    };
}
function createTypeColumn(nr: NumberMap<string>): Column {
    return {
        Header: "Type",
        headerStyle: {
            textAlign: "center",
        },
        accessor: "type_id",
        width: 290,
        Cell: (data: ReactTableRowData<number>) => nr[data.value],
        getProps: emitComponentPropsGetterRC("type", "type_id")
    };
}
function createPriceColumn(accessor: string): Column {
    return {
        accessor,
        Header: "Price",
        headerStyle: {
            textAlign: "center",
        },
        style: {
            textAlign: "right",
        },
        Cell: (data: ReactTableRowData<number>) => mf.toLocaleString(data.value, "ISK"),
        width: 136,
    };
}
function createQuantityColumn<T>(
    accessor: string,
    cellRender: (data: ReactTableRowData<T>) => R.ReactNode
): Column {
    return {
        accessor,
        Header: "Quantity",
        headerStyle: {
            textAlign: "center",
        },
        style: {
            textAlign: "right",
        },
        width: 100,
        Cell: cellRender,
    };
}
const getCellRender = (nr: NumberMap<string>, validator: (text: string) => string) => {
    return  (data: ReactTableRowData<number>) => {
        const text = nr[data.value] || "failed entry";
        const color = validator(text);
        return color ? <span style={{ color }}>{text}</span> : text;
    };
};
function createLocationColumn(header: string, nr: NumberMap<string>, width?: number): Column {
    return {
        Header: header,
        headerStyle: {
            textAlign: "center",
        },
        style: {
            textAlign: "left",
            paddingLeft: 10,
        },
        accessor: "location_id",
        Cell: getCellRender(
            nr, text => text.startsWith("!!") ? "orange" : text.startsWith(FORBIDDEN_STRUCTURE_NAME) ? "#ff4f4f": ""
        ),
        width,
    };
}
export function createJournalColumns(): Column[] {
    return [
        createDateColumn("Date", "date"),
        {
            Header: "Type",
            headerStyle: {
                textAlign: "center",
            },
            accessor: "ref_type",
            width: 220,
            Cell: (data: ReactTableRowData<string>) => data.value.replace(/_/g, " "),
        },
        {
            Header: "Amount",
            headerStyle: {
                textAlign: "center",
            },
            style: {
                textAlign: "right",
            },
            accessor: "amount",
            Cell: (data: ReactTableRowData<number>) => {
                const ss = {
                    color: data.value < 0 ? red[500]: green[500]
                };
                return <span style={ss}>{mf.toLocaleString(data.value, "ISK")}</span>;
            },
            width: 136,
        },
        {
            Header: "Balance",
            headerStyle: {
                textAlign: "center",
            },
            style: {
                textAlign: "right",
            },
            accessor: "balance",
            width: 190,
            maxWidth: 220,
            Cell: (data: ReactTableRowData<number>) => mf.toLocaleString(data.value, "ISK"),
        },
        {
            Header: "Description",
            headerStyle: {
                textAlign: "center",
            },
            style: {
                textAlign: "left",
                paddingLeft: 10
            },
            accessor: "description",
        },
    ];
}
export function createOrdersColumns(nr: NumberMap<string>, isHistory: boolean): Column[] {
    const headers: Column[] = [
        createDateColumn("Issued", "issued"),
        createTypeColumn(nr),
        createQuantityColumn<number>("", data => {
            const origin = data.original as EVEMarketOrder;
            return `${origin.volume_remain}/${origin.volume_total}`;
        }),
        createPriceColumn("price"),
        createLocationColumn("Station", nr, 340),
        {
            Header: "Region",
            headerStyle: {
                textAlign: "center",
            },
            accessor: "region_id",
            width: 100,
            maxWidth: 100,
            Cell: (data: ReactTableRowData<number>) => rmwc[data.value].name,
        },
        {
            Header: isHistory ? "Duration (days)": "Expires in",
            headerStyle: {
                textAlign: "center",
            },
            style: {
                textAlign: "right",
                paddingRight: isHistory? 20: 10,
            },
            accessor: "duration",
            Cell: (data: ReactTableRowData<number>) => {
                if (isHistory) {
                    return data.value;
                }
                const issued = Date.parse((data.original as EVECharacterOrder).issued) + (3600 * 24 * 1000 * data.value);
                return DateTimeUtil.niceCountdown(issued - Date.now());
            },
            width: 135,
        },
        {
            Header: "Sell/Buy",
            headerStyle: {
                textAlign: "center",
            },
            style: {
                textAlign: "left",
                paddingLeft: 10,
            },
            accessor: "is_buy_order",
            Cell: (data: ReactTableRowData<number>) => !!data.value ? "Buy": "Sell",
            width: 80,
        },
    ];
    isHistory && headers.push(
        {
            Header: "State",
            headerStyle: {
                textAlign: "center",
            },
            style: {
                textAlign: "left",
                paddingLeft: 10,
            },
            accessor: "state"
        }
    );
    return headers;
}
export function createTransactionsColumns(nr: NumberMap<string>): Column[] {
    return [
        createDateColumn("Date", "date"),
        createTypeColumn(nr),
        createPriceColumn("unit_price"),
        createQuantityColumn<number>("quantity", data => mf.toLocaleString(data.value)),
        {
            Header: "Credit",
            headerStyle: {
                textAlign: "center",
            },
            style: {
                textAlign: "right",
            },
            Cell: (data: ReactTableRowData<number>) => {
                const origin = data.original as EVEWalletTransactions;
                let priceTotal = origin.unit_price * origin.quantity;
                origin.is_buy && (priceTotal = -priceTotal);
                const ss = {
                    color: priceTotal < 0 ? red[500] : green[500]
                };
                return <span style={ss}>{mf.toLocaleString(priceTotal, "ISK")}</span>;
            },
            width: 136,
        },
        {
            Header: "Client",
            headerStyle: {
                textAlign: "center",
            },
            accessor: "client_id",
            width: 200,
            maxWidth: 200,
            Cell: getCellRender(
                nr, text => {
                    if (typeof text === "string") {
                        return text.includes("failed") ? "orange" : "";
                    }
                    return "";
                }
            ),
            getProps: emitComponentPropsGetterRC("character", "client_id")
        },
        createLocationColumn("Where", nr),
    ];
}