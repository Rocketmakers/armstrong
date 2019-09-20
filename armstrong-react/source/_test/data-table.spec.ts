import assert = require("assert");
import { act, renderHook } from "react-hooks-testing-library";
import { IUseDataTableResult } from "../components/tables/tableTypes";
import { useDataTable } from "../hooks/useDataTable";
import { utils } from "../utilities/utils";

const todoDataUrl = "https://jsonplaceholder.typicode.com/todos";

interface ITodos {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

const localData: ITodos[] = [
  {
    userId: 1,
    id: 1,
    title: "delectus aut autem",
    completed: false,
  },
  {
    userId: 2,
    id: 2,
    title: "quis ut nam facilis et officia qui",
    completed: false,
  },
  {
    userId: 3,
    id: 3,
    title: "fugiat veniam minus",
    completed: false,
  },
  {
    userId: 4,
    id: 4,
    title: "et porro tempora",
    completed: true,
  },
  {
    userId: 5,
    id: 5,
    title: "et porro tempora",
    completed: true,
  },
  {
    userId: 6,
    id: 6,
    title: "delectus aut autem",
    completed: false,
  },
  {
    userId: 7,
    id: 7,
    title: "quis ut nam facilis et officia qui",
    completed: false,
  },
  {
    userId: 8,
    id: 8,
    title: "fugiat veniam minus",
    completed: false,
  },
  {
    userId: 9,
    id: 9,
    title: "et porro tempora",
    completed: true,
  },
  {
    userId: 10,
    id: 10,
    title: "et porro tempora",
    completed: true,
  },
];

async function loadTodoData() {
  return async (): Promise<IUseDataTableResult<ITodos>> => {
    return { data: localData };
  };
}

describe("useDataTable", () => {
  it("Simple", async () => {
    const rowsPerPage = 5;
    const { result } = renderHook(() =>
      useDataTable({ data: localData, options: { rowsPerPage } }),
    );
    assert(
      result.current.data.length === localData.length,
      "Should have an data on first render",
    );
    assert(
      result.current.options.rowsPerPage === rowsPerPage,
      `Rows should equal ${rowsPerPage}`,
    );
  });

  it("Pagination", async () => {
    const rowsPerPage = 5;
    const totalPages = localData.length / rowsPerPage;
    const { result } = renderHook(() =>
      useDataTable({
        data: localData,
        options: { rowsPerPage, paginate: true },
      }),
    );

    assert(
      result.current.data.length === localData.length,
      "Should have an data on first render",
    );
    assert(
      result.current.options.rowsPerPage === rowsPerPage,
      `Rows should equal ${rowsPerPage}`,
    );
    assert(
      result.current.totalPages === totalPages,
      `Should have ${totalPages}`,
    );
    assert(result.current.currentPage === 1, `Should be on page 1`);
    act(() => result.current.setPage(2));
    assert(result.current.currentPage === 2, `Should be on page 2`);
  });

  it("Pagination set rows", async () => {
    const defaultRowsPerPage = 5;
    const newRowsPerPage = 10;
    const defaultTotalPages = localData.length / defaultRowsPerPage;

    const { result } = renderHook(() =>
      useDataTable({
        data: localData,
        options: { rowsPerPage: defaultRowsPerPage, paginate: true },
      }),
    );

    assert(
      result.current.data.length === localData.length,
      "Should have an data on first render",
    );
    assert(
      result.current.options.rowsPerPage === defaultRowsPerPage,
      `Rows should equal ${defaultRowsPerPage}`,
    );
    assert(
      result.current.totalPages === defaultTotalPages,
      `Should have ${defaultTotalPages}`,
    );
    assert(result.current.currentPage === 1, `Should be on page 1`);

    act(() => result.current.setRowsPerPage(newRowsPerPage));

    // assert(result.current.currentPage === 1, `Should be on page 1`);
    // assert(result.current.totalPages === 1, `Should be on page 1`);
    // assert(
    //   result.current.data.length === defaultRowsPerPage,
    //   `Should be on page 1`,
    // );
  });
});
