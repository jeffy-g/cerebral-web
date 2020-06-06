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
type ReactInstanceType<T extends React.ElementType<any>, P = React.ComponentPropsWithRef<T>> = React.ComponentElement<P, React.Component<P>>;
type TransitionEventTriggers = {
    onExited?: () => void;
};
type ReactTableRowData<T> = {
    [property: string]: any;
    original: {
        [property: string]: any;
    }
    value: T;
};
type EVEComponentPropsBase = {
    characterId: EVEId;
};
type EVEComponentStateBase<T = IEVECharacter[]> = {
    characters: T;
    ticking?: boolean;
    newcomer?: boolean;
};
interface IReactDecorator {
}
interface IBufferableProgress extends IReactDecorator {
    progress(increment: number): void;
    progressBuffer(increment: number): void;
    showText(text: string): void;
    prepare(): void;
    done(): void;
    reset(text?: string): void;
}
declare type ProgressState = {
    completed: number;
    buffer: number;
    opacity?: number;
    text?: string;
};
interface IStatePurgeable<T = never> {
    purgeState(inheritState: T): void;
}