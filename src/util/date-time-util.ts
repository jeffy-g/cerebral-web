export const MS_ONE_DAY = 86_400_000;
    export const timeUntil = (futureDate: Date, current?: Date) => {
        current === void 0 && (current = new Date());
        return niceCountdown(futureDate.getTime() - current.getTime());
    };
    export const timeSince = (pastDate: Date) => {
        return niceCountdown(Date.now() - pastDate.getTime());
    };
    export const relative = (date: Date) => {
        if (date > new Date()) {
            return timeUntil(date);
        }
        return `${timeSince(date)} ago`;
    };
    export const skillLength = (startDate: string, endDate: string) => {
        let start = +new Date(startDate);
        const now = Date.now();
        if (start < now) {
            start = now;
        }
        const msDelta = Math.abs((+new Date(endDate)) - start);
        return niceCountdown(msDelta);
    };
    export const niceCountdown = (msecremain: number): string => {
        if (isNaN(msecremain)) return "N/A";
        let secs = msecremain / 1000;
        const d = (secs / 86400) | 0;
        secs -= d * 86400;
        const h = (secs / 3600) | 0;
        secs -= h * 3600;
        const m = (secs / 60) | 0;
        secs -= m * 60;
        const s = secs | 0;
        let tstr = "";
        d && (tstr = `${d}d `);
        h && (tstr += `${h}h `);
        m && (tstr += `${m}m `);
        s && (tstr += `${s}s `);
        if (!tstr) {
            return msecremain + "ms";
        }
        return tstr.trimRight();
    };