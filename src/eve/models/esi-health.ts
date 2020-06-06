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
import { ESI_BASE } from "./constants";
const _DEBUG = 1;
const ADJUST = 10_000;
let nsl_Expires = Date.now();
function emitRequest() {
    let petag: TBC<string> = null;
    let hscache: ESIHealthStatus[] = [];
    return async function () {
        if (nsl_Expires > Date.now()) {
            return hscache;
        }
        const opt: RequestInit = {
            method: "get", mode: "cors",
            headers: onil()
        };
        if (petag) {
            // @ts-ignore
            opt.headers["if-none-match"] = petag;
        }
        const healthes: ESIHealthStatus[] = await fetch(
            `${ESI_BASE}/status.json?version=latest`, opt
        ).then(res => {
            const st = res.status;
            petag = res.headers.get("etag");
            nsl_Expires = Date.parse(res.headers.get("expires")!) + ADJUST;
            _DEBUG && console.log(
                "----> esi health status response: etag=%s, http::status=%s, expires=%s",
                petag, st, new Date(nsl_Expires).toLocaleTimeString()
            );
            return st === 200? res.json(): void 0;
        });
        if (healthes) {
            hscache = healthes;
        }
        return hscache;
    };
}
export const getStatus = emitRequest();
export const getCurrentESIHealthExpires = <K extends NorSFunctions<Date>>(method?: K): ReturnType<Date[K]> => {
    if (method) {
        return new Date(nsl_Expires)[method]() as ReturnType<Date[K]>;
    }
    return nsl_Expires as ReturnType<Date[K]>;
};