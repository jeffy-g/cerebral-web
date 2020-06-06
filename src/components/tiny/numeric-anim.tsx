import * as R from "react";
type FNAOption = {
    duration?: number;
    intlOption?: Intl.NumberFormatOptions;
    formater?: Intl.NumberFormat;
};
const fna = (
    element: HTMLElement,
    start: number, diff: number,
    options: FNAOption = {
        duration: 500,
        intlOption: { minimumFractionDigits: 0, maximumFractionDigits: 3 },
    }
) => {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) {
        console.warn("invalid element", element);
        return;
    }
    const TIMEOUT = 16;
    if (options.duration === void 0) {
        options.duration = 500;
    }
    let formater = options.formater;
    if (formater === void 0) {
        if (options.intlOption === void 0) {
            options.intlOption = { minimumFractionDigits: 0, maximumFractionDigits: 3 };
        }
        formater = new Intl.NumberFormat(void 0, options.intlOption);
    }
    const step = diff / Math.ceil(options.duration / TIMEOUT);
    const textNode = document.createTextNode("");
    let value = 0;
    let tid: number;
    const animate = () => {
        if (Math.abs(value) >= Math.abs(diff)) {
            window.clearInterval(tid);
            textNode.data = formater!.format(start + diff);
            return;
        }
        textNode.data = formater!.format(start + value);
        value += step;
    };
    element.textContent = "";
    element.appendChild(textNode);
    animate();
    tid = window.setInterval(animate, TIMEOUT);
};
export type NumericAnimationProps = PartialPick<FNAOption, "duration" | "intlOption"> & {
    start: number;
    className?: string;
};
export const NumericAnimation = (props: NumericAnimationProps) => {
    const {
        start,
        duration = 500,
        intlOption = { minimumFractionDigits: 0, maximumFractionDigits: 3 },
        className
    } = props;
    const startCache = R.useRef(0);
    const nodeRef = R.useRef<HTMLElement | null>(null);
    R.useEffect(
        () => {
            const span = nodeRef.current;
            if (startCache.current !== start && span) {
                fna(
                    span,
                    startCache.current,
                    start - startCache.current,
                    { duration, formater: new Intl.NumberFormat(void 0, intlOption) }
                );
                startCache.current = start;
            }
        },
    );
    return <span ref={e => nodeRef.current = e} className={className}>{startCache.current.toLocaleString(void 0, intlOption)}</span>;
};