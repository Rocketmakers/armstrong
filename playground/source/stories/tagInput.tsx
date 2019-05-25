import { storiesOf } from "../story-host";
import { TagInput, ITagInputProps } from '../_symlink';
import * as React from 'react'

storiesOf("TagInput", TagInput)
  .add("Basic", () => {
    return <TagInputTest />
  })
  .add("Suggestions", () => {
    return <TagInputTest suggestions={["a", "a1", "b", "c", "d", "e"]} />
  })
  .add("Set Tags", () => {
    const [time, setTime] = React.useState<string[]>([])
    return (
      <>
        <button onClick={() => setTime(["hello"])}>hello</button>
        <button onClick={() => setTime(["17", "05"])}>17, 05</button>
        <button onClick={() => setTime([])}>Empty</button>
        <TagInputTest value={time} onTagsChange={setTime} />
      </>
    )
  })


const TagInputTest: React.FC<ITagInputProps> = p => {
  const [tags, setTags] = React.useState<string[]>([])
  const onTimeChanged = React.useCallback((selected: string[]) => {
    setTags([...tags, JSON.stringify(selected)])
    p.onTagsChange && p.onTagsChange(selected)
  }, [tags])
  return (
    <>
      {/* <input type="text" /> */}
      <TagInput {...p} onTagsChange={onTimeChanged} />
      <ul>
        {tags.map((d, i) => <li key={i}>{d}</li>)}
      </ul>
    </>
  )
}