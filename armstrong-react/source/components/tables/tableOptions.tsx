import * as React from "react";

import { ClassHelpers } from "../..";
import { Icon } from "../display/icon";
import { IDataTableOptionsBar } from "./tableTypes";

export function TableOptions<T>({
  download,
  filter,
  onDownload,
  onFilter,
  onPrint,
  print,
}: IDataTableOptionsBar<T>) {
  return (
    <div className={ClassHelpers.classNames("table-options")}>
      {download && <Icon icon={Icon.Icomoon.download} onClick={onDownload} />}
      {print && <Icon icon={Icon.Icomoon.printer} onClick={onPrint} />}
      {filter && <Icon icon={Icon.Icomoon.filter} onClick={onFilter} />}
    </div>
  );
}
