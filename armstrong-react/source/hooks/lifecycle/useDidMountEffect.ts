import * as React from "react"

export function useDidMountEffect(fn: React.EffectCallback) {
  React.useEffect(fn, []);
}
