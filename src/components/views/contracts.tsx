import * as R from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { BorderedCardHeader } from "../tiny/extras";
import { ContractsTable } from "../tables/contracts-table";
import * as CharProvider from "@eve/models/char-provider";
const cardStyle: R.CSSProperties = {
    paddingLeft: 18,
    paddingRight: 18,
};
export const Contracts = () => {
    const charClass = CharProvider.getCharacterClass();
    return <div style={{ padding: 10 }}>
        <Card style={{ margin: "0 0 10px" }}>
            <BorderedCardHeader title="Pending Contracts" fontSize="1.4rem" />
            <CardContent style={cardStyle}>
                <ContractsTable contracts={charClass.getAllContracts()} />
            </CardContent>
        </Card>
        <Card style={{ margin: 0 }}>
            <BorderedCardHeader title="Completed Contracts" fontSize="1.4rem" />
            <CardContent style={cardStyle}>
                <ContractsTable
                    contracts={charClass.getAllContracts(true)}
                    complete
                />
            </CardContent>
        </Card>
    </div>;
};