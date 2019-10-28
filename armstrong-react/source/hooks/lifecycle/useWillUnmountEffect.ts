import * as React from "react";

export function useWillUnmountEffect(fn: React.EffectCallback) {
  React.useEffect(() => fn, []);
}
