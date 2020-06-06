import * as mf from "@util/misc-functions";
interface WinstonLogger {
    log(level: string, message: string): void;
}
let createLogger = async () => {
    return mf.isElectron() ? (async () => {
        return import("winston").then(winston => {
            const format = winston.format;
            return winston.createLogger({
                level: "verbose",
                format: format.combine(
                    format.timestamp({
                        format: "ZZ YYMMDD hh:mm:ss.SSS"
                    }),
                    format.printf(info => `[${info.timestamp}] (${info.level}): ${info.message}${info.splat !== undefined ? ` ${info.splat}`:""}`)
                ),
                transports: [
                    new winston.transports.File({ filename: "winston.log" })
                ]
            });
        });
    })(): (async () => {
        return {
            // @ts-ignore unused parameters
            log: (level: string, message: string): void => {}
        };
    })();
};
namespace logger {
    let logger: WinstonLogger;
    createLogger().then(winstonLogger => logger = winstonLogger);
    export function log(level: string, message: string) {
        logger && logger.log(level, message);
    }
}
declare global {
    type CustomLogger = typeof logger;
}
export const createDebugLogger = (prompt: string, isDebug: boolean | number, promptColor?: string) => {
    if (isDebug) {
        let params: any[] = [prompt];
        if (promptColor !== void 0 && promptColor.length) {
            params[0] = "%c" + prompt;
            params.push(promptColor);
        }
        const logger = console.log.bind(console, ...params);
        return (...args: any[]) => {
            logger(...args);
        };
    } else {
        return () => {};
    }
};
export const NsLogger = logger;