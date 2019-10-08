import * as React from "react";
import { IFilterParameters, TFilterAction } from ".";
import { Button, ClassHelpers } from "../..";

export interface ITableFilters<T> {
  filterValues: Array<IFilterParameters<T>>;
  onClear: () => void;
  onUpdateFilter: (
    action: TFilterAction,
    key?: any,
    value?: React.ReactNode,
  ) => void;
}

export function TableFiltersDialog<T>({
  filterValues,
  onClear,
  onUpdateFilter,
}: ITableFilters<T>) {
  return (
    <div>
      <div className={ClassHelpers.classNames("table-filters")}>
        <div className={ClassHelpers.classNames("title")}>Filters</div>
        <Button
          className={ClassHelpers.classNames("table-reset-filter-btn")}
          onClick={onClear}
        >
          Clear
        </Button>
      </div>
      {filterValues.map((f: IFilterParameters<T>, index: number) => {
        return (
          <>
            <div key={index}>
              {f.name}
              <select
                onChange={e => onUpdateFilter("add", f.name, e.target.value)}
              >
                {f.values.map((ff: React.ReactNode, idx: number) => {
                  switch (typeof ff) {
                    case "boolean": {
                      const val = ff ? "true" : "false";
                      return <option key={idx} label={val} value={val} />;
                    }
                    default: {
                      const val = ff as string;
                      return <option key={idx} label={val} value={val} />;
                    }
                  }
                })}
                }
              </select>
            </div>
          </>
        );
      })}
    </div>
  );
}
