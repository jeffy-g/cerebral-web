import * as NsOAuthClient from "./oauth/oauth-client";
import * as CharProvider from "./models/char-provider";
import * as AuthProvider from "./models/auth-provider";
import * as esiScheduler from "./api/esi-scheduler";
import * as mf from "@util/misc-functions";
import inspect, { enter } from "@util/inspect/";
const WIDTH = 512;
const HEIGHT = 700;
const DEBUG = {
    checkArgs: 0,
    timerDebug: 1
};
const log = console.log;
let authWindow: Window | undefined;
let guardCounter = 0;
const openWindow = (link: string, withOption = true): Window => {
    guardCounter = 0;
    let options: TBD<string>;
    if (withOption) {
        const p = mf.adjustCenterPosition(WIDTH, HEIGHT);
        options = `width=${WIDTH},height=${HEIGHT},top=${p.top},left=${p.left}`;
    }
    return <Window>window.open(link, "externalWnd", options);
};
const closeWindowIfAlive = (): void => {
    if (authWindow) {
        if ("window" in authWindow) {
            authWindow.close();
        }
        authWindow = void 0;
    }
};
const authrizeCallback: NsOAuthClient.TOAuthCallback = (oauthResult) => {
    AuthProvider.push(oauthResult);
    const charId = oauthResult.characterId;
    esiScheduler.register(charId);
    CharProvider.getCharacterClass().regularInquiries(true, charId).then((success) => {
        if (success) {
            const name = CharProvider.getCharacterName(charId);
            log(`Authorize process done, characterID: ${charId}, name: "${name}"`);
            esiScheduler.save();
        } else {
            EVEApp.marshalling({
                "notify.warn": `Unable to interrupt an ESI request task that is already running.
The acquisition of data will be done at the next query.`
            });
        }
    });
};
function acquireTheAccessToken(queryFragment: string, sso: NsOAuthClient.IEVEOAuth2): boolean {
    if (guardCounter > 0) {
        log("::handleCallbackResponse running!!", guardCounter);
        return false;
    }
    let m = /code=([^&]+)/.exec(queryFragment);
    const code = m?.[1];
    m = /\?error=(.+)$/.exec(queryFragment);
    const error = m?.[1];
    if (code || error) {
        closeWindowIfAlive();
    }
    if (code) {
        log(`::handleCallbackResponse, code: ${code}, guardCounter:`, guardCounter++);
        sso.authCodeExchange(code, authrizeCallback);
        return true;
    } else if (error) {
        alert(`Failed to authorize your character, error=${error}\nplease try again.`);
    }
    return false;
}
let checkTimerId: TBD<number>;
@inspect.injectAspect(enter)
class AuthenticationEventMarshaller {
    private oauth2?: NsOAuthClient.IEVEOAuth2;
    constructor(oauth2: NsOAuthClient.IEVEOAuth2) {
        this.oauth2 = oauth2;
    }
    private cleanup() {
        clearInterval(checkTimerId);
        checkTimerId = void 0;
        this.oauth2 = void 0;
        window.removeEventListener("message", this.handleOAuthRedirect, false);
    }
    private handleOAuthRedirect = (e: MessageEvent): any => {
        log(e);
        const queryFragment = e.data as string;
        if (typeof queryFragment === "string" && acquireTheAccessToken(queryFragment, this.oauth2!)) {
            log("authorize process running...");
            this.cleanup();
        }
    }
    private checkAuthWindow = (): void => {
        checkTimerId && clearInterval(checkTimerId);
        checkTimerId = window.setInterval(() => {
            const wnd = authWindow as Window;
            if (DEBUG.timerDebug) log("AuthenticationEventMarshaller::_checkAuthWindow");
            if (!wnd || wnd && wnd.closed) {
                authWindow = void 0;
                this.cleanup();
                if (DEBUG.timerDebug) log("AuthenticationEventMarshaller::_checkAuthWindow -> authWindow:", authWindow);
            }
        }, 777);
    }
    async process(withPopup = false) {
        const authUrl = await this.oauth2!.createAuthorizeUrl(
            esiScheduler.ere.getKnownScopes()
        );
        const w = openWindow(authUrl, withPopup);
        if (w) {
            authWindow = w;
            window.addEventListener("message", this.handleOAuthRedirect, false);
            this.checkAuthWindow();
        }
    }
}
window.addEventListener("beforeunload", e => {
    log(e);
    closeWindowIfAlive();
}, mf.LISTENER_OPTION_ONCE);
export function processEVESSO(withPopup?: boolean) {
    if (authWindow) {
        console.warn("Authorize window already exists.");
        return;
    }
    try {
        const sso = NsOAuthClient.createOAuthWrapper();
        new AuthenticationEventMarshaller(sso).process(!!withPopup);
    } catch (e) {
        if (e instanceof Error) {
            alert(e.message);
        }
        throw e;
    }
}