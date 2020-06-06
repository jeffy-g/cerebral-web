import * as R from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { BorderedCardHeader } from "@com/tiny/extras";
import * as CharProvider from "@eve/models/char-provider";
import { BaseConfig } from "@/raw-configs";
import * as esiScheduler from "@eve/api/esi-scheduler";
import { ContractsTable } from "@com/tables/contracts-table";
export class Contracts extends R.Component<EVEComponentPropsBase> {
    render() {
        const { characterId } = this.props;
        const char = CharProvider.getCharacter(characterId)!;
        const { contracts, contractSlotsUsed } = char;
        const style: any = {
            paddingLeft: 18,
            paddingRight: 18,
        };
        const contract_statuses = BaseConfig.contract_completed_statuses;
        return (
            <div>
                <Card className="margin10">
                    <BorderedCardHeader
                        fontSize="1.3rem"
                        title={`Incomplete Contracts (${contractSlotsUsed}/${char.getMaxContracts()})`}
                        subheader={esiScheduler.explainOfLastTimeSchedule(characterId, "get_characters_character_id_contracts")}
                    />
                    <CardContent style={style}>
                        <ContractsTable
                            charId={characterId}
                            contracts={contracts.filter(c => !contract_statuses.includes(c.status))}
                        />
                    </CardContent>
                </Card>
                <Card className="margin10">
                    <BorderedCardHeader
                        fontSize="1.3rem"
                        title="Completed Contracts"
                    />
                    <CardContent style={style}>
                        <ContractsTable
                            contracts={contracts.filter(c => contract_statuses.includes(c.status))}
                            complete
                            charId={characterId}
                        />
                    </CardContent>
                </Card>
            </div>
        );
    }
}