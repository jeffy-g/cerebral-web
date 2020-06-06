export class LocalStorage<ValueType extends {}> {
    constructor(
        private key: string,
        private defaultValue: ValueType
    ) {}
    load(raw?: boolean): ValueType {
        try {
            const data = localStorage.getItem(this.key);
            if (data === null) {
                localStorage.setItem(this.key, raw ? this.defaultValue + "" : JSON.stringify(this.defaultValue));
                return this.defaultValue as ValueType;
            } else {
                return (
                    raw ? data : JSON.parse(data || "null")
                ) as unknown as ValueType;
            }
        } catch {
            return this.defaultValue as ValueType;
        }
    }
    save(value: ValueType, raw?: boolean) {
        try {
            const data = raw ? value + "" : JSON.stringify(value);
            localStorage.setItem(this.key, data);
        } catch (e) {
            console.error(e);
        }
    }
    merge(value: Partial<ValueType>) {
        const data = this.load();
        this.save({ ...data, ...value } as ValueType);
    }
}