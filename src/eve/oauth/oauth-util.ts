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