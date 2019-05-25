import { utils } from "../../../utilities/utils";

function addValue<T>(values: T[], item: T) {
  if (!values) {
    return [item]
  }

  return [...values, item].sort()
}
function removeValue<T>(values: T[], item: T) {
  if (!values) {
    return []
  }

  return utils.array.filter(values, i => i !== item)
}

export function arrayIncludesValue<T>(values: T[], item: T) {
  return !!values && values.indexOf && values.indexOf(item) > -1
}

export function arrayToggleItem<T>(values: T[], item: T) {
  if (!arrayIncludesValue(values, item)) {
    return addValue(values, item)
  }

  return removeValue(values, item)
}
