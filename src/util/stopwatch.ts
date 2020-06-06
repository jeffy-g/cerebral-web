export class Stopwatch {
    constructor(public st: number = 0, public ed: number = 0) { }
    start(): void {
        this.st = performance.now();
    }
    stop(): void {
        this.ed = performance.now();
    }
    stopAndResult(): string {
        return (performance.now() - this.st).toFixed(8);
    }
    getResult(): string {
        return (this.ed - this.st).toFixed(6);
    }
    toString(): string {
        return "\u{23F1}(ms)=" + this.getResult();
    }
}