import * as R from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Slider, {
} from "@material-ui/core/Slider";
import { CoolDialogTitle } from "@com/tiny/extras";
import * as mf from "@util/misc-functions";
import * as constants from "@eve/models/constants";
const ATTRIBUTE_KEYS = constants.ATTRIBUTE_KEYS;
export type RemapDialogProps = {
    open: boolean;
    attributes?: EVECharacterAttributesFragment;
    implants?: number;
    editIndex?: number;
    onAddRemap:  (attributes?: EVECharacterAttributesFragment, implants?: number, index?: number) => void;
    onGetOptimalAttributes: (editIndex: number, implants: number) => void;
} & TransitionEventTriggers;
type RemapDialogState = {
    attributes: EVECharacterAttributesFragment;
    implants: number;
};
const CSS_TEXT = `
    .remap-content-root {
        overflow-x: hidden;
        padding: 8px 24px;
    }
    .remap-content {
        --pad-vertical: 24px;
        width: 260px;
        /* 2019/9/29 avoid reflow etc */
        table-layout: fixed;
    }
    .remap-content td:first-child {
        width: 82px;
    }
    .remap-content td {
        padding: 0;
        height: calc(var(--pad-vertical) * 2);
        width: auto;
        vertical-align: middle;
    }
    /* need this style for Slider */
    /*.remap-content td .slider {
        // margin: 20px 10px 8px;
        // width: 200px;
        // height: 12px; 
        padding: var(--pad-vertical) 0;
    }*/
    .remap-content td:last-child {
        width: 32px;
        text-align: right;
    }

    .custom-slider .track {
        /* --transition-list: width 150ms ease; */
        transition: width 150ms ease;
    }
    .custom-slider .thumb {
        transition: box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, left 150ms ease 0ms;
    }
`;
const SliderClasses = {
    track: "track", thumb: "thumb"
};
const createAttributeSliderRow = (
    name: EVECharacterAttributesKeys, attrValue: number,
    handleOnChange: (attribute: EVECharacterAttributesKeys, value: number) => void
) => {
    return <tr key={name}>
        <td>{mf.capitalizeToken(name)}</td>
        <td>
            <Slider className="custom-slider"
                valueLabelDisplay="auto"
                step={1} min={17} max={27}
                // @ts-ignore unused var
                onChange={(e, value) => {
                    handleOnChange(name, value as number);
                }}
                value={attrValue}
                classes={SliderClasses}
            />
        </td>
        <td>{attrValue}</td>
    </tr>;
};
export class RemapDialog extends R.Component<RemapDialogProps, RemapDialogState> {
    constructor(props: RemapDialogProps) {
        super(props);
        this.state = {
            attributes: props.attributes || {
                perception: 17,
                memory: 17,
                willpower: 17,
                intelligence: 17,
                charisma: 17,
            } as EVECharacterAttributesFragment,
            implants: props.implants || 0
        };
    }
    shouldComponentUpdate(np: RemapDialogProps, ns: RemapDialogState) {
        const { props } = this;
        let needup = false;
        if (np.attributes !== void 0 && np.attributes !== props.attributes) {
            ns.attributes = np.attributes;
            needup = true;
        }
        if (np.implants !== props.implants) {
            ns.implants = np.implants || 0;
            needup = true;
        }
        if (!needup) {
            const ns_attributes = ns.attributes;
            const { attributes } = this.state;
            needup = props.open !== np.open ||
                attributes.perception !== ns_attributes.perception ||
                attributes.memory !== ns_attributes.memory ||
                attributes.willpower !== ns_attributes.willpower ||
                attributes.intelligence !== ns_attributes.intelligence ||
                attributes.charisma !== ns_attributes.charisma ||
                this.state.implants !== ns.implants;
        }
        return needup;
    }
    handleClose = () => {
        this.props.onAddRemap();
    }
    handleAdd = () => {
        const state = this.state;
        this.props.onAddRemap(state.attributes, state.implants, this.props.editIndex);
    }
    handleUseSuggested = () => {
        if (this.props.editIndex !== undefined) {
            this.props.onGetOptimalAttributes(this.props.editIndex, this.state.implants);
        }
    }
    handleAttributeChange = (attribute: EVECharacterAttributesKeys, value: number) => {
        const { attributes } = this.state;
        let currentAttrValue = attributes[attribute] as number;
        let pool = 14 + (5 * 17);
        if (currentAttrValue > value) {
            currentAttrValue = value;
        } else {
            for (let index = 0, end = ATTRIBUTE_KEYS.length; index < end;) {
                const attr = ATTRIBUTE_KEYS[index++];
                pool -= attributes[attr] as number;
            }
            if (pool > 0) {
                currentAttrValue = pool + currentAttrValue <= value ? pool + currentAttrValue : value;
            }
        }
        this.setState({ attributes: { ...attributes, [attribute]: currentAttrValue } });
    }
    // @ts-ignore unused parameter `e`
    handleImplants = (e: unknown, value: number | number[]) => {
        this.setState({ implants: value as number });
    }
    render() {
        const actions =
            <DialogActions>
                {
                    this.props.editIndex !== undefined ? (
                        <Button onClick={this.handleUseSuggested} color="primary" autoFocus children="Use optimal"/>
                    ) : null
                }
                <Button onClick={this.handleAdd} color="primary" autoFocus children="Save"/>
                <Button onClick={this.handleClose} color="secondary" children="Cancel"/>
            </DialogActions>;
        const attributes = this.state.attributes;
        return (
            <>
                <style type="text/css">{CSS_TEXT}</style>
                <Dialog
                    open={this.props.open}
                    onClose={this.handleClose}
                    onExited={this.props.onExited}
                >
                    <CoolDialogTitle>Remap</CoolDialogTitle>
                    {}
                    <DialogContent classes={{ root: "remap-content-root" }}>
                        <table className="remap-content">
                            <tbody>
                                {
                                    ATTRIBUTE_KEYS.map(name => {
                                        return createAttributeSliderRow(
                                            name, attributes[name], this.handleAttributeChange
                                        );
                                    })
                                }
                                <tr>
                                    <td>Implants</td>
                                    <td>
                                        <Slider className="custom-slider"
                                            valueLabelDisplay="auto"
                                            step={1} min={0} max={5}
                                            onChange={this.handleImplants}
                                            value={this.state.implants}
                                            classes={SliderClasses}
                                        />
                                    </td>
                                    <td>{`+${this.state.implants}`}</td>
                                </tr>
                            </tbody>
                        </table>
                    </DialogContent>
                    {actions}
                </Dialog>
            </>
        );
    }
}