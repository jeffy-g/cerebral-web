import * as R from "react";
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import Paper from "@material-ui/core/Paper";
import { CoolDialogTitle } from "../tiny/extras";
import {
    getEVEImageUrl
} from "@eve/models/constants";
type MainContentDialogProps = {
    open: boolean;
    onClose: () => void;
    onExited?: () => void;
    mail?: EVEMailData;
    mailBody?: EVEMailBodyEx;
};
const createAvatar = (id: number, type: string): JSX.Element => {
    type AvatarProops = R.ComponentPropsWithoutRef<typeof Avatar>;
    const props: AvatarProops = {
        style: styles.avatar,
    };
    switch (type) {
        case "character":
        case "corporation":
        case "alliance":
            props.src = getEVEImageUrl(type, id);
            break;
        case "mailing_list":
            props.children = <Icon>list</Icon>; break;
        default:
            props.children = <Icon>help</Icon>; break;
    }
    return <Avatar {...props} />;
};
const BORDER_PROP = "1px solid rgba(192, 192, 192, 0.39)";
const styles = {
    paper: {
        borderRadius: 6, minWidth: 320
    } as R.CSSProperties,
    dialogContent: {
        textAlign: "left",
        fontSize: 14,
        padding: "4px 16px 10px"
    } as R.CSSProperties,
    th: {
        width: 60,
        paddingRight: 6,
        textAlign: "right",
        borderRight: BORDER_PROP,
        borderBottom: BORDER_PROP,
    } as R.CSSProperties,
    thLast: {
        width: 60,
        paddingRight: 6,
        textAlign: "right",
        borderRight: BORDER_PROP,
    } as R.CSSProperties,
    td: {
        textTransform: "capitalize",
        borderBottom: BORDER_PROP,
    } as R.CSSProperties,
    table: {
        marginBottom: 10,
        width: "100%",
    } as R.CSSProperties,
    avatar: {
        width: 26,
        height: 26,
        marginLeft: 2
    } as R.CSSProperties,
    chip: {
        margin: 2,
        height: 28
    } as R.CSSProperties,
    wrapper: {
        display: "flex",
        flexWrap: "wrap",
    } as R.CSSProperties,
};
const handleToggleWrap = () => {
    const e = $query("div.eve-mail-body");
    if (e) {
        const value = e.style.whiteSpace;
        e.style.whiteSpace = value === "pre" ? "pre-wrap" : "pre";
    }
};
export class MailContentDialog extends R.PureComponent<MainContentDialogProps> {
    render() {
        let { mail = onil<EVEMailData>(), mailBody, open } = this.props;
        if (mail === void 0) {
            return null;
        }
        return (
            <Dialog
                open={open}
                scroll="paper"
                PaperProps={{ style: styles.paper }}
                onClose={this.props.onClose}
                onExited={this.props.onExited}
            >
                <CoolDialogTitle>{mail.subject}</CoolDialogTitle>
                <DialogContent style={styles.dialogContent}>
                    <table cellPadding={3} style={styles.table}>
                        <tbody>
                            <tr>
                                <th style={styles.th}>From:</th>
                                <td style={styles.td}>
                                    <Chip style={styles.chip}
                                        avatar={createAvatar(mail.from, "character")}
                                        label={mail.from_name}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th style={styles.th}>To:</th>
                                <td style={styles.td}>
                                    <div style={styles.wrapper}>{
                                        mail.recipients && mail.recipients.map(r => (
                                            <Chip key={r.recipient_id} style={styles.chip}
                                                avatar={createAvatar(r.recipient_id, r.recipient_type)}
                                                label={r.recipient_name}
                                            />
                                        ))
                                    }</div>
                                </td>
                            </tr>
                            <tr>
                                <th style={styles.th}>Date:</th>
                                <td style={styles.td}>
                                    {new Date(mail.timestamp).toLocaleString(navigator.language)}
                                </td>
                            </tr>
                            <tr>
                                <th style={styles.thLast}>Labels:</th>
                                <td>
                                    {mail.label_names !== undefined ? mail.label_names.join(", ") : ""}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <Paper>
                        <div className="eve-mailbody-wrap-toggle" onClick={handleToggleWrap}>Toggle wrap</div>
                        <div className="eve-mail-body" style={{ whiteSpace: "pre-wrap" }}
                            dangerouslySetInnerHTML={{ __html: mailBody?.htmlBody || "" }}
                        ></div>
                    </Paper>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.onClose} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
        );
    }
}