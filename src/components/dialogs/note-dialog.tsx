import * as R from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import { CoolDialogTitle } from "../tiny/extras";
const styles = {
    dialog: {
        width: 355,
    },
    row: {
        height: "1.5rem",
    },
};
export type NoteDialogProps = {
    open: boolean;
    title?: string;
    details?: string;
    editIndex?: number;
    applyNoteContents: (title?: string, details?: string, index?: number) => void;
} & TransitionEventTriggers;
export class NoteDialog extends R.Component<NoteDialogProps> {
    private titleInput!: TBC<HTMLInputElement>;
    private detailsEditor!: TBC<HTMLTextAreaElement>;
    shouldComponentUpdate(np: NoteDialogProps) {
        return np.open !== this.props.open;
    }
    render() {
        const { open, title, details, editIndex } = this.props;
        return (
            <Dialog
                open={open}
                onClose={() => this.props.applyNoteContents()}
                onExited={this.props.onExited}
            >
                <CoolDialogTitle>Note</CoolDialogTitle>
                <DialogContent style={styles.dialog}>
                    <table style={{ width: "100%"}}>
                        <tbody>
                            <tr style={styles.row}>
                                <td>Title</td>
                            </tr>
                            <tr>
                                <td>
                                    <TextField fullWidth
                                        autoFocus
                                        defaultValue={title || ""}
                                        inputRef={ref => this.titleInput = ref}
                                    />
                                </td>
                            </tr>
                            <tr style={styles.row}>
                                <td>Details</td>
                            </tr>
                            <tr>
                                <td>
                                    <TextField fullWidth
                                        defaultValue={details || ""}
                                        inputRef={ref => this.detailsEditor = ref}
                                        multiline
                                        rows={8}
                                        rowsMax={8}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => this.props.applyNoteContents((this.titleInput as HTMLInputElement).value, (this.detailsEditor as HTMLTextAreaElement).value || "", editIndex)} color="primary" autoFocus children="Save" />
                    <Button onClick={() => this.props.applyNoteContents()} color="secondary" children="Cancel" />
                </DialogActions>
            </Dialog>
        );
    }
}