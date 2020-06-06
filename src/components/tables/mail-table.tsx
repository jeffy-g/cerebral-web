import * as R from "react";
import ReactTable, { Column } from "react-table";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import * as NsESIClient from "@eve/api/esi-client";
import * as MailBodyHelper from "@eve/mail-body-helper";
import { MailContentDialog } from "../dialogs/mail-content-dialg";
type MailTableProps = {
    characterId: EVEId;
    mails?: EVEMailData[];
};
type MailTableState = {
    openDialog?: boolean;
    openedMail?: EVEMailData;
    mailBody?: EVEMailBodyEx;
    animateClassName?: string;
    clickedRow?: number;
};
async function fetchMailBodyOf(mailId: number, charId: MailTableProps["characterId"]): Promise<TBD<EVEMailBodyEx>> {
    const esi = await NsESIClient.getInstance(charId);
    return MailBodyHelper.retrieveMailBody(mailId, charId, esi);
}
function createNewState(
    animateClassName: string = "",
    clickedRow: number = 0,
    openedMail: TBD<EVEMailData> = void 0,
    mailBody: TBD<EVEMailBodyEx> = void 0,
    openDialog: boolean = false
): MailTableState {
    return {
        openDialog,
        openedMail,
        mailBody,
        animateClassName,
        clickedRow
    };
}
type TMailTable = R.Component<MailTableProps, MailTableState>;
const handleMailContent = async (that: TMailTable, mailId: number) => {
    const mailData = that.props.mails!.find(c => c.mail_id === mailId);
    if (mailData) {
        await new Promise<void>(resolve => {
            that.setState(
                createNewState("loading-icon", mailId), resolve
            );
        });
        let newState: TBD<MailTableState>;
        try {
            const mailBody = await fetchMailBodyOf(mailData.mail_id, that.props.characterId);
            newState = createNewState("", 0, mailData, mailBody, true);
        } catch (error) {
            console.log(error);
            newState = createNewState();
        } finally {
            newState && that.setState(newState);
        }
    }
};
const mailTableColumns: Column[] = [
    {
        Header: "Status",
        id: "is_read",
        accessor: (mail: EVEMailData) => mail.is_read,
        Cell: (row: ReactTableRowData<boolean>) => {
            const iconType = row.value ? "drafts" : "mail";
            return <div className="table-iconCell">
                <Icon className="table-iconCell__icon" children={iconType}/>
            </div>;
        },
        maxWidth: 50,
    },
    {
        Header: "Sender",
        id: "from_name",
        accessor: "from_name",
        maxWidth: 150,
    },
    {
        Header: "Subject",
        id: "subject",
        accessor: "subject",
    },
    {
        Header: "Received",
        accessor: "timestamp",
        Cell: (data: ReactTableRowData<string>) => new Date(data.value).toLocaleString(navigator.language),
        sortMethod: (a, b) => {
            const ad = +new Date(a);
            const bd = +new Date(b);
            return ad < bd ? -1 : +(ad > bd);
        },
        maxWidth: 160,
    },
    {
        Header: "Labels",
        id: "labels",
        accessor: "label_names",
        Cell: (row: ReactTableRowData<string[]>) => row.value !== undefined ? row.value.join(", ") : "",
        width: 200,
    },
    {
        Header: "",
        accessor: "mail_id",
        maxWidth: 32,
        className: "-mail-fetch-buttonCell"
    }
];
const getMailIdColumn = () => {
    return mailTableColumns.find(c => c.accessor === "mail_id");
};
export class MailTable extends R.Component<MailTableProps, MailTableState> {
    constructor(props: MailTableProps) {
        super(props);
        this.state = createNewState();
        this.initTableColumnsWith();
    }
    private initTableColumnsWith() {
        const col = getMailIdColumn();
        if (col) {
            col.Cell = (row: ReactTableRowData<number>) => {
                const stat = this.state;
                return <IconButton
                    className={`-right-arrow-button ${stat.clickedRow === row.value ? stat.animateClassName : ""}`}
                    onClick={() => handleMailContent(this, row.value)}
                >
                    <Icon>navigate_next</Icon>
                </IconButton>;
            };
        }
    }
    componentWillUnmount() {
        const col = getMailIdColumn();
        col && (col.Cell = void 0);
    }
    render() {
        const { mails } = this.props;
        if (!Array.isArray(mails) || mails.length === 0) {
            return <p>No Mails found.</p>;
        }
        const stat = this.state;
        const mailDlgProps = {
            mail: stat.openedMail,
            mailBody: stat.mailBody,
            open: !!stat.openDialog,
            onClose: () => {
                this.setState(createNewState(
                    "", 0, stat.openedMail, stat.mailBody
                ));
            },
        };
        return <>
            <MailContentDialog {...mailDlgProps}/>
            <ReactTable
                data={mails}
                columns={mailTableColumns}
                defaultPageSize={10}
                pageSizeOptions={[
                    5, 10, 15, 20, 25, 30, 40, 50
                ]}
                defaultSorted={[
                    { id: "timestamp", desc: true }
                ]}
            />
        </>;
    }
}