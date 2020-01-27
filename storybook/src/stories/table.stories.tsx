import * as React from "react";

import { storiesOf } from "@storybook/react";
import { Table, useDataTable, Icon } from "../_symlink";
import { IPaginateButtonProps } from "../_symlink/components/tables/tablePagingation";
import { IUseDataTableResult } from "../_symlink/components/tables/tableTypes";

import "../theme/theme.scss";

const localTodos: ITodos[] = [
  {
    userId: 1,
    id: 1,
    title: "delectus aut autem",
    completed: false,
  },
  {
    userId: 1,
    id: 2,
    title: "quis ut nam facilis et officia qui",
    completed: false,
  },
  {
    userId: 1,
    id: 3,
    title: "fugiat veniam minus",
    completed: false,
  },
  {
    userId: 1,
    id: 4,
    title: "et porro tempora",
    completed: true,
  },
  {
    userId: 1,
    id: 5,
    title: "laboriosam mollitia et enim quasi adipisci quia provident illum",
    completed: false,
  },
  {
    userId: 1,
    id: 6,
    title: "qui ullam ratione quibusdam voluptatem quia omnis",
    completed: false,
  },
  {
    userId: 1,
    id: 7,
    title: "illo expedita consequatur quia in",
    completed: false,
  },
  {
    userId: 1,
    id: 8,
    title: "quo adipisci enim quam ut ab",
    completed: true,
  },
  {
    userId: 1,
    id: 9,
    title: "molestiae perspiciatis ipsa",
    completed: false,
  },
  {
    userId: 1,
    id: 10,
    title: "illo est ratione doloremque quia maiores aut",
    completed: true,
  },
];

const todoDataUrl = "https://jsonplaceholder.typicode.com/todos";
const photosDataUrl = "https://jsonplaceholder.typicode.com/albums/1/photos";
interface ITodos {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}
interface IPhotos {
  albumId: number;
  id: number;
  title: string;
  thumbnailUrl: string;
  url: string;
}

async function fetchTodoData() {
  const res = await fetch(todoDataUrl);
  return res.json();
}

async function loadTodoData(): Promise<IUseDataTableResult<ITodos>> {
  const res = await fetch(todoDataUrl, { method: "GET" });
  const data = ((await res.json()) as unknown) as ITodos[];

  return {
    data,
  };
}

async function loadPhotosData(): Promise<IUseDataTableResult<IPhotos>> {
  const res = await fetch(photosDataUrl, { method: "GET" });
  const data = ((await res.json()) as unknown) as IPhotos[];

  return {
    data,
  };
}

function capitalizeFirstLetter(str: string): string {
  const s = str.toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function TableHeaderCell(name: string) {
  return (
    <span style={{ color: "gray", fontSize: 20 }}>
      {capitalizeFirstLetter(name)}
    </span>
  );
}

function CompletedTableCell(value: boolean) {
  return (
    <div style={{ textAlign: "center" }}>
      {value ? (
        <Icon icon={Icon.Icomoon.thumbsUp} />
      ) : (
        <Icon icon={Icon.Icomoon.thumbsDown} />
      )}
    </div>
  );
}


function CompletedTableCellButton(value: boolean) {
  return <button>{value ? "true" : "false"}</button>;
}

const ExamplePaginationButton: React.FC<IPaginateButtonProps> = ({
  active,
  direction,
  index,
  onClick,
}) => {
  return (
    <button
      style={{
        backgroundColor: "unset",
        border: "unset",
        color: active ? "#3498d8" : "#4f5c69",
        fontWeight: active ? 500 : 200,
      }}
      onClick={() => onClick(index)}
    >
      {(direction && direction) || index}
    </button>
  );
};

storiesOf("Table", module)
  .add("Simple table", () => {
    const [state, setState] = React.useState([]);

    React.useEffect(() => {
      const getData = async () => {
        const res = await fetchTodoData();
        setState(res);
      };
      getData();
    }, []);

    return (
      <Table<ITodos>
        headerFormatter={{
          id: null,
          completed: null,
          title: null,
          userId: null,
        }}
        columnFormatter={{
          completed: CompletedTableCell,
        }}
        data={state}
      />
    );
  })
  .add("Simple table (Hooks)", () => {
    const { data, options, setPage, setRowsPerPage, totalPages } = useDataTable<
      ITodos
    >({
      data: localTodos,
      options: {
        rowsPerPage: 5,
        paginate: true,
      },
    });

    return (
      <Table<ITodos>
        headerFormatter={{
          id: null,
          completed: null,
          title: null,
          userId: null,
        }}
        columnFormatter={{
          completed: CompletedTableCell,
        }}
        numberOfPages={totalPages}
        onChangePage={setPage}
        onChangeRowsPerPage={setRowsPerPage}
        options={options}
        data={data}
      />
    );
  })
  .add("Update Data (Hooks)", () => {
    const {
      data,
      options,
      setPage,
      setRowsPerPage,
      totalPages,
      updateData,
    } = useDataTable<ITodos>({
      options: {
        rowsPerPage: 5,
        paginate: true,
      },
    });

    React.useEffect(() => {
      updateData(localTodos);
    }, []);

    return (
      <Table<ITodos>
        headerFormatter={{
          id: null,
          completed: null,
          title: null,
          userId: null,
        }}
        columnFormatter={{
          completed: CompletedTableCell,
        }}
        numberOfPages={totalPages}
        onChangePage={setPage}
        onChangeRowsPerPage={setRowsPerPage}
        options={options}
        data={data}
      />
    );
  })
  .add("Table with titles", () => {
    const [state, setState] = React.useState([]);

    React.useEffect(() => {
      const getData = async () => {
        const res = await fetchTodoData();
        setState(res);
      };
      getData();
    }, []);
    return (
      <Table<ITodos>
        headerFormatter={{
          id: null,
          completed: null,
          title: null,
          userId: null,
        }}
        columnFormatter={{
          completed: CompletedTableCell,
          userId: value => <p style={{ textAlign: "center" }}>{value}</p>,
        }}
        data={state}
        title="My Table"
        subTitle="My Table with Titles"
      />
    );
  })
  .add("Table with options", () => {
    const { data, downloadTableAsCSV, options, printTable } = useDataTable<
      ITodos
    >({
      fetch: loadTodoData,
      options: {
        rowsPerPage: 10,
        download: true,
        print: true,
      },
    });

    return (
      <Table<ITodos>
        headerFormatter={{
          id: null,
          completed: null,
          title: null,
          userId: null,
        }}
        columnFormatter={{
          completed: CompletedTableCell,
          userId: value => <p style={{ textAlign: "center" }}>{value}</p>,
        }}
        data={data}
        options={options}
        onDownload={downloadTableAsCSV}
        onPrint={printTable}
        title="My Table"
        subTitle="My Table with Options"
      />
    );
  })

  .add("Table with formatted headers", () => {
    const [state, setState] = React.useState([]);

    React.useEffect(() => {
      const getData = async () => {
        const res = await fetchTodoData();
        setState(res);
      };
      getData();
    }, []);

    return (
      <Table<ITodos>
        headerFormatter={{
          id: TableHeaderCell,
          completed: TableHeaderCell,
          title: TableHeaderCell,
          userId: TableHeaderCell,
        }}
        columnFormatter={{
          completed: CompletedTableCell,
        }}
        data={state}
        title="My Table"
        subTitle="My Table with Formatted Headers"
      />
    );
  })
  .add("Table with formatted columns", () => {
    const [state, setState] = React.useState([]);

    React.useEffect(() => {
      const getData = async () => {
        const res = await fetchTodoData();
        setState(res);
      };
      getData();
    }, []);

    return (
      <Table<ITodos>
        headerFormatter={{
          id: TableHeaderCell,
          completed: TableHeaderCell,
          title: TableHeaderCell,
          userId: TableHeaderCell,
        }}
        columnFormatter={{
          title: (colValue: string, rowValue: ITodos) => (
            <div onClick={() => alert(JSON.stringify(rowValue))}>
              {colValue}
            </div>
          ),
          completed: CompletedTableCellButton,
        }}
        data={state}
        title="My Table"
        subTitle="My Table with Formatted Headers"
      />
    );
  })
  .add(
    "Table with pagination (Hooks)",
    () => {
      const {
        data,
        isLoading,
        options,
        setPage,
        setRowsPerPage,
        totalPages,
      } = useDataTable<ITodos>({
        fetch: loadTodoData,
        options: {
          rowsPerPage: 5,
          paginate: true,
        },
      });
      return isLoading ? (
        <div>Loading</div>
      ) : (
        <Table<ITodos>
          headerFormatter={{
            id: TableHeaderCell,
            completed: TableHeaderCell,
            title: TableHeaderCell,
            userId: TableHeaderCell,
          }}
          columnFormatter={{
            completed: CompletedTableCell,
          }}
          data={data}
          numberOfPages={totalPages}
          options={options}
          onChangeRowsPerPage={setRowsPerPage}
          onChangePage={setPage}
          paginationElement={ExamplePaginationButton}
          subTitle="My Paginated Data Table"
          title="My Table"
        />
      );
    },
    {},
  )
  .add("Table with sortable columns (Hooks)", () => {
    const { data, isLoading, options, sortDataBy } = useDataTable<ITodos>({
      fetch: loadTodoData,
      options: {
        rowsPerPage: 5,
        sort: {
          initialSortBy: { key: "title", direction: "asc" },
        },
      },
    });

    return isLoading ? (
      <div>Loading</div>
    ) : (
      <Table<ITodos>
        columnFormatter={{
          completed: b => <p>{b ? "true" : "false"}</p>,
        }}
        data={data}
        headerFormatter={{
          id: TableHeaderCell,
          completed: TableHeaderCell,
          title: TableHeaderCell,
          userId: TableHeaderCell,
        }}
        options={options}
        onSortBy={sortDataBy}
        paginationElement={ExamplePaginationButton}
        subTitle="My Sortable Data Table"
        title="My Table"
      />
    );
  })
  .add("Filterable Table (Subtractive) (Hooks)", () => {
    const {
      data,
      filters,
      filterList,
      isLoading,
      options,
      setPage,
      setRowsPerPage,
      totalPages,
      updateFilter,
    } = useDataTable<ITodos>({
      fetch: loadTodoData,
      options: {
        rowsPerPage: 100,
        filter: { filterBy: ["userId", "completed"], filtering: "subtractive" },
        paginate: true,
      },
    });

    return isLoading ? (
      <div>Loading</div>
    ) : (
      <>
        <Table<ITodos>
          columnFormatter={{
            completed: b => <p>{b ? "true" : "false"}</p>,
          }}
          data={data}
          filters={filters}
          filterList={filterList}
          headerFormatter={{
            id: TableHeaderCell,
            completed: TableHeaderCell,
            title: TableHeaderCell,
            userId: TableHeaderCell,
          }}
          numberOfPages={totalPages}
          onChangePage={setPage}
          onChangeRowsPerPage={setRowsPerPage}
          onUpdateFilter={updateFilter}
          options={options}
          paginationElement={ExamplePaginationButton}
          subTitle="My Filterable Data Table"
          title="My Table"
        />
      </>
    );
  })
  .add("Filterable Table (Additive) (Hooks)", () => {
    const {
      data,
      filters,
      filterList,
      isLoading,
      options,
      setPage,
      setRowsPerPage,
      totalPages,
      updateFilter,
    } = useDataTable<ITodos>({
      fetch: loadTodoData,
      options: {
        rowsPerPage: 100,
        filter: { filterBy: ["userId"], filtering: "additive" },
        paginate: true,
      },
    });

    return isLoading ? (
      <div>Loading</div>
    ) : (
      <>
        <Table<ITodos>
          columnFormatter={{
            completed: b => <p>{b ? "true" : "false"}</p>,
          }}
          data={data}
          filters={filters}
          filterList={filterList}
          headerFormatter={{
            id: TableHeaderCell,
            completed: TableHeaderCell,
            title: TableHeaderCell,
            userId: TableHeaderCell,
          }}
          numberOfPages={totalPages}
          onChangePage={setPage}
          onChangeRowsPerPage={setRowsPerPage}
          onUpdateFilter={updateFilter}
          options={options}
          paginationElement={ExamplePaginationButton}
          subTitle="My Filterable Data Table"
          title="My Table"
        />
      </>
    );
  })
  .add("Multiple Tables (Hooks)", () => {
    const {
      data: todoData,
      isLoading: isTodoLoading,
      options: todoOptions,
    } = useDataTable<ITodos>({
      fetch: loadTodoData,
      options: {
        rowsPerPage: 20,
      },
    });

    const {
      data: photosData,
      isLoading: isPhotosLoading,
      options: photosOptions,
    } = useDataTable<IPhotos>({
      fetch: loadPhotosData,
      options: {
        rowsPerPage: 20,
      },
    });

    return (
      (isTodoLoading && isPhotosLoading && <div>Loading Tables</div>) || (
        <div>
          <Table<ITodos>
            columnFormatter={{
              completed: b => <p>{b ? "true" : "false"}</p>,
            }}
            data={todoData}
            headerFormatter={{
              id: TableHeaderCell,
              completed: TableHeaderCell,
              title: TableHeaderCell,
              userId: TableHeaderCell,
            }}
            options={todoOptions}
            title="Todos"
          />
          <Table<IPhotos>
            columnFormatter={{ thumbnailUrl: value => <img src={value}></img> }}
            data={photosData}
            headerFormatter={{
              id: null,
              albumId: null,
              thumbnailUrl: null,
              title: null,
              url: null,
            }}
            options={photosOptions}
            title="Photos"
          />
        </div>
      )
    );
  });
