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
import { JPopupWindowOption } from "../tiny/popup";
import * as mf from "@util/misc-functions";
function createRouteListTable(source: string) {
    const routeList = source.split(",");
    let rows = "";
    for (const route of routeList) {
        const [id, name, ss] = route.split(":");
        rows += `<tr>
    <td><span class="sstext" data-sstext="${ss}"></span>&ensp;${name}</td>
    <td>: ${id}</td>
</tr>`;
    }
    return `<table style="white-space: pre">
    <tbody>${rows}</tbody>
</table>`;
}
export function createPopupWindowOptionForAssets(viewTableDomId: string) {
    const routeViewStyle = {
        top: 0, left: 0,
        width: "auto", height: "auto",
    };
    const jpopupOptions: JPopupWindowOption = {
        id: "route-list-view",
        className: "route-list-popup thumbnail-view",
        contextSelector: `#${viewTableDomId} tbody`,
        targetSelector: ".root-detail.j[data-route-ids]",
        onPopup: function (this: HTMLElement, popupContainer: JQuery<HTMLElement>) {
            const routeIds = this.dataset.routeIds;
            if (routeIds) {
                const routeview = popupContainer.css(routeViewStyle).html(
                    createRouteListTable(routeIds)
                );
                const pos = mf.decideRectPositionInWindow(
                    this.getBoundingClientRect() as DOMRect,
                    {
                        width: routeview.outerWidth()!, height: routeview.outerHeight()!,
                        vAdjust: 3, hAdjust: 3
                    },
                    true
                );
                routeview.css(pos).fadeIn(400);
            }
        },
    };
    return jpopupOptions;
}