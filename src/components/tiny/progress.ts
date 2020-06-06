// @ts-ignore 
/// <reference types="jquery"/>
// @ts-ignore 
/// <reference path="../globals.d.ts"/>
const FADE_TIME = 200;
const raf = requestAnimationFrame;
// @ts-ignore 
let btm: typeof BackgroundTaskManager;
const emitComponentTags = (
    id: string,
    title: string,
    max: number,
    positionStyle = ""
) => `<div style="${positionStyle}" id="${id}" class="progbar-component">
    <span class="progbar-component__title">${title}</span>
    <progress title="pending gauge" class="progbar-component__progress" max="${max}" value="0"></progress>
    <span class="progbar-component__text"></span>
</div>`;
const emitUpdator = (dis: ProgressComponent) => {
    let pv = 0;
    return  function(this: ProgressComponent) {
        const v = this.vp();
        if (v !== pv) {
            raf(() => {
                this.p!.value = v;
                this.t!.data = v + "";
                pv = v;
            });
        }
    }.bind(dis) as ((this: ProgressComponent) => void);
};
type TOpOption = {
    show?: boolean;
    interval?: number
};
export class ProgressComponent {
    p?: HTMLProgressElement;
    t?: Text;
    css: string = "";
    barHeight: number = 0;
    parentSelector = "body";
    vp: () => number;
    constructor(
        private id: string,
        private title: string,
        private max: number,
        valueProvider: typeof ProgressComponent.prototype.vp
    ) {
        this.vp = valueProvider;
        if (typeof btm !== "object") {
            // @ts-ignore
            if (typeof BackgroundTaskManager === "object") {
                // @ts-ignore
                btm = BackgroundTaskManager;
            } else if (
                // @ts-ignore
                typeof BTM === "object"
            ) {
                // @ts-ignore
                btm = BTM;
            }
        }
    }
    setMax(max: number) {
        this.max = max;
        this.p && (this.p.max = max);
    }
    update = emitUpdator(this);
    showing: TBD<boolean>;
    operation({ show = true, interval = 33 }: TOpOption = onil()) {
        const id = this.id;
        let c: JQuery<HTMLProgressElement> = $("#" + id);
        if (show) {
            if (c.length === 0) {
                c = $(emitComponentTags(id, this.title, this.max, this.css));
            }
            if (!this.p) {
                this.p = c.appendTo(this.parentSelector).fadeIn(FADE_TIME).css("display", "flex").find(".progbar-component__progress")[0] as HTMLProgressElement;
                if (this.barHeight) {
                    this.p.style.height = this.barHeight + "px";
                }
                const valueText = c.find(".progbar-component__text")[0];
                const text = valueText.appendChild(new Text("0"));
                this.t = text;
            }
            if (!this.showing) {
                btm.operateTimerTask(
                    id, {
                        action: "start", interval,
                    }, this.update
                );
                this.showing = true;
            }
        } else {
            btm.operateTimerTask(id, { action: "remove" });
            c.fadeOut(FADE_TIME, () => {
                c.remove();
                this.p = void 0;
                this.t = void 0;
                this.showing = false;
            });
        }
    }
}