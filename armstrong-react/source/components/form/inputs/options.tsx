import * as React from "react";
import { utils } from "../../../utilities/utils";

export function buildOptions<T>(label: string, items: T[], valueFactory: (t: T) => string | number, labelFactory: (t: T) => string, enableOptionLabel: boolean = false) {
  const options = [<option key={`blank`} value="" disabled={!enableOptionLabel}>{label}</option>];
  if (items) {
    utils.array.each(items, (d, idx) => {
      options.push(<option key={idx} value={valueFactory(d)}>{labelFactory(d)}</option>);
    })
  }

  return options;
}
