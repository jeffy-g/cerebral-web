import * as R from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import { CoolDialogTitle } from "../tiny/extras";
type ModalDialogProps = {
    open: boolean;
    onCloseHandler: (agree: boolean) => void;
    mainTitle: R.ReactNode;
    content?: R.ReactNode;
    buttons?: ButtonsFlag;
} & TransitionEventTriggers;
export const enum ButtonsFlag {
    AGREE = 0b01,
    DISAGREE = 0b10,
    BOTH = AGREE|DISAGREE
}
export class ModalDialog extends R.PureComponent<ModalDialogProps> {
    onClose = (e: R.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        this.props.onCloseHandler(e.currentTarget.id === "agree");
    }
    render() {
        const { buttons = ButtonsFlag.BOTH } = this.props;
        return (
            <Dialog
                open={this.props.open}
                onClose={this.onClose}
                onExited={this.props.onExited}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <CoolDialogTitle smallPadding textAlign="center" id="alert-dialog-title">{this.props.mainTitle}</CoolDialogTitle>
                <DialogContent style={{ padding: "16px", whiteSpace: "pre" }}>
                    {this.props.content}
                    {}
                    {}
                </DialogContent>
                <DialogActions>
                    {buttons & ButtonsFlag.DISAGREE? <Button onClick={this.onClose} color="primary">
                        Disagree
                    </Button>: null}
                    {buttons & ButtonsFlag.AGREE? <Button id="agree" onClick={this.onClose} color="secondary" autoFocus>
                        Agree
                    </Button>: null}
                </DialogActions>
            </Dialog>
        );
    }
}