import * as React from "react";

export type PageToken = string | number;

export interface IInfinitePagingResult<T> {
  data: T[];
  nextPageToken?: PageToken;
}

export interface IUseInfinitePagingSettings<T> {
  fetch(pageToken: PageToken): Promise<IInfinitePagingResult<T>>;
  firstPageToken?: PageToken;
}

interface IUseInfinitePagingState<T> {
  items: T[];
  nextPageToken: PageToken;
  hasFinished: boolean;
  hasData: boolean;
  error: any;
}

const initialState = <T>(): IUseInfinitePagingState<T> => ({
  items: [],
  nextPageToken: undefined,
  hasFinished: false,
  hasData: false,
  error: undefined,
});

export function useInfinitePaging<T>(settings: IUseInfinitePagingSettings<T>) {
  const [state, setState] = React.useState<IUseInfinitePagingState<T>>(
    initialState(),
  );
  const [isFetching, setIsFetching] = React.useState(false);

  const fetcher = React.useCallback(
    (currentItems: T[], fetchPageToken?: PageToken) => {
      setIsFetching(true);
      settings
        .fetch(fetchPageToken)
        .then(v => {
          const noReturnedItems = !v.data || v.data.length === 0;
          const items = noReturnedItems
            ? currentItems
            : [...currentItems, ...v.data];
          setState({
            items,
            nextPageToken: v.nextPageToken,
            hasFinished: noReturnedItems || !v.nextPageToken,
            hasData: true,
            error: undefined,
          });
          setIsFetching(false);
        })
        .catch(error => {
          setState({ ...state, error });
          setIsFetching(false);
        });
    },
    [state],
  );

  const loadMore = React.useCallback(() => {
    if (isFetching || state.hasFinished) {
      return;
    }
    fetcher(state.items, state.nextPageToken);
  }, [fetcher, isFetching]);

  const reload = React.useCallback(() => {
    setState(initialState());
    fetcher([], settings.firstPageToken);
  }, [fetcher]);

  React.useEffect(() => {
    fetcher([], settings.firstPageToken);
  }, []);

  return {
    items: state.items,
    isFetching,
    fetchError: state.error,
    hasData: state.hasData,
    hasFinished: state.hasFinished,
    loadMore,
    reload,
  };
}
