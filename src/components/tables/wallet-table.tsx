/*!
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  <one line to give the program's name and a brief idea of what it does.>
  Copyright (C) 2018 jeffy-g hirotom1107@gmail.com

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
import ReactTable, { Column } from "react-table";
import { JPopupWindow, JPopupWindowOption } from "@com/tiny/popup";
import * as columnFactory from "./wallet-columns";
export type WalletTypeToken = "wallet_journal" | "wallet_transactions" | "orders" | "orders_history";
type WalletTableProps = {
    walletType: WalletTypeToken;
    walletData?: EVEWalletJournal[] | EVEWalletTransactions[] | EVECharacterOrderHistory[];
    nameRegistry: Record<number, string>;
};
const config = EVEApp.Config.getConfig("/components/wallet-table");
const jpopupOptions = Object.assign({...config.popupOptions} as JPopupWindowOption, {
    onPopup: function (this: HTMLElement, popupContainer: JQuery<HTMLElement>) {
        const imagePath = this.dataset.thumbnail;
        if (imagePath) {
            const offset = $(this).offset()!;
            const thumbnail = popupContainer.css({
                top: offset.top + this.offsetHeight / 2,
                left: offset.left + this.offsetWidth,
                width: 80, height: 64
            });
            const img = document.createElement("img");
            img.onload = () => {
                thumbnail.fadeIn(200);
            };
            img.src = imagePath;
            thumbnail.append(img);
        }
    },
} as JPopupWindowOption);
let jpopup: TBD<JPopupWindow>;
export class WalletTable extends R.Component<WalletTableProps> {
    componentDidMount() {
        if (!jpopup) {
            jpopup = new JPopupWindow(jpopupOptions as JPopupWindowOption);
        }
        jpopup.install();
    }
    componentDidUpdate(pp: Readonly<WalletTableProps>): void {
        if (pp.walletData !== this.props.walletData) {
            jpopup!.init();
        }
    }
    componentWillUnmount() {
        if (jpopup) {
            jpopup.destroy();
            jpopup = void 0;
        }
    }
    render() {
        const { walletType, walletData, nameRegistry } = this.props;
        if (!Array.isArray(walletData) || walletData.length === 0) {
            return <p>No data found.</p>;
        }
        let columns: Column[];
        if (walletType.includes("journal")) {
            columns = columnFactory.createJournalColumns();
        } else if (walletType.includes("transactions")) {
            columns = columnFactory.createTransactionsColumns(nameRegistry);
        } else if (walletType.includes("orders")) {
            columns = columnFactory.createOrdersColumns(nameRegistry, walletType !== "orders");
        } else {
            throw new Error("Probably there is no data to display...");
        }
        return <ReactTable<EVEWalletJournal | EVEWalletTransactions | EVECharacterOrderHistory>
            style={{
                fontSize: "0.95em", cursor: "default",
            }}
            pageSizeOptions={config.pageSizeOptions}
            resizable
            data={walletData}
            columns={columns}
            defaultPageSize={15}
            defaultSorted={[
                { id: "date_cols", desc: true }
            ]}
        />;
    }
}