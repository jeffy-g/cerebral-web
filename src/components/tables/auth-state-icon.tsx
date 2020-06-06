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
import * as AuthProvider from "@eve/models/auth-provider";
const DEBUG = 1;
const log = console.log;
const AuthStateContexts = {
    not_yet: {
        tip: "token refresh has not been done yet",
        micon: "check_circle",
        color: "silver"
    },
    expired_not_yet: {
        tip: "token has expired and token has not been refreshed yet",
        micon: "warning",
        color: "silver"
    },
    failed: {
        tip: "failed last time token request",
        micon: "warning",
        color: "red"
    },
    expired: {
        tip: "token expired",
        micon: "warning",
        color: "#e8e800"
    },
    healthy: {
        tip: "healthy",
        micon: "check_circle",
        color: "#5be8a4"
    },
};
type AuthStateContextKeys = keyof typeof AuthStateContexts;
const AuthIconClassName = "auth-state-icon";
const ElementSelector = `i.${AuthIconClassName}`;
const validateAuthState = (parentSelector?: string) => {
    if (!enableUpdate) {
        return -1;
    }
    let counter = 0;
    if (parentSelector === void 0) {
        parentSelector = "";
    }
    const icons = $queryAll<HTMLElement>(parentSelector + ElementSelector);
    for (const icon of icons) {
        const currentAuthState = lookupAuthState(
            AuthProvider.getEVEOAuthCharacter(icon.dataset.cid!)
        );
        if (icon.title !== currentAuthState.tip) {
            icon.title = currentAuthState.tip;
            icon.textContent = currentAuthState.micon;
            icon.style.color = currentAuthState.color;
            counter++;
        }
    }
    return counter;
};
const lookupAuthState = (auth: AuthProvider.IEVEOAuthCharacter) => {
    let key: AuthStateContextKeys | undefined;
    const expired = new Date(auth.accessTokenExpiry) < new Date();
    switch (auth.lastRefresh.success) {
        case false: key = "failed"; break;
        case undefined:
            key = expired? "expired_not_yet": "not_yet";
            break;
    }
    if (key === void 0) {
        key = expired? "expired": "healthy";
    }
    return AuthStateContexts[key];
};
const emitValidateProcess = (parentSelector: string, logMessage: string, countRef?: { current: number }) => {
    return () => {
        const updated = validateAuthState(parentSelector);
        if (DEBUG) {
            const params = [] as number[];
            countRef && params.push(countRef.current++);
            params.push(updated);
            log(logMessage, ...params);
        }
    };
};
export const AuthStateIconManager = (
    { parentSelector = "", duration = 10_000 }: {
        parentSelector?: string;
        duration?: number;
    }
) => {
    const countRef = R.useRef(0);
    R.useEffect(
        emitValidateProcess(parentSelector, "AuthStateIconManager::didUpdate - updated: %s")
    );
    R.useEffect(() => {
        BackgroundTaskManager.operateTimerTask(
            "auth-state-checker", {
                action: "start", interval: duration
            }, emitValidateProcess(parentSelector, "AuthStateIconManager::backgroundTimer - validated@%s, updated: %s", countRef)
        );
        return () => {
            BackgroundTaskManager.operateTimerTask("auth-state-checker", { action: "remove" });
            enableUpdate = true;
            DEBUG && log("AuthStateIconManager::UNMOUNTED");
        };
    }, []);
    return null;
};
let enableUpdate = true;
export const enableAuthStateUpdate = (is: boolean) => {
    enableUpdate = is;
    if (DEBUG) {
        !is && log("%cenableAuthStateUpdate::desabled", "color: orange");
    }
};
export const AuthStateIcon = ({ characterId }: { characterId: string }) => {
    return <i title=""
        children="access_time"
        data-cid={characterId}
        className={`material-icons ${AuthIconClassName}`}
    />;
};