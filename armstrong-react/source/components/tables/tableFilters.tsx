import * as React from "react";

import { Button } from "../..";
import { Icon } from "../display/icon";
import { IFilter } from "./tableTypes";

export interface ITableFilters<T> {
  filters: IFilter[];
  onRemove: (key: keyof T, value: any) => void;
}

export function TableFilters<T>({
  filters,
  onRemove,
}: React.PropsWithChildren<ITableFilters<T>>) {
  return (
    <div>
      {filters && filters.map((filter: IFilter) => {
        return (
          <Button
            leftIcon={Icon.Icomoon.cross}
            rounded
            onClick={() => onRemove(filter.key, filter.value)}
          >
            {filter.key} {filter.value}
          </Button>
        );
      })}
    </div>
  );
}
