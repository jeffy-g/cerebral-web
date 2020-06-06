import * as R from "react";
import {
    useTheme,
} from "@material-ui/core/styles";
import {
    EVEStatusData,
    IEVEStatusObserver,
    EVEStatusObserverState,
} from "@eve/models/eve-status";
// @ts-ignore cannot detect type definition
import LineChart from "recharts/es6/chart/LineChart";
// @ts-ignore cannot detect type definition
import Line from "recharts/es6/cartesian/Line";
// @ts-ignore cannot detect type definition
import Tooltip from "recharts/es6/component/Tooltip";
// @ts-ignore cannot detect type definition
import XAxis from "recharts/es6/cartesian/XAxis";
// @ts-ignore cannot detect type definition
import YAxis from "recharts/es6/cartesian/YAxis";
// @ts-ignore cannot detect type definition
import Label from "recharts/es6/component/Label";
// @ts-ignore cannot detect type definition
import Dot from "recharts/es6/shape/Dot";
import * as Extras from "../tiny/extras";
const _DEBUG = 0;
let samples: EVEStatusData[]; {
    if (_DEBUG) {
        const rand = () => Math.round(Math.random() * 20000);
        samples = [
            { players: rand(), server_version: "0", start_time: "2018-07-17T15:40:31Z" },
            { players: rand(), server_version: "0", start_time: "2018-07-17T15:40:31Z" },
            { players: rand(), server_version: "0", start_time: "2018-07-17T15:40:31Z" },
            { players: rand(), server_version: "0", start_time: "2018-07-17T15:40:31Z" },
            { players: rand(), server_version: "0", start_time: "2018-07-17T15:40:31Z" },
            { players: rand(), server_version: "0", start_time: "2018-07-17T15:40:31Z" },
            { players: rand(), server_version: "0", start_time: "2018-07-17T15:40:31Z" },
            { players: rand(), server_version: "0", start_time: "2018-07-17T15:40:31Z" },
            { players: rand(), server_version: "0", start_time: "2018-07-17T15:40:31Z" },
        ];
    }
}
type RuntimeDotProps = {
    key: string;
    r: number;
    strokeWidth: number;
    stroke: string;
    fill: string;
    width: number;
    height: number;
    value: number;
    dataKey: string;
    cx: number;
    cy: number;
    index: number;
    payload: EVEStatusData;
};
export interface IEVEStatusWidgetProxy {
    enableTimer: (enable: boolean) => void;
}
export type TEVEStatusWidget = R.ComponentType<TinyLineChartProps>;
export type TinyLineChartProps = {
    useSeconds?: boolean;
    handleClose?: () => void;
    proxy?: IEVEStatusWidgetProxy;
};
export type TinyLineChartState = EVEStatusObserverState & {
    timerEnable?: boolean;
};
const noop = () => {};
const renderDot = (props: RuntimeDotProps) => {
    const {  start_time, vip } = props.payload;
    if (start_time === "") {
        props.fill = "red";
    } else if (vip) {
        props.fill = "rgb(255, 181, 0)";
    }
    return <Dot {...props}/>;
};
const EVEStatusWidgetBase = R.memo(
    (props: TinyLineChartProps) => {
        const [state, updateState] = R.useState(onil<TinyLineChartState>());
        const eveStatusObserverInterface = R.useMemo<IEVEStatusObserver>(() => {
            return {
                setState(newState) {
                    updateState(prev => {
                        return { ...prev, ...newState };
                    });
                }
            };
        }, []);
        const dispatchUpdate = R.useCallback((timerEnable: boolean) => {
            updateState(prev => {
                return { data: prev.data || void 0, timerEnable };
            });
        }, []);
        R.useEffect(() => {
            const assignEnableTimer = (fn: TStdFunction) => { proxy && (proxy.enableTimer = fn); };
            EVEStatus.register(eveStatusObserverInterface);
            assignEnableTimer(dispatchUpdate);
            return () => {
                EVEStatus.unRegister(eveStatusObserverInterface);
                assignEnableTimer(noop);
            };
        }, []);
        const { data = samples, timerEnable } = state;
        const {  useSeconds = false, handleClose, proxy } = props;
        const theme = useTheme();
        return <div className={`eve-status-widget${timerEnable ? " is-showing": ""}`}>
            {}
            <style>{
`.eve-status-widget {
    box-shadow: ${theme.shadows[6]};
    background-color: ${theme.palette.background.default};
}
div.app[data-theme="dark"] .eve-status-widget {
    /* box-shadow: 0px 3px 5px -1px rgba(175, 175, 175, 0.36), 1px 6px 10px 0px rgba(175, 175, 175, 0.26), 3px 1px 18px 0px rgba(179, 179, 179, 0.18);
    box-shadow: 0px 3px 2px -1px rgba(175, 175, 175, 0.36), -1px 1px 4px 1px rgba(175, 175, 175, 0.26), 0px 3px 8px 6px rgba(179, 179, 179, 0.18); */
	/* 191230 */
    box-shadow: 1px 2px 2px -1px rgba(175, 175, 175, 0.36), 1px 2px 4px 1px rgba(175, 175, 175, 0.26), 0px 1px 10px 3px rgba(179, 179, 179, 0.22);
}
/* dynamic theme change. */
text {
    fill: ${theme.palette.text.primary};
}
.eve-status-widget__icon {
    background-color: whitesmoke;
    vertical-align: middle;
}
/* emulate close button */
.eve-status-widget__button-close {
    /* float: right; */
    position: absolute;
    top: 4px;
    right: 8px;
    cursor: pointer;
    font-size: 10px;
}`
}
            </style>
            <img src="./eve-icon.png" width="18" className="eve-status-widget__icon"/>&ensp;eve time - {<Extras.EVETime sec={useSeconds} enable={timerEnable}/>}
            {}
            {<span className="eve-status-widget__button-close" onClick={handleClose}>❌</span>}
            {}
            {}
            <LineChart className="-line-chart" width={310} height={110} data={data}>
                <XAxis dataKey="at">
                    {}
                    <Label value="time line (local)" offset={-3} position="insideBottom"/>
                </XAxis>
                {}
                <YAxis />
                <Tooltip />
                {}
                <Line type="monotone" dataKey="players" dot={renderDot}/>
            </LineChart>
        </div>;
    },
    (pp, np) => pp.useSeconds === np.useSeconds
);
export const EVEStatusWidget = EVEStatusWidgetBase;