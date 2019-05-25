import { storiesOf } from "../story-host";
import * as React from 'react'
import { AutoCompleteInput, useRemoteOptions, IAutoCompleteOption, useOptions, AutoCompleteMultiInput, AutoCompleteSingleInput } from '../_symlink';

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

// storiesOf("AutoCompleteInput", AutoCompleteInput)
//   .add("Options", () => {
//     // const { options, filter, setFilter } = useRemoteOptions(fetch)
//     const [value, onValueChange] = React.useState<IAutoCompleteOption | IAutoCompleteOption[]>(undefined)
//     return (
//       <>
//         {`Value: ${JSON.stringify(value)}`}
//         <AutoCompleteInput options={[{ id: 1, name: "1" }, { id: 2, name: "2" }, { id: 3, name: "3" }]} value={value} onSelected={onValueChange} />
//       </>
//     )
//   })

storiesOf("AutoCompleteSingleInput", AutoCompleteSingleInput)
  .add("Options", () => {
    const { options, filter, setFilter } = useOptions([{ id: 1, name: "1" }, { id: 2, name: "2" }, { id: 3, name: "3" }])
    const [value, onValueChange] = React.useState<IAutoCompleteOption>(undefined)
    return (
      <>
        {`Value: ${JSON.stringify(value)}`}
        <AutoCompleteSingleInput value={value} onValueChange={onValueChange} options={options} filter={filter} onFilterChange={setFilter} />
      </>
    )
  })
  .add("Remote Options", () => {
    const { options, filter, setFilter } = useRemoteOptions(fetch)
    const [value, onValueChange] = React.useState<IAutoCompleteOption>(undefined)
    return (
      <>
        {`Value: ${JSON.stringify(value)}`}
        <AutoCompleteSingleInput options={options} value={value} onValueChange={onValueChange} filter={filter} onFilterChange={setFilter} />
      </>
    )
  })

storiesOf("AutoCompleteMultiInput", AutoCompleteMultiInput)
  .add("Options", () => {
    const { options, filter, setFilter } = useOptions([{ id: 1, name: "1" }, { id: 2, name: "2" }, { id: 3, name: "3" }])
    const [value, onValueChange] = React.useState<IAutoCompleteOption[]>([])
    return (
      <>
        <AutoCompleteMultiInput options={options} value={value} onValueChange={onValueChange} filter={filter} onFilterChange={setFilter} />
        {JSON.stringify(value)}
      </>
    )
  })
  .add("Remote Options", () => {
    const { options, filter, setFilter } = useRemoteOptions(fetch)
    const [value, onValueChange] = React.useState<IAutoCompleteOption[]>([])
    return (
      <>
        <AutoCompleteMultiInput options={options} value={value} onValueChange={onValueChange} filter={filter} onFilterChange={setFilter} />
        {JSON.stringify(value)}
      </>
    )
  })
