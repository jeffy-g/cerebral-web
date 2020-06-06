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
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (this: string, ss: string, position?: number) {
        position = position || 0;
        return this.substring(position, position + ss.length) === ss;
    };
}
if (!String.prototype.includes) {
    String.prototype.includes = function (search: string, start?: number) {
        if (typeof start !== "number") {
            start = 0;
        }
        if (start + search.length > this.length) {
            return false;
        } else {
            return this.indexOf(search, start) !== -1;
        }
    };
}
if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, "includes", {
        value: function <T>(searchElement: T, fromIndex?: number) {
            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }
            let o = Object(this);
            let len = o.length >>> 0;
            if (len === 0) {
                return false;
            }
            let n = fromIndex! | 0;
            let k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
            function sameValueZero(x: any, y: any) {
                return x === y || (typeof x === "number" && typeof y === "number" && isNaN(x) && isNaN(y));
            }
            while (k < len) {
                if (sameValueZero(o[k], searchElement)) {
                    return true;
                }
                k++;
            }
            return false;
        }
    });
}
if (!Array.prototype.randomSort) {
    Object.defineProperty(Array.prototype, "randomSort", {
        value: function <T>(this: Array<T>, copy = true) {
            let pointer = this.length;
            const cpy = copy? this.slice(): this;
            while (pointer) {
                const i = (Math.random() * pointer--) | 0;
                const temp = cpy[pointer];
                cpy[pointer] = cpy[i];
                cpy[i] = temp;
            }
            return cpy;
        }
    });
}
Array.prototype.bnSearch = function bnSearch<T>(this: T[], v: T) {
    let low = 0;
    let hi = this.length - 1;
    while (low <= hi) {
        let m = low + ((hi - low) >>> 1);
        let r = (+this[m] - +v);
        if (r > 0) {
            hi = m - 1;
        } else if (r < 0) {
            low = m + 1;
        } else {
            return m;
        }
    }
    return -1;
};
Array.prototype.bnIncludes = function bnIncludes<T>(this: T[], value: T) {
    return this.bnSearch(value) !== -1;
};
(function(g: Window) {
    if (!g.requestIdleCallback) {
        g.requestIdleCallback = function (callback: (deadline: IdleDeadline) => void, options: IdleRequestOptions = { timeout: 64 }) {
            const start = Date.now();
            return g.setTimeout(() => {
                callback({
                    didTimeout: false,
                    timeRemaining() {
                        return Math.max(0, options.timeout - (Date.now() - start));
                    }
                });
            }, 7);
        };
    }
    if (!g.cancelIdleCallback) {
        g.cancelIdleCallback = (id: number) => {
            g.clearTimeout(id);
        };
    }
    const obc = Object.create;
    let cc = 0;
    Object.defineProperty(g, "onil", {
        value: <T>() => {
            cc++;
            return obc(null) as T;
        },
    });
    Object.defineProperty(g, "onilCount", {
        get: () => cc,
        set: (v: string | number) => cc = +v
    });
    g["$dom"] = function <E extends HTMLElement>(id: string): E {
        return <E>document.getElementById(id);
    };
    g["$queryAll"] = function $queryAll<T extends Element>(selector: string, context?: ParentNode): NodeListOf<T> {
        return _qbase<NodeListOf<T>>(selector, context!, "querySelectorAll");
    };
    g["$query"] = function $query<T extends HTMLElement>(selector: string, context?: ParentNode): T {
        return _qbase<T>(selector, context!, "querySelector");
    };
    function _qbase<TReturn>(selector: string, context: ParentNode, method: "querySelector" | "querySelectorAll"): TReturn {
        if (!context) {
            context = document;
        }
        // @ts-ignore typescript cannot detect function signature.
        return <TReturn>context[method](selector);
    }
    g["$consumeEvent"] = function consumeEvent<E extends Event>(e: E, immediate: boolean = true): void {
        const method = immediate ? "stopImmediatePropagation" : "stopPropagation";
        e[method]();
        e.preventDefault();
    };
    Function.prototype.__timeoutId__ = void 0;
    Function.prototype.emitDefer = function emitDefer(
        this: Function,
        time: number = 33,
        this_p: any = null,
        ...args: any[]
    ): void {
        this.__timeoutId__ = window.setTimeout(() => {
            this.__timeoutId__ = void 0;
            this.apply(this_p, args);
        }, time);
    };
    Function.prototype.cancelPreviously = function cancelPreviously(this: Function): void {
        const tid = this.__timeoutId__;
        tid && (
            window.clearTimeout(tid),
            this.__timeoutId__ = void 0
        );
    };
    Function.prototype.reemitDefer = function reemitDefer(
        this: Function,
        time: number = 33,
        this_p: any = null,
        ...args: any[]
    ): void {
        this.cancelPreviously();
        this.emitDefer(time, this_p, ...args);
    };
})(window);
export default void 0;