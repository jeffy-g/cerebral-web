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
import * as R from "react";
import * as ReactDOM from "react-dom";
export namespace UniverseUnit {
    export const AU = 149_597_870_700;
    export const LY = 9_460_730_472_580_800;
    export function ly(n: number): number {
        return n * LY;
    }
    export function toLY(n: number): number {
        return n / LY;
    }
    export function au(n: number): number {
        return n * AU;
    }
    export function toAU(n: number): number {
        return n / AU;
    }
}
const ID_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";
export const PrimativeComparator = <T>(a: T, b: T) => {
    return a < b? -1: +(a > b);
};
export const shallowEquals = <T extends Record<string, any>>(a: T, b: T) => {
    const akeys = Object.keys(a), bkeys = Object.keys(b);
    if (akeys.length !== bkeys.length) {
        return false;
    }
    for (let i = akeys.length; i--;) {
        const propertyA = akeys[i], propertyB = bkeys[i];
        if (propertyA !== propertyB) {
            return false;
        }
        if (a[propertyA] !== b[propertyA]) {
            return false;
        }
    }
    return true;
};
export const arrayEquals = <T extends any[]>(a: T, b: T) => {
    if (a.length !== b.length) {
        return false;
    }
    for (let i = a.length; i--;) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
};
export const isElectron = () => {
    return navigator.userAgent.includes("Electron");
};
export const isLocalHost = () => {
    return location.hostname === "localhost";
};
export const isDevelopment = () => {
    return isLocalHost() || isElectron();
};
export const getElectronVersion = () => {
    // @ts-ignore unused matchs[0]
    const [_, major, minor, patch] = /Electron.(\d+).(\d+).(\d+)/.exec(navigator.appVersion);
    return { major, minor, patch };
};
export const isSmartPhone = () => {
    const ua = navigator.userAgent;
    return ua.includes("Mobile") && (ua.includes("Android") || ua.includes("iPhone"));
};
export const createInlineWorker = (
    workerCode: Function,
    messageHandler?: Worker["onmessage"],
    workerOptions?: WorkerOptions
) => {
    const m = /^(?:function)?\s*\w*\s*\([^)]*\)\s*(?:=>)?\s*{([\w\W]*?)}$/.exec(
        workerCode + ""
    );
    if (m) {
        const functionBody = m[1];
        const inlineWorker = new Worker(
            "data:application/javascript," + encodeURIComponent(functionBody),
            workerOptions
        );
        typeof messageHandler === "function" && (inlineWorker.onmessage = messageHandler);
        return inlineWorker;
    }
    throw new SyntaxError("worker code is invalid or other cause");
};
export type TLogLevelTypes = "lightwarn" | "warn" | "info";
export const log = (msg: string, level: TLogLevelTypes = "info") => {
    console.info(`%c${msg}`, getLogStyle(level));
};
export const getLogStyle = (level: TLogLevelTypes) => {
    const base = "padding: 0 8px; font-weight: bold;";
    let style: string;
    switch (level) {
        case "info":
            style = `${base} background: whitesmoke; color: #454545;`;
            break;
        case "warn":
            style = `${base} background: #222; color: rgba(255, 40, 22, 0.8);`;
            break;
        case "lightwarn":
            style = `${base} background: #222; color: rgba(255, 245, 22, 0.8);`;
            break;
        default:
            style = "";
            break;
    }
    return style;
};
export const sleep = (time: number) => {
    return new Promise<void>(resolve => {
        setTimeout(resolve, time);
    });
};
export const waitForObject = async <
    T extends Record<string, any>,
    K extends keyof T
