/*!
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  <one line to give the program's name and a brief idea of what it does.>
  Copyright (C) 2019 jeffy-g hirotom1107@gmail.com

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
import * as R from "react";
import { RouteChildrenProps } from "react-router";
import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Popover from "@material-ui/core/Popover";
import Card from "@material-ui/core/Card";
import Tooltip from "@material-ui/core/Tooltip";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import * as NsOAuthClient from "@eve/oauth/oauth-client";
import { SharedStorage } from "@/global/shared-storage";
import * as Extras from "../tiny/extras";
import * as mf from "@util/misc-functions";
import inspect, { enter } from "@util/inspect/";
const _DEBUG = false;
const log = console.log;
type TESITaskOptionKeys = "esiTaskParallelity" | "esiTaskPerformanceReport" | "esiTaskDebug";
type TESITaskOptions = {
    [K in TESITaskOptionKeys]?: boolean;
};
type TExtraOptionState = {
    open: boolean;
    anchor: HTMLElement;
} & TESITaskOptions;
type SettingsState = NsOAuthClient.TEVEAppCredentials & {
};
const checkBoxParameters = [
    ["esiTaskParallelity", "Task Parallelity"],
    ["esiTaskPerformanceReport", "Performance Report"],
    ["esiTaskDebug", "Debug log"],
] as [TESITaskOptionKeys, string][];
const IMPORT_AERA_DEFAULT_TEXT = "Drop or click!";
const changeDomStateOnDragEvent = (dom: HTMLElement, exit: boolean = true) => {
    dom.classList[exit? "remove": "add"]("drag-enter");
    dom.dataset.text = exit? IMPORT_AERA_DEFAULT_TEXT: "Import app config!?";
};
const toolTipClasses = {
    tooltip: "nowrap-tooltip"
};
const buttonClasses = {
    root: "-page-button-contained",
    contained: `app-credentials-tip-button${mf.isSmartPhone()? " smart": ""}`
};
const styles: Record<string, R.CSSProperties> = {
    credentialsTip: {
        whiteSpace: "pre"
    },
    credentialsTipWarn: {
        color: "rgba(255, 226, 84, 0.72)",
        padding: "6px 3px",
        margin: 0,
        whiteSpace: "pre"
    },
    inputField: { marginTop: 10 },
};
const ESITaskOptions = R.memo(
    () => {
        const appConfig = EVEApp.Config;
        const [state, setExtraOptionState] = R.useState<TExtraOptionState>({
            open: false,
            anchor: void 0 as unknown as HTMLElement,
            esiTaskDebug: appConfig.get("esiTaskDebug"),
            esiTaskParallelity: appConfig.get("esiTaskParallelity"),
            esiTaskPerformanceReport: appConfig.get("esiTaskPerformanceReport"),
        });
        const showExtraOptions = (e: R.MouseEvent<HTMLButtonElement>) => {
            setExtraOptionState(prev => {
                return {
                    ...prev, open: true, anchor: e.currentTarget
                };
            });
        };
        const closeExtraOptions = () => {
            setExtraOptionState(prev => {
                return { ...prev, open: false };
            });
        };
        const handleChangeEvents = (e: R.ChangeEvent<HTMLInputElement>, checked: boolean) => {
            const newState: TESITaskOptions = onil();
            const optionKey = e.currentTarget.value as TESITaskOptionKeys;
            newState[optionKey] = checked;
            appConfig.set(optionKey, checked);
            setExtraOptionState(prev => {
                return { ...prev, ...newState };
            });
        };
        return <>
            <Popover
                open={state.open}
                anchorEl={state.anchor}
                container={() => $query("div.app")}
                anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                onClose={closeExtraOptions}
            >
                <div className="settings-popover__content">
                    <Extras.TitledDivider text="ESI task options" align="left" style={{
                        // @ts-ignore cannot detect css var
                        "--hmargin": "-8px"
                    }}/>
                    {
                        checkBoxParameters.map(item => {
                            const optkey = item[0];
                            return <Extras.LabeledCheckBox key={optkey} className="settings-popover__content__checkbox"
                                label={item[1]} value={optkey}
                                checked={state[optkey] || false}
                                onChange={handleChangeEvents}
                            />;
                        })
                    }
                </div>
            </Popover>
            <div className="fs1 -flex-most-right">
                data source&nbsp;:&ensp;
                <Extras.LabeledDenseRadio disabled checked
                    value="tranquility"
                    name="datasource-buttons"
                    aria-label="tranquility"
                    label="tranquility" lableClassName="fs08125"
                />
                <Extras.LabeledDenseRadio disabled
                    value="singularity"
                    name="datasource-buttons"
                    aria-label="singularity"
                    label="singularity" lableClassName="fs08125"
                />
                <IconButton title="show extra configs"
                    className="padding-4px"
                    onClick={showExtraOptions}
                >
                    <Icon>menu</Icon> {}
                </IconButton>
            </div>
        </>;
    },
    Extras.shouldNotComponentUpdate
);
const MemorizedTextField = R.memo(
    (props: TextFieldProps) => {
        return <TextField autoComplete="off" fullWidth style={styles.inputField} {...props}/>;
    },
    (pp, np) => pp.value === np.value
);
const TooltipContent = R.memo(() => {
        return <>
            <div style={styles.credentialsTip}>
            Please visit this page and follow the instructions to create a <code>EVE Application credentials</code>:&ensp;<a
                href="https://github.com/jeffy-g/cerebral-web/blob/master/how-to/API-SETUP.md"
                rel="noopener noreferrer"
                target="_blank"
                className="external-link"
            >API Setup Instructions</a>.&#10;Please read the instructions <strong>very carefully</strong> as it is important that you follow them <strong>exactly</strong>.
            </div>
            <p style={styles.credentialsTipWarn}>
                <strong>Warning:</strong>&#10;  After changing your client credentials,
                &#10;  all of your characters will lose authorization within 20 minutes,
                &#10;  and must be re-authorized before new data will be pulled.
            </p>
        </>;
    },
    Extras.shouldNotComponentUpdate
);
const SaveCredentialsButton = R.memo((
        { callback, reset }: { callback: () => Promise<boolean>, reset: ResetState }
    ) => {
        const [success, updateState] = R.useState(false);
        const handler = R.useCallback(async () => {
            updateState(await callback());
        }, [callback]);
        if (reset.value) {
            reset.value = false;
            updateState(false);
        }
        let iconToken: string, text: string;
        if (success) {
            iconToken = "check", text = "ok";
        } else {
            iconToken = "save", text = "save";
        }
        return <Button variant="outlined" classes={{ root: "settings-bottom-pane__save-button" }} onClick={handler}>{
            <><Icon>{iconToken}</Icon>{`\u2002${text}`}</>
        }</Button>;
    },
    // @ts-ignore unused parameter
    (pp, np) => !np.reset.value
);
const fixedTooltipProps: Extras.TooltipedButtonProps["tooltipProps"] = {
    placement: "right-end", classes: toolTipClasses, title: <TooltipContent/>
};
const fiexedTooltipButtonProps: Extras.TooltipedButtonProps["buttonProps"] = {
    variant: "contained", classes: buttonClasses
};
const handleDragOver = (e: R.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.dropEffect = "link";
    e.preventDefault();
};
const handleDrop = (e: R.DragEvent<HTMLDivElement>) => {
    _DEBUG && log("onDrop", e.dataTransfer.dropEffect, e.nativeEvent);
    const files = e.dataTransfer.files;
    if (files.length) {
        _DEBUG && log(files[0].name, e.dataTransfer.items);
        const dropType = e.dataTransfer.items[0];
        (dropType.type === "application/json") && mf.readTextFromFile(files[0]).then(jsonString => {
            EVEApp.Config.importAppConfig(jsonString);
        }).catch(reason => console.warn(reason));
    }
    changeDomStateOnDragEvent(e.currentTarget);
    $consumeEvent(e.nativeEvent);
};
@inspect.injectAspect(enter)
export class Settings extends R.Component<RouteChildrenProps, SettingsState> {
    constructor(props: RouteChildrenProps) {
        super(props);
        this.state = {
            client_id: "", secret_key: "",
            redirect_uri: "",
        };
    }
    private load() {
        SharedStorage.get<NsOAuthClient.TEVEAppCredentials>("eve-credentials", (data) => {
            if (data === void 0) {
                data = {
                    client_id: "", secret_key: "",
                    redirect_uri: "",
                };
            }
            this.isDirty = false;
            this.setStateWithCallback(data as SettingsState);
        });
    }
    dataSouceChanged: boolean = false;
    isDirty: boolean = false;
    private isNeedReset() {
        return this.isDirty || this.dataSouceChanged;
    }
    // @ts-ignore unused first parameter
    shouldComponentUpdate(np: Readonly<RouteChildrenProps>, ns: Readonly<SettingsState>): boolean {
        const stat = this.state;
        this.isDirty = stat.client_id !== ns.client_id ||
            stat.secret_key !== ns.secret_key ||
            stat.redirect_uri !== ns.redirect_uri;
        _DEBUG && log("Settings::dataSouceChanged=", this.dataSouceChanged, this.isDirty);
        return this.isDirty;
    }
    componentDidMount() {
        this.load();
    }
    private setStateWithCallback(state: SettingsState) {
        this.setState(state, () => {
            this.isDirty = false;
            this.dataSouceChanged = false;
        });
    }
    handleCredentialsInput = (e: R.ChangeEvent<HTMLInputElement>) => {
        const state: SettingsState = onil();
        state[e.target.id as keyof NsOAuthClient.TEVEAppCredentials] = e.target.value.trim();
        this.setStateWithCallback(state);
    }
    saveDeveloperCredentials = async (): Promise<boolean> => {
        const { client_id, secret_key, redirect_uri } = this.state;
        if (!NsOAuthClient.validateAppIdSecret(client_id, secret_key)) {
            EVEApp.marshalling({
                "notify.error": "must fill in the text fields.\nor invalid data"
            });
            return false;
        }
        const newCredentials = {
            client_id, secret_key, redirect_uri
        };
        return new Promise<boolean>(resolve => {
            SharedStorage.set("eve-credentials", newCredentials, (e: Event) => {
                    const success = e.type === "success";
                    resolve(success);
                    if (success) {
                        EVEApp.marshalling({ "eve-credentials.changed": newCredentials });
                    }
                }
            );
        });
    }
    render() {
        const state = this.state;
        return (
            <div className="padding-10px">
                <Card className="mui-custom-card">
                    <CardHeader
                        title="EVE API Application Credentials"
                        className="-border-bottom-dashed"
                        subheader={<>To authenticate an EVE character, you need to create Application credentials on the {
                            <a className="external-link" href="https://developers.eveonline.com/applications/create" target="_blank">EVE Developers website</a>
                        } and enter your <code>Client ID</code></>}
                    />
                    <CardContent>
                        <div className="flex-cc">
                            {}
                            <Extras.TooltipedButton
                                tooltipProps={fixedTooltipProps}
                                buttonProps={fiexedTooltipButtonProps}
                            >
                                <Extras.EVEToolIcon type="info"/> Tip
                            </Extras.TooltipedButton>
                            {}
                            <ESITaskOptions/>
                        </div>
                        <MemorizedTextField title="This field is required"
                            onChange={this.handleCredentialsInput}
                            id="client_id" label="Client ID" value={state.client_id}
                        />
                        {}
                        <MemorizedTextField
                            onChange={this.handleCredentialsInput}
                            id="redirect_uri" label="Redirect URI" value={state.redirect_uri}
                            title="NOTE: `redirect_uri` displayed in placeholder is an automatically detected value. (use it when this field is empty&#xa;if want change it, please input the needed uri."
                            placeholder={NsOAuthClient.REDIRECT_URI_DEFAULT}
                        />
                        <div className="settings-bottom-pane flex-cc">
                            <SaveCredentialsButton callback={this.saveDeveloperCredentials} reset={{ value: this.isNeedReset() }}/>
                            {}
                            <Tooltip classes={toolTipClasses}
                                title="when click, export app config as json.&#10;and or, drop json file and import it as app config!"
                                disableFocusListener
                            >
                                <div className="settings-bottom-pane__droppable-area -flex-most-right" data-text={IMPORT_AERA_DEFAULT_TEXT}
                                    onDragEnter={e => {
                                        _DEBUG && log("onDragEnter", e.nativeEvent);
                                        changeDomStateOnDragEvent(e.currentTarget, false);
                                    }}
                                    onDragOver={handleDragOver}
                                    onDragLeave={e => {
                                        _DEBUG && log("onDragLeave", e.nativeEvent);
                                        changeDomStateOnDragEvent(e.currentTarget);
                                    }}
                                    onDrop={handleDrop}
                                    onClick={e => {
                                        $consumeEvent(e.nativeEvent);
                                        EVEApp.Config.exportAppConfig();
                                    }}
                                ></div>
                            </Tooltip>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }
}