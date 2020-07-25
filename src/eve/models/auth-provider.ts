/*!
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  <one line to give the program's name and a brief idea of what it does.>
  Copyright (C) 2018 jeffy-g hirotom1107@gmail.com

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
import {
    EVEOAuthCharacter, withOAuthManager,
    IEVEOAuthCharacter, TEVEOAuthCharacterData
} from "./oauth-character";
import {
    TEVEOAuthResult, TOAuthRequestErrorReason,
} from "@eve/oauth/oauth-client";
import * as oac from "@eve/oauth/oauth-client";
import * as esis from "@eve/api/esi-scheduler";
import { Store } from "@util/indexed-db-store";
export {
    IEVEOAuthCharacter, NsEVEOAuthCharacter, TEVEOAuthCharacterData
} from "./oauth-character";
type TJSAtomicValueRecord = Record<string, JsonValueTypes>;
type TEVEOAuthDataRecord = Record<string, TJSAtomicValueRecord>;
let acRecord: Record<string, IEVEOAuthCharacter>;
const KN = "auth-characters";
let store: Store<TEVEOAuthDataRecord>;
export const getEVEOAuthCharacterIds = (): string[] => {
    return Object.keys(acRecord);
};
export const getEVEOAuthCharacter = (cid?: EVEId) => {
    if (cid) {
        return acRecord[cid];
    } else {
        const chars = Object.values(acRecord);
        return chars.length? chars[0]: void 0 as unknown as IEVEOAuthCharacter;
    }
};
const scopeCache: Record<string, string[]> = {};
const updateScopesCache = (characterId: EVEId) => {
    const auth = acRecord[characterId];
    if (auth) {
        const jwtp = oac.getJWTPayload(auth.accessToken);
        return scopeCache[characterId] = jwtp.scp;
    }
    throw new ReferenceError(`characterId: ${characterId} is not authorized`);
};
export const getGrantedScopesById = (cid: EVEId) => {
    if (acRecord[cid]) {
        let scopes = scopeCache[cid];
        if (scopes === void 0) {
            return updateScopesCache(cid);
        }
        return scopes;
    }
    throw new ReferenceError("characterId is invalid or authorized data not found, characterId: " + cid);
};
export const getScopeInfo = (characterId: EVEId): ScopeInfo[] => {
    const scopeInfo: ScopeInfo[] = [];
    const knownScopes = esis.ere.getKnownScopes(false);
    const scopes = getGrantedScopesById(characterId);
    for (const scope in knownScopes) {
        scopeInfo.push({
            name: scope,
            description: knownScopes[scope],
            isGranted: scopes.includes(scope)
        });
    }
    return scopeInfo;
};
const EXTRA_PROPs = ["lock", "called"];
const getAsPlain = ({
    excludeProps = EXTRA_PROPs,
    bannedCharacterId
}: { excludeProps?: string[]; bannedCharacterId?: EVEId; } = {}) => {
    const plainAuthCharsRecord = onil() as TEVEOAuthDataRecord;
    const cids = Object.keys(acRecord);
    for (let i = 0, cid: typeof cids[0]; cid = cids[i++];) {
        if (bannedCharacterId === cid) {
            continue;
        }
        const authChar = acRecord[cid];
        const plainData = onil() as TJSAtomicValueRecord;
        for (const prop of Object.keys(authChar)) {
            if (excludeProps && excludeProps.includes(prop)) {
                continue;
            }
            const value = authChar[prop as keyof IEVEOAuthCharacter];
            if (typeof value !== "function") {
                plainData[prop] = value;
            }
        }
        plainAuthCharsRecord[cid] = plainData;
    }
    return plainAuthCharsRecord;
};
const updateAuthDataTask = (reason: string) => {
    store.set(
        getAsPlain(), KN, e => {
        console.log("AuthData update: reason=%s, event:", reason, e);
    });
};
export const push = (oAuthResult: TEVEOAuthResult, reason: string = "third party push") => {
    const ac = "getAccessToken" in oAuthResult? oAuthResult as IEVEOAuthCharacter: new EVEOAuthCharacter(oAuthResult);
    if (acRecord !== undefined) {
        acRecord[ac.characterId] = ac;
        updateScopesCache(ac.characterId);
        updateAuthDataTask.reemitDefer(777, null, reason);
    }
};
export const suppressESIRequest = (characterId: EVEId, reason: TOAuthRequestErrorReason, temporary = false) => {
    esis.markFailed(characterId, reason, temporary);
};
export const checkTokenExpiresAll = async (callback?: (message: string) => void) => {
    const auths = Object.values(acRecord);
    const promises = new Array(auths.length) as Promise<boolean>[];
    for (let index = 0, auth: typeof auths[0]; index < auths.length;) {
        auth = auths[index];
        promises[index++] = auth.checkTokenExpire().then(success => {
            callback && (
                callback(`${oac.getJWTPayload(auth.accessToken).name}'s access token ${success? "updated": "is valid"}`)
            );
            return success;
        }).catch(reason => {
            console.warn("refresh_token failed?, reason:", reason);
            Promise.reject(reason);
            return false;
        });
    }
    return Promise.all(promises).then(
        result => result.reduce((acc, success) => +success + acc, 0)
    );
};
export const remove = async (bannedCharacterId: EVEId) => {
    if (acRecord !== void 0) {
        const auth = acRecord[bannedCharacterId];
        if (auth) {
            const plain = getAsPlain({ bannedCharacterId });
            const oauth = oac.createOAuthWrapper();
            const ret = await oauth.revoke(auth.refreshToken);
            store.set(plain, KN);
            delete acRecord[bannedCharacterId];
            console.log(
                "esiScheduler.unRegister: %s, revoke refresh token: %s", esis.unRegister(bannedCharacterId), ret
            );
            return true;
        }
    }
    return false;
};
export const init = async (force: boolean = false) => {
    return load(force).then(async () => {
        await import("./character").then(m => m.init(force));
    });
};
const load = async (force: boolean = false) => {
    const initRegistry = async () => {
        const json = await store.getAsync(KN, {});
        const oauthCharsRecord = (
            typeof json === "string" ? JSON.parse(json): json
        ) as TEVEOAuthDataRecord;
        const acrecord: Record<string, IEVEOAuthCharacter> = {};
        if (oauthCharsRecord !== undefined) {
            Object.keys(oauthCharsRecord).forEach((charId) => {
                const ac = new EVEOAuthCharacter(oauthCharsRecord[charId] as TEVEOAuthCharacterData);
                acrecord[ac.characterId] = ac;
            });
        }
        acRecord = acrecord;
    };
    if (store === void 0) {
        store = new Store({
            name: "app-config",
            onChangeDatabase: initRegistry
        });
    }
    if (force || acRecord === undefined) {
        await initRegistry();
    }
    withOAuthManager({ push, suppressESIRequest });
};