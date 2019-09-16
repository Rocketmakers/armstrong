import * as React from "react";
import { Icon } from "../display/icon";
import { TSortDirection } from "./tableTypes";

export interface ITableHeading<T> {
  name: keyof T;
  cell: (name: keyof T) => React.ReactNode;
  sortBy?: (header: keyof T, direction: TSortDirection) => void;
  initSort?: TSortDirection;
}

export function TableHeading<T>({
  name,
  cell,
  sortBy,
  initSort,
}: React.PropsWithChildren<ITableHeading<T>>) {
  const [sortByState, setSortByState] = React.useState<TSortDirection>("asc");

  React.useEffect(() => {
    if (initSort && sortBy) {
      setSortByState(initSort);
    }
  }, []);

  const handleSortBy = () => {
    if (sortBy) {
      sortBy(name, sortByState);
      setSortByState(sortByState === "asc" ? "desc" : "asc");
    }
  };

  return (
    <th onClick={handleSortBy}>
      {cell ? cell(name) : name}
      {sortBy && (
        <Icon
          icon={
            sortByState === "asc"
              ? Icon.Icomoon.arrowDown5
              : Icon.Icomoon.arrowUp5
          }
        />
      )}
    </th>
  );
}
