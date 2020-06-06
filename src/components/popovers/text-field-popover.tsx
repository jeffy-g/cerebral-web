import * as R from "react";
import Popover from "@material-ui/core/Popover";
import TextField from "@material-ui/core/TextField";
import Chip from "@material-ui/core/Chip";
import Avatar from "@material-ui/core/Avatar";
import Icon from "@material-ui/core/Icon";
export type TextFieldPopoverProps = {
    open: boolean;
    anchorEl: HTMLElement;
    placeholder?: string;
    text?: string;
    onEnter?: (text: string) => void;
} & TransitionEventTriggers;
type TextFieldPopoverState = {
    placeholder: string;
    text?: string;
};
export class TextFieldPopover extends R.Component<TextFieldPopoverProps, TextFieldPopoverState> {
    constructor(props: TextFieldPopoverProps) {
        super(props);
        this.state = {
            placeholder: "please type the any text",
            text: props.text !== undefined ? props.text : "",
        };
    }
    shouldComponentUpdate(np: TextFieldPopoverProps, ns: TextFieldPopoverState): boolean {
        let npcpy = { placeholder: np.placeholder, text: np.text };
        if (np.text !== this.props.text) {
        } else if (ns.text !== void 0 ) {
            delete npcpy.text;
        }
        Object.assign(ns, npcpy);
        return true;
    }
    handleRequestClose = (userAccepted: boolean = true) => {
        let { text } = this.state;
        if (text !== void 0 && !text.length || !userAccepted) {
            text = "";
        }
        this.props.onEnter && this.props.onEnter(text!);
    }
    render() {
        const { state, props } = this;
        return (
            <Popover
                open={props.open}
                anchorEl={props.anchorEl}
                onClose={() => this.handleRequestClose(false)}
                anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
                anchorPosition={{ left: 0, top: 0 }}
                onExited={this.props.onExited}
            >
                <div className="margin10">
                    <Chip label="[Enter] press then apply changes"
                        avatar={<Avatar><Icon style={{ width: "auto", height: "auto" }}>priority_high</Icon></Avatar>}
                    />
                    <TextField fullWidth autoFocus
                        style={{ display: "block", marginTop: 10 }}
                        placeholder={state.placeholder}
                        onChange={e => this.setState({ text: e.target.value })}
                        value={state.text}
                        onKeyPress={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                this.handleRequestClose();
                            }
                        }}
                    />
                </div>
            </Popover>
        );
    }
}