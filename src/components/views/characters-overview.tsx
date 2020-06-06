/*!
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  <one line to give the program's name and a brief idea of what it does.>
  Copyright (C) 2020 jeffy-g hirotom1107@gmail.com

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
import { CharactersOverviewTable } from "@com/tables/char-overview-table";
import { processEVESSO } from "@eve/sso-authorization";
import * as Extras from "@com/tiny/extras";
import { LocalStorage } from "@util/web-storage-util";
const ls = new LocalStorage("/eve.sso/login/withPopup", true);
export const Overview = () => {
    const [withPopup, setPopup] = R.useState(ls.load());
    return <>
        <Extras.EVEBannerButton
            onClick={() => processEVESSO(withPopup)}
            checkboxProps={{
                size: "small",
                label: "with popup",
                rootClassName: "eve-banner-button__checkbox", labelClassName: "fs08125",
                checked: withPopup, value: "unused",
                // @ts-ignore 
                onChange: (e: R.ChangeEvent<HTMLInputElement>, checked: boolean) => {
                    ls.save(checked);
                    setPopup(checked);
                }
            }}
        />
        <CharactersOverviewTable/>
    </>;
};