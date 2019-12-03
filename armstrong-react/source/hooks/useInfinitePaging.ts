import * as React from "react";

export type PageToken = string | number;

export interface IInfinitePagingResult<T> {
  data: T[];
  nextPageToken?: PageToken;
}

export interface IUseInfinitePagingSettings<T> {
  firstPageToken?: PageToken;
  onFetched?: (item: T[]) => void | Promise<void>;
  key: keyof T;
  initialItems?: T[];
  pageSize?: number;
  fetch(pageToken: PageToken): Promise<IInfinitePagingResult<T>>;
}

interface IItems<T> {
  [key: string]: T;
}

const itemsToDictionary = <T>(items: T[], key: keyof T): IItems<T> =>
  (items || []).reduce<IItems<T>>((previousItems, item) => {
    previousItems[(item[key] as any) as string] = item;
    return previousItems;
  }, {});

interface IUseInfinitePagingState<T> {
  items: IItems<T>;
  nextPageToken: PageToken;
  hasFinished: boolean;
  hasData: boolean;
  error: any;
}

const initialState = <T>(initialItems: IItems<T>): IUseInfinitePagingState<T> => ({
  items: initialItems,
  nextPageToken: undefined,
  hasFinished: false,
  hasData: false,
  error: undefined
});

export function useInfinitePaging<T>(settings: IUseInfinitePagingSettings<T>) {
  const [state, setState] = React.useState<IUseInfinitePagingState<T>>(
    initialState(itemsToDictionary(settings.initialItems, settings.key))
  );
  const [isFetching, setIsFetching] = React.useState(false);

  const addItems = React.useCallback(
    (currentItems: IItems<T>, newItems: T[]): IItems<T> => ({
      ...currentItems,
      ...itemsToDictionary(newItems, settings.key)
    }),
    [settings.key]
  );

  const fetcher = React.useCallback(
    async (currentItems: IItems<T>, fetchPageToken?: PageToken, isReloading?: boolean) => {
      const isInitial = fetchPageToken === settings.firstPageToken;
      setIsFetching(true);

      try {
        const response = await settings.fetch(fetchPageToken);
        const noReturnedItems = !response || !response.data || response.data.length === 0;
        const responseSmallerThanPageSize = settings.pageSize && response.data.length < settings.pageSize;

        const items: IItems<T> = noReturnedItems
          ? currentItems
          : addItems(isInitial ? (isReloading ? {} : itemsToDictionary(settings.initialItems, settings.key)) : currentItems, response.data);

        setState({
          items,
          nextPageToken: response.nextPageToken,
          hasFinished: noReturnedItems || responseSmallerThanPageSize || !response.nextPageToken,
          hasData: true,
          error: undefined
        });

        setIsFetching(false);

        if (settings.onFetched && response) {
          settings.onFetched(response.data);
        }
      } catch (error) {
        console.error(error);
        setState({ ...state, error });
        setIsFetching(false);
      }
    },
    [state, settings.firstPageToken, addItems]
  );

  const loadMore = React.useCallback(async () => {
    if (isFetching || state.hasFinished) {
      return;
    }
    await fetcher(state.items, state.nextPageToken);
  }, [fetcher, isFetching]);

  /** reload the state  */

  const reload = React.useCallback(async () => {
    setState({ ...initialState(itemsToDictionary(settings.initialItems, settings.key)), items: state.items });

    await fetcher({}, settings.firstPageToken, true);
  }, [fetcher]);

  /**
   * adds or replaces an array of new items, matched by a specified key
   *
   * @param key the key to check if the item is already in state
   * @param replacements the new items to insert into the array
   */

  const insert: (replacements: T[]) => void = React.useCallback(
    replacements => {
      const newState = { ...state };

      newState.items = addItems(newState.items, replacements);

      setState(newState);
    },
    [state]
  );

  const remove: <K extends keyof T>(value: T[K]) => void = React.useCallback(
    value => {
      const newState = { ...state };

      delete newState.items[(value as any) as string];

      setState(newState);
    },
    [state]
  );

  React.useEffect(() => {
    fetcher({}, settings.firstPageToken);
  }, []);

  const returnItems = React.useMemo(() => Object.keys(state.items).map(key => state.items[key]), [state]);

  return {
    items: returnItems,
    isFetching,
    fetchError: state.error,
    hasData: state.hasData,
    hasFinished: state.hasFinished,
    loadMore,
    reload,
    insert,
    remove
  };
}
