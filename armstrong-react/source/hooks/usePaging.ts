import * as React from "react";
import { utils } from "../utilities/utils";

export interface IPagingResult<T> {
  data: T[];
  totalRecords: number;
}

export interface IUsePagingSettings<T> {
  fetch(page: number, pageSize: number): Promise<IPagingResult<T>>;
  pageSize: number;
}

interface IUsePagingState<T> {
  items: T[];
  currentPage: number;
  totalRecords: number;
  totalPages: number;
  hasData: boolean;
  error: any;
}

const initialState = <T>(): IUsePagingState<T> => ({
  items: [],
  currentPage: undefined,
  totalRecords: undefined,
  totalPages: undefined,
  hasData: false,
  error: undefined,
});

export function usePaging<T>(settings: IUsePagingSettings<T>) {
  const [state, setState] = React.useState<IUsePagingState<T>>(initialState());
  const [isFetching, setIsFetching] = React.useState(false);

  const fetcher = React.useCallback(
    (page: number) => {
      if (
        page < 1 ||
        (!utils.object.isUndefined(state.totalPages) && page > state.totalPages)
      ) {
        return;
      }

      setIsFetching(true);
      settings
        .fetch(page, settings.pageSize)
        .then(v => {
          // const noReturnedItems = !v.data || v.data.length === 0
          setState({
            items: v.data,
            currentPage: page,
            totalRecords: v.totalRecords,
            totalPages: Math.ceil(v.totalRecords / settings.pageSize),
            hasData: true,
            error: undefined,
          });
          setIsFetching(false);
        })
        .catch(error => {
          setState({
            items: [],
            currentPage: page,
            totalRecords: state.totalRecords,
            totalPages: state.totalPages,
            hasData: false,
            error,
          });
          setIsFetching(false);
        });
    },
    [state],
  );

  const gotoPage = React.useCallback(
    (page: number) => {
      if (isFetching) {
        return;
      }
      fetcher(page);
    },
    [fetcher, isFetching],
  );

  const reload = React.useCallback(() => {
    setState(initialState());
    fetcher(1);
  }, [fetcher]);

  React.useEffect(() => {
    fetcher(1);
  }, []);

  return {
    items: state.items,
    totalPages: state.totalPages,
    totalRecords: state.totalRecords,
    currentPage: state.currentPage,
    isFetching,
    fetchError: state.error,
    hasData: state.hasData,
    gotoPage,
    reload,
  };
}
