import * as React from "react";
import { ClassHelpers } from "../..";

export interface ITableItemDropdown {
  values: number[];
  onSelect: (itemCount: number) => void;
}

export const TableItemDropdown: React.FunctionComponent<ITableItemDropdown> = ({
  values,
  onSelect,
}) => {
  return (
    <div className={ClassHelpers.classNames("table-item-dropdown")}>
      <div>Rows per Page</div>
      <select onChange={e => onSelect(Number(e.target.value))}>
        {values.map((value: number) => (
          <option
            key={value}
            value={Number(value)}
            label={value !== 0 ? value.toString() : "all"}
          />
        ))}
      </select>
    </div>
  );
};
