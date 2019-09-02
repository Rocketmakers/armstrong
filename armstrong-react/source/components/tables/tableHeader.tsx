import * as React from "react";
import { Icon } from "../display/icon";

export type TSortDirection = "asc" | "desc";

export interface ITableHeading {
  name: string;
  sortBy?: (header: string, direction: TSortDirection) => void;
}

export const TableHeading: React.FunctionComponent<ITableHeading> = ({
  name,
  sortBy,
}) => {
  const [sortByState, setSortByState] = React.useState<TSortDirection>("asc");

  const handleSortBy = () => {
    sortBy(name, sortByState);
    setSortByState(sortByState === "asc" ? "desc" : "asc");
  };

  return (
    <th onClick={handleSortBy}>
      {name}
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
};
