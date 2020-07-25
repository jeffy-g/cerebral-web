/*!
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  <one line to give the program's name and a brief idea of what it does.>
  Copyright (C) 2018 jeffy-g hirotom1107@gmail.com

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
import Avatar, { AvatarProps } from "@material-ui/core/Avatar";
import Icon, { IconProps } from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import Chip from "@material-ui/core/Chip";
import Tooltip, { TooltipProps } from "@material-ui/core/Tooltip";
import Button, { ButtonProps } from "@material-ui/core/Button";
import Radio, { RadioProps } from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox, { CheckboxProps } from "@material-ui/core/Checkbox";
import List from "@material-ui/core/List";
import CardHeader, { CardHeaderProps } from "@material-ui/core/CardHeader";
import DialogTitle, { DialogTitleProps } from "@material-ui/core/DialogTitle";
import Accordion, { AccordionProps } from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Card from "@material-ui/core/Card";
import Collapse from "@material-ui/core/Collapse";
import red from "@material-ui/core/colors/red";
import green from "@material-ui/core/colors/green";
import {
    useTheme, Theme, ThemeProvider
} from "@material-ui/core/styles";
import {
    getEVEImageUrl
} from "@eve/models/constants";
import * as mf from "@util/misc-functions";
declare global {
    type ResetState = {
        value: boolean;
    };
}
type ExtrasFunctionComponentBaseProps = {
    static?: boolean;
};
export const EVETime = (props: { sec?: boolean, enable?: boolean } = onil()) => {
    const { enable, sec } = props;
    const interval = enable? (sec? 1e3: 60 * 1e3): 0;
    const [eveTime, update] = R.useState("");
    R.useEffect(() => {
        const action = enable? "start": "stop";
        BackgroundTaskManager.operateTimerTask<string>("eve-time", {
            action, interval,
            taskBody: mf.getEVETime
        }, update);
    }, [enable]);
    R.useEffect(() => {
        return () => {
            BackgroundTaskManager.operateTimerTask("eve-time", { action: "remove" });
        };
    }, []);
    return <span>{eveTime}</span>;
};
export const shouldNotComponentUpdate = () => true;
type BorderedCardHeaderProps = ExtrasFunctionComponentBaseProps & {
    title?: R.ReactNode;
    subheader?: R.ReactNode;
    fontSize?: R.ReactText;
    titleClassName?: string;
    subTitleClassName?: string;
};
export const BorderedCardHeader = R.memo((props: BorderedCardHeaderProps) => {
        const style: R.CSSProperties = {
            paddingBottom: 2,
            borderBottom: "dashed 1px rgba(192, 192, 192, 0.47)"
        };
        if (props.fontSize !== void 0) {
            style.fontSize = props.fontSize;
        }
        const { titleClassName, subTitleClassName } = props;
        return <CardHeader
            style={{ padding: "10px 18px" }}
            titleTypographyProps={{  style, className: titleClassName }}
            title={props.title}
            subheaderTypographyProps={{  className: subTitleClassName }}
            subheader={props.subheader}
        />;
    }, (pp, np) => {
        return (typeof pp.static !== "undefined" && pp.static === np.static) ||
            (pp.fontSize === np.fontSize && pp.subheader === np.subheader && pp.title === np.title);
    }
);
export const Themetize = (children: R.ReactNode) => {
    return <ThemeProvider theme={EVEApp.getTheme()} children={children}/>;
};
type TEVEBannerButtonOption = {
    checkboxProps?: LabeledCheckBoxProps;
};
export const EVEBannerButton = R.memo(
    (props: ButtonProps & TEVEBannerButtonOption) => {
        const checkbox = props.checkboxProps;
        let optionComponent: TBD<R.ReactNode>;
        if (checkbox) {
            optionComponent = <LabeledCheckBox {...checkbox}/>;
        }
        return <>
            <Button variant="outlined"
                className="eve-banner-button"
                onClick={props.onClick}
            >&nbsp;</Button>
            {optionComponent}
        </>;
    },
    (np, pp) => {
        const checkboxProps = np.checkboxProps;
        const checkboxProps2 = pp.checkboxProps;
        if (!checkboxProps || !checkboxProps2) {
            return false;
        }
        if (checkboxProps && checkboxProps2) {
            return checkboxProps.checked === checkboxProps2.checked;
        }
        return true;
    }
);
type EVEAvatarProps = {
    character: {
        character_id: EVEId;
        race_id: number;
        online: EVECharacterOnline;
    },
} & AvatarProps;
export const EVEAvatar = R.memo(
    (props: EVEAvatarProps) => {
        const { character, ...others } = props;
        const className = character.online.online ? "eve-avatar online" : "eve-avatar";
        const character_id = character.character_id;
        return <Avatar data-id={character_id} data-race={character.race_id}
            classes={{ root: className }}
            src={getEVEImageUrl("character", character_id, 64)}
            {...others}
        />;
    },
    (pp, np) => {
        const ppc = pp.character;
        const npc = np.character;
        return ppc === npc && ppc.online.online === npc.online.online;
    }
);
export const syncEVEAvatarState = () => {
    const avatars = $queryAll<HTMLElement>(".eve-avatar[data-id][data-race]");
    const characters = EVEApp.Providers.CharProvider.getCharactersMap();
    avatars.forEach(avatar => {
        const character = characters[avatar.dataset.id!];
        const method = character.online.online? "add": "remove";
        avatar.classList[method]("online");
    });
};
type TitledDividerProps = R.HTMLAttributes<HTMLDivElement> & {
    text: string,
    align?: "left" | "center" | "right",
    background?: string,
};
const _TitledDivider = (props: TitledDividerProps) => {
    const theme: Theme = useTheme();
    const {
        text,
        align = "center",
        background = theme.palette.background.paper,
        style = onil(),
        ...others
    } = props;
    const ss = Object.assign({ "--align": align, "--text-background": background }, style);
    return <div className="styled-hr-text" data-content={text}
        style={ss}
        {...others}
    />;
};
export const TitledDivider = R.memo(
    _TitledDivider, shouldNotComponentUpdate
);
export const TooltipedButton = R.memo(
    (props: {
        tooltipProps: Omit<TooltipProps, "children">,
        buttonProps: ButtonProps,
        children: R.ReactNode
    }) => {
        const [open, setOpenState] = R.useState(false);
        const button = <Button {...props.buttonProps}
            onClick={() => {
                setOpenState(!open);
            }}
        >{props.children}</Button>;
        return <Tooltip open={open}
            {...props.tooltipProps}
            disableFocusListener disableHoverListener disableTouchListener
            children={button}
        />;
    },
    (pp, np) => {
        return pp.buttonProps === np.buttonProps && pp.tooltipProps === np.tooltipProps;
    }
);
export type TooltipedButtonProps = R.ComponentPropsWithRef<typeof TooltipedButton>;
const disableClickEvent = (e: R.MouseEvent) => e.stopPropagation();
function DenseRadio(props: RadioProps) {
    const { onClick = disableClickEvent, ...others } = props;
    return <Radio className="dense-radio" onClick={onClick} {...others}/>;
}
function memorizeBinarySignal<TProps extends { safe: boolean; }>(fc: (props: TProps) => JSX.Element) {
    return R.memo(fc, (pp, np) => pp.safe === np.safe);
}
type BinarySignalProps = R.HTMLAttributes<HTMLSpanElement> & {
    safe: boolean;
    ok: R.ReactNode;
    fail: R.ReactNode;
};
export const BinarySignal = memorizeBinarySignal((props: BinarySignalProps) => {
    const { safe, ok, fail } = props;
    return <span style={{ color: safe ? green.A200 : red[500] }}>
        {safe? ok: fail}
    </span>;
});
export type BinarySignalIconProps = IconProps & {
    safe: boolean;
    icons: [string, string];
};
export type LabeledDenseRadioProps = RadioProps & { label: string; lableClassName?: string; };
export type LabeledCheckBoxProps = CheckboxProps & {
    formStyle?: R.CSSProperties;
    rootClassName?: string;
    labelClassName?: string;
    label: string;
    checkBoxPadding?: number | string;
    value?: unknown;
};
export const BinarySignalIcon = memorizeBinarySignal((props: BinarySignalIconProps) => {
    const { safe, icons } = props;
    return <Icon classes={{ root: "bin-signal-icon" }}
        // @ts-ignore typescript cannot detect var property.
        style={{ "--color": safe ? green.A200 : red[500], ...props.style } as R.CSSProperties}
    >
        {icons[+!safe]}
    </Icon>;
});
function memorizeChecked<TProps extends { checked?: boolean | string }>(fc: (props: TProps) => JSX.Element) {
    return R.memo(fc, (pp, np) => {
        return pp.checked === np.checked;
    });
}
export const LabeledDenseRadio = memorizeChecked((props: LabeledDenseRadioProps) => {
    const { label, lableClassName, ...others } = props;
    const cn = `dense-radio-label ${lableClassName? lableClassName: ""}`;
    return <>
        <DenseRadio {...others}/>
        <label className={cn}>{label}</label>
    </>;
});
export type TDenseRadioGroupEntry = {
    label: string;
    checked?: boolean;
    value?: unknown;
};
export type DenseRadioGroupProps = {
    name?: string,
    lableClassName?: string,
    onChange?: RadioProps["onChange"],
    children: () => TDenseRadioGroupEntry[]
};
export const DenseRadioGroup = (props: DenseRadioGroupProps) => {
    const { name, lableClassName, onChange, children } = props;
    const entries = children();
    const elements: R.ReactFragment[] = [];
    for (const entry of entries) {
        const { label, ...others } = entry;
        elements.push(
            <LabeledDenseRadio key={label} name={name}
                onChange={onChange}
                label={label}
                lableClassName={lableClassName}
                {...others}
            />
        );
    }
    return <>{elements}</>;
};
export const LabeledCheckBox = memorizeChecked((props: LabeledCheckBoxProps) => {
    const {
        label,
        formStyle = onil(),
        rootClassName,
        labelClassName = "",
        checkBoxPadding = 4,
        value,
        style =onil(),
        ...others
    } = props;
    const ip = value !== void 0? { value }: void 0;
    return <FormControlLabel style={formStyle} className={rootClassName}
        control={
            <Checkbox style={{ padding: checkBoxPadding, ...style }}
                inputProps={ip as CheckboxProps["inputProps"]}
                {...others}
            />
        }
        label={label} classes={{ label: labelClassName }}
    />;
});
export function TransitionElement(
    props: R.HTMLAttributes<HTMLDivElement> & {
    children: R.ReactNode,
    type: string,
    typeValue: any,
    duration?: number
}): JSX.Element {
    const { children, type, typeValue, duration = 300, ...others } = props;
    return <div style={{
        transition: `${type} ${duration}ms linear`,
        [type]: typeValue,
    }} {...others}>{children}</div>;
}
export const CoolDialogTitle = R.memo((props: DialogTitleProps & {
    smallPadding?: boolean;
    textAlign?: "left" | "center" | "right";
}) => {
    const { smallPadding, textAlign = "left", ...rest } = props;
    const style: R.CSSProperties = { background: "rgba(214, 214, 214, 0.31)", textAlign };
    if (smallPadding === true) {
        style.padding = "10px 32px 10px";
    }
    return <DialogTitle {...rest} style={style}/>;
}, shouldNotComponentUpdate);
export const EVEToolIcon = R.memo((props: { type: string, className?: string }) => {
    const { type, className } = props;
    return <img src={`./images/sde/${type}.png`} alt="icon" width="28" height="28" className={`eve-tool-icon ${className || ""}`}/>;
}, shouldNotComponentUpdate);
export const EVEChip = (props: { id: EVEId }) => {
    const character_id = props.id;
    if (!character_id) {
        return null;
    }
    return <Chip component="span" label={EVEApp.Providers.CharProvider.getCharacterName(character_id)} avatar={
        <Avatar component="span"
            style={{
                width: 28, height: 28, marginLeft: 3
            }}
            src={getEVEImageUrl("character", character_id)}
        />
    }/>;
};
const _AscendDescendButton = (props: {
    ascending: boolean
    updateOrder: (ascending: boolean) => void,
    marginLeft?: number,
    marginRight?: number
}) => {
    const { marginLeft = 10, marginRight = 0 } = props;
    let [ascending, update] = R.useState(props.ascending);
    return <Tooltip title={ ascending? "ascending order": "descending order" } disableFocusListener>
        <IconButton
            classes={{ root: "ascending-descending-button" }}
            // @ts-ignore cannot detect var property
            style={{ "--l-margin": `${marginLeft}px`, "--r-margin": `${marginRight}px` }}
            onClick={function (e) {
                e.stopPropagation();
                update(ascending = !ascending);
                props.updateOrder(ascending);
            }}
            data-ascending={ascending}
        >
            <Icon classes={{ root: "icon" }}>keyboard_arrow_up</Icon>
        </IconButton>
    </Tooltip>;
};
export const AscendDescendButton = R.memo(
    _AscendDescendButton, shouldNotComponentUpdate
);
const PanelSummaryClasses = {
    root: "expansion-panel-summary",
    content: "expansion-panel-summary-content"
};
const PanelSummaryIconButtonProps = {
    style: {
        marginRight: 10
    }
};
const AccordionExpandIcon = <Icon>expand_more</Icon>;
const TransitionProps = { unmountOnExit: true, mountOnEnter: true };
export type CustomExpansionPanelProps = ExcludePick<AccordionProps, "children"> & {
    listItemContent: R.ReactNode;
    detailsContent: R.ReactNode;
    defaultExpanded?: boolean;
    autoHeight?: boolean;
};
export const CustomExpansionPanel = (props: CustomExpansionPanelProps) => {
    const {
        listItemContent,
        detailsContent,
        defaultExpanded = false,
        autoHeight = true,
        expanded,
        TransitionProps: extraTransitionProps = onil()
    } = props;
    return <Accordion className="mui-custom-card" defaultExpanded={defaultExpanded}
        expanded={expanded}
        TransitionProps={{...TransitionProps, ...extraTransitionProps}}
    >
        <AccordionSummary
            classes={PanelSummaryClasses}
            expandIcon={AccordionExpandIcon}
            IconButtonProps={PanelSummaryIconButtonProps}
        >
            <List>{listItemContent}</List>
        </AccordionSummary>
        {}
        <AccordionDetails className="expansion-panel-details medium-padding" data-autoheight={autoHeight}>
            {detailsContent}
        </AccordionDetails>
    </Accordion>;
};
type CollapseCardProps = CardHeaderProps & {
    open: boolean,
    compare: R.ReactText;
    collapseWrapperClasse: string
};
export const CollapseCard = R.memo((props: CollapseCardProps) => {
    const {
        children,
        open,
        collapseWrapperClasse,
        compare,
        ...others
    } = props;
    return <Card className="mui-custom-card">
        {}
        <CardHeader {...others}/>
        {}
        <Collapse in={open} unmountOnExit mountOnEnter
            classes={{ wrapper: collapseWrapperClasse }}
        >
            {children}
        </Collapse>
    </Card>;
}, (pp, np) => pp.open === np.open && pp.compare === np.compare);