import * as R from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Tooltip from "@material-ui/core/Tooltip";
import { BorderedCardHeader, BinarySignal, BinarySignalIcon } from "@com/tiny/extras";
import * as ess from "@eve/api/esi-scheduler";
import * as Auth from "@eve/models/auth-provider";
import * as DateTimeUtil from "@util/date-time-util";
import inspect, { enter } from "@util/inspect/";
const HEALTH_EXPIRES = "esi-health-status-expires";
const TRI_STATE = "tri-state-circle";
function shiftClassName(this: HTMLElement, state: ESIHealthStatusTokens | "dead") {
    this.className = `${TRI_STATE} ${state}`;
}
type SimplifiedESIRequestEntry = ReturnType<typeof ess.ere.lookUpRequestByOperationId>;
const lookupHealthStatus = (
    healths: ESIHealthStatus[],
    re: SimplifiedESIRequestEntry,
    opid: string
) => {
    const endpoint = re.context.endpoint;
    const method = opid.substring(0, opid.indexOf("_"));
    for (let index = 0, end = healths.length; index < end;) {
        const health = healths[index++];
        if (health.route === endpoint && health.method === method) {
            return health;
        }
    }
    return void 0;
};
const bindESIHealthStatus = async () => {
    const stop = () => {
        throw "api.tsx: ESI Health Status preview were stopped.";
    };
    const raf = requestAnimationFrame;
    const esiHealths = await EVEStatus.ESIHealth.getStatus();
    const dom = $query(`span.${HEALTH_EXPIRES}`);
    if (dom === null) {
        stop();
    }
    raf(() => {
        dom.textContent = `${EVEStatus.ESIHealth.getCurrentESIHealthExpires("toLocaleTimeString")} (local time)`;
    });
    const opidNodes = $queryAll<HTMLTableCellElement>("td[data-opid]");
    if (opidNodes === null) {
        stop();
    }
    const lubopid = ess.ere.lookUpRequestByOperationId;
    for (const opnode of opidNodes) {
        if (!opnode.parentElement) {
            stop();
        }
        const opid = opnode.dataset.opid!;
        const re = lubopid(opid, false);
        if (re) {
            const healthState = lookupHealthStatus(
                esiHealths, re, opid
            );
            const triState = $query(`span.${TRI_STATE}`, opnode);
            raf(shiftClassName.bind(triState, healthState?.status || "dead"));
        }
    }
};
const ScopeElement = R.memo(
    ({ scope }: { scope: ScopeInfo }) => {
        return <Tooltip key={scope.name} title={scope.description}
            classes={{ tooltip: "scope-token-tooltip" }}
            placement="top"
            style={{ maxWidth: "none" }}
            disableFocusListener
        >
            <div className="scope-token">
                <BinarySignalIcon
                    safe={scope.isGranted} icons={["check", "clear"]}
                />{` ${scope.name}`}
            </div>
        </Tooltip>;
    },
    (pp, np) => pp.scope.name === np.scope.name && pp.scope.isGranted === np.scope.isGranted
);
const AuthorizedScopeInfos = R.memo(
    ({ characterId }: { characterId: EVEId }) => {
        const infos = Auth.getScopeInfo(characterId);
        const elements: React.ReactElement[] = [];
        for (const scope of infos) {
            elements.push(
                <ScopeElement key={scope.name} scope={scope}/>
            );
        }
        return <>{elements}</>;
    },
    (pp, np) => pp.characterId === np.characterId
);
let updateTid: number;
@inspect.injectAspect(enter)
export class Api extends R.Component<EVEComponentPropsBase> {
    constructor(props: EVEComponentPropsBase) {
        super(props);
    }
    shouldComponentUpdate(np: EVEComponentPropsBase) {
        return this.props.characterId !== np.characterId;
    }
    componentDidMount() {
        this.componentDidUpdate();
        updateTid = window.setInterval(() => {
            this.forceUpdate();
        }, 4e3);
    }
    componentDidUpdate() {
        try {
            bindESIHealthStatus();
        } catch (msg) {
            console.warn(msg);
        }
    }
    componentWillUnmount() {
        window.clearInterval(updateTid);
    }
    render() {
        const { characterId } = this.props;
        const auth = Auth.getEVEOAuthCharacter(characterId);
        const authStatus = !!auth.lastRefresh.success || auth.lastRefresh.shouldRetry !== false;
        const cardStyle = { paddingTop: 0 };
        return <div className="flex-ct">
            <div className="flex-item-card"
                // @ts-ignore R.CSSProperties cannot allow double dash var property.
                style={{ "--flex-grow": 0.4 }}
            >
                <Card className="mui-custom-card">
                    <BorderedCardHeader title="API Health" fontSize="1.4rem" />
                    <CardContent style={cardStyle}>
                        <strong>Token Status: </strong>
                        <BinarySignal safe={authStatus} ok="OK" fail="Dead, please re-authorize!"/>
                        <br />
                        <strong>Access Token: </strong><span className="auth-token">{auth.accessToken.substring(0, 24) + "..."}</span>
                        <br />
                        <strong>Refresh Token: </strong><span className="auth-token">{auth.refreshToken.substring(0, 18) + "..."}</span>
                        <br />
                        <strong>Access Token Expiry: </strong>{DateTimeUtil.relative(new Date(auth.accessTokenExpiry))}
                        <br />
                        <strong>Last Refresh: </strong>{
                            auth.lastRefresh.date !== undefined ? (
                                <span>
                                    <BinarySignal safe={auth.lastRefresh.success} ok="Success" fail="Failure" />
                                    {` ${DateTimeUtil.timeSince(new Date(auth.lastRefresh.date))} ago`}
                                </span>
                            ) : "Notyet"
                        }
                    </CardContent>
                </Card>
                <Card className="mui-custom-card">
                    <BorderedCardHeader title="Scopes Granted" fontSize="1.4rem" />
                    <CardContent style={cardStyle}>
                        <div className="scopes-note"><strong>Note: </strong>{`If you are missing any scopes,
please simply use the `}{<img src="./images/eve-sso-login-black-small.png" className="inline-image-with-width eve-banner"
// @ts-ignore can use css var name. (react api will not issue a warning
style={{ "--image-width": "160px" }}/>}{` button
on the [Managed Characters] page and re-add this character.
`}</div>
                        <AuthorizedScopeInfos characterId={auth.characterId}/>
                    </CardContent>
                </Card>
            </div>
            <div className="flex-item-card"
                // @ts-ignore R.CSSProperties cannot allow double dash var property.
                style={{ "--flex-grow": 0.6 }}
            >
                <Card className="mui-custom-card">
                    <BorderedCardHeader title="Data Refresh" fontSize="1.4rem"
                        subheader={<>ESI health status expiration: <span className={HEALTH_EXPIRES}></span></>}
                        static={true}
                    />
                    <CardContent style={cardStyle}>
                        <table style={{ width: "100%" }}>
                            <thead>
                                <tr>
                                    <th className="refresh-table-head">ESI operation Id - (query interval: min)</th>
                                    <th className="refresh-table-head interval">Last</th>
                                    <th className="refresh-table-head interval">Next</th>
                                </tr>
                            </thead>
                            <tbody>{
                                ess.listTheScheduleState(characterId).map(info => {
                                    const fireable = info.nextRefresh === "Due" ? "1": void 0;
                                    let last = info.lastRefresh;
                                    let title: TBD<string>;
                                    if (last.length > 21) {
                                        title = last;
                                        last = last.substring(0, 18) + "...";
                                    }
                                    return <tr key={info.type} className="esi-operation-list-row" data-fireable={fireable}>
                                        <td className="refresh-table-cell" data-opid={info.type}><span className={TRI_STATE}/>{info.typeDetails}</td>
                                        <td className="refresh-table-cell" title={title}>{last}</td>
                                        <td className="refresh-table-cell">{info.nextRefresh}</td>
                                    </tr>;
                                })
                            }</tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>
        </div>;
    }
}