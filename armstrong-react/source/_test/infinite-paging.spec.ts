import assert = require("assert");
import { act, renderHook } from "react-hooks-testing-library"
import { IInfinitePagingResult, useInfinitePaging } from "../hooks/useInfinitePaging";
import { utils } from "../utilities/utils";

function getFetcher(totalRecords: number, pageSize: number) {
  const results = utils.array.range(0, totalRecords).map(i => `item_` + i)
  const maxPage = Math.ceil(totalRecords / pageSize)
  return async (page: number): Promise<IInfinitePagingResult<string>> => {
    let nextPageToken = page + 1
    if (nextPageToken > maxPage) {
      nextPageToken = undefined
    }
    return { data: utils.array.getPage(results, page, pageSize), nextPageToken }
  }
}

describe("useInfinitePaging", () => {
  it("Basic", async () => {
    const pageSize = 5
    const totalRecords = 9
    const { result, waitForNextUpdate } = renderHook(() => useInfinitePaging({ fetch: getFetcher(totalRecords, pageSize), firstPageToken: 1 }))

    assert(result.current.items.length === 0, "Should have an empty items array on first render")
    assert(result.current.isFetching, "Should indicate isFetching on first render")
    assert(!result.current.hasData, "Should indicate no data on first render")
    assert(result.current.fetchError === undefined, "Should indicate no fetch error on first render")
    assert(!result.current.hasFinished, "Should indicate not finished on first render")

    await waitForNextUpdate()

    assert(result.current.items.length === pageSize, "Should have an items array on first update")
    assert(!result.current.isFetching, "Should indicate not isFetching on first update")
    assert(result.current.hasData, "Should indicate has data on first update")
    assert(result.current.fetchError === undefined, "Should indicate no fetch error on first update")
    assert(!result.current.hasFinished, "Should indicate not finished on first update")

    act(() => result.current.loadMore())

    assert(result.current.items.length === pageSize, "Should have an items array on load more")
    assert(result.current.isFetching, "Should indicate isFetching on load more")
    assert(result.current.hasData, "Should indicate has data on load more")
    assert(result.current.fetchError === undefined, "Should indicate no fetch error on load more")
    assert(!result.current.hasFinished, "Should indicate not finished on load more")

    await waitForNextUpdate()

    assert(result.current.items.length === totalRecords, "Should have an items array on loading more")
    assert(!result.current.isFetching, "Should indicate not isFetching on loading more")
    assert(result.current.hasData, "Should indicate has data on loading more")
    assert(result.current.fetchError === undefined, "Should indicate no fetch error on loading more")
    assert(result.current.hasFinished, "Should indicate finished on loading more")
  })
})
