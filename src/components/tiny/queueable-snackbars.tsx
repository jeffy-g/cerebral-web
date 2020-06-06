/*!
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  <one line to give the program's name and a brief idea of what it does.>
  Copyright (C) 2019 jeffy-g hirotom1107@gmail.com

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
import * as R from "react";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
const MESSAGE_STATE_COLORs = {
    check_circle: "#43a047",
    info: "#1976d2",
    warning: "#ffa000",
    error: "#d32f2f",
};
export type MessageState = keyof typeof MESSAGE_STATE_COLORs;
export type TQueueableSnackbars = Pick<
    QueueableSnackbars, "notify" | "clear" | "next"
>;
export type SnackbarMessage = {
    at: Date;
    state: MessageState;
    rowMessage: string;
};
export type QueueableSnackbarsProps = {
};
export type QueueableSnackbarsState = {
    open: boolean;
    messageInfo?: SnackbarMessage;
};
const DUMMY_MESSAGE = {
    state: "info",
    rowMessage: "nothing much, sir",
    at: new Date(0)
} as SnackbarMessage;
const classes = {
    close: {
        padding: 2
    },
    messageContainer: {
        display: "flex",
        alignContent: "center",
        alignItems: "center"
    },
    messageBodyStyle: {
        whiteSpace: "pre",
    },
    queueButtonStyle: {
        padding: "4px 8px",
        minWidth: "unset"
    }
} as Record<string, R.CSSProperties>;
const timeStampStyle = {
    fontSize: "0.7rem",
    paddingLeft: 8
} as R.CSSProperties;
const dateFormatOpt = {
    year: "2-digit",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
} as Intl.DateTimeFormatOptions;
const DEFAULT_HIDE = 8e3;
export class QueueableSnackbars extends R.Component<QueueableSnackbarsProps, QueueableSnackbarsState> {
    private queue: SnackbarMessage[] = [];
    state: QueueableSnackbarsState = {
        open: false
    };
    notify = (message: string, state: MessageState) => {
        const q = this.queue;
        q.push({
            at: new Date(),
            state,
            rowMessage: message,
        });
        if (this.state.open && q.length) {
            this.forceUpdate();
        } else {
            this.next();
        }
    }
    next = () => {
        const q = this.queue;
        const consumeQueue = () => {
            q.length && this.setState({
                messageInfo: q.shift(), open: true
            });
        };
        if (q.length > 0) {
            this.setState({ open: false }, consumeQueue);
        } else {
            consumeQueue();
        }
    }
    clear = () => {
        this.setState({ open: false }, () => (this.queue.length = 0));
    }
    handleClose4NextQueue = (
        // @ts-ignore unused parameter
        event: R.SyntheticEvent | R.MouseEvent, reason?: string
    ) => {
        if (reason !== "clickaway") {
            this.setState({ open: false });
        }
    }
    render() {
        const {
            open,
            messageInfo = DUMMY_MESSAGE
        } = this.state;
        const color = MESSAGE_STATE_COLORs[messageInfo.state];
        const messageNode = <>{messageInfo.rowMessage}
            <span style={timeStampStyle}
                role="img" aria-label="time-stamp"
            >⏰{messageInfo.at.toLocaleString(void 0, dateFormatOpt)}</span>
        </>;
        return <Snackbar key={+messageInfo.at}
            anchorOrigin={{
                vertical: "top",
                horizontal: "center"
            }}
            open={open}
            autoHideDuration={DEFAULT_HIDE}
            onClose={this.handleClose4NextQueue}
            onExited={this.next}
            ContentProps={{
                "aria-describedby": "message-id",
            }}
            message={
                <div style={classes.messageContainer} id="message-id">
                    {<Icon style={{ marginRight: 8, color }}>{messageInfo.state}</Icon>}
                    {<div style={classes.messageBodyStyle}>{messageNode}</div>}
                </div>
            }
            action={[
                <Button key="next" color="secondary" size="small"
                    style={classes.queueButtonStyle}
                    onClick={this.handleClose4NextQueue}
                >
                    {this.queue.length}
                </Button>,
                <IconButton key="clear" color="inherit" aria-label="Clear"
                    style={classes.close}
                    onClick={this.clear}
                >
                    <Icon>close</Icon>
                </IconButton>
            ]}
        />;
    }
}