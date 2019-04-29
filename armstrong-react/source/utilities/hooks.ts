import * as React from "react"

export function useDidUpdateEffect(fn: React.EffectCallback, deps?: React.DependencyList) {
  const didMountRef = React.useRef(false);

  React.useEffect(() => {
    if (didMountRef.current) {
      fn();
    } else {
      didMountRef.current = true;
    }
  }, deps);
}
