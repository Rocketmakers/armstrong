import * as React from "react";
import { ClassHelpers, generateUniqueId, ValidationLabel } from "../../..";
import { DataValidationMessage, DataValidationMode } from "../formCore";

export interface ISwitchInput {
  focus: () => void;
  blur: () => void;
}

export interface ISwitchInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** if enabled, the switch will nudge across a bit when hovered to provide a visual cue */
  hoverNudgeEffectEnabled?: boolean;

  /** width of the switch track - 50 by default */
  width?: number;

  /** height of the switch track - 25 by default */
  height?: number;

  /** padding of the switch track (if negative, the nubbin will be bigger than the track) - 2px by default */
  padding?: number;
}

const SwitchInputRef: React.RefForwardingComponent<
  ISwitchInput,
  ISwitchInputProps
> = (props, ref) => {
  const {
    hoverNudgeEffectEnabled,
    height,
    width,
    padding,
    className,
    id,
    ...attrs
  } = props;

  const input = React.useRef<HTMLInputElement>(undefined);

  React.useEffect(() => {
    if (input.current) {
      input.current.style.setProperty("--switch-height", `${height}px`);
      input.current.style.setProperty("--switch-width", `${width}px`);
      input.current.style.setProperty("--switch-padding", `${padding}px`);
    }
  }, [input, height, width, padding]);

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
    <div className={classes} title={validationMessage}>
      <input
        ref={input}
        name={name}
        type="checkbox"
        id={autoId}
        {...attrs}
        onClick={() => setClicked(true)}
        onMouseLeave={() => setClicked(false)}
        data-has-clicked={clicked}
        data-hover-nudge-enabled={hoverNudgeEffectEnabled}
      />{" "}
      <ValidationLabel message={validationMessage} mode={validationMode} />
    </div>
  );
};

export const SwitchInput = React.forwardRef(SwitchInputRef);

SwitchInput.defaultProps = {
  hoverNudgeEffectEnabled: true,
  width: 50,
  height: 25,
  padding: 2
};
