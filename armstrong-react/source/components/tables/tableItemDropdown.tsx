import * as React from "react";

import "./styles.scss";

export interface ITableItemDropdown {
  values: number[];
  onSelect: (itemCount: number) => void;
}

export const TableItemDropdown: React.FunctionComponent<ITableItemDropdown> = ({
  values,
  onSelect,
}) => {
  return (
    <div className="table-item-dropdown">
      <div>Rows per Page</div>
      <select onChange={e => onSelect(Number(e.target.value))}>
        {values.map(value => (
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
