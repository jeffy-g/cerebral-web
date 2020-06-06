import * as R from "react";
import ReactTable, { Column } from "react-table";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import { ContractInfoDialog } from "../dialogs/contract-info-dialog";
import * as mf from "@util/misc-functions";
type ContractsTableProps = {
    charId?: string|number;
    contracts: EVEContractData[];
    complete?: boolean;
};
type ContractsTableState = {
    openedContract: EVEContractData | undefined;
    openDialog: boolean;
};
type ContractsTableSnapShot = Record<string, any>;
export class ContractsTable extends R.Component<ContractsTableProps, ContractsTableState, ContractsTableSnapShot> {
    constructor(props: ContractsTableProps) {
        super(props);
        this.purgeState();
    }
    shouldComponentUpdate(np: ContractsTableProps, ns: ContractsTableState) {
        const diff = this.props.charId !== np.charId;
        diff && (ns.openedContract = void 0);
        return true;
    }
    private purgeState() {
        this.state = {
            openedContract: void 0,
            openDialog: false
        };
    }
    render() {
        const { contracts } = this.props;
        let jsxElement: JSX.Element;
        if (typeof contracts === "object" && contracts !== null && contracts.length === 0) {
            jsxElement = <p>No contracts found.</p>;
        } else {
            const columns: Column<EVEContractData>[] = [
                {
                    Header: "ID",
                    id: "contract_id",
                    accessor: "contract_id",
                    show: false
                },
                {
                    Header: "Type",
                    headerStyle: {
                        textAlign: "left"
                    },
                    id: "type",
                    accessor: c => c.type.replace("_", " "),
                    style: {
                        textTransform: "capitalize"
                    },
                    maxWidth: 120
                },
                {
                    Header: "Status",
                    headerStyle: {
                        textAlign: "left"
                    },
                    id: "status",
                    accessor: c => c.status.replace("_", " "),
                    style: {
                        textTransform: "capitalize"
                    },
                    maxWidth: 150
                },
                {
                    Header: "Details",
                    headerStyle: {
                        textAlign: "left"
                    },
                    id: "title",
                    accessor: (c) => {
                        if (c.type === "courier") {
                            let str = "";
                            str += (c.start_location !== undefined) ? c.start_location.system.name : "Unknown";
                            str += " >> ";
                            str += (c.end_location !== undefined) ? c.end_location.system.name : "Unknown";
                            str += ` (${mf.toLocaleString(c.volume as number, "m³")}`;
                            return str;
                        }
                        return c.title;
                    }
                },
                {
                    Header: "From",
                    headerStyle: {
                        textAlign: "left"
                    },
                    id: "issuer_id",
                    accessor: c => (c.for_corporation === true ? c.issuer_corporation.name : c.issuer.name),
                    maxWidth: 120
                },
                {
                    Header: "To",
                    headerStyle: {
                        textAlign: "left"
                    },
                    id: "assignee_id",
                    accessor: (c) => {
                        if (c.acceptor !== undefined) {
                            return c.acceptor.name;
                        } if (c.assignee !== undefined) {
                            return c.assignee.name;
                        }
                        return "Public";
                    },
                    maxWidth: 120
                },
                {
                    Header: "Issued",
                    headerStyle: {
                        textAlign: "left"
                    },
                    accessor: "date_issued",
                    Cell: row => (
                        <span>
                            {new Date(row.value).toLocaleDateString(navigator.language)}
                        </span>
                    ),
                    sortMethod: (a, b) => (new Date(a).getTime() > new Date(b).getTime() ? 1 : -1),
                    maxWidth: 80
                },
            ];
            if (this.props.complete === true) {
                columns.push({
                    Header: "Completed",
                    headerStyle: {
                        textAlign: "left"
                    },
                    id: "date_completed",
                    accessor: c => (c.date_completed !== undefined ? c.date_completed : c.date_issued),
                    Cell: row => (
                        <span>
                            {new Date(row.value).toLocaleDateString(navigator.language)}
                        </span>
                    ),
                    sortMethod: (a, b) => (new Date(a).getTime() > new Date(b).getTime() ? 1 : -1),
                    maxWidth: 80
                });
            }
            columns.push({
                Header: "",
                accessor: "contract_id",
                style: {
                    textAlign: "center",
                    height: 32,
                    padding: 4
                },
                Cell: (row: { value: number }) => (
                    <IconButton
                        className="-right-arrow-button"
                        onClick={() => this.setState({
                            openDialog: true,
                            openedContract: contracts.find(c => c.contract_id === row.value)
                        })}
                    >
                        <Icon>navigate_next</Icon>
                    </IconButton>
                ),
                width: 32
            });
            const { openDialog, openedContract } = this.state;
            const dlgProps = {
                open: openDialog,
                contract: openedContract,
                onClose: () => {
                    this.setState({ openDialog: false });
                },
            };
            jsxElement = <>
                <ContractInfoDialog {...dlgProps} />
                <ReactTable
                    style={{
                        fontSize: "0.95em", cursor: "default",
                    }}
                    data={contracts}
                    columns={columns}
                    defaultPageSize={5}
                    defaultSorted={[
                        {
                            id: this.props.complete === true ? "date_completed" : "date_issued",
                            desc: true
                        }
                    ]}
                />
            </>;
        }
        this.purgeState();
        return jsxElement;
    }
}