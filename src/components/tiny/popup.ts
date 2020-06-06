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