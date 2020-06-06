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