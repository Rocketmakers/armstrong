import * as React from "react";
import { useThrottle } from "../../../hooks/useThrottle";
import { utils } from "../../../utilities/utils";

export interface IAutoCompleteOption {
  id: number | string;
  name: string;
  data?: any;
  className?: string;
  style?: React.CSSProperties;
  prefixElement?: React.ReactNode;
}

export function useOptions(allOptions: IAutoCompleteOption[]) {
  const [options, setOptions] = React.useState<IAutoCompleteOption[]>([])
  const [filter, onFilterChanged] = React.useState("")
  const setFilter = React.useCallback((query: string) => {
    onFilterChanged(query)
    setOptions(utils.array.filter(allOptions, o => o.name.toLowerCase().indexOf(query.toLowerCase()) > -1))
  }, [allOptions])
  return { options, filter, setFilter }
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

export interface IAutoCompleteProps<TValue> {
  disabled?: boolean
  hasGoButton?: boolean
  goButtonContent?: React.ReactNode
  canClear?: boolean
  className?: string
  isSearching?: boolean
  filter: string
  onFilterChange: (v: string) => void
  options: IAutoCompleteOption[]
  value: TValue
  onValueChange: (o: TValue) => void
  placeholder?: string
  visibleItems?: number
  noResultsMessage?: string
  leftIcon?: string;
}
