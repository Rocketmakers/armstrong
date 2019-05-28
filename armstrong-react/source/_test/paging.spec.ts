import assert = require("assert");
import { act, renderHook } from "react-hooks-testing-library"
import { IPagingResult, usePaging } from "../hooks/usePaging";
import { utils } from "../utilities/utils";

function getFetcher(totalRecords: number) {
  const results = utils.array.range(0, totalRecords).map(i => `item_` + i)
  return async (page: number, pageSize: number): Promise<IPagingResult<string>> => {
    return { data: utils.array.getPage(results, page, pageSize), totalRecords: results.length }
  }
}

describe("usePaging", () => {
  it("Basic", async () => {
    const pageSize = 5
    const totalRecords = 29
    const totalPages = 6
    const { result, waitForNextUpdate } = renderHook(() => usePaging({ fetch: getFetcher(totalRecords), pageSize }))

    assert(result.current.items.length === 0, "Should have an empty items array on first render")
    assert(result.current.isFetching, "Should indicate isFetching on first render")
    assert(!result.current.hasData, "Should indicate no data on first render")
    assert(result.current.totalPages === undefined, "Should indicate undefined total paged on first render")
    assert(result.current.totalRecords === undefined, "Should indicate undefined total records on first render")
    assert(result.current.currentPage === undefined, "Should indicate undefined current page on first render")

    await waitForNextUpdate()

    assert(result.current.items.length === pageSize, "Should have an items array on first update")
    assert(!result.current.isFetching, "Should indicate not isFetching on first update")
    assert(result.current.hasData, "Should indicate has data on first update")
    assert(result.current.totalPages === totalPages, "Should indicate total paged on first update")
    assert(result.current.totalRecords === totalRecords, "Should indicate total records on first update")
    assert(result.current.currentPage === 1, "Should indicate current page 1 on first update")

    act(() => result.current.gotoPage(6))

    assert(result.current.items.length === pageSize, "Should have an items array on goto page")
    assert(result.current.isFetching, "Should indicate isFetching on goto page")
    assert(result.current.hasData, "Should indicate has data on goto page")
    assert(result.current.totalPages === totalPages, "Should indicate total paged on goto page")
    assert(result.current.totalRecords === totalRecords, "Should indicate total records on goto page")
    assert(result.current.currentPage === 1, "Should indicate current page 1 on goto page")

    await waitForNextUpdate()

    assert(result.current.items.length === 4, "Should have an items array on last page")
    assert(!result.current.isFetching, "Should indicate not isFetching on last page")
    assert(result.current.hasData, "Should indicate has data on last page")
    assert(result.current.totalPages === totalPages, "Should indicate total paged on last page")
    assert(result.current.totalRecords === totalRecords, "Should indicate total records on last page")
    assert(result.current.currentPage === 6, "Should indicate current page 6 on last page")

  })
})
