import * as mf from "../misc-functions";
const raf = requestAnimationFrame;
export class ProgressManipulator implements IBufferableProgress {
    private incrementableBuffer: boolean;
    private textElement: HTMLElement;
    private progbarStyle: CSSStyleDeclaration;
    private completed: number;
    constructor(
        private linearProgress: React.Component<any, ProgressState>
    ) {
        this.incrementableBuffer = true;
        const dom = mf.findDOMNode(linearProgress);
        this.textElement = $query("div.progbar-text-extras", dom);
        this.progbarStyle = $query("div.front-progbar", dom).style;
        this.completed = 0;
    }
    private transformer = () => {
        this.progbarStyle.transform = `scale(${this.completed / 100}, 0.7)`;
    }
    public progress(increment: number) {
        let next = this.completed + increment;
        next > 100 && (next = 100);
        this.completed = next;
        raf(this.transformer);
    }
    public progressBuffer(increment: number) {
        if (this.incrementableBuffer) {
            let allow: boolean;
            this.linearProgress.setState(
                (state: ProgressState) => {
                    let buffer = state.buffer + increment;
                    if (buffer > 100) {
                        console.log("ProgressDecorator::overFlow! - ", buffer);
                        buffer = 100, allow = false;
                    } else {
                        allow = true;
                    }
                    return { buffer };
                }, () => {
                    this.incrementableBuffer = allow;
                }
            );
        }
    }
    private messages: string[] = [];
    private textNode: Text = document.createTextNode("");
    private renderText = () => {
        this.textNode.data = this.messages.pop() || "";
    }
    public showText(text: string) {
        this.messages.push(text);
        raf(this.renderText);
    }
    public prepare() {
        this.revert({
            opacity: 1,
            completed: 0, buffer: 0, text: ""
        });
    }
    public done() {
        this.linearProgress.setState({ opacity: 0 });
    }
    public reset(text: string = "") {
        this.revert({ completed: 0, buffer: 0, text });
    }
    private revert(state: ProgressState) {
        this.incrementableBuffer = true;
        this.linearProgress.setState(state);
        this.completed = 0;
        this.messages.length = 0;
        const tn = this.textNode;
        const tef = this.textElement.firstChild;
        if (tef === null || tn !== tef) {
            const te = this.textElement;
            if (tef === null) {
                te.appendChild(tn);
            } else {
                te.replaceChild(tn, tef);
                console.warn("found irregular operation, are these intended?");
            }
        }
        tn.data = "";
        this.progbarStyle.transform = "scale(0, 0.7)";
    }
}