import * as React from "react";
import { ClassHelpers } from "../../../index";
import { KeyCodes } from "../../../utilities/keyCodes";
import { utils } from "../../../utilities/utils";
import { DataValidationMessage, DataValidationMode } from "../formCore";
import { useForm } from "../formHooks";
import { ValidationLabel } from "../validationWrapper";

export interface ICodeInputProps extends React.HTMLAttributes<HTMLElement> {
  lengthPerBox?: number[];
  onCodeChange?: (value: string | number) => void;
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

function getBindingName(index: number) {
  return `code_${index}`
}
const formData = {}
export const CodeInput: React.FC<ICodeInputProps> = props => {

  const { DataForm, bind, dataBinder, notifyChange } = useForm(formData)

  const { onCodeChange, lengthPerBox, numeric, type, className, tabIndex, value, placeholder, readonly } = props;

  const codeLength = React.useMemo(() => utils.array.reduce(lengthPerBox, (memo, num) => memo + num, 0), [lengthPerBox])

  const [focusIndex, setFocusIndex] = React.useState<number>(null)
  const [code, setCode] = React.useState<string>("")

  const storedKey = React.useRef<string>(null);

  const buildValue = React.useCallback(() => {
    let codeCandidate: string | number = "";
    utils.array.each(lengthPerBox, (lpb, idx) => {
      const val = dataBinder.getValue(getBindingName(idx))
      codeCandidate += val ? val.toUpperCase() : "";
    });
    if (codeCandidate.length !== codeLength) {
      return
    }
    if (codeCandidate === code) {
      return
    }
    setCode(codeCandidate)
    if (numeric) {
      codeCandidate = parseInt(codeCandidate, 10);
    }
    if (onCodeChange) {
      onCodeChange(codeCandidate);
    }
  }, [lengthPerBox, onCodeChange, numeric, codeLength])

  const onKeyUpFocusNext = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    let movingBack = false;
    const current = e.target as HTMLInputElement;
    let el: HTMLInputElement;
    let currentVal = current.value.trim();
    const lpb = lengthPerBox[focusIndex];
    let retFromStore = false;
    currentVal = currentVal.slice(0, lpb);
    if (e.keyCode === KeyCodes.backspace) {
      movingBack = true;
      if (currentVal.length === 0) {
        el = current.previousSibling as HTMLInputElement;
      } else {
        el = current;
      }
    } else {
      el = current.nextSibling as HTMLInputElement;
      if (storedKey.current && el && !el.value) {
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
        // el.value = "";
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
    utils.array.each(lengthPerBox, (lpb, idx) => {
      const chunk = pasted.substr(currentIndex, lpb);
      currentIndex += lpb;
      splitArray.push(chunk);
      dataBinder.setValue(getBindingName(idx), chunk);
      // inputs.current[idx].value = chunk;
    });

    buildValue();
  }, [lengthPerBox, buildValue, numeric, codeLength])

  const handleFocus = React.useCallback((index: number) => () => {
    setFocusIndex(index)
    storedKey.current = null;
  }, [storedKey])

  const keyDown = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    const lpb = lengthPerBox[focusIndex];
    const selectionLength = window.getSelection().toString().length;
    if (selectionLength === lpb) {
      return;
    }

    if (e.currentTarget.value.length === lpb) {
      if (e.keyCode >= KeyCodes.key_0 && e.keyCode <= KeyCodes.key_9) {
        storedKey.current = e.key;
      }
      if (e.keyCode >= KeyCodes.key_a && e.keyCode <= KeyCodes.key_z) {
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
      utils.array.each(lengthPerBox, (lpb, idx) => {
        dataBinder.setValue(getBindingName(idx), value.substr(currentIndex, lpb));
        // inputs.current[i].value = ;
        currentIndex += lpb;
      });
      notifyChange()
    }
  }, [])

  const validationMessage = DataValidationMessage.get(props);
  const validationMode = DataValidationMode.get(props)

  const classes = React.useMemo(() => ClassHelpers.classNames("armstrong-input", "code-input",
    className, {
      "show-validation": validationMode !== "none" && validationMessage,
    }), [className, validationMode, validationMessage]);

  return (
    <div className={classes}>
      <DataForm onDataChanged={buildValue} className={classes}>
        {
          lengthPerBox.map((lpb, i) => (
            <input
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
              {...bind.text(getBindingName(i) as any)}
            />
          ))}
      </DataForm>
      <ValidationLabel message={validationMessage} mode={validationMode} />
    </div>
  );
}

CodeInput.defaultProps = {
  lengthPerBox: [2, 2, 2],
}
