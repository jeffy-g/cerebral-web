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