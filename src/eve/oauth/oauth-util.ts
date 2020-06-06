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
export type TCodeVerifier = {
    safe_code_verifier: string;
};
export type TCodeChallenge = {
    safe_code_challenge: string;
};
export type TCodeChallengeContext = TCodeVerifier & TCodeChallenge;
export type TJWTPayload = {
    scp: string[];
    jti: string;
    kid: string;
    sub: string;
    azp: string;
    name: string;
    owner: string;
    exp: number;
    iss: string;
};
const rndByte32 = () => {
    const numbers: number[] = new Array(32);
    let count = 32;
    do {
        numbers[--count] = ~~(Math.random() * 255);
    } while (count);
    return numbers;
};
const wsbfu = (u8a: number[] | Uint8Array) => {
    // @ts-ignore
    return btoa(String.fromCharCode.apply(null, u8a))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
};
const s2b = (s: string): Uint8Array => {
    const ar = s.split("");
    let sz = ar.length;
    const b = new Array(sz) as number[];
    for (; sz--;) {
        b[sz] = ar[sz].charCodeAt(0);
    }
    return Uint8Array.from(b);
};
export async function gcc() {
    const result = Object.create(null) as TCodeChallengeContext;
    const safeVerifier = wsbfu(rndByte32());
    const code_challenge = await crypto.subtle.digest(
        "sha-256", s2b(safeVerifier)
    ).then(buffer => new Uint8Array(buffer));
    result.safe_code_verifier = safeVerifier;
    result.safe_code_challenge = wsbfu(code_challenge);
    return result;
}
export const validate = (clientId: string, secretKey?: string) => {
    let valid = +/^[a-z0-9]{32}$/.test(clientId);
    if (secretKey) {
        valid &= +/^[a-zA-Z0-9]{40}$/.test(secretKey);
    }
    return !!valid;
};
export const getJWTPayload = (accessToken: string) => {
    const json = atob(accessToken.split(".")[1]);
    return JSON.parse(json) as TJWTPayload;
};