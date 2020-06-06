import { IESIClient } from "./api/esi-client";
const EVE_MARKETER_URL = "https://evemarketer.com";
const DOTLAN_URL       = "http://evemaps.dotlan.net";
const ZKILLBOARD_URL   = "https://zkillboard.com";
const TTL = 600 * 1000;
const MI = 300 * 1000;
const DEBUG = {
    dumpLinks: 1,
    noCache: 0
};
let mailRegistry: UndefableStringMap<EVEMailBodyEx>;
let lastAccess = 0;
const use = () => {
    lastAccess = Date.now();
    if (mailRegistry === void 0) {
        mailRegistry = onil() as Record<string, EVEMailBodyEx>;
    }
};
function resolveShowInfoScheme(typeId: string | number, extraId: string): string {
    typeId = +typeId;
    if (typeId >= 1373 && typeId <= 1386) {
        return `${ZKILLBOARD_URL}/character/${extraId}/`;
    }
    if (
        typeId >= 54 && typeId <= 57 ||
        typeId >= 1529 && typeId <= 1531 ||
        typeId >= 1926 && typeId <= 1932 ||
        typeId >= 2496 && typeId <= 2502 ||
        typeId >= 3865 && typeId <= 3872 ||
        typeId === 34325 || typeId === 34326
    ) {
        return `${DOTLAN_URL}/station/${extraId}`;
    }
    switch (typeId) {
        case 0: return "#";
        case 2: return `${DOTLAN_URL}/corp/${extraId}`;
        case 3: return `${DOTLAN_URL}/map/${extraId}`;
        case 5: return `${DOTLAN_URL}/system/${extraId}`;
        default:
            break;
    }
    return `${EVE_MARKETER_URL}/types/${typeId}`;
}
function completeStyledText(htmlBody: string): string {
    if (!/^\s*$/.test(htmlBody)) {
        let m: TBC<RegExpExecArray>, offset: number = 0;
        const re = /<showinfo:(\d+)(?:\/\/)?(\d+)?>([^<]+)<\/showinfo>/g;
        let contents: string = "";
        while (
            m = re.exec(htmlBody)
        ) {
            const prev = htmlBody.substring(offset, m.index);
            prev && (contents += prev);
            contents += `<a href="${resolveShowInfoScheme(m[1], m[2])}" target="_blank">${m[3]}</a>`;
            offset = m.index + m[0].length;
        }
        return contents.length ? contents + htmlBody.substring(offset): htmlBody;
    }
    return htmlBody;
}
const brAndFontTagReplacer = () => {
    const re_font = /size="(\d+)"\s+color="#\w{2,}(\w{6})"|color="#\w{2,}(\w{6})"\s+size="(\d+)"/;
    let enterFont = false;
    return ($0: string, tag: string): string => {
        switch (tag) {
            default: {
                return $0;
            }
            case "br": {
                return "\n";
            }
            case "font": {
                if (enterFont = !enterFont) {
                    const m = re_font.exec($0)!;
                    const fs = m[1] || m[4];
                    const color = m[2] || m[3];
                    return `<span style="font-size: ${fs}px; color: #${color}">`;
                }
                return "</span>";
            }
        }
    };
};
const eveLinksAnalyzeReplacer = () => {
    let enter = false;
    let isinfo: boolean;
    const re_evelinks = /(showinfo:\d+)(?:\/\/\d+)?|(?:fitting|killReport):(\d+):[^"]+/;
    const re_protocols = /(showinfo|killReport|fitting)(?=:)/;
    return ($0: string, tag: string) => {
        if (tag === "a") {
            if (enter = !enter) {
                if (DEBUG && DEBUG.dumpLinks) console.log($0);
                const m = re_evelinks.exec($0);
                let tagWithAttrs: string;
                if (!m) {
                    const attributes = /[^<>]+/.exec($0)![0];
                    tagWithAttrs = !/https?:\/\//.test(attributes) ?
                        `<${attributes} onclick="return false">` :
                        `<${attributes} target="_blank">`;
                } else {
                    switch (re_protocols.exec(m[0])![0]) {
                        case "killReport":
                            tagWithAttrs = `<a href="${ZKILLBOARD_URL}/kill/${m[2]}/" target="_blank">`;
                            break;
                        case "fitting":
                            tagWithAttrs = `<showinfo:${m[2]}>`;
                            break;
                        default:
                            tagWithAttrs = `<${m[0]}>`;
                            break;
                    }
                }
                isinfo = !tagWithAttrs.startsWith("<a");
                return tagWithAttrs;
            } else {
                return isinfo ? "</showinfo>": "</a>";
            }
        }
        return $0;
    };
};
const nest = (styledContents: string) => {
    const re_tag = /<\/?([\w-!]+)[^>]*\/?>/gm;
    return completeStyledText(
        styledContents.replace(
            re_tag, brAndFontTagReplacer()
        ).replace(
            re_tag, eveLinksAnalyzeReplacer()
        )
    );
};
export const normalizeEVEStyledText = nest;
export const retrieveMailBody = async (mailId: number, charId: EVEId, esi: IESIClient) => {
    use();
    let emb = mailRegistry![mailId];
    if (!emb) {
        try {
            console.time("retrieveMailBody");
            emb = await esi.get(`characters/${charId}/mail/${mailId}`, "v1", { auth: true });
            console.timeEnd("retrieveMailBody");
            emb.htmlBody = nest(emb.body);
            if (!DEBUG.noCache) mailRegistry![mailId] = emb;
        } catch (e) {
            throw e;
        }
    }
    emb && (emb.last_accessed = new Date());
    return emb;
};
export function doMaintenance() {
    if ((mailRegistry !== void 0) && (lastAccess + TTL < Date.now())) {
        mailRegistry = void 0;
    }
}
if (!DEBUG) setInterval(doMaintenance, MI);