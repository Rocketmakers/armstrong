import * as React from "react";
import { arrayToggleItem } from "./arrayItems";

export interface IAutoCompleteOption {
  id: number | string;
  name: string;
  data?: any;
  className?: string;
  style?: React.CSSProperties;
  prefixElement?: JSX.Element;
}

export function useThrottle<TValue>(value: TValue, limit: number, onValueChange?: (value: TValue) => void) {
  const [throttledValue, setThrottledValue] = React.useState(value);
  const lastRan = React.useRef(Date.now());

  React.useEffect(
    () => {
      const handler = setTimeout(() => {
        if (Date.now() - lastRan.current >= limit) {
          setThrottledValue(value);
          if (onValueChange) { onValueChange(value) }
          lastRan.current = Date.now();
        }
      }, limit - (Date.now() - lastRan.current));

      return () => {
        clearTimeout(handler);
      };
    },
    [value, limit]);

  return throttledValue;
}

export function useRemoteOptions(remoteQuery?: (query: string) => Promise<IAutoCompleteOption[]>) {
  const [options, setOptions] = React.useState<IAutoCompleteOption[]>([])
  const [filter, setFilter] = React.useState("")
  const onFilterChanged = React.useCallback((query: string) => {
    remoteQuery(query).then(opts => setOptions(opts)).catch(e => {
      // tslint:disable-next-line: no-console
      console.log("Unable to perform query");
    })
  }, [remoteQuery])
  useThrottle(filter, 2000, onFilterChanged)
  return { options, filter, setFilter }
}

interface IAutoCompleteProps<TValue> {
  filter: string
  onFilterChange: (v: string) => void
  options: IAutoCompleteOption[]
  value: TValue
  onValueChange: (o: TValue) => void
}

type IAutoCompleteSelectProps<TM extends "single" | "multiple", TO> = { multiSelect: TM } & IAutoCompleteProps<TO>

export const AutoComplete: React.FunctionComponent<IAutoCompleteSelectProps<"single", IAutoCompleteOption> | IAutoCompleteSelectProps<"multiple", IAutoCompleteOption[]>> = p => {
  if (p.multiSelect === "multiple") {
    return <AutoCompleteMultiInput {...p} />
  }
  return <AutoCompleteSingleInput {...p} />
}

export const AutoCompleteSingleInput: React.FunctionComponent<IAutoCompleteProps<IAutoCompleteOption>> = p => {
  const { filter, onFilterChange, options, value, onValueChange } = p
  return (
    <>
      <input value={filter} onChange={e => onFilterChange(e.currentTarget.value)} />
      <div>{value && <span onClick={() => onValueChange(undefined)}>{value.name}</span>}</div>
      <ul>
        {options.map(o => <li key={o.id} onClick={() => onValueChange(value && value.id === o.id ? undefined : o)}>{o.name}</li>)}
      </ul>
    </>
  )
}

export const AutoCompleteMultiInput: React.FunctionComponent<IAutoCompleteProps<IAutoCompleteOption[]>> = p => {
  const { filter, onFilterChange, options, value, onValueChange } = p
  return (
    <>
      <div>
        {value && value.length > 0 && value.map((o, i) => <span onClick={() => onValueChange(arrayToggleItem(value, o))} key={o.id}>{o.name}</span>)}
        <span><input value={filter} onChange={e => onFilterChange(e.currentTarget.value)} /></span>
      </div>
      <ul>
        {options.map(o => <li key={o.id} onClick={() => onValueChange(arrayToggleItem(value, o))}>{o.name}</li>)}
      </ul>
    </>
  )
}
