import * as React from "react";

import { useDidUpdateEffect } from "../lifecycle/useDidUpdateEffect";
import { useWillUnmountEffect } from "../lifecycle/useWillUnmountEffect";

/**
 * Runs the callback after the given time in ms
 */

export const useTimeout = (
  /** The callback to run after the given time */
  callback: () => void,

  /** The time in ms to wait before running the callback */
  time: number,

  /** Set to true to allow changes to the callback to be respected when it's executed (by default, the callback will be run as it is when runTimeout is called) */
  updating: boolean = false
) => {
  const timeout = React.useRef<number>();
  const [resolved, setResolved] = React.useState(false);

  const clear = React.useCallback(() => {
    if (typeof window !== "undefined") {
      window.clearTimeout(timeout.current);
    } else {
      clearTimeout(timeout.current);
    }
  }, [timeout.current]);

  const set = React.useCallback(() => {
    if (updating) {
      if (typeof window !== "undefined") {
        timeout.current = window.setTimeout(() => setResolved(true), time);
      } else {
        timeout.current = (setTimeout(
          () => setResolved(true),
          time
        ) as any) as number;
      }
    } else {
      if (typeof window !== "undefined") {
        timeout.current = window.setTimeout(callback, time);
      } else {
        timeout.current = (setTimeout(callback, time) as any) as number;
      }
    }
  }, [callback, time, updating]);

  useDidUpdateEffect(() => updating && resolved && callback(), [resolved]);
  useWillUnmountEffect(clear);

  return {
    /** clear the timeout, stopping it from executing */
    clear,

    /** set the timeout callback */
    set
  };
};
