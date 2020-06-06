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
import { EVEImage } from "@com/tiny/eve-image-icon";
export const listItemClasses = {
    root: "summary-listitem-root"
};
export const listItemTextClasses = {
    primary: "ellipsis-text",
    secondary: "list-item-secondary-text"
};
export const nextListItemClasses = {
    primary: "-inline-block"
};
export const SummaryPara = (props: { children: React.ReactNode }) => {
    return <p className="summary-para">{props.children}</p>;
};
export const createActiveImplantList = (implants: ImplantData[], hasMergin = false, fallback?: string) => {
    let contents: ReactInstanceType<"div">[] = [];
    if (!implants.length) {
        contents = [
            <div key="fallback">{fallback}</div>
        ];
    } else {
        for (let index = 0, end = implants.length; index < end;) {
            const { id, name } = implants[index];
            contents[index++] = <div key={id}>
                <span>
                    <EVEImage path={`/types/${id}/icon?size=32`}/>
                    {}
                </span>
                <span>{name}</span>
            </div>;
        }
    }
    let cn = "implants-list";
    if (hasMergin) {
        cn += " has-margin";
    }
    return <div  className={cn}>{
        contents
    }</div>;
};