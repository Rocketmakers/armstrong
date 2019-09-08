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
  currentPage: 1,
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

  React.useMemo(() => {
    const itemsPerPage = (settings.itemsPerPage && settings.itemsPerPage) || 5;
    setState((oldState: IUseDataTableState<T>) => ({
      ...oldState,
      itemsPerPage,
      sortParameters: {
        sortColumn: settings.initialSortBy,
        sortDirection: "asc",
      },
    }));
  }, [settings.initialSortBy, settings.itemsPerPage]);

  /**
   * On Mount Hook
   */
  // ---------------------------------------------------------
  React.useEffect(() => {
    setStoredData(settings.data);
    const { totalPages } = calculatePagination(
      storedData.length,
      state.itemsPerPage,
      1,
    );

    setState((oldState: IUseDataTableState<T>) => ({
      ...oldState,
      data: storedData.slice(0, state.itemsPerPage),
      itemsPerPage: state.itemsPerPage,
      totalPages,
      currentPage: 1,
    }));
  }, [settings.data]);

  React.useEffect(() => {
    const fetchData = async () => {
      const res = await settings.fetch();
      return res.data && res.data.length > 0 ? res.data : [];
    };

    setIsLoading(true);
    fetchData()
      .then(async vData => {
        const newData = await vData;
        setIsLoading(false);

        await setStoredData(newData);

        const { totalPages } = await calculatePagination(
          newData.length,
          state.itemsPerPage,
          1,
        );

        await setState((oldState: IUseDataTableState<T>) => ({
          ...oldState,
          sortParameters: {
            sortColumn:
              (settings.initialSortBy && settings.initialSortBy) || undefined,
            sortDirection: "desc",
          },
          totalPages,
          totalItems: newData.length,
        }));

        setState((oldState: IUseDataTableState<T>) => ({
          ...oldState,
          data:
            (settings.initialSortBy &&
              sort(newData, settings.initialSortBy, "asc")) ||
            newData.slice(0, state.itemsPerPage),
        }));
      })
      .catch(error => {
        setState((oldState: IUseDataTableState<T>) => ({ ...oldState, error }));
        setIsLoading(false);
      });
  }, [settings.fetch, settings.initialSortBy, state.itemsPerPage]);

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
  const sort = React.useCallback(
    (d: T[], key: keyof T, direction: TSortDirection, currentPage?: number) => {
      const { startIndex, endIndex } = calculatePagination(
        d.length,
        state.itemsPerPage,
        state.currentPage,
      );
      const da =
        direction === "asc"
          ? _.sortBy(d, key.toString())
              .reverse()
              .slice(startIndex, endIndex)
          : _.sortBy(d, key.toString()).slice(startIndex, endIndex);
      return da;
    },
    [settings.initialSortBy, settings.itemsPerPage, state],
  );

  /**
   * Sort by Callback
   * @param key : which key to sort by
   * @param direction : which direction
   */
  // ---------------------------------------------------------
  const sortDataBy = React.useCallback(
    (key: keyof T, direction: TSortDirection) => {
      setState((oldState: IUseDataTableState<T>) => ({
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

      setState((oldState: IUseDataTableState<T>) => ({
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
      const { startIndex, endIndex } = calculatePagination(
        storedData.length,
        state.itemsPerPage,
        currentPage,
      );

      const newData = state.sortParameters.sortColumn
        ? sort(
            storedData,
            state.sortParameters.sortColumn,
            state.sortParameters.sortDirection,
            currentPage,
          )
        : storedData.slice(startIndex, endIndex);

      setState((oldState: IUseDataTableState<T>) => ({
        ...oldState,
        data: newData,
        currentPage,
      }));
    },
    [state, state.currentPage, state.itemsPerPage],
  );

  return {
    currentPage: state.currentPage,
    data: state.data,
    isLoading,
    setItemsPerPage,
    setPage,
    sortDataBy,
    sortParameters: state.sortParameters,
    totalItems: state.totalItems,
    totalPages: state.totalPages,
  };
}
