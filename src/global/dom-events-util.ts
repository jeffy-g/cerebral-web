/*!
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  <one line to give the program's name and a brief idea of what it does.>
  Copyright (C) 2017 jeffy-g hirotom1107@gmail.com

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
declare global {
    type KeyboardEventHander = (event: KeyboardEvent) => boolean;
    interface Window {
        DomEventsUtil: typeof _DomEventsUtil;
    }
    const DomEventsUtil: typeof _DomEventsUtil;
}
namespace _DomEventsUtil {
    export interface IListenerListRegistry<T extends unknown> {
        add(event: string, listener: T): TBD<T>;
        remove(event: string, listener: T): void;
        getListeners<K extends string>(event: K): T[];
    }
    class ListenerListRegistry<T> implements IListenerListRegistry<T> {
        private listenerRegistry: Record<string, T[]> = onil();
        add(event: string, listener: T): TBD<T> {
            let listeners = this.getListeners(event);
            if (typeof listener === "function" && !listeners.includes(listener)) {
                listeners.push(listener);
                return listener;
            }
            return void 0;
        }
        remove(event: string, listener: T): void {
            if (typeof listener === "function") {
                let listeners = this.getListeners(event);
                const index = listeners.indexOf(listener);
                index !== -1 && listeners.splice(index, 1);
            }
        }
        getListeners<K extends string>(event: K): T[] {
            let listeners = this.listenerRegistry[event];
            if (listeners === void 0) {
                this.listenerRegistry[event] = listeners = [] as T[];
            }
            return listeners;
        }
    }
    export const createListenerRegistry = <T>(): IListenerListRegistry<T> => {
        return new ListenerListRegistry<T>();
    };
    export interface ITransitionEventMarshaller {
        callbacks: {
            beforeTrigger: (dom: HTMLElement, onklazz: boolean) => void;
            transitionEnd: (e: TransitionEvent, onklazz: boolean) => void;
        };
        fireTransition(): void;
    }
    class TransitionEventMarshaller implements ITransitionEventMarshaller {
        private _onKlazz: boolean = false;
        public callbacks!: ITransitionEventMarshaller["callbacks"];
        constructor(
            private  _dom: HTMLElement,
            private _transitionTriggerClass: string,
            callbacks?: ITransitionEventMarshaller["callbacks"]
        ) {
            if (typeof callbacks === "object") {
                this.callbacks = callbacks;
            }
        }
        private transitionEndHandler = (e: TransitionEvent) => {
            this._dom.removeEventListener("transitionend", this.transitionEndHandler);
            this.callbacks.transitionEnd(e, this._onKlazz);
        }
        private updateTriggerState() {
            this._onKlazz = this._dom.classList.toggle(this._transitionTriggerClass);
        }
        public fireTransition(): void {
            const d = this._dom;
            this.callbacks.beforeTrigger(
                d,
                this._onKlazz = d.classList.contains(this._transitionTriggerClass)
            );
            d.addEventListener("transitionend", this.transitionEndHandler);
            this.updateTriggerState.reemitDefer(33, this);
        }
    }
    export function createTransitionEventMarshaller(
        dom: HTMLElement,
        transitionTriggerKlazz: string,
        callbacks?: ITransitionEventMarshaller["callbacks"]
    ): ITransitionEventMarshaller {
        return new TransitionEventMarshaller(dom, transitionTriggerKlazz, callbacks);
    }
    const _parsekeyStroke = (keyStroke: string) => {
        let ckeys_match = CKEYS_RE.exec(keyStroke);
        if (!ckeys_match) {
            return null;
        }
        type StrokeInfo = {
            alt: boolean;
            ctrl: boolean;
            shift: boolean;
            key: string;
        };
        const kmap: StrokeInfo = {
            alt: false,
            ctrl: false,
            shift: false,
            key: ""
        };
        ckeys_match.shift();
        if (!/(alt|ctrl|shift)/.test(ckeys_match[ckeys_match.length - 1])) {
            kmap.key = ckeys_match.pop()!;
        }
        (ckeys_match as ("alt"|"ctrl"|"shift")[]).forEach(e => {
            e && (kmap[e] = !0);
        });
        return kmap;
    };
    export const dispatchKeyEvent = (type: GrobalEventNames, keyStroke: string, context: EventTarget = document) => {
        const info = _parsekeyStroke(keyStroke);
        if (info) {
            const e = new KeyboardEvent(type, {
                bubbles : true,
                cancelable : true,
                key : info.key,
                ctrlKey : info.ctrl,
                shiftKey : info.shift,
                altKey : info.alt
            });
            context.dispatchEvent(e);
        }
    };
    type GrobalEventNames = "keyup" | "keydown" | "keypress";
    export const GLOBAL = "0-0-0@";
    const EVENT_DISPATCHER_REGISTORY: Record<string, Function> = {
        keyup: (e: KeyboardEvent): any => {
            const regist_key: string = _gen_token_from_keyevent(e);
            let handlers: KeyboardEventHander[] = keyup_handlers[regist_key];
            if (handlers) {
                for (let handler of handlers) {
                    if (!handler(e)) {
                        return false;
                    }
                }
            }
            handlers = keyup_handlers[regist_key.substring(0, 6)];
            if (handlers) {
                for (let handler of handlers) {
                    if (!handler(e)) {
                        return false;
                    }
                }
            }
            return true;
        }
    };
    const keyup_handlers: Record<string, KeyboardEventHander[]> = onil();
    const CKEYS_RE = /(alt|ctrl|shift)?\x20?(alt|ctrl|shift)?\x20?(alt|ctrl|shift)?\x20?(\w+)/;
    const _gen_token_from_keyStroke = (keyStroke: string): string|null => {
        if (keyStroke === GLOBAL) {
            return GLOBAL;
        }
        let ckeys_match = CKEYS_RE.exec(keyStroke);
        if (!ckeys_match) {
            return null;
        }
        const kmap: Record<string, number> = {
            alt: 0,
            ctrl: 0,
            shift: 0
        };
        ckeys_match.shift();
        let key: string;
        if (!/(alt|ctrl|shift)/.test(ckeys_match[ckeys_match.length - 1])) {
            key = ckeys_match.pop()!;
        } else {
            key = "";
        }
        ckeys_match.forEach(e => {
            e && (kmap[e] = 1);
        });
        return `${kmap.alt}-${kmap.ctrl}-${kmap.shift}@${key}`;
    };
    const _gen_token_from_keyevent = (kevent: KeyboardEvent): string => {
        let key = kevent.key;
        if (!kevent.altKey && !kevent.shiftKey && !kevent.ctrlKey) {
            return GLOBAL + key;
        }
        if (/Alt|Control|Shift/.test(key)) {
            key = "";
        }
        return `${+!!kevent.altKey}-${+!!kevent.ctrlKey}-${+!!kevent.shiftKey}@${key}`;
    };
    export type ShortcutKeyListenerId = (e: KeyboardEvent) => any;
    export function registerShortcutKey(
        stroke: string,
        listener: ShortcutKeyListenerId,
        description?: string
    ): ShortcutKeyListenerId | undefined {
        let regist_key: TBC<string> = _gen_token_from_keyStroke(stroke);
        if (regist_key) {
            let handlers: KeyboardEventHander[] = keyup_handlers[regist_key];
            if (!handlers) {
                keyup_handlers[regist_key] = handlers = [];
            }
            if (!handlers.includes(listener)) {
                    handlers.push(listener);
                if (description) {
                    registeredContexts.push(
                        Object.freeze({
                            stroke, listener, description,
                        })
                    );
                }
                return listener;
            }
        }
        return void 0;
    }
    export type KeyEventListenerContext = {
        stroke: string;
        description: string;
        listener: ShortcutKeyListenerId;
        id?: number;
    };
    let registeredContexts: KeyEventListenerContext[] = [];
    export function registerShortcutKeys<
        B extends boolean,
        R extends B extends false? void: ShortcutKeyListenerId[]
    >(contexts: KeyEventListenerContext[], useIds?: B): R {
        let ids: ShortcutKeyListenerId[] | undefined;
        if (useIds) {
            ids = [];
        }
        for (const context of contexts) {
            const id = registerShortcutKey(context.stroke, context.listener);
            useIds && id && ids!.push(id);
            registeredContexts.push(
                Object.freeze(context)
            );
        }
        return ids as R;
    }
    export function getRegisteredShortcutContexts() {
        return registeredContexts.slice().sort(
            (a, b) => a.stroke < b.stroke? -1: +(a.stroke > b.stroke)
        );
    }
    export function unRegisterShortcutKey(keys: string, listenerId: ShortcutKeyListenerId): void {
        let regist_key: TBC<string> = _gen_token_from_keyStroke(keys);
        if (!regist_key) return;
        let handlers: KeyboardEventHander[] = keyup_handlers[regist_key];
        if (handlers) {
            const index = handlers.indexOf(listenerId);
            index !== -1 && handlers.splice(index, 1);
        }
    }
    export function initGlobalEvent(type: GrobalEventNames): void {
        HANDLE_SHORTCUT_KEYs: {
            const eh = EVENT_DISPATCHER_REGISTORY[type];
            eh && window.addEventListener(type, eh as KeyboardEventHander);
        }
    }
    export function removeGlobalEvent(type: GrobalEventNames): void {
        HANDLE_SHORTCUT_KEYs: {
            const eh = EVENT_DISPATCHER_REGISTORY[type];
            eh && window.removeEventListener(type, eh as KeyboardEventHander);
        }
    }
    export function getPrimaryKeyInfo(ke: KeyboardEvent, add_ctrlkeys: boolean = true): Record<string, any> {
        let info: Record<string, any> = {
            key: ke.key, code: ke.code, keyCode: ke.keyCode
        };
        if (add_ctrlkeys) {
            info = {
                altKey: ke.altKey, shiftKey: ke.shiftKey, ctrlKey: ke.ctrlKey,
                metaKey: ke.metaKey,
                ...info
            };
        }
        return info;
    }
    export function is(event: KeyboardEvent | MouseEvent, ctrlKeys?: string): boolean {
        let token: string;
        if (ctrlKeys === void 0 || ctrlKeys === null || ctrlKeys.length === 0) {
            token = "0-0-0";
        } else {
            const kmap: Record<string, number> = {
                alt: 0, ctrl: 0, shift: 0
            };
            ctrlKeys.split(/ |\+/g).forEach(e => {
                kmap[e] = 1;
            });
            token = `${kmap.alt}-${kmap.ctrl}-${kmap.shift}`;
        }
        return (
            token === `${+!!event.altKey}-${+!!event.ctrlKey}-${+!!event.shiftKey}`
        );
    }
}
window["DomEventsUtil"] = _DomEventsUtil;
export default void 0;