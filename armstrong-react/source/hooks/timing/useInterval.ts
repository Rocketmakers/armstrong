import * as React from "react";

export const useInterval = (callback: () => void, interval: number) => {
  const intervalRef = React.useRef<number>();

  React.useEffect(() => {
    intervalRef.current = window.setInterval(callback, interval);

    return () => clearInterval(intervalRef.current);
  }, [callback, interval]);
};
