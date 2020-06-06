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
import * as W from "@eve/oauth/";
export * from "@eve/oauth/oauth-util";
export * from "@eve/oauth/";
let credentials: W.TEVEAppCredentials;
export type TOAuthCallback = (data: W.TEVEOAuthResult) => void;
export type TOAuthConfigFragment = {
    appCredentials?: W.TEVEAppCredentials;
};
export const setConfiguration = (config: TOAuthConfigFragment) => {
    config.appCredentials && (credentials = config.appCredentials);
};
export const validateAppIdSecret = W.validate;
export const REDIRECT_URI_DEFAULT: string =
    (location.host.length > 0 && location.protocol.startsWith("http")) ?
        `${location.protocol}//${location.host}/callback/` : "http://localhost/callback/";
export const createOAuthWrapper = (): W.IEVEOAuth2 => {
    const {
        client_id, secret_key, redirect_uri
    } = credentials;
    const opt: W.TEVEAppCredentials = onil();
    opt.client_id = client_id;
    opt.secret_key = secret_key || "";
    if (
        typeof redirect_uri === "string" && redirect_uri.length &&
        redirect_uri !== REDIRECT_URI_DEFAULT
    ) {
        opt.redirect_uri = redirect_uri;
    } else {
        opt.redirect_uri = REDIRECT_URI_DEFAULT;
    }
    return new W.Wrapper(opt);
};