>(subject: T, key: K, wait: number, truthy = true) => {
    if (truthy) {
        while (subject[key]) {
            await sleep(wait);
        }
    } else {
        while (!subject[key]) {
            await sleep(wait);
        }
    }
};
export function deepClone<T>(object: T): T {
    return JSON.parse(JSON.stringify(object)) as T;
}
export function capitalizeToken(token: string): string {
    const head = token[0].toUpperCase();
    return `${head}${token.substring(1)}`;
}
export function countChar(content: string, ch: string): number {
    let count = 0;
    if (typeof content === "string") {
        for (let index = 0; index < content.length;) {
            content[index++] === ch && count++;
        }
    }
    return count;
}
export function createKey(size = 5, prefix = "uid_") {
    let id = prefix;
    const len = ID_CHARS.length;
    while (size--) {
        id += ID_CHARS[(Math.random() * len) | 0];
    }
    return id;
}
export function createUUID() {
    return ((1e7 + "") + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (ch) => {
        const n = +ch;
        return (
            n ^ (
                (~~(Math.random() * 255)) & (15 >> (n / 4))
            )
        ).toString(16);
    });
}
export function normalizeEntity(str: NonNullable<string>) {
    return str ? str.replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&apos;/g, "'")
        .replace(/&quot;/g, '"') : "";
}
export async function asyncProcess<Prime, Byproduct>(
    arryData: Prime[],
    mapMarshaller: (e: Prime) => Promise<Byproduct>,
    doneProcessor: (values: Byproduct[]) => void
): Promise<void> {
    const promises = arryData.map(mapMarshaller);
    // @ts-ignore this error occurs ts v3.9.3 awaited type inference
    await Promise.all(promises).then(doneProcessor);
}
const formater = new Intl.NumberFormat(navigator.language);
const formaterRecord: Record<number, Intl.NumberFormat> = {};
export const toLocaleString = (value: number, unit?: string, options?: Intl.NumberFormatOptions | number) => {
    unit === void 0 && (unit = "", 1) || (unit = " " + unit);
    let fmt: Intl.NumberFormat | undefined;
    if (typeof options === "number") {
        fmt = formaterRecord[options];
        if (fmt === void 0) {
            formaterRecord[options] = fmt = new Intl.NumberFormat(navigator.language, { minimumFractionDigits: options, maximumFractionDigits: options });
        }
    } else if (options === void 0) {
        fmt = formater;
    }
    const formatedNumber = fmt? fmt.format(value): value.toLocaleString(navigator.language, options as Intl.NumberFormatOptions);
    return `${formatedNumber}${unit}`;
};
export function createLocalFile(
    data: BlobPart, fileName: string, contentType: string,
): void {
    const url = URL.createObjectURL(
        new Blob([data], { type: contentType })
    );
    const eid = `__save_settings_link${Date.now()}`;
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.id = eid;
    anchor.style.cssText = "position: absolute; top: -1000px; left: -1000px";
    anchor.download = fileName;
    anchor.addEventListener("click", function () {
        console.log("handle download file: ", this.download);
        setTimeout(() => this.remove(), 2000);
    }, false);
    document.body.appendChild(anchor);
    setTimeout(
        () => anchor.click(), 33
    );
}
export const LISTENER_OPTION_ONCE = { once: true };
export const isFireFox = navigator.userAgent.includes("FireFox");
export function adjustCenterPosition(width: number, height: number) {
    const left = window.outerWidth / 2 - width / 2;
    const top = window.outerHeight / 2 - height / 2;
    return { left, top };
}
export const decideRectPositionInWindow = (
    targetRect: DOMRect,
    sizeOptions: { width: number, height: number, vAdjust?: number, hAdjust?: number },
    enableScale: boolean = false
) => {
    sizeOptions = Object.assign({vAdjust: 0, hAdjust: 0 }, sizeOptions);
    const bottomSideHeight = window.innerHeight - targetRect.bottom;
    const arrangeTop = targetRect.top > bottomSideHeight;
    arrangeTop && (sizeOptions.vAdjust! *= -1);
    const rightSideWidth = window.innerWidth - targetRect.right + targetRect.width / 2;
    sizeOptions.hAdjust! += Math.max(sizeOptions.width - rightSideWidth, 0);
    const offset: {
        top: number, left: number,
        transform: string,
        transformOrigin: string
    } = {
        top: (
            arrangeTop? targetRect.top - sizeOptions.height: targetRect.bottom
        ) + window.scrollY + sizeOptions.vAdjust!,
        left: targetRect.left + targetRect.width / 2 - sizeOptions.hAdjust!,
        transform: "none",
        transformOrigin: "initial"
    };
    if (enableScale) {
        const h = arrangeTop? targetRect.top: bottomSideHeight;
        if (h < sizeOptions.height) {
            offset.transform = `scale(${h / sizeOptions.height})`;
            offset.transformOrigin = `left ${arrangeTop? "bottom": "top"} 0px`;
        }
    }
    return offset;
};
export const globalize = <P extends keyof typeof window, T extends (typeof window)[P]>(source: T, propName: P) => {
    window[propName] = Object.assign((window[propName] || {}) as T, source);
};
export function replaceContentAsDiv(parent: HTMLElement, texts: string|string[]) {
    while (parent.firstElementChild) {
        parent.firstElementChild.remove();
    }
    if (!Array.isArray(texts)) {
        texts = texts.split("\n");
    }
    const re = /<([\w-]+)[^>]*>[^<]*<\/\1>/;
    const fragment = document.createDocumentFragment();
    for (const text of texts) {
        const div = document.createElement("div");
        if (re.test(text)) {
            div.innerHTML = text;
        } else {
            div.textContent = text;
        }
        fragment.appendChild(div);
    }
    parent.appendChild(fragment);
}
export const animateOnce = (dom: HTMLElement, animateClass: string): void => {
    dom.addEventListener("animationend", () => dom.classList.remove(animateClass), LISTENER_OPTION_ONCE);
    dom.classList.add(animateClass);
};
export type TMoveEventListener = {
    touchmove: (e: TouchEvent) => any;
    mousemove: (e: MouseEvent) => any;
};
export const bindMouseOrTouchEvent = (mlHandlers: TMoveEventListener, b_remove: boolean = false): void => {
    let type: "touchmove" | "mousemove";
    if (isSmartPhone()) {
        type = "touchmove";
    } else {
        type = "mousemove";
    }
    // @ts-ignore typescript cannot detect function signature..
    window[listenerMethod(!b_remove)](type, mlHandlers[type], false);
};
export const listenerMethod = <B extends boolean, M extends B extends true? "addEventListener": "removeEventListener">(add: B): M => {
    return (add? "addEventListener": "removeEventListener") as M;
};
type XEventListener<K extends keyof HTMLElementEventMap> = EventListenerOrEventListenerObject | ((this: HTMLElement, ev: HTMLElementEventMap[K]) => any);
export const eventListener = <K extends keyof HTMLElementEventMap>(
    type: K,
    listener: XEventListener<K>,
    element?: HTMLElement | TQuerySelector,
    remove: any = 0
) => {
    const method = listenerMethod(!remove);
    if (element) {
        if (typeof element === "string") {
            element = $query(element);
        }
        // @ts-ignore cannot solve listener type
        element && element[method](type, listener, false);
    } else {
        // @ts-ignore cannot solve listener type
        window[method](type, listener, false);
    }
};
export const copyToClipboard = function (text: string, x?: number, y?: number): boolean {
    let id = "__dummy_for_copy__";
    let ta = $dom<HTMLTextAreaElement>(id);
    if (!ta) {
        ta = document.createElement("textarea");
        ta.id = id;
        ta.style.cssText = `position: absolute;
opacity: 0;
width: 1px;
height: 1px;
border: 0;
padding: 0;
left: -10px;
top: -10px`;
        ta.onfocus = e => {
            e.preventDefault();
        };
        ta.readOnly = true;
        document.body.appendChild(ta);
    }
    if (isFireFox) {
        ta.style.left = (x || -10) + "px";
        ta.style.top = (y || -10) + "px";
    }
    ta.value = text;
    ta.setSelectionRange(0, text.length);
    ta.focus();
    const sucess = document.execCommand("copy");
    ta.value = "";
    if (isFireFox) {
        y && setTimeout(() => {
            ta.style.left = "-10px";
            ta.style.top = "-10px";
        }, 500);
    }
    return sucess;
};
export function showOpenFileDialog(acceptTypes: string = ".*"): Promise<FileList> {
    return new Promise<FileList>((resolve) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = acceptTypes;
        input.style.cssText = "position: absolute; top: -100px; width: 1px; height: 1px";
        input.onchange = (e: Event) => {
            const ss = "color: gold; background-color: black";
            console.log("%cshowOpenFileDialog -> onchange", ss);
            let files = (<HTMLInputElement>e.target).files;
            if (files === null || files.length === 0) {
                console.log("showOpenFileDialog -> onchange -> async IIFE", ss);
                (async () => {
                    let guard = 0;
                    do {
                        await sleep(100);
                        files = (<HTMLInputElement>e.target).files;
                        if (files !== null && files.length) {
                            resolve(files);
                            input.remove();
                            break;
                        }
                        if (++guard === 10) {
                            console.warn("showOpenFileDialog::timeout");
                            break;
                        }
                    } while (1);
                })();
            } else {
                resolve(files);
                input.remove();
            }
        };
        document.body.appendChild(input);
        input.click();
    });
}
export function readTextFromFile(file: File) {
    return new Promise<string>(resolve => {
        const reader = new FileReader();
        reader.onload = event => resolve((event.target as FileReader).result as string);
        reader.readAsText(file);
    });
}
export const readLocalFile = async (): Promise<string> => {
    const files = await showOpenFileDialog();
    const content = await readTextFromFile(files[0]);
    return content;
};
export const toDateLocaleString = (date: string) => {
    const ndate = date === void 0 ? new Date(): new Date(date);
    return ndate.toLocaleString(navigator.language);
};
export const getEVETime = (second: boolean = true) => {
    return new Intl.DateTimeFormat(void 0, {
        year: "numeric",
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: second? "2-digit": void 0,
        timeZone: "UTC",
    }).format(new Date());
};
export function dateStringForFile(): string {
   return new Date().toLocaleString().replace(/(\/|:| )/g, (match, $1) => {
       switch ($1) {
           case "/": return "-";
           case ":": return "_";
           case " ": return "@";
       }
       return match;
   });
}
export const findDOMNode = <T extends HTMLElement>(component?: R.ReactInstance | null): T => {
    return ReactDOM.findDOMNode(component) as T;
};
export const mergeStateDirectly = <S extends Record<string, any>, T extends R.Component<any, Partial<S>>>(that: T, state: Partial<S>): void => {
    that.state = Object.assign(that.state || {}, state);
};