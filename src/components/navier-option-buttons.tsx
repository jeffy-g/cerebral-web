import * as R from "react";
import Icon from "@material-ui/core/Icon";
import IconButton, { IconButtonProps } from "@material-ui/core/IconButton";
import Tooltip, { TooltipProps } from "@material-ui/core/Tooltip";
import {
    withStyles, StyleRules
} from "@material-ui/core/styles";
import * as Extras from "./tiny/extras";
export type NavierOptionButtonsProps = {
    classes: Record<string, string>,
    pinRequest: (on: boolean) => void;
    pined: boolean;
    extraButtons: ExtraButtonDetail[];
};
type TooltipIconButtonProps = IconButtonProps & {
    buttonClass: string;
    popperClass: string;
    title: TooltipProps["title"];
};
const PinableKeyStroke = "ctrl alt p";
const ThemeToggleKeyStroke = "ctrl alt t";
const styles: StyleRules = {
    root: {
        padding: "6px 0 0 3px",
        display: "flex"
    },
    button: {
        margin: "3px 3px 3px 8px",
        width: 36, height: 36,
        padding: 0,
        filter: "blur(0.4px)",
        "&.siblings": {
            marginLeft: 3,
        },
        "&.pinable": {
            marginLeft: "auto",
            marginRight: 6
        }
    },
    popper: {
        whiteSpace: "pre",
        fontSize: "0.9em",
        letterSpacing: "0.05em"
    }
};
function getTooltipTextForPinButton(pined: boolean): string {
    let tip: string;
    if (!pined) {
        tip = "currently drawer not pinning.\nclick again then pinning.";
    } else {
        tip = "currently drawer pinning.\nclick then will be unpin.";
    }
    return tip + ` [${PinableKeyStroke}]`;
}
const TooltipIconButton = (props: TooltipIconButtonProps) => {
    const { buttonClass, popperClass, title, ...ohters } = props;
    return <Tooltip title={title} classes={{ tooltip: popperClass }} disableFocusListener>
        <IconButton
            classes={{ root: buttonClass }}
            {...ohters}
        />
    </Tooltip>;
};
let isDark: boolean = true;
const toggleTheme = () => {
    isDark = !isDark;
    EVEApp.updateTheme(+isDark);
};
const nop = (props: NavierOptionButtonsProps) => {
    const { classes, pined, extraButtons } = props;
    const pinState = pined? "1": "";
    let key = 0;
    R.useEffect(() => {
        const listenerIds = DomEventsUtil.registerShortcutKeys([
            {
                stroke: PinableKeyStroke,
                listener: () => $query("button.pinable").click(),
                description: "toggle drawer pin state"
            }, {
                stroke: ThemeToggleKeyStroke,
                listener: () => $query("button.theme-hook").click(),
                description: "toggle light/dark theme"
            },
        ], true);
        return () => {
            DomEventsUtil.unRegisterShortcutKey(PinableKeyStroke, listenerIds[0]);
            DomEventsUtil.unRegisterShortcutKey(ThemeToggleKeyStroke, listenerIds[1]);
        };
    }, []);
    return <div className={classes.root}>
        {}
        <TooltipIconButton title={`toggle light/dark theme. [${ThemeToggleKeyStroke}]`}
            popperClass={classes.popper} buttonClass={`${classes.button} theme-hook`}
            onClick={toggleTheme}
        >
            <Extras.EVEToolIcon type="tipoftheday" className={isDark ? "" : "invert"} />
        </TooltipIconButton>
        {}
        {extraButtons.map(detail => {
            return <TooltipIconButton key={key++} title={detail.tip}
                popperClass={classes.popper} buttonClass={`${classes.button} siblings ${detail.additionalButtonClass}`}
                onClick={detail.clickHandler}
                children={detail.icon}
            />;
        })}
        {}
        <TooltipIconButton title={getTooltipTextForPinButton(pined)}
            popperClass={classes.popper} buttonClass={`${classes.button} pinable`}
            children={
                <Icon
                    className="morphing-icon"
                    data-pined={pinState}
                    data-before="place" data-after="pin_drop"
                />
            }
            onClick={e => {
                const icon = e.currentTarget.querySelector(".material-icons") as HTMLElement;
                if (icon) {
                    props.pinRequest(icon.dataset.pined === "");
                }
            }}
        />
    </div>;
};
const styled = withStyles(styles as StyleRules, { classNamePrefix: "NavierOptionButtons" })(nop);
export const NavierOptionButtons = R.memo(styled, (pp, np) => {
    return pp.pined === np.pined && pp.extraButtons.length === np.extraButtons.length;
});