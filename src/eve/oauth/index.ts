import {
    gcc, validate, getJWTPayload,
    TCodeChallengeContext, TCodeVerifier
} from "./oauth-util";
import { create } from "mini-semaphore";
export * from "./oauth-util";
const EVE_OAUTH_HOST = "login.eveonline.com";
const EVE_OAUTH_BASE = `https://${EVE_OAUTH_HOST}/v2/oauth`;
type TGrantTypes = "refresh_token" | "authorization_code";
export type TEVEOAuthResult = {
    characterId: EVEId;
    accessToken: string;
    refreshToken: string;
    characterOwnerHash: string;
    accessTokenExpiry: Date;
};
type TOAuth2AccessTokenResponse = {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    token_type: string;
    error?: any;
};
export type TEVEOAuthRefreshResult = {
    accessToken: string,
    accessTokenExpiry: Date,
    accessTokenExpiryAsLong: number,
    refreshToken: string
};
export type TJWTVerifyResult = {
    characterId: number;
    name: string;
    scopes: string[];
    type: string;
    characterOwnerHash: string;
};
export type TEVEAppCredentials = {
    client_id: string;
    secret_key?: string;
    redirect_uri: string;
};
export type TOAuthRefreshErrorResponse = {
    error:
        | "invalid_request"
        | "invalid_client"
        | "invalid_grant"
        | "unauthorized_client"
        | "unsupported_grant_type"
        | "invalid_scope"
        | "invalid_token";
    error_description?: string;
    error_uri?: string;
};
export type TOAuthRequestErrorReason = "scope" | "token" | "client" | "error";
export interface IEVEOAuth2 {
    createAuthorizeUrl(scopes: string[], response_type?: "code" | "token", state?: string): Promise<string>;
    authCodeExchange(code: string, callback: (data: TEVEOAuthResult) => void): Promise<void>;
    refresh(refresh_token: string): Promise<TEVEOAuthRefreshResult>;
    revoke(refresh_token: string): Promise<boolean>;
}
const s = create(5);
export class Wrapper implements IEVEOAuth2 {
    private clientId: string;
    private redirectUri: string;
    private challenge?: TCodeChallengeContext;
    private appCredentials!: string;
    constructor(options: TEVEAppCredentials) {
        const {
            client_id, secret_key, redirect_uri
        } = options;
        if (!validate(client_id, secret_key)) {
            throw new Error("EVE client id/secret is invalid");
        }
        if (!redirect_uri) {
            throw new Error("`redirect_uri` is required");
        }
        this.clientId = client_id;
        this.redirectUri = redirect_uri;
        if (secret_key) {
            this.appCredentials = window.btoa(`${client_id}:${secret_key}`);
        } else {
        }
    }
    private createFetchOptions(code_or_refreshToken: string, grantType: TGrantTypes) {
        const options = {
            method: "POST",
            mode: "cors",
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                host: EVE_OAUTH_HOST
            },
        } as RequestInit;
        const encoded = encodeURIComponent(code_or_refreshToken);
        let usePkce: boolean | undefined, body: string;
        if (grantType === "authorization_code") {
            body = `grant_type=authorization_code&code=${encoded}`;
            const verifier = this.challenge as TCodeVerifier;
            if (usePkce = !!verifier) {
                body += `&client_id=${this.clientId}&code_verifier=${verifier.safe_code_verifier}`;
            } else if (!this.appCredentials) {
                throw new Error("createFetchOptions: unintended flow has been occurs");
            }
        } else  {
            body = `grant_type=refresh_token&refresh_token=${encoded}`;
            if (usePkce = !this.appCredentials) {
                body += `&client_id=${this.clientId}`;
            }
        }
        options.body = body;
        if (!usePkce) {
            // @ts-ignore
            options.headers!.authorization = `Basic ${this.appCredentials}`;
        }
        return options;
    }
    async createAuthorizeUrl(
        scopes: string[], response_type: "code" | "token" = "code",
        state: string = "login"
    ) {
        const queries: Record<string, string> = {
            response_type,
            redirect_uri: this.redirectUri,
            client_id: this.clientId,
            scope: scopes.join(" "),
            state
        };
        if (response_type === "code" && !this.appCredentials) {
            const c = await gcc();
            queries.code_challenge = c.safe_code_challenge;
            queries.code_challenge_method = "S256";
            this.challenge = c;
        }
        return `${EVE_OAUTH_BASE}/authorize/?${new URLSearchParams(queries) + ""}`;
    }
    async refresh(refresh_token: string): Promise<TEVEOAuthRefreshResult> {
        const opt = this.createFetchOptions(refresh_token, "refresh_token");
        let r: Response;
        await s.acquire();
        try {
            r = await fetch(`${EVE_OAUTH_BASE}/token/`, opt);
        } finally {
            s.release();
        }
        const data = await r.json() as TOAuth2AccessTokenResponse;
        let reason: unknown = null;
        switch (r.status) {
            case 200: {
                const dateAsNumber = Date.now() + (data.expires_in * 1000);
                return {
                    accessToken: data.access_token,
                    accessTokenExpiryAsLong: dateAsNumber,
                    accessTokenExpiry: new Date(dateAsNumber),
                    refreshToken: data.refresh_token
                } as TEVEOAuthRefreshResult;
            }
            case 400:
            case 401:
            case 403:
                if (data && data.error) {
                    reason = data as TOAuthRefreshErrorResponse;
                } else {
                    reason = `ERROR: code=${r.status}`;
                }
                break;
            default:
                reason = `unkown error, code=${r.status}`;
                break;
        }
        if (reason !== null) {
            if (typeof reason === "string") {
                throw new Error(reason);
            } else {
                throw reason;
            }
        }
        throw new Error("SSO refresh token failed...");
    }
    async revoke(refresh_token: string) {
        const opt = {
            method: "POST",
            mode: "cors",
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                host: EVE_OAUTH_HOST
            },
            body: `token_type_hint=refresh_token&token=${encodeURIComponent(refresh_token)}&client_id=${this.clientId}`
        } as RequestInit;
        let r: TBD<Response>;
        await s.acquire();
        try {
            r = await fetch(`${EVE_OAUTH_BASE}/revoke/`, opt);
        } catch (e) {
            throw e;
        } finally {
            s.release();
        }
        return r.status === 200;
    }
    async authCodeExchange(code: string, callback: (data: TEVEOAuthResult) => void) {
        const opt = this.createFetchOptions(code, "authorization_code");
        const ret = await fetch(`${EVE_OAUTH_BASE}/token/`, opt).then<TOAuth2AccessTokenResponse>(res => res.json());
        const v   = this.verify(ret.access_token);
        const p = {
            characterId: v.characterId,
            characterOwnerHash: v.characterOwnerHash,
            accessToken: ret.access_token,
            accessTokenExpiry: new Date(Date.now() + (ret.expires_in * 1000)),
            refreshToken: ret.refresh_token,
        } as TEVEOAuthResult;
        callback(p);
    }
    protected verify(accessToken: string): TJWTVerifyResult {
        const payload = getJWTPayload(accessToken);
        if (
            /(?:https:\/\/)?\b(?:sisilogin\.testeveonline|login\.eveonline)\.com/.test(payload.iss)
        ) {
            return {
                characterId: +payload.sub.split(":")[2],
                name: payload.name,
                scopes: payload.scp,
                type: payload.kid,
                characterOwnerHash: payload.owner
            } as TJWTVerifyResult;
        }
        throw new Error("The issuer claim was not from login.eveonline.com or sisilogin.testeveonline.com");
    }
}