import * as React from "react";
import * as _ from "underscore";
import { TableHeading, TSortDirection } from "./tableHeader";
import { TableItem } from "./tableItem";
import { TableItemDropdown } from "./tableItemDropdown";
import { TableTitle } from "./tableTitle";

export interface ITableProps {
  data: any;
  headers?: string[]; // this overides the data column name
  onChangeItemPerPage?: (items: number) => void;
  hideHeaders?: boolean;
  sortBy?: (colName: string, direction: TSortDirection) => void;
  subTitle?: string;
  title?: string;
}

export const Table: React.FunctionComponent<ITableProps> = ({
  data,
  headers,
  onChangeItemPerPage,
  hideHeaders,
  sortBy,
  subTitle,
  title,
}) => {
  const [tableHeaders, setTableHeaders] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (headers) {
      setTableHeaders(headers);
    } else {
      setTableHeaders(Object.keys(data[0]).map(header => header));
    }
  }, []);

  return (
    <div>
      <TableTitle title={title} subTitle={subTitle} />
      <table>
        {!hideHeaders ? (
          <thead>
            <tr>
              {tableHeaders.map(header => (
                <TableHeading key={header} name={header} sortBy={sortBy} />
              ))}
            </tr>
          </thead>
        ) : null}
        <tbody>
          {data.map((rows, idx: number) => {
            return <TableItem key={idx} data={rows} />;
          })}
        </tbody>
      </table>

      <TableItemDropdown
        values={[5, 10, 20, 0]}
        onSelect={onChangeItemPerPage}
      />
    </div>
  );
};
