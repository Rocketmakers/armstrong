import * as React from "react";

import * as _ from "underscore";
import { TSortDirection } from "../components/tables/tableHeader";

export interface IUseDataTableProps<T> {
  data: T[];
}

export interface IUseDataTableResult<T> {
  data: T[];
}

interface IUseDataTableState<T> {
  currentPage: number;
  data: T[];
  itemsPerPage: number;
  sortParameters: { sortColumn: string; sortDirection: TSortDirection };
  totalItems: number;
  totalPages: number;
}

export interface IUseDataTableSettings<T> {
  data?: T[];
  fetch?(): Promise<IUseDataTableResult<T>>;
  initialSortBy?: keyof T;
  itemsPerPage?: number;
}

const initialState = <T>(): IUseDataTableState<T> => ({
  currentPage: undefined,
  data: [],
  itemsPerPage: undefined,
  sortParameters: { sortColumn: "id", sortDirection: "desc" },
  totalItems: undefined,
  totalPages: undefined,
});

export function useDataTable<T>(settings: IUseDataTableSettings<T>) {
  const [state, setState] = React.useState<IUseDataTableState<T>>(
    initialState(),
  );
  const [storedData, setStoredData] = React.useState<T[]>([]);

  const [isFetching, setIsFetching] = React.useState(false);

  const fetcher = React.useCallback(() => {
    setIsFetching(true);
    settings
      .fetch()
      .then(v => {
        const noReturnedItems = !v.data || v.data.length === 0;
        const items = (!noReturnedItems && v.data) || [];
        const itemsPerPage =
          (settings.itemsPerPage && settings.itemsPerPage) || 5;

        setStoredData(items);

        const { totalPages } = calculatePagination(
          items.length,
          itemsPerPage,
          1,
        );
        setState(oldState => ({
          ...oldState,
          data: items.slice(0, itemsPerPage),
          totalPages,
          totalItems: items.length,
          itemsPerPage,
        }));
        setIsFetching(false);
      })
      .catch(error => {
        // setState({ ...state, error });
        setIsFetching(false);
      });
  }, [state]);

  /**
   * Calculate the pagination parameters
   * @param totalItems : total length of the data array
   * @param itemsPerPage : max number of items per page
   * @param currentPage : current page number
   */
  // ---------------------------------------------------------
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

  /**
   * Sort the Data dependent on the criteria
   * @param key : which key to sort by
   * @param direction : which direction
   * @param currentPage : (optional) current page
   */
  // ---------------------------------------------------------
  const sort = (
    key: string,
    direction: TSortDirection,
    currentPage?: number,
  ) => {
    const { startIndex, endIndex } = calculatePagination(
      storedData.length,
      state.itemsPerPage,
      (currentPage && currentPage) || state.currentPage,
    );
    return direction === "asc"
      ? _.sortBy(storedData, key)
          .reverse()
          .slice(startIndex, endIndex)
      : _.sortBy(storedData, key).slice(startIndex, endIndex);
  };

  /**
   * On Mount Hook
   */
  // ---------------------------------------------------------
  React.useEffect(() => {
    const itemsPerPage = (settings.itemsPerPage && settings.itemsPerPage) || 5;
    if (settings.data) {
      setStoredData(settings.data);
      const { totalPages } = calculatePagination(
        storedData.length,
        itemsPerPage,
        1,
      );

      setState(oldState => ({
        ...oldState,
        data: storedData.slice(0, itemsPerPage),
        itemsPerPage,
        totalPages,
        currentPage: 1,
      }));
    } else if (settings.fetch) {
      fetcher();
    }
  }, []);

  /**
   * Sort by Callback
   * @param key : which key to sort by
   * @param direction : which direction
   */
  // ---------------------------------------------------------
  const sortDataBy = React.useCallback(
    (key: string, direction: TSortDirection) => {
      setState(oldState => ({
        ...oldState,
        data: sort(key, direction),
        sortParameters: { sortColumn: key, sortDirection: direction },
      }));
    },
    [state],
  );

  /**
   * Set max items Callback
   * @param itemsPerPage : max items per page
   */
  // ---------------------------------------------------------
  const setItemsPerPage = React.useCallback(
    (itemsPerPage: number) => {
      const sItemsPerPage =
        itemsPerPage !== 0 ? itemsPerPage : storedData.length;
      const { totalPages } = calculatePagination(
        storedData.length,
        sItemsPerPage,
        state.currentPage,
      );

      setState(oldState => ({
        ...oldState,
        data: storedData.slice(0, sItemsPerPage),
        itemsPerPage: sItemsPerPage,
        totalPages,
        currentPage: 1,
      }));
    },
    [state],
  );

  /**
   * Set the desired page Callback
   * @param currentPage : desired page
   */
  // ---------------------------------------------------------
  const setPage = React.useCallback(
    (currentPage: number) => {
      setState(oldState => ({
        ...oldState,
        data: sort(
          state.sortParameters.sortColumn,
          state.sortParameters.sortDirection,
          currentPage,
        ),
        currentPage,
      }));
    },
    [state],
  );

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
