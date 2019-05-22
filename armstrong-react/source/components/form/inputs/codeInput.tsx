import * as React from "react";
import { ClassHelpers } from "../../../index";
import { IFormInputHTMLProps } from "../form";
import { DataValidationMessage } from "../formCore";
import { ValidationLabel } from "../validationWrapper";
import { Utils } from '../../../utilities/utils';
import { useForm } from '../formHooks';

export interface ICodeInputProps extends IFormInputHTMLProps {
  lengthPerBox?: number[];
  change?: (value: string | number) => void;
  value?: string;
  placeholder?: string;
  type?: string;
  numeric?: boolean;
  readonly?: boolean;
}

function calcTabIndex(tabIndex: number | undefined, fieldIndex: number) {
  if (tabIndex === undefined || tabIndex === -1) {
    return tabIndex;
  }
  return tabIndex + fieldIndex;
}

//const formData = {}
export const CodeInput: React.FC<ICodeInputProps> = props => {

  const { change, validationMode, lengthPerBox, numeric, type, className, tabIndex, value, placeholder, readonly } = props;

  const inputs = React.useRef<HTMLInputElement[]>([])

  const codeLength = React.useMemo(() => Utils.reduce(lengthPerBox, (memo, num) => memo + num, 0), [lengthPerBox])

  const [focusIndex, setFocusIndex] = React.useState<number>(null)

  const storedKey = React.useRef<string>(null);

  const buildValue = React.useCallback(() => {
    let code: string | number = "";
    Utils.each(inputs.current, (i) => {
      code += i.value.toUpperCase();
    });
    if (code.length !== codeLength) {
      return
    }
    if (code === value) {
      return
    }
    if (numeric) {
      code = parseInt(code, 10);
    }
    if (change) {
      change(code);
    }
  }, [lengthPerBox, change, numeric, codeLength])

  const onKeyUpFocusNext = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    let movingBack = false;
    const current = e.target as HTMLInputElement;
    let el: HTMLInputElement;
    let currentVal = current.value.trim();
    const lpb = lengthPerBox[focusIndex];
    let retFromStore = false;
    currentVal = currentVal.slice(0, lpb);
    if (e.keyCode === 8) {
      movingBack = true;
      if (currentVal.length === 0) {
        el = current.previousSibling as HTMLInputElement;
      } else {
        el = current;
      }
    } else {
      el = current.nextSibling as HTMLInputElement;
      if (
        storedKey.current && el && !el.value) {
        el.value = storedKey.current;

        storedKey.current = null;
        retFromStore = true;
      }
    }
    if (currentVal.length < lpb && !movingBack) {
      return;
    }
    if (el) {
      el.focus();
      if (el && el.value && !movingBack && !retFromStore) {
        el.select()
        //el.value = "";
      }
    }

    buildValue();
  }, [lengthPerBox, focusIndex, storedKey, buildValue])

  const handlePaste = React.useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
    let pasted: string = e.clipboardData.getData("text/plain").replace(/\s/g, "");
    pasted = pasted.substr(0, codeLength).toUpperCase();

    if (numeric) {
      const parsed = parseInt(pasted, 10);
      if (isNaN(parsed)) {
        e.preventDefault();
        return false;
      }
    }

    const splitArray = [];
    let currentIndex = 0;
    Utils.each(lengthPerBox, (lpb, idx) => {
      const chunk = pasted.substr(currentIndex, lpb);
      currentIndex += lpb;
      splitArray.push(chunk);
      inputs.current[idx].value = chunk;
    });

    buildValue();
  }, [lengthPerBox, buildValue, numeric, codeLength])

  const handleFocus = React.useCallback((index: number) => () => {
    setFocusIndex(index)
    storedKey.current = null;
  }, [storedKey])

  const keyDown = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    // console.log(e.key)
    const lpb = lengthPerBox[focusIndex];
    const selectionLength = window.getSelection().toString().length;
    if (selectionLength === lpb) {
      return;
    }

    if (e.currentTarget.value.length === lpb) {
      if (e.keyCode >= 48 && e.keyCode <= 57) {
        storedKey.current = e.key;
      }
      if (e.keyCode >= 65 && e.keyCode <= 90) {
        storedKey.current = e.key;
      }
    }
  }, [lengthPerBox, focusIndex, storedKey])

  const handleClick = React.useCallback((e: React.MouseEvent<HTMLInputElement>) => {
    if (e.currentTarget.value) {
      e.currentTarget.select();
    }
  }, [])

  React.useEffect(() => {
    if (value) {
      let currentIndex = 0;
      Utils.each(lengthPerBox, (lpb, i) => {
        inputs.current[i].value = value.substr(currentIndex, lpb);
        currentIndex += lpb;
      });
    }
  }, [])

  const validationMessage = DataValidationMessage.get(props);
  const classes = React.useMemo(() => ClassHelpers.classNames("armstrong-input", "code-input",
    className, {
      "show-validation": validationMode !== "none" && validationMessage,
    }), [className, validationMode, validationMessage]);

  //const { DataForm, bind } = useForm(dateState)

  return (
    <div className={classes}>
      <div>
        {
          lengthPerBox.map((lpb, i) => (
            <input
              ref={r => inputs.current[i] = r}
              className="code-input-field"
              tabIndex={calcTabIndex(tabIndex, i)}
              key={i}
              type={type || "text"}
              placeholder={placeholder}
              maxLength={lpb}
              readOnly={readonly}
              onClick={handleClick}
              onFocus={handleFocus(i)}
              onKeyUp={onKeyUpFocusNext}
              onKeyDown={keyDown}
              onPaste={handlePaste}
              onChange={buildValue}
            />
          ))}
      </div>
      <ValidationLabel message={validationMessage} mode={validationMode} />
    </div>
  );
}

CodeInput.defaultProps = {
  lengthPerBox: [2, 2, 2],
  validationMode: "none",
}
