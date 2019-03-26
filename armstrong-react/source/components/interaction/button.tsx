import * as React from "react";
import * as _ from "underscore";
import { ClassHelpers } from "../../utilities/classHelpers";
import { Icon } from "./../display/icon";

export interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** (string) An icon to show on the left of the buttons content */
  leftIcon?: string;
  /** (string) An icon to show on the right of the buttons content */
  rightIcon?: string;
  /** (boolean) Wether or not the button should have rounded edges */
  rounded?: boolean;
  /** (boolean) If true, disables actions and puts button into a 'pending' state */
  pending?: boolean;
}

export interface IButtonRef { focus: () => void, blur: () => void }

function ButtonRef(props: IButtonProps, ref: React.Ref<IButtonRef>) {
  const { onClick, leftIcon, rightIcon, className, rounded, pending, disabled, type, children, ...attrs } = props

  const buttonRef = React.useRef<HTMLButtonElement>()
  React.useImperativeHandle(ref, () => ({
    focus: () => {
      if (buttonRef) { buttonRef.current.focus() }
    },
    blur: () => {
      if (buttonRef) { buttonRef.current.blur() }
    },
  }))

  const handleClick = React.useCallback(e => {
    if (onClick && !pending) {
      onClick(e);
    }
  }, [onClick, pending])

  const classes = ClassHelpers.classNames(
    "btn",
    className,
    {
      "rounded": rounded,
      "icon-button-left": leftIcon !== undefined,
      "icon-button-right": rightIcon !== undefined,
      "pending": pending,
    },
  );
  return (
    <button ref={buttonRef} disabled={pending || disabled} type={type || "button"} onClick={handleClick} {...attrs} className={classes}>
      {leftIcon && <Icon className="left-icon" icon={leftIcon} />}
      {children}
      {rightIcon && <Icon className="right-icon" icon={rightIcon} />}
    </button>
  );

}

export const Button = React.forwardRef(ButtonRef)