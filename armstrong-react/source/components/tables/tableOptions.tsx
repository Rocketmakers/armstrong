import * as React from "react";
import { IDataTableOptionsBar } from "../../hooks/useDataTable";
import { Icon } from "../display/icon";

import { ClassHelpers } from "../..";

export function TableOptions<T>({
  download,
  filter,
  onDownload,
  onFilter,
  onPrint,
  print,
  sort,
}: IDataTableOptionsBar<T>) {
  return (
    <div className={ClassHelpers.classNames("table-options")}>
      {download && <Icon icon={Icon.Icomoon.download} onClick={onDownload} />}
      {print && <Icon icon={Icon.Icomoon.printer} onClick={onPrint} />}
      {sort && <Icon icon={Icon.Icomoon.list} />}
      {filter && <Icon icon={Icon.Icomoon.filter} onClick={onFilter} />}
    </div>
  );
}
