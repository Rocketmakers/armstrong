import * as React from "react";
import { ClassHelpers, generateUniqueId, ValidationLabel } from "../../..";
import { useCSSVariables } from "../../../hooks/useCssVariables";
import { IconOrJsx, useIconOrJsx } from "../../display/icon";
import { DataValidationMessage, DataValidationMode } from "../formCore";

export interface ISwitchInput {
  focus: () => void;
  blur: () => void;
}

export interface ISwitchInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** if enabled, the switch will nudge across a bit when hovered to provide a visual cue — Set with css variable --armstrong-switch-hover-nudge-amount */
  hoverNudgeAmount?: number;

  /** width of the switch track - 50 by default — Set with css variable --armstrong-switch-width */
  width?: number;

  /** height of the switch track - 25 by default — Set with css variable --armstrong-switch-height */
  height?: number;

  /** padding of the switch track (if negative, the nubbin will be bigger than the track) - 2px by default — Set with css variable --armstrong-switch-padding */
  padding?: number;

  /** colour of the switch track when inactive — Set with css variable --armstrong-switch-inactive-colour */
  inactiveColour?: string;

  /** colour of the switch track when hovering — Set with css variable --armstrong-switch-hover-colour */
  hoveringColour?: string;

  /** colour of the switch track when active — Set with css variable --armstrong-switch-active-colour */
  activeColour?: string;

  /** colour of the nubbin when inactive - Set with css variable --armstrong-switch-nubbin-inactive-colour */
  inactiveNubbinColour?: string;

  /** colour of the nubbin when inactive - Set with css variable --armstrong-switch-nubbin-inactive-colour */
  hoveringNubbinColour?: string;

  /** colour of the nubbin when active - Set with css variable --armstrong-switch-nubbin-active-colour */
  activeNubbinColour?: string;

  /** if set to true, the nubbin will have a 1px border in the current colour of the switch */
  borderedNubbin?: boolean;

  /** grey out the switch and stop it from being interactible */
  disabled?: boolean;

  /** icon to show on the nubbin when the value of checked is true, accessed via Icon.[IconSet].[IconName] or by passing in some JSX */
  activeIcon?: IconOrJsx;

  /** icon to show on the nubbin when the value of checked is false, accessed via Icon.[IconSet].[IconName] or by passing in some JSX */
  inactiveIcon?: IconOrJsx;

  /** where to render the icon - defalults to on-nubbin */
  iconStyle?: "on-nubbin" | "is-nubbin" | "static";

  /** size of the icon as a proportion of the size of the nubbin (from 0 to 1), if activeIcon or inactiveIcon are set, defaults to 0.8 — Set with css variable --armstrong-switch-icon-size */
  iconSize?: number;

  /** renders shadows around the nubbin and inset into the track — true by default */
  renderShadows?: boolean;

  /** Adds a label above the input */
  label?: string;
}

const SwitchInputRef: React.ForwardRefRenderFunction<
  ISwitchInput,
  ISwitchInputProps
> = (props, ref) => {
  const {
    hoverNudgeAmount,
    height,
    width,
    padding,
    className,
    inactiveColour,
    hoveringColour,
    activeColour,
    inactiveNubbinColour,
    hoveringNubbinColour,
    activeNubbinColour,
    id,
    label,
    disabled,
    activeIcon,
    inactiveIcon,
    iconSize,
    iconStyle,
    borderedNubbin,
    renderShadows,
    style,
    name,
    ...attrs
  } = props;

  const inputWrapper = useCSSVariables([
    {
      name: "--armstrong-switch-height",
      value: `${height}px`,
      enabled: !!height
    },
    { name: "--armstrong-switch-width", value: `${width}px`, enabled: !!width },
    {
      name: "--armstrong-switch-padding",
      value: `${padding}px`,
      enabled: !!padding
    },
    {
      name: "--armstrong-switch-hover-nudge-amount",
      value: `${hoverNudgeAmount}px`,
      enabled: !!hoverNudgeAmount
    },
    {
      name: "--armstrong-switch-inactive-colour",
      value: inactiveColour
    },
    {
      name: "--armstrong-switch-hover-colour",
      value: hoveringColour
    },
    {
      name: "--armstrong-switch-active-colour",
      value: activeColour
    },
    {
      name: "--armstrong-switch-nubbin-inactive-colour",
      value: inactiveNubbinColour
    },
    {
      name: "--armstrong-switch-nubbin-hover-colour",
      value: hoveringNubbinColour
    },
    {
      name: "--armstrong-switch-nubbin-active-colour",
      value: activeNubbinColour
    },
    {
      name: "--armstrong-switch-icon-size",
      value: iconSize
    }
  ]);

  const input = React.useRef<HTMLInputElement>(null);

  const refCallback = React.useCallback(() => {
    return {
      focus() {
        if (input.current) {
          input.current.focus();
        }
      },
      blur() {
        if (input.current) {
          input.current.blur();
        }
      }
    };
  }, [input]);

  React.useImperativeHandle(ref, refCallback, [refCallback]);

  const [clicked, setClicked] = React.useState(false);

  const validationMessage = DataValidationMessage.get(props);
  const validationMode = DataValidationMode.get(props);

  const classes = React.useMemo(
    () =>
      ClassHelpers.classNames("armstrong-input", "switch-input", className, {
        "show-validation": validationMode !== "none" && validationMessage
      }),
    [className, validationMode, validationMessage]
  );

  const autoId = React.useMemo(
    () => id || generateUniqueId(u => "switch_" + u),
    [id]
  );

  const activeIconElement = useIconOrJsx(
    activeIcon,
    {
      // @ts-ignore
      "data-icon-style": iconStyle,
      className: "active-icon"
    },
    icon => (
      <div className="icon active-icon" data-icon-style="icon-style">
        {icon}
      </div>
    )
  );

  const inactiveIconElement = useIconOrJsx(
    inactiveIcon,
    {
      // @ts-ignore
      "data-icon-style": iconStyle,
      className: "inactive-icon"
    },
    icon => (
      <div className="icon inactive-icon" data-icon-style="icon-style">
        {icon}
      </div>
    )
  );

  return (
    <div
      className={classes}
      title={validationMessage}
      ref={inputWrapper}
      data-icon-style={iconStyle}
      data-bordered-nubbin={borderedNubbin}
      data-render-shadows={renderShadows}
      style={style}
    >
      {label && <label className="armstrong-label">{label}</label>}
      <input
        {...attrs}
        ref={input}
        name={name}
        type="checkbox"
        id={autoId}
        onClick={() => setClicked(true)}
        onMouseLeave={() => setClicked(false)}
        data-has-clicked={clicked}
        data-hover-nudge-enabled={!!hoverNudgeAmount}
        data-disabled={disabled}
      />

      {activeIcon && activeIconElement}
      {inactiveIcon && inactiveIconElement}

      <ValidationLabel message={validationMessage} mode={validationMode} />
    </div>
  );
};

/** Renders a switch which behaves like a checkbox with many visual customisation options. Falls back to a checkbox in older browsers. */

export const SwitchInput = React.forwardRef(SwitchInputRef);

SwitchInput.defaultProps = {
  iconStyle: "on-nubbin",
  // renderShadows: true
};
