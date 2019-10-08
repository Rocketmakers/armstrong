import * as React from "react";
import { ClassHelpers, generateUniqueId, ValidationLabel } from "../../..";
import { useCSSVariables } from "../../../hooks/useCssVariables";
import { Icon } from "../../display/icon";
import { DataValidationMessage, DataValidationMode } from "../formCore";

export interface ISwitchInput {
  focus: () => void;
  blur: () => void;
}

export interface ISwitchInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** if enabled, the switch will nudge across a bit when hovered to provide a visual cue */
  hoverNudgeAmount?: number;

  /** width of the switch track - 50 by default */
  width?: number;

  /** height of the switch track - 25 by default */
  height?: number;

  /** padding of the switch track (if negative, the nubbin will be bigger than the track) - 2px by default */
  padding?: number;

  /** colour of the switch track when inactive */
  inactiveColour?: string;

  /** colour of the switch track when hovering */
  hoveringColour?: string;

  /** colour of the switch track when active */
  activeColour?: string;

  /** grey out the switch and stop it from being interactible */
  disabled?: boolean;

  /** icon to show on the nubbin when the value of checked is true */
  activeIcon?: string;

  /** icon to show on the nubbin when the value of checked is false */
  inactiveIcon?: string;
}

const SwitchInputRef: React.RefForwardingComponent<
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
    id,
    disabled,
    activeIcon,
    inactiveIcon,
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
    }
  ]);

  const input = React.useRef(null);

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
    () => id || generateUniqueId(u => "checkbox_" + u),
    [id]
  );

  return (
    <div className={classes} title={validationMessage} ref={inputWrapper}>
      <input
        ref={input}
        name={name}
        type="checkbox"
        id={autoId}
        {...attrs}
        onClick={() => setClicked(true)}
        onMouseLeave={() => setClicked(false)}
        data-has-clicked={clicked}
        data-hover-nudge-enabled={!!hoverNudgeAmount}
        data-disabled={disabled}
      />

      {activeIcon && <Icon className="active-icon" icon={activeIcon} />}
      {inactiveIcon && <Icon className="inactive-icon" icon={inactiveIcon} />}

      <ValidationLabel message={validationMessage} mode={validationMode} />
    </div>
  );
};

export const SwitchInput = React.forwardRef(SwitchInputRef);
