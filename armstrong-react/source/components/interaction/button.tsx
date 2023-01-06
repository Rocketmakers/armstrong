import * as React from "react";
import { ClassHelpers } from "../../utilities/classHelpers";
import { getIconOrJsx, IconOrJsx } from "./../display/icon";
import { useConfirmDialogProvider, IDialogProviderProps } from "../display/dialogProvider";

export interface IButtonConfirmDialog {
  /** (string) Text to show in the body of the dialog - defaults to Are you sure? */
  content: string;

  /** (string) Content of the confirm button - defaults to confirm */
  confirmText?: string;

  /** (string) Content of the cancel button - defaults to cancel */
  cancelText?: string;
}

export type ButtonConfirmDialog = IButtonConfirmDialog | React.FC<IDialogProviderProps<boolean, void>>;

const isIButtonConfirmDialog = (dialogProps: ButtonConfirmDialog): dialogProps is IButtonConfirmDialog =>
  !!dialogProps && !!(dialogProps as IButtonConfirmDialog).content;

export const useButtonConfirmDialog = (config: ButtonConfirmDialog) =>
  useConfirmDialogProvider(
    isIButtonConfirmDialog(config)
      ? ({ choose }) => {
          if (!config) {
            return;
          }
          return (
            <>
              <p>{config.content}</p>

              <div className="confirm-dialog-buttons">
                <Button onClick={() => choose(false)}>{config.cancelText || "cancel"}</Button>

                <Button onClick={() => choose(true)}>{config.confirmText || "confirm"}</Button>
              </div>
            </>
          );
        }
      : config,
    { className: "button-confirm-dialog" }
  );

export interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** (string) An icon to show on the left of the buttons content */
  leftIcon?: IconOrJsx;

  /** (string) An icon to show on the right of the buttons content */
  rightIcon?: IconOrJsx;

  /** (boolean) Wether or not the button should have rounded edges */
  rounded?: boolean;

  /** (boolean) If true, disables actions and puts button into a 'pending' state */
  pending?: boolean;

  /** (objct) If defined, will pop up a confirmation dialog - must be within a DialogProvider for this to work */
  confirmDialog?: boolean | ButtonConfirmDialog;

  /** (1 | 2 | 3) Level of danger of this button, displayed through colour. 1 is normal, 2 colours with $color-warning, and 3 colours with $color-negative */
  dangerLevel?: 1 | 2 | 3;
}

export interface IButton {
  focus: () => void;
  blur: () => void;
}

const ButtonRef: React.ForwardRefRenderFunction<IButton, IButtonProps> = (props, ref) => {
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
    confirmDialog,
    dangerLevel,
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

  const openConfirmDialog = useButtonConfirmDialog(typeof confirmDialog === "boolean" ? { content: "Are you sure?" } : confirmDialog);

  const handleClick = React.useCallback(
    async e => {
      if (onClick && !pending) {
        if (!confirmDialog || (await openConfirmDialog())) {
          onClick(e);
        }
      }
    },
    [onClick, pending, openConfirmDialog]
  );

  const classes = ClassHelpers.classNames("btn", className, {
    rounded,
    "icon-button-left": leftIcon !== undefined,
    "icon-button-right": rightIcon !== undefined,
    pending
  });

  const isIconButton = React.useMemo(() => !children && (!!leftIcon || !!rightIcon) && !(leftIcon && rightIcon), [
    leftIcon,
    children,
    rightIcon
  ]);

  return (
    <button
      ref={buttonRef}
      data-is-icon-button={isIconButton}
      data-danger-level={dangerLevel}
      disabled={pending || disabled}
      type={type || "button"}
      onClick={handleClick}
      {...attrs}
      className={classes}
    >
      {leftIcon && getIconOrJsx(leftIcon, { className: "left-icon" }, icon => <div className="left-icon">{icon}</div>)}
      {children}
      {rightIcon && getIconOrJsx(rightIcon, { className: "right-icon" }, icon => <div className="right-icon">{icon}</div>)}
    </button>
  );
};

export const Button = React.forwardRef(ButtonRef);

Button.defaultProps = {
  dangerLevel: 1
};
