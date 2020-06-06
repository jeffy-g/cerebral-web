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
export type JPopupWindowOption = {
    id: string;
    className: string;
    contextSelector: string;
    targetSelector: string;
    onPopup: (
        this: HTMLElement,
        popupContainer: JQuery<HTMLElement>,
        e?: JQuery.MouseEnterEvent<HTMLElement, undefined, any, any>
    ) => any;
};
const raf = window.requestAnimationFrame;
export class JPopupWindow {
    constructor(private options: JPopupWindowOption) {}
    // @ts-ignore type parameter R is error at currently typescript implementation
    private contextWithPurged<T extends boolean, R extends T extends true? JQuery<HTMLElement>: void>(wantInstance: T): R {
        const jinstance = $(this.options.contextSelector).off("mouseenter", "**").off("mouseleave mouseout", "**");
        if (wantInstance) {
            return jinstance as R;
        }
    }
    install() {
        const op = this.options;
        $(`<div class="${op.className}" id="${op.id}"/>`).appendTo("body");
        this.init();
    }
    init() {
        const op = this.options;
        const targetSelector = op.targetSelector;
        this.contextWithPurged(true)
        .on("mouseenter", targetSelector, function (this: HTMLElement, e) {
            raf(() => op.onPopup.call(this, $(`#${op.id}`).stop(true, true), e));
            $consumeEvent(e.originalEvent as MouseEvent);
        })
        .on("mouseleave", targetSelector, function (e) {
            raf(() => {
                $(`#${op.id}`).stop(true, true).fadeOut(180, function () {
                    $(this).empty().css({width: 0, height: 0});
                });
            });
            $consumeEvent(e.originalEvent as MouseEvent);
        });
    }
    destroy() {
        $(`.${this.options.className}`).remove();
        this.contextWithPurged(false);
    }
}