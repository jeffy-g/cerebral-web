declare interface IUnzip {
    new(data: Uint8Array): this;
    getFilenames(): string[];
    decompress(entry: string): Uint8Array;
    getCommentAsString(): string;
    getFileHeader(index: number): {
        getCommentAsString(): string;
    };
}
declare namespace Zlib {
    const Unzip: IUnzip;
}
interface Window {
    Zlib: typeof Zlib;
}