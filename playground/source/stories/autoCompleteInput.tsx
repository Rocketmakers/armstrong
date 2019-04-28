import { storiesOf } from "../story-host";
import * as React from 'react'
import { AutoCompleteSingleInput, useRemoteOptions, AutoCompleteMultiInput, IAutoCompleteOption, AutoComplete } from '../_symlink/components/form/inputs/autoComplete';

function createOption(text: string, id: number) {
  return { id: id, name: text + "-" + id }
}
async function fetch(text: string): Promise<IAutoCompleteOption[]> {
  if (!text) {
    return []
  }
  return [
    createOption(text, 1),
    createOption(text, 2),
    createOption(text, 3),
    createOption(text, 4),
    createOption(text, 5),
  ]
}

storiesOf("AutoComplete", AutoComplete)
  .add("Remote Options", () => {
    const { options, filter, setFilter } = useRemoteOptions(fetch)
    const [option, setOption] = React.useState<IAutoCompleteOption>(undefined)
    return <AutoCompleteSingleInput options={options} value={option} onValueChange={setOption} filter={filter} onFilterChange={setFilter} />
  })
  .add("Remote Options - Multi", () => {
    const { options, filter, setFilter } = useRemoteOptions(fetch)
    const [option, setOption] = React.useState<IAutoCompleteOption[]>(undefined)
    return <AutoCompleteMultiInput options={options} value={option} onValueChange={setOption} filter={filter} onFilterChange={setFilter} />
  })
