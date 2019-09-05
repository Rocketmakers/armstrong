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
  error: any;
  itemsPerPage: number;
  sortParameters: { sortColumn: keyof T; sortDirection: TSortDirection };
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
  error: undefined,
  itemsPerPage: undefined,
  sortParameters: { sortColumn: undefined, sortDirection: "desc" },
  totalItems: undefined,
  totalPages: undefined,
});

export function useDataTable<T>(settings: IUseDataTableSettings<T>) {
  const [state, setState] = React.useState<IUseDataTableState<T>>(
    initialState(),
  );
  const [storedData, setStoredData] = React.useState<T[]>([]);

  const [isLoading, setIsLoading] = React.useState(false);

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
  }, [settings.data, settings.fetch]);

  const fetcher = React.useCallback(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await settings.fetch();
        const items = res.data || [];
        const itemsPerPage =
          (settings.itemsPerPage && settings.itemsPerPage) || 5;

        if (items.length > 0) {
          await setStoredData(items);
          const { totalPages } = await calculatePagination(
            items.length,
            itemsPerPage,
            1,
          );

          console.log(storedData);

          setState((oldState: IUseDataTableState<T>) => ({
            ...oldState,
            data: sort(
              items,
              settings.initialSortBy,
              state.sortParameters.sortDirection,
            ),
            sortParameters: {
              sortColumn:
                (settings.initialSortBy && settings.initialSortBy) || undefined,
              sortDirection: "desc",
            },
            totalPages,
            totalItems: storedData.length,
            itemsPerPage: settings.itemsPerPage,
            currentPage: 1,
          }));
        }
        setIsLoading(false);
      } catch (error) {
        setState({ ...state, error });
        setIsLoading(false);
      }
    };
    fetchData();
  }, [settings.initialSortBy]);

  /**
   * Calculate the pagination parameters
   * @param totalItems : total length of the data array
   * @param itemsPerPage : max number of items per page
   * @param currentPage : current page number
   */
  // ---------------------------------------------------------
  const calculatePagination = React.useCallback(
    (totalItems: number, itemsPerPage: number, currentPage: number) => {
      const startIndex: number = Math.ceil((currentPage - 1) * itemsPerPage);
      const endIndex: number = startIndex + itemsPerPage;
      const totalPages: number = Math.ceil(totalItems / itemsPerPage);

      return {
        totalPages,
        startIndex,
        endIndex,
      };
    },
    [
      state.itemsPerPage,
      state.totalItems,
      settings.itemsPerPage,
      settings.data,
      settings.fetch,
    ],
  );

  /**
   * Sort the Data dependent on the criteria
   * @param key : which key to sort by
   * @param direction : which direction
   * @param currentPage : (optional) current page
   */
  // ---------------------------------------------------------
  const sort = (
    d: T[],
    key: keyof T,
    direction: TSortDirection,
    currentPage?: number,
  ) => {
    const { startIndex, endIndex } = calculatePagination(
      d.length,
      state.itemsPerPage,
      (currentPage && currentPage) || state.currentPage,
    );
    return direction === "asc"
      ? _.sortBy(d, key.toString())
          .reverse()
          .slice(startIndex, endIndex)
      : _.sortBy(d, key.toString()).slice(startIndex, endIndex);
  };

  /**
   * Sort by Callback
   * @param key : which key to sort by
   * @param direction : which direction
   */
  // ---------------------------------------------------------
  const sortDataBy = React.useCallback(
    (key: keyof T, direction: TSortDirection) => {
      setState(oldState => ({
        ...oldState,
        data: sort(storedData, key, direction),
        sortParameters: { sortColumn: key, sortDirection: direction },
      }));
    },
    [state, storedData],
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
          storedData,
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
    isLoading,
    setItemsPerPage,
    setPage,
    sortDataBy,
    totalItems: state.totalItems,
    totalPages: state.totalPages,
  };
}
