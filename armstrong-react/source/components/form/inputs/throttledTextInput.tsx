import * as React from "react";
import { TextInput, ITextInputProps } from "./textInput";

export type IThrottledTextInputProps = ITextInputProps & {
  /**(number) Amount of time to wait after the user has stopped typing before sending onChange */
  waitForMilliseconds?: number;
};

export const ThrottledTextInput: React.FC<IThrottledTextInputProps> = props => {
  const { value, onChange, waitForMilliseconds, ...root } = props;

  const [realValue, setRealValue] = React.useState(value);

  const onRootChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setRealValue(e.currentTarget.value);
    },
    [setRealValue]
  );

  const sendValue = React.useCallback(() => {
    if (realValue !== value) {
      onChange({ currentTarget: { value: realValue }, target: { value: realValue } } as any);
    }
  }, [realValue, onChange]);

  React.useEffect(() => {
    if (realValue !== value) {
      const handler = setTimeout(sendValue, waitForMilliseconds);
      return () => clearTimeout(handler);
    }
    return () => {};
  }, [realValue]);

  React.useEffect(() => {
    setRealValue(value);
  }, [value]);

  return <TextInput value={realValue} onChange={onRootChange} {...root} />;
};

ThrottledTextInput.defaultProps = {
  waitForMilliseconds: 500
};
