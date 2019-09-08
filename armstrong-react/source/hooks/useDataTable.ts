import * as React from "react";

import * as _ from "underscore";
import { TSortDirection } from "../components/tables/tableHeader";

export interface IUseDataTableProps<T> {
  data: T[];
}

export interface IUseDataTableResult<T> {
  data: T[];
}

export interface IDataTableOptions<T> {
  download?: boolean;
  filter?: boolean;
  paginate?: boolean;
  print?: boolean;
  rowsPerPage?: number;
  sort?: {
    initialSortBy?: keyof T;
  };
}

export interface IDataTableOptionsBar<T> extends IDataTableOptions<T> {
  onDownload?: () => void;
  onPrint?: () => void;
  onFilter?: () => void;
}

interface IUseDataTableState<T> {
  currentPage: number;
  data: T[];
  error: any;
  rowsPerPage: number;
  sortParameters: { sortColumn: keyof T; sortDirection: TSortDirection };
  totalRows: number;
  totalPages: number;
}

export interface IUseDataTableSettings<T> {
  data?: T[];
  fetch?(): Promise<IUseDataTableResult<T>>;
  options: IDataTableOptions<T>;
}

const initialState = <T>(): IUseDataTableState<T> => ({
  currentPage: 1,
  data: [],
  error: undefined,
  rowsPerPage: undefined,
  sortParameters: { sortColumn: undefined, sortDirection: "desc" },
  totalRows: undefined,
  totalPages: undefined,
});

export function useDataTable<T>({
  data,
  fetch,
  options,
}: IUseDataTableSettings<T>) {
  const [state, setState] = React.useState<IUseDataTableState<T>>(
    initialState(),
  );
  const [storedData, setStoredData] = React.useState<T[]>([]);

  const [isLoading, setIsLoading] = React.useState(false);

  React.useMemo(() => {
    const rowsPerPage = (options.rowsPerPage && options.rowsPerPage) || 5;
    setState((oldState: IUseDataTableState<T>) => ({
      ...oldState,
      rowsPerPage,
      sortParameters: {
        sortColumn: (options.sort && options.sort.initialSortBy) || undefined,
        sortDirection: "asc",
      },
    }));
  }, [
    options.sort && options.sort.initialSortBy && options.sort.initialSortBy,
    options.rowsPerPage,
  ]);

  /**
   * On Mount Hook
   */
  // ---------------------------------------------------------
  React.useEffect(() => {
    setStoredData(data);
    const { totalPages } = calculatePagination(
      storedData.length,
      state.rowsPerPage,
      1,
    );

    setState((oldState: IUseDataTableState<T>) => ({
      ...oldState,
      data: storedData.slice(0, state.rowsPerPage),
      rowsPerPage: state.rowsPerPage,
      totalPages,
      currentPage: 1,
    }));
  }, [data]);

  /**
   * On Mount Hook with fetch
   */
  // ---------------------------------------------------------
  React.useEffect(() => {
    const fetchData = async () => {
      const res = await fetch();
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
          state.rowsPerPage,
          1,
        );

        await setState((oldState: IUseDataTableState<T>) => ({
          ...oldState,
          sortParameters: {
            sortColumn:
              (options.sort && options.sort.initialSortBy) || undefined,
            sortDirection: "desc",
          },
          totalPages,
          totalRows: newData.length,
        }));

        setState((oldState: IUseDataTableState<T>) => ({
          ...oldState,
          data:
            (options.sort &&
              sort(newData, options.sort.initialSortBy, "asc")) ||
            newData.slice(0, state.rowsPerPage),
        }));
      })
      .catch(error => {
        setState((oldState: IUseDataTableState<T>) => ({ ...oldState, error }));
        setIsLoading(false);
      });
  }, [
    fetch,
    options.sort && options.sort.initialSortBy && options.sort.initialSortBy,
    state.rowsPerPage,
  ]);

  /**
   * Print the Table
   */
  // ---------------------------------------------------------
  const printTable = React.useCallback(
    (tableRef: React.Ref<HTMLTableElement>) => {},
    [state.rowsPerPage, state.currentPage, state.sortParameters],
  );

  /**
   * Calculate the pagination parameters
   * @param totalRows : total length of the data array
   * @param rowsPerPage : max number of rows per page
   * @param currentPage : current page number
   */
  // ---------------------------------------------------------
  const calculatePagination = React.useCallback(
    (totalRows: number, rowsPerPage: number, currentPage: number) => {
      const startIndex: number = Math.ceil((currentPage - 1) * rowsPerPage);
      const endIndex: number = startIndex + rowsPerPage;
      const totalPages: number = Math.ceil(totalRows / rowsPerPage);

      return {
        totalPages,
        startIndex,
        endIndex,
      };
    },
    [state.rowsPerPage, state.totalRows, options.rowsPerPage, data, fetch],
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
        state.rowsPerPage,
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
    [options.sort, options.rowsPerPage, state],
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
   * Set max rows Callback
   * @param rowsPerPage : max rows per page
   */
  // ---------------------------------------------------------
  const setRowsPerPage = React.useCallback(
    (newRowsPerPage: number) => {
      const rowsPerPage =
        newRowsPerPage !== 0 ? newRowsPerPage : storedData.length;
      const { totalPages } = calculatePagination(
        storedData.length,
        rowsPerPage,
        state.currentPage,
      );

      setState((oldState: IUseDataTableState<T>) => ({
        ...oldState,
        data: storedData.slice(0, rowsPerPage),
        rowsPerPage: options.rowsPerPage,
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
        state.rowsPerPage,
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
    [state, state.currentPage, state.rowsPerPage],
  );

  return {
    currentPage: state.currentPage,
    data: state.data,
    isLoading,
    setRowsPerPage,
    setPage,
    sortDataBy,
    sortParameters: state.sortParameters,
    totalRows: state.totalRows,
    totalPages: state.totalPages,
  };
}
