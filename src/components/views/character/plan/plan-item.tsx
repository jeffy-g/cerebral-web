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
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import TableCell from "@material-ui/core/TableCell";
import {
    SortableElement, SortableElementProps
} from "react-sortable-hoc";
import * as DateTimeUtil from "@util/date-time-util";
import { SkillDB } from "@eve/models/eve-skills";
type CellStyles = {
    columnAttributes?: R.CSSProperties;
    columnSPhs?: R.CSSProperties;
    columnLastRemap?: R.CSSProperties;
};
export type SortableItemAProps = {
    onEdit: (index: number) => any;
    onRemove: (index: number) => unknown;
    onMouseDown: (index: number, e: R.MouseEvent<HTMLElement>) => any;
    highlighted: boolean;
    value: PlanQueueItem;
    idx: number;
} & CellStyles & SortableElementProps;
const EditIconButton = <IconButton className="padding-4px">
    <Icon style={{ fontSize: "1.2rem" }}>mode_edit</Icon>
</IconButton>;
const DeleteIconButton = <IconButton className="padding-4px">
    <Icon>delete</Icon>
</IconButton>;
const PlanItem = (props: SortableItemAProps) => {
    const { onRemove, onEdit, onMouseDown, idx } = props;
    const handleMouseDown = R.useCallback((e: R.MouseEvent<HTMLElement>) => {
        const text = (e.target as HTMLElement).textContent;
        if (text === "delete") {
            onRemove(idx);
        } else if (text === "mode_edit") {
            onEdit(idx);
        } else {
            onMouseDown(idx, e);
        }
    }, [idx]);
    const handleKeyup = R.useCallback((e: R.KeyboardEvent) => {
        if (e.key === "Delete") {
            onRemove(idx);
        }
    }, [idx]);
    const queueItem = props.value;
    const tprops = {
        className: `plan-table-row${props.highlighted ? " user-selected": ""}`,
        onClick: handleMouseDown,
        tabIndex: 0,
        onKeyUp: handleKeyup
    };
    if (queueItem.type === "skill") {
        const groupName = SkillDB.skills[queueItem.id].mkt_gname;
        return (
            <tr {...tprops}>
                <TableCell
                    // @ts-ignore 
                    style={{ "--group-icon": `url("../images/skill-groups/${groupName.toLowerCase().replace(" ", "-")}.png")` }}
                >
                    {queueItem.title}
                </TableCell>
                <TableCell>{DateTimeUtil.niceCountdown(queueItem.time)}</TableCell>
                <TableCell>{groupName}</TableCell>
                <TableCell style={props.columnAttributes}>{queueItem.attributeTitle}</TableCell>
                <TableCell style={props.columnSPhs}>{queueItem.spHour}</TableCell>
                <TableCell style={props.columnLastRemap}>{DateTimeUtil.niceCountdown(queueItem.lastRemap)}</TableCell>
                <TableCell className="edit-button-cell"/>
                <TableCell>
                    {DeleteIconButton}
                </TableCell>
            </tr>
        );
    }
    else if (queueItem.type === "note" || queueItem.type === "remap") {
        const icon = queueItem.type === "note" ? "📝": "🔀";
        return (
            <tr {...tprops}>
                <TableCell data-icon={icon} colSpan={6}>
                    <div className="text-ellipsis">{queueItem.title}</div>
                </TableCell>
                <TableCell className="edit-button-cell">
                    {EditIconButton}
                </TableCell>
                <TableCell>
                    {DeleteIconButton}
                </TableCell>
            </tr>
        );
    }
    else {
        return <tr/>;
    }
};
export const SortablePlanItem = SortableElement<SortableItemAProps>(
    PlanItem
);