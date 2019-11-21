import * as React from "react";
import { ClassHelpers } from "../../../index";
import { KeyCodes } from "../../../utilities/keyCodes";
import { utils } from "../../../utilities/utils";
import { DataValidationMessage, DataValidationMode } from "../formCore";
import { useForm } from "../formHooks";
import { ValidationLabel } from "../validationWrapper";

export interface ICodeInputProps extends React.HTMLAttributes<HTMLElement> {
  /** An array of lengths of each input in the code */
  lengthPerBox?: number[];

  /** Callback to fire when the value changes */
  onCodeChange?: (value: string | number) => void;

  /** Current value of the code */
  value?: string | number;

  /** A placeholder to display in each input */
  placeholder?: string;

  /** Render the value of the input as a password */
  hideValue?: boolean;

  /** Override the type property of the input elements (overrides hideValue prop) */
  type?: string;

  /** Restrict to numeric values */
  numeric?: boolean;

  /** Disable the inputs */
  readonly?: boolean;

  /** Automatically focus on the first input element */
  autoFocus?: boolean;
}

function calcTabIndex(tabIndex: number | undefined, fieldIndex: number) {
  if (tabIndex === undefined || tabIndex === -1) {
    return tabIndex;
  }
  return tabIndex + fieldIndex;
}

function getBindingName(index: number) {
  return `code_${index}`;
}
const formData = {};

/** An input which binds to a single string or numeric value, seperated into multiple inputs, with focus moving automatically between them. */

export const CodeInput: React.FC<ICodeInputProps> = props => {
  const { DataForm, bind, dataBinder, notifyChange } = useForm(formData);

  const { onCodeChange, lengthPerBox, numeric, hideValue, className, tabIndex, value, placeholder, readonly, autoFocus, type } = props;

  /** the total length of the code, based on the total of lengthPerBox */

  const codeLength = React.useMemo(() => utils.array.reduce(lengthPerBox, (runningTotal, boxLength) => runningTotal + boxLength, 0), [
    lengthPerBox
  ]);

  /** Set values of the inputs */

  const setValues = React.useCallback(
    (newValue: string) => {
      /** index of the start of each substring */

      let currentIndex = 0;

      // loop through lengthPerBox array, set substrings to values in binder

      utils.array.each(lengthPerBox, (boxLength, i) => {
        const chunk = newValue.substr(currentIndex, boxLength);

        currentIndex += boxLength;

        dataBinder.setValue(getBindingName(i), chunk);
      });

      notifyChange();
    },
    [lengthPerBox, notifyChange]
  );

  const [focusIndex, setFocusIndex] = React.useState<number>(null);

  const storedKey = React.useRef<string>(null);

  /** Get the current full value from the form inputs */

  const getValue = React.useCallback(
    () =>
      lengthPerBox
        .map((_, i) => {
          const val = dataBinder.getValue(getBindingName(i));
          return val || "";
        })
        .join(""),
    []
  );

  /** Run onCodeChange callback with the combined values of each input */

  const buildValue = React.useCallback(() => {
    let codeCandidate: string | number = getValue();

    if (numeric) {
      codeCandidate = parseInt(codeCandidate, 10);
    }

    if (onCodeChange) {
      onCodeChange(codeCandidate);
    }
  }, [lengthPerBox, onCodeChange, numeric, codeLength]);

  /** If necessary, move focus to next input element on key up */

  const onKeyUpFocusNext = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const current = e.target as HTMLInputElement;
      const boxLength = lengthPerBox[focusIndex];
      const currentVal = current.value.trim().slice(0, boxLength);
      const movingBack = e.keyCode === KeyCodes.backspace;

      let element: HTMLInputElement;
      let retFromStore = false;

      if (movingBack) {
        if (currentVal.length === 0) {
          element = current.previousSibling as HTMLInputElement;
        } else {
          element = current;
        }
      } else {
        element = current.nextSibling as HTMLInputElement;

        if (storedKey.current && element && !element.value) {
          element.value = storedKey.current;
          storedKey.current = null;
          retFromStore = true;
        }
      }

      if (currentVal.length < boxLength && !movingBack) {
        return;
      }

      if (element) {
        element.focus();

        if (element.value && !movingBack && !retFromStore) {
          element.select();
          // el.value = "";
        }
      }

      buildValue();
    },
    [lengthPerBox, focusIndex, storedKey, buildValue]
  );

  /** On paste event, paste in value and move focus */

  const handlePaste = React.useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      let pasted: string = e.clipboardData.getData("text/plain").replace(/\s/g, "");

      pasted = pasted.substr(0, codeLength).toUpperCase();

      if (numeric) {
        const parsed = parseInt(pasted, 10);

        if (isNaN(parsed)) {
          e.preventDefault();
        }
      }

      setValues(pasted);
      buildValue();
    },
    [lengthPerBox, buildValue, numeric, codeLength]
  );

  const handleFocus = React.useCallback(
    (index: number) => () => {
      setFocusIndex(index);
      storedKey.current = null;
    },
    [storedKey]
  );

  const keyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const boxLength = lengthPerBox[focusIndex];
      const selectionLength = window.getSelection().toString().length;

      if (selectionLength === boxLength) {
        return;
      }

      if (e.currentTarget.value.length === boxLength) {
        if (e.keyCode >= KeyCodes.key_0 && e.keyCode <= KeyCodes.key_9) {
          storedKey.current = e.key;
        }
        if (e.keyCode >= KeyCodes.key_a && e.keyCode <= KeyCodes.key_z) {
          storedKey.current = e.key;
        }
      }
    },
    [lengthPerBox, focusIndex, storedKey]
  );

  /** Select contents of input on click */

  const handleClick = React.useCallback((e: React.MouseEvent<HTMLInputElement>) => {
    if (e.currentTarget.value) {
      e.currentTarget.select();
    }
  }, []);

  /** The current value as a string */

  const currentValue = React.useMemo(() => {
    if (typeof value === "string" || !value) {
      return value as string;
    }
    return value.toString();
  }, [value]);

  /** On changes to value set by prop, update the values of the form */

  React.useEffect(() => {
    if (currentValue !== getValue()) {
      setValues(currentValue);
    }
  }, [currentValue, getValue]);

  const validationMessage = DataValidationMessage.get(props);
  const validationMode = DataValidationMode.get(props);

  const classes = React.useMemo(
    () =>
      ClassHelpers.classNames("armstrong-input", "code-input", className, {
        "show-validation": validationMode !== "none" && validationMessage
      }),
    [className, validationMode, validationMessage]
  );

  return (
    <div className={classes}>
      <DataForm onDataChanged={buildValue} className={classes}>
        {lengthPerBox.map((boxLength, i) => (
          <input
            autoFocus={i === 0 && autoFocus}
            {...bind.text(getBindingName(i) as any)}
            className="code-input-field"
            tabIndex={calcTabIndex(tabIndex, i)}
            key={i}
            type={type || (hideValue ? "password" : "text")}
            placeholder={placeholder}
            maxLength={boxLength}
            readOnly={readonly}
            onClick={handleClick}
            onFocus={handleFocus(i)}
            onKeyUp={onKeyUpFocusNext}
            onKeyDown={keyDown}
            onPaste={handlePaste}
          />
        ))}
      </DataForm>
      <ValidationLabel message={validationMessage} mode={validationMode} />
    </div>
  );
};

CodeInput.defaultProps = {
  lengthPerBox: [2, 2, 2]
};
