import * as React from "react";
import { Icon } from "../display/icon";

import "./styles.scss";

export interface ITableOptions {}

export const TableOptions: React.FunctionComponent<ITableOptions> = ({}) => {
  return (
    <div className="table-options">
      <Icon icon={Icon.Icomoon.search} />
      <Icon icon={Icon.Icomoon.download} />
      <Icon icon={Icon.Icomoon.printer} />
      <Icon icon={Icon.Icomoon.list} />
      <Icon icon={Icon.Icomoon.filter} />
    </div>
  );
};
