import * as React from "react";

import * as _ from "underscore";
import { TSortDirection } from "../components/tables/tableHeader";

export type TFilterAction = "add" | "remove" | "clear";
export interface IUseDataTableResult<T> {
  data: T[];
}

export interface ISortParameters<T> {
  key: keyof T;
  direction: TSortDirection;
}

export interface IDataTableOptions<T> {
  download?: boolean;
  filter?: {
    filterBy?: Array<keyof T>;
  };
  hideHeaders?: boolean;
  paginate?: boolean;
  print?: boolean;
  rowsPerPage?: number;
  sort?: {
    initialSortBy?: ISortParameters<T>;
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
  sortParameters: ISortParameters<T>;
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
  sortParameters: { key: undefined, direction: "desc" },
  totalRows: undefined,
  totalPages: undefined,
});

interface IUseDataTable<T> {
  currentPage: number;
  data: T[];
  downloadTableAsCSV: () => void;
  filterList: IFilterParameters[];
  isLoading: boolean;
  options: IDataTableOptions<T>;
  printTable: (ref: HTMLTableElement) => void;
  setRowsPerPage: (newRowsPerPage: number) => void;
  setPage: (currentPage: number) => void;
  sortDataBy: (key: keyof T, direction: TSortDirection) => void;
  sortParameters: ISortParameters<T>;
  totalRows: number;
  totalPages: number;
  updateFilter: (
    action: TFilterAction,
    column?: keyof T,
    value?: React.ReactNode,
  ) => void;
}

export interface IFilterParameters {
  name: string;
  values: React.ReactNode[];
}

export function useDataTable<T>({
  data,
  fetch,
  options,
}: IUseDataTableSettings<T>): IUseDataTable<T> {
  const [state, setState] = React.useState<IUseDataTableState<T>>(
    initialState(),
  );
  const [storedData, setStoredData] = React.useState<T[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const [filterList, setFilterList] = React.useState<IFilterParameters[]>([]);

  /**
   *
   */
  // ---------------------------------------------------------
  React.useMemo(() => {
    const rowsPerPage =
      (options && options.rowsPerPage && options.rowsPerPage) || 5;
    const sortParameters =
      (options &&
        options.sort &&
        options.sort.initialSortBy &&
        options.sort.initialSortBy) ||
      null;

    setState((oldState: IUseDataTableState<T>) => ({
      ...oldState,
      rowsPerPage,
      sortParameters,
    }));
  }, []);

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
    setIsLoading(true);
    fetch()
      .then(async vData => {
        const newData = await vData;

        await setStoredData(newData.data);

        const { totalPages } = await calculatePagination(
          newData.data.length,
          state.rowsPerPage,
          1,
        );

        const sortParameters =
          (options.sort &&
            options.sort.initialSortBy &&
            options.sort.initialSortBy) ||
          null;

        await setState((oldState: IUseDataTableState<T>) => ({
          ...oldState,
          sortParameters,
          totalPages,
          totalRows: newData.data.length,
        }));

        setState((oldState: IUseDataTableState<T>) => ({
          ...oldState,
          data:
            (sortParameters && sort(newData.data, sortParameters.key, "asc")) ||
            newData.data.slice(0, state.rowsPerPage),
        }));
        setIsLoading(false);
      })
      .catch(error => {
        setState((oldState: IUseDataTableState<T>) => ({ ...oldState, error }));
        setIsLoading(false);
      });
  }, [fetch]);

  /**
   * Filter
   */
  // ---------------------------------------------------------
  React.useEffect(() => {
    if (storedData && storedData.length > 0 && options.filter) {
      const arrayKeys = _.chain(storedData)
        .map(_.keys)
        .flatten()
        .unique()
        .value();

      if (options.filter.filterBy.length > 0) {
        const newFilterList = arrayKeys
          .filter(f => options.filter.filterBy.includes(f as keyof T))
          .map(m => {
            return {
              name: m,
              values: _.uniq(storedData, m).map(s => s[m]),
            };
          });
        setFilterList(newFilterList);
      } else {
        const newFilterList = arrayKeys.map(m => {
          return {
            name: m,
            values: _.uniq(storedData, m).map(s => s[m]),
          };
        });
        setFilterList(newFilterList);
      }
    }
  }, [storedData]);

  /**
   * Print the Table
   */
  // ---------------------------------------------------------
  const printTable = React.useCallback(
    (ref: HTMLTableElement) => {
      const printWindow = window.open();
      printWindow.document.write(ref.outerHTML);
      printWindow.print();
      printWindow.close();
    },
    [state.data],
  );

  /**
   * Download the Table as CSV
   */
  // ---------------------------------------------------------
  const downloadTableAsCSV = React.useCallback(
    (allData?: boolean) => {
      if (state.data.length > 0) {
        const items = allData ? storedData : state.data;
        const replacer = (key, value) => (value === null ? "" : value);
        const header = Object.keys(items[0]);
        const csv = items.map(row =>
          header
            .map(fieldName => JSON.stringify(row[fieldName], replacer))
            .join(","),
        );
        csv.unshift(header.join(","));
        const csvString = csv.join("\r\n");
        const csvFile = new Blob([csvString], { type: "text/csv" });
        const url = URL.createObjectURL(csvFile);

        const clickHandler = () => {
          setTimeout(() => {
            URL.revokeObjectURL(url);
            this.removeEventListener("click", clickHandler);
          }, 150);
        };

        const link = document.createElement("a");
        link.addEventListener("click", clickHandler, false);
        link.download = "table.csv";
        link.href = url;
        link.click();
      }
    },
    [state.data],
  );

  /**
   * Add filter parameter
   */
  // ---------------------------------------------------------
  const updateFilter = React.useCallback(
    (action: TFilterAction, column?: keyof T, value?: React.ReactNode) => {
      switch (action) {
        case "add":
          {
          }
          break;
        case "clear":
          {
            const { totalPages } = calculatePagination(
              storedData.length,
              state.rowsPerPage,
              1,
            );

            const sortParameters =
              (options.sort &&
                options.sort.initialSortBy &&
                options.sort.initialSortBy) ||
              null;

            setFilterList([]);

            setState((oldState: IUseDataTableState<T>) => ({
              ...oldState,
              data:
                (sortParameters &&
                  sort(storedData, sortParameters.key, "asc")) ||
                storedData.slice(0, state.rowsPerPage),
            }));
          }
          break;
        case "remove":
          {
          }
          break;
      }
    },
    [state.rowsPerPage, state.totalRows, options.rowsPerPage, data, fetch],
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
    [options && options.sort, state],
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
        sortParameters: { key, direction },
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
        rowsPerPage,
        totalPages,
        currentPage: state.currentPage,
      }));
    },
    [state, state.currentPage, state.rowsPerPage],
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

      const newData = state.sortParameters
        ? sort(
            storedData,
            state.sortParameters.key,
            state.sortParameters.direction,
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
    downloadTableAsCSV,
    filterList,
    isLoading,
    options,
    printTable,
    setRowsPerPage,
    setPage,
    sortDataBy,
    sortParameters: state.sortParameters,
    totalRows: state.totalRows,
    totalPages: state.totalPages,
    updateFilter,
  };
}
