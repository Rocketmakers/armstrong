import * as React from "react";
import { ClassHelpers } from "../../utilities/classHelpers";
import { getIconOrJsx } from '../display/icon';
import { IButtonProps } from './button';

interface IDropdownButtonOption {
  label: string | JSX.Element;
  onClick: () => void;
}

type BaseButtonProps = Omit<IButtonProps, 'onClick'>;

export interface IDropdownButtonProps extends BaseButtonProps {
  /** The options to show in the dropdown */
  options: IDropdownButtonOption[];
  /** Wether to show the dropdown menu pinned to the left or right of the button */
  alignment?: "left" | "right";
}


export interface IDropdownButton {
  focus: () => void;
  blur: () => void;
}

const DropdownButtonRef: React.ForwardRefRenderFunction<IDropdownButton, IDropdownButtonProps> = (props, ref) => {
  const {
    leftIcon,
    rightIcon,
    className,
    rounded,
    pending,
    disabled,
    type,
    children,
    dangerLevel,
    options,
    ...attrs
  } = props;

  const [isOpen, setIsOpen] = React.useState(false);

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


  const classes = ClassHelpers.classNames("btn", "dd-btn", className, {
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

  const handleOptionClick = React.useCallback((handler: () => void) => {
    setIsOpen(false);
    handler();
  }, [props.options])

  const handleClick = React.useCallback((e: MouseEvent) => {
    if (buttonRef.current && !buttonRef.current.contains(e.target as Node)){
      setIsOpen(false)
    }
  }, [buttonRef])

  React.useEffect(()=>{
    document.addEventListener('mousedown', e => handleClick(e), false);
    return document.removeEventListener('mousedown', e => handleClick(e), false);
  }, [])

  return (
    <>
      <button
        ref={buttonRef}
        data-is-icon-button={isIconButton}
        data-danger-level={dangerLevel}
        disabled={pending || disabled}
        type={type || "button"}
        {...attrs}
        className={classes}
        onClick={() => setIsOpen(!isOpen)}
      >
        {leftIcon && getIconOrJsx(leftIcon, { className: "left-icon" }, icon => <div className="left-icon">{icon}</div>)}
        {children}
        {rightIcon && getIconOrJsx(rightIcon, { className: "right-icon" }, icon => <div className="right-icon">{icon}</div>)}

        {isOpen && 
        <div className="dd-btn-list" data-align={props.alignment}>
          {props.options.map(op =>
            <div onClick={() => handleOptionClick(op.onClick)}>{op.label}</div>
          )}
        </div>
      }
      </button>
     
    </>
  );
};

export const DropdownButton = React.forwardRef(DropdownButtonRef);

DropdownButton.defaultProps = {
  dangerLevel: 1,
  alignment: "left"
};
