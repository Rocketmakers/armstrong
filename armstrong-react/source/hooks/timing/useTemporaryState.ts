import * as React from "react";

/**
 * A hook to use a piece of state that lasts a certain time before running a callback and optionally returning back to its initial state
 * @param initialState The starting state
 * @param timeoutTime  The time for the change in state to last
 * @param callback The callback to run after the given time
 * @param reset Whether to reset back to inital state - true by default
 */

export const useTemporaryState = <T>(
  initialState: T,
  timeoutTime: number,
  callback?: () => any,
  reset: boolean = true
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [state, setState] = React.useState(initialState);
  const timeout = React.useRef<number>(null);

  React.useEffect(() => {
    if (state) {
      timeout.current = window.setTimeout(() => {
        if (!!callback) {
          callback();
        }
        if (reset) {
          timeout.current = window.setTimeout(() => {
            setState(initialState);
          }, 50);
        }
      }, timeoutTime);
    }
  }, [state]);

  React.useEffect(() => {
    return () => window.clearTimeout(timeout.current);
  }, []);

  return [state, setState];
};
