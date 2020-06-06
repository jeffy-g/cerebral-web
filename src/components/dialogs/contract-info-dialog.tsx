import * as R from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import red from "@material-ui/core/colors/red";
import green from "@material-ui/core/colors/green";
import { CoolDialogTitle } from "../tiny/extras";
import * as DateTimeUtil from "@util/date-time-util";
import * as mf from "@util/misc-functions";
const styles: Record<string, R.CSSProperties> = {
    tableContent: {
        textAlign: "left",
        fontSize: 14,
        padding: "4px 10px"
    },
    th: {
        width: 110
    },
    table: {
        marginBottom: 8,
        borderRadius: 4,
        boxShadow: "1px 1px 4px 0px rgba(192, 192, 192, 0.72)",
        width: "100%",
    }
};
type ContractInfoDialogProps = {
    open: boolean;
    contract?: EVEContractData;
    onClose: () => void;
};
export class ContractInfoDialog extends R.PureComponent<ContractInfoDialogProps> {
    render() {
        const { contract } = this.props;
        if (contract === undefined) {
            return null;
        }
        let typeSpecific: R.ReactNode = "";
        switch (contract.type) {
            case "courier":
                typeSpecific = (
                    <tbody>
                        <tr>
                            <th style={styles.th}>Pickup:</th>
                            <td>
                                {contract.start_location !== undefined ? contract.start_location.name : "Unknown"}
                            </td>
                        </tr>
                        <tr>
                            <th>Delivery:</th>
                            <td>
                                {contract.end_location !== undefined ? contract.end_location.name : "Unknown"}
                            </td>
                        </tr>
                        <tr>
                            <th>Volume:</th>
                            <td>{
                                mf.toLocaleString(contract.volume!, "m³")
                            }</td>
                        </tr>
                        <tr>
                            <th>Reward:</th>
                            <td style={{ color: green.A200, fontWeight: "bold" }}>{
                                mf.toLocaleString(contract.reward!, "ISK")
                            }</td>
                        </tr>
                        <tr>
                            <th style={styles.th}>Collateral:</th>
                            <td style={{ color: red[500], fontWeight: "bold" }}>{
                                mf.toLocaleString(contract.collateral!, "ISK")
                            }</td>
                        </tr>
                        <tr>
                            <th style={styles.th}>Days to Complete:</th>
                            <td>{
                                contract.days_to_complete
                            }</td>
                        </tr>
                    </tbody>
                );
                break;
            case "item_exchange":
                const price = contract.price!;
                typeSpecific = (
                    <tbody>
                        <tr>
                            <th style={styles.th}>
                                Buyer Will{price >= 0 ? " Pay" : " Get"}:
                            </th>
                            <td style={{ color: price >= 0 ? red[500] : green.A200, fontWeight: "bold" }}>{
                                mf.toLocaleString(price >= 0 ? price : (price * -1), "ISK")
                            }</td>
                        </tr>
                    </tbody>
                );
                break;
            case "auction":
                typeSpecific = (
                    <tbody>
                        <tr>
                            <th style={styles.th}>Opening Bid:</th>
                            <td style={{ color: red[500], fontWeight: "bold" }}>{
                                mf.toLocaleString(contract.price!, "ISK")
                            }</td>
                        </tr>
                    </tbody>
                );
                break;
            default: break;
        }
        const tableProps = {
            cellPadding: 3, style: styles.table
        };
        return (
            <Dialog
                open={this.props.open}
                PaperProps={{ style: { borderRadius: 6, minWidth: 280 } }}
                onClose={() => this.props.onClose()}
            >
                <CoolDialogTitle>Contract Info</CoolDialogTitle>
                <div style={styles.tableContent}>
                    <table {...tableProps}>
                        <tbody>
                            <tr>
                                <th style={styles.th}>Type:</th>
                                <td style={{ textTransform: "capitalize" }}>
                                    {contract.type.replace("_", " ")}
                                </td>
                            </tr>
                            <tr>
                                <th>Status:</th>
                                <td style={{ textTransform: "capitalize" }}>
                                    {contract.status.replace("_", " ")}
                                </td>
                            </tr>
                            <tr>
                                <th>Date Completed:</th>
                                <td>
                                    {
                                        contract.date_completed !== undefined
                                            ? `${new Date(contract.date_completed).toLocaleString(navigator.language)
                                            } (${DateTimeUtil.relative(new Date(contract.date_completed))})`
                                            : "Not Completed"
                                    }
                                </td>
                            </tr>
                            <tr>
                                <th>Description:</th>
                                <td>
                                    {contract.title !== undefined && contract.title !== "" ? contract.title : "N/A"}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table {...tableProps}>
                        <tbody>
                            <tr>
                                <th style={styles.th}>Date Issued:</th>
                                <td>
                                    {new Date(contract.date_issued).toLocaleString(navigator.language)}
                                    &ensp;
                                    {DateTimeUtil.relative(new Date(contract.date_issued))}
                                </td>
                            </tr>
                            <tr>
                                <th>Issuer:</th>
                                <td>
                                    {contract.issuer.name}
                                </td>
                            </tr>
                            <tr>
                                <th>Issuer Corporation:</th>
                                <td>
                                    {contract.issuer_corporation.name}
                                </td>
                            </tr>
                            <tr>
                                <th>Behalf of Corp?</th>
                                <td>
                                    {contract.for_corporation ? "Yes" : "No"}
                                </td>
                            </tr>
                            <tr>
                                <th>Expiry Date:</th>
                                <td>
                                    {new Date(contract.date_expired).toLocaleString(navigator.language)}
                                    &ensp;
                                    {DateTimeUtil.relative(new Date(contract.date_expired))}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table {...tableProps}>
                        <tbody>
                            <tr>
                                <th style={styles.th}>Availability:</th>
                                <td style={{ textTransform: "capitalize" }}>
                                    {contract.availability.replace("_", " ")}
                                    {contract.assignee !== undefined ? ` - ${contract.assignee.name}` : ""}
                                </td>
                            </tr>
                            <tr>
                                <th>Date Accepted:</th>
                                <td>
                                    {
                                        contract.date_accepted !== undefined
                                            ? `${new Date(contract.date_accepted).toLocaleString(navigator.language)
                                            } (${DateTimeUtil.relative(new Date(contract.date_accepted))})`
                                            : "Not Accepted"
                                    }
                                </td>
                            </tr>
                            <tr>
                                <th>Acceptor:</th>
                                <td>
                                    {contract.acceptor !== undefined ? contract.acceptor.name : "Not Accepted"}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table {...tableProps}>
                        {typeSpecific}
                    </table>
                </div>
                <DialogActions>
                    <Button onClick={() => this.props.onClose()} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
        );
    }
}