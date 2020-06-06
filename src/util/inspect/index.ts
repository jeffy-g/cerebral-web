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
let DEBUG = false;
export const debug = (on: boolean): void => {
    DEBUG = on;
};
const log = console.log.bind(console, "[inspector]");
const prospectMethods = <TFunction extends Function>(
    target: TFunction,
    decoratorBody: MethodDecoratorBody,
    nameList?: string[],
    isExcludes: boolean = false
): void => {
    let i = 1;
    do {
        const subject = i ? target: target.prototype;
        const descs = Object.getOwnPropertyDescriptors(subject);
        inner: for (const name in descs) {
            if (nameList && (isExcludes === nameList.includes(name))) {
                continue inner;
            }
            const desc = descs[name];
            if (desc.writable && typeof desc.value === "function") {
                const descriptor: PropertyDescriptor = <PropertyDescriptor>methodFixer(decoratorBody)<Function>(target, name, desc);
                Object.defineProperty(subject, name, descriptor);
            }
        }
    } while (i--);
};
const injectAspect = (
    decoratorBody: MethodDecoratorBody,
    nameList?: string[],
    isExcludes: boolean = false
): ClassDecorator => {
    return function <TFunction extends Function>(target: TFunction): TBD<TFunction> {
        DEBUG && prospectMethods(target, decoratorBody, nameList, isExcludes);
        return target;
    };
};
export const getCtorOrFunctionName = (_this: any): string => {
    let ctor = _this.constructor;
    let match = ctor.toString().match(/\s*(?:function|class)\s+([\w]+)/i);
    if (match && match[1]) {
        return match[1] === "Function" ? _this.name : match[1];
    }
    return "<anonymouse>";
};
export type MethodDecoratorBody = (thisp: any, args: IArguments, delegate: Function, name: string) => any;
const methodFixer = (decoratorBody: MethodDecoratorBody): MethodDecorator => {
    return function <T>(
        target: Object, name: string | symbol, descriptor: TypedPropertyDescriptor<T>
    ): TypedPropertyDescriptor<T> {
        if (DEBUG) {
            const className = getCtorOrFunctionName(target);
            const implement = descriptor.value as T;
            const fullName = `${className}::${name.toString()}`;
            descriptor.value = function (this: T) {
                return decoratorBody(this, arguments, <Function><unknown>implement, fullName);
            } as unknown as T;
        }
        return descriptor;
    };
};
export const enter: MethodDecoratorBody = (thisp: any, args: IArguments, implement: Function, name: string): any => {
    log(name);
    return implement.apply(thisp, args);
};
export const checkArgs: MethodDecoratorBody = (thisp: any, args: IArguments, implement: Function, name: string): any => {
    log(`${name} enter: `, args);
    let result = implement.apply(thisp, args);
    log(`${name} exit : `, result);
    return result;
};
export const time: MethodDecoratorBody = (thisp: any, args: IArguments, implement: Function, name: string): any => {
    console.time(name);
    let result = implement.apply(thisp, args);
    console.timeEnd(name);
    return result;
};
const inspect = (methodBody: MethodDecoratorBody): MethodDecorator => {
    return methodFixer(methodBody);
};
export default {
    injectAspect,
    inspect
};