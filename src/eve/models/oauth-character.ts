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
import * as NsOAuthClient from "@eve/oauth/oauth-client";
import {
    TEVEOAuthResult,
    IEVEOAuth2, TEVEOAuthRefreshResult,
    TOAuthRefreshErrorResponse, TOAuthRequestErrorReason
} from "@eve/oauth/oauth-client";
import { create, ISimplifiedLock } from "mini-semaphore";
export type TEVEOAuthCharacterData = TEVEOAuthResult & {
    lastRefresh?: LastRefresh;
    accessTokenExpiryAsLong?: number;
};
export interface IEVEOAuthCharacter extends InterfaceType<typeof EVEOAuthCharacter.prototype> {}
export type NsEVEOAuthCharacter = InterfaceType<typeof EVEOAuthCharacter> & {
    new(data: TEVEOAuthCharacterData): IEVEOAuthCharacter;
};
export interface IOAuthManager {
    push(authData: Partial<IEVEOAuthCharacter>, reason?: string): void;
    suppressESIRequest(characterId: EVEId, reason: TOAuthRequestErrorReason, temporary?: boolean): void;
}
let mgr: IOAuthManager = {
    // @ts-ignore unused parameters
    push(authData: Partial<IEVEOAuthCharacter>, reason?: string) {},
    // @ts-ignore unused parameters
    suppressESIRequest(characterId: EVEId, reason: TOAuthRequestErrorReason, temporary?: boolean) {}
};
export const withOAuthManager = (m: IOAuthManager) => {
    for (const key of ["push", "suppressESIRequest"] as (keyof IOAuthManager)[]) {
        if (typeof m[key] !== "function") {
            throw new Error("invalid provider");
        }
    }
    mgr = m;
};
export class EVEOAuthCharacter {
    characterId: TEVEOAuthResult["characterId"];
    accessToken: TEVEOAuthResult["accessToken"];
    refreshToken: TEVEOAuthResult["refreshToken"];
    accessTokenExpiry: TEVEOAuthResult["accessTokenExpiry"];
    characterOwnerHash: TEVEOAuthResult["characterOwnerHash"];
    accessTokenExpiryAsLong: number;
    lastRefresh: LastRefresh;
    constructor(authData: TEVEOAuthCharacterData) {
        this.characterId = authData.characterId;
        this.accessToken = authData.accessToken;
        this.refreshToken = authData.refreshToken;
        this.accessTokenExpiry = authData.accessTokenExpiry;
        this.characterOwnerHash = authData.characterOwnerHash;
        this.lastRefresh = authData.lastRefresh || onil();
        this.accessTokenExpiryAsLong = authData.accessTokenExpiryAsLong || +new Date(authData.accessTokenExpiry);
        this.lock = create(1);
        this.called = 0;
    }
    isTokenExpired = () => {
        return (this.accessTokenExpiryAsLong || 0) <= Date.now() + 10000;
    }
    async checkTokenExpire(): Promise<boolean> {
        await this.lock.acquire();
        try {
            if (this.isTokenExpired()) {
                this.called++;
                return this.refresh();
            }
        } finally {
            this.lock.release();
        }
        return false;
    }
    async getAccessToken(): Promise<string> {
        await this.checkTokenExpire();
        return this.accessToken;
    }
    private lock: ISimplifiedLock;
    // @ts-ignore develpment use (to be removed in the future
    private called: number;
    private async refresh() {
        if (this.refreshBlocked()) {
            throw this.lastRefresh.error;
        }
        let oauth: IEVEOAuth2 | undefined;
        try {
            oauth = NsOAuthClient.createOAuthWrapper();
        } catch (e) {
            this.ssoInstanceError();
            throw e;
        }
        let success: number | undefined;
        if (oauth) {
            let result: TEVEOAuthRefreshResult;
            try {
                result = await oauth.refresh(this.refreshToken);
            } catch (e) {
                this.tokenRequestError(e);
                throw e;
            }
            this.accessToken = result.accessToken;
            this.accessTokenExpiry = result.accessTokenExpiry;
            this.accessTokenExpiryAsLong = result.accessTokenExpiryAsLong;
            this.refreshToken = result.refreshToken;
            this.lastRefresh = {
                date: new Date(), success: true
            };
            this.save("accessToken updated!");
            success = 1;
        }
        return !!success;
    }
    private refreshBlocked(): boolean {
        return (
            (this.lastRefresh.success === false)
            && (
                (this.lastRefresh.shouldRetry === false)
                || (new Date(this.lastRefresh.date) > new Date(Date.now() - 300 * 1e3))
            )
        );
    }
    private ssoInstanceError() {
        this.lastRefresh.success = false;
        this.lastRefresh.error = {
            error: "invalid_client",
            error_description: "No client credentials provided.",
        };
        this.lastRefresh.shouldRetry = false;
        this.save("ssoInstanceError");
        this.markFailed("client");
    }
    private tokenRequestError(thrownError: TOAuthRefreshErrorResponse | Error) {
        let reason: TOAuthRequestErrorReason = "error";
        let temporary: TBD<boolean>;
        const lr = this.lastRefresh;
        lr.success = false;
        if ("error" in thrownError) {
            lr.error = thrownError;
            switch (thrownError.error) {
                case "invalid_grant":
                    reason = "token";
                    break;
                case "invalid_client":
                case "unauthorized_client":
                    reason = "client";
                    break;
                case "invalid_token":
                    reason = "token";
                    break;
                default:
                    temporary = true;
                    break;
            }
        } else {
            lr.error = reason = thrownError.message as TOAuthRequestErrorReason;
            temporary = true;
        }
        lr.shouldRetry = !!temporary;
        this.markFailed(reason, temporary);
        this.save("tokenRequestError");
    }
    private markFailed(reason: TOAuthRequestErrorReason, temporary?: boolean) {
        mgr.suppressESIRequest(this.characterId, reason, temporary);
    }
    private save(reason: string) {
        mgr.push(this, reason);
    }
}