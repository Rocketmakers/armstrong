import * as React from "react";

import { stat } from "fs";
import * as _ from "underscore";
import { TSortDirection } from "../components/tables/tableHeader";

export interface IUseDataTableProps<T> {
  data: T[];
}

interface IUseDataTableState<T> {
  data: T[];
  currentPage: number;
  itemsPerPage: number;
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
  itemsPerPage: undefined,
  totalItems: undefined,
  totalPages: undefined,
});

export function useDataTable<T>(settings: IUseDataTableSettings<T>) {
  const [state, setState] = React.useState<IUseDataTableState<T>>(
    initialState(),
  );

  const calculatePagination = (
    totalItems: number,
    itemsPerPage: number,
    currentPage: number,
  ) => {
    const startIndex: number = Math.ceil((currentPage - 1) * itemsPerPage);
    const endIndex: number = startIndex + itemsPerPage;
    const totalPages: number = Math.ceil(totalItems / itemsPerPage);

    return {
      totalPages,
      startIndex,
      endIndex,
    };
  };

  React.useEffect(() => {
    const itemsPerPage = (settings.itemsPerPage && settings.itemsPerPage) || 5;
    const { totalPages } = calculatePagination(
      settings.data.length,
      itemsPerPage,
      1,
    );

    setState(oldState => ({
      ...oldState,
      data: settings.data.slice(0, itemsPerPage),
      itemsPerPage,
      totalPages,
      currentPage: 1,
    }));
  }, []);

  const sortDataBy = React.useCallback(
    (key: string, direction: TSortDirection) => {
      setState(oldState => ({
        ...oldState,
        data:
          direction === "asc"
            ? _.sortBy(state.data, key).reverse()
            : _.sortBy(state.data, key),
      }));
    },
    [settings],
  );

  const setItemsPerPage = React.useCallback(
    (itemsPerPage: number) => {
      const { totalPages } = calculatePagination(
        settings.data.length,
        itemsPerPage,
        state.currentPage,
      );
      setState(oldState => ({
        ...oldState,
        data: settings.data.slice(0, itemsPerPage),
        itemsPerPage,
        totalPages,
        currentPage: 1,
      }));
    },
    [state],
  );

  const setPage = React.useCallback(
    (currentPage: number) => {
      const { endIndex, startIndex } = calculatePagination(
        settings.data.length,
        state.itemsPerPage,
        currentPage,
      );
      setState(oldState => ({
        ...oldState,
        data: settings.data.slice(startIndex, endIndex),
        currentPage,
      }));
    },
    [state],
  );

  const filterDataBy = React.useCallback((query: string) => {}, [settings]);

  return {
    currentPage: state.currentPage,
    data: state.data,
    setItemsPerPage,
    setPage,
    sortDataBy,
    totalItems: state.totalItems,
    totalPages: state.totalPages,
  };
}
