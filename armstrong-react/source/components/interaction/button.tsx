import * as React from "react";
import { ClassHelpers } from "../../utilities/classHelpers";
import { getIconOrJsx, IconOrJsx } from "./../display/icon";

export interface IButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** (string) An icon to show on the left of the buttons content */
  leftIcon?: IconOrJsx;

  /** (string) An icon to show on the right of the buttons content */
  rightIcon?: IconOrJsx;

  /** (boolean) Wether or not the button should have rounded edges */
  rounded?: boolean;

  /** (boolean) If true, disables actions and puts button into a 'pending' state */
  pending?: boolean;
}

export interface IButton {
  focus: () => void;
  blur: () => void;
}

const ButtonRef: React.RefForwardingComponent<IButton, IButtonProps> = (
  props,
  ref
) => {
  const {
    onClick,
    leftIcon,
    rightIcon,
    className,
    rounded,
    pending,
    disabled,
    type,
    children,
    ...attrs
  } = props;

  const buttonRef = React.useRef<HTMLButtonElement>();
  React.useImperativeHandle(
    ref,
    () => ({
      focus: () => {
        if (buttonRef.current) {
          buttonRef.current.focus();
        }
      },
      blur: () => {
        if (buttonRef.current) {
          buttonRef.current.blur();
        }
      }
    }),
    [buttonRef.current]
  );

  const handleClick = React.useCallback(
    e => {
      if (onClick && !pending) {
        onClick(e);
      }
    },
    [onClick, pending]
  );

  const classes = ClassHelpers.classNames("btn", className, {
    rounded,
    "icon-button-left": leftIcon !== undefined,
    "icon-button-right": rightIcon !== undefined,
    pending
  });

  const isIconButton = React.useMemo(
    () => !children && (!!leftIcon || !!rightIcon) && !(leftIcon && rightIcon),
    [leftIcon, children, rightIcon]
  );

  return (
    <button
      ref={buttonRef}
      data-is-icon-button={isIconButton}
      disabled={pending || disabled}
      type={type || "button"}
      onClick={handleClick}
      {...attrs}
      className={classes}
    >
      {leftIcon &&
        getIconOrJsx(leftIcon, { className: "left-icon" }, icon => (
          <div className="left-icon">{icon}</div>
        ))}
      {children}
      {rightIcon &&
        getIconOrJsx(rightIcon, { className: "right-icon" }, icon => (
          <div className="right-icon">{icon}</div>
        ))}
    </button>
  );
};

export const Button = React.forwardRef(ButtonRef);
