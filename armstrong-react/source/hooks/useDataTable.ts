import * as React from "react";

import * as _ from "underscore";
import { TSortDirection } from "../components/tables/tableHeader";

export interface IUseDataTableProps<T> {
  data: T[];
}

interface IUseDataTableState<T> {
  data: T[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

export interface IUseDataTableSettings<T> {
  data: T[];
  itemsPerPage?: number;
}

const initialState = <T>(): IUseDataTableState<T> => ({
  data: [],
  currentPage: undefined,
  totalItems: undefined,
  totalPages: undefined,
});

export function useDataTable<T>(settings: IUseDataTableSettings<T>) {
  const [state, setState] = React.useState<IUseDataTableState<T>>(
    initialState(),
  );

  React.useEffect(() => {
    setState(oldState => ({
      ...oldState,
      data:
        (settings.itemsPerPage &&
          settings.data.slice(0, settings.itemsPerPage)) ||
        settings.data,
    }));
  }, []);

  const sortDataBy = React.useCallback(
    (key: string, direction: TSortDirection) => {
      direction === "asc"
        ? setState(oldState => ({
            ...oldState,
            data: _.sortBy(state.data, key).reverse(),
          }))
        : setState(oldState => ({
            ...oldState,
            data: _.sortBy(state.data, key),
          }));
    },
    [settings],
  );

  const onChangeItemsPerPage = React.useCallback(
    (itemsPerPage: number) => {
      setState(oldState => ({
        ...oldState,
        data: settings.data.slice(
          0,
          itemsPerPage === 0 ? settings.data.length : itemsPerPage,
        ),
      }));
    },
    [state],
  );

  const filterDataBy = React.useCallback((query: string) => {}, [settings]);

  return {
    currentPage: state.currentPage,
    data: state.data,
    onChangeItemsPerPage,
    sortDataBy,
    totalItems: state.totalItems,
    totalPages: state.totalPages,
  };
}
