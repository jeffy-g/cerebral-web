import * as R from "react";
import LinearProgress from "@material-ui/core/LinearProgress";
let setExplainText: R.Dispatch<R.SetStateAction<string>>;
const ExplainText = R.memo((props: { text?: string }) => {
    const [text, update] = R.useState(props.text!);
    setExplainText === void 0 && (setExplainText = update);
    return <div className="progbar-text progbar-text-extras">{text}</div>;
}, (pp, np) => pp.text === np.text);
const MemorizedLinearProgress = R.memo((props: {
        dashedClassName: string,
        completed: number,
        buffer: number
    }) => {
        const progressClasses: Record<string, string> = {
            root: "progbar-root",
            bar1Buffer: "front-progbar",
            bar2Buffer: "buffer-progbar",
            dashed: props.dashedClassName
        };
        return <LinearProgress
            classes={progressClasses}
            color="secondary" variant="buffer"
            value={props.completed} valueBuffer={props.buffer}
        />;
    },
    (pp, np) => {
        return pp.completed === np.completed &&
        pp.buffer === np.buffer &&
        pp.dashedClassName === np.dashedClassName;
    }
);
export class BufferProgressBar extends R.Component<{}, ProgressState> {
    constructor(props: any) {
        super(props);
        this.state = {
            completed: 0,
            buffer: 0,
            opacity: 0,
            text: ""
        };
    }
    // @ts-ignore unused var.
    shouldComponentUpdate(np: {}, ns: Readonly<ProgressState>) {
        const { completed, buffer, opacity, text } = this.state;
        setExplainText(ns.text!);
        return completed !== ns.completed || buffer !== ns.buffer || opacity !== ns.opacity || text !== ns.text;
    }
    render() {
        const { completed, buffer, opacity, text } = this.state;
        const dashedClassName = opacity === 1 ? "dashed-animator" : "dashed-animator is-paused";
        return (
            <div className="progbar" style={{ opacity }}>
                <ExplainText text={text}/>
                <MemorizedLinearProgress
                    dashedClassName={dashedClassName}
                    completed={completed} buffer={buffer}
                />
                {}
            </div>
        );
    }
}