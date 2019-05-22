import { storiesOf } from "../story-host";
import { CodeInput, ICodeInputProps } from '../_symlink';
import * as React from 'react'

storiesOf("CodeInput", CodeInput)
  .add("Simple", () => {
    return <CodeInputTest />
  })
  .add("Seeded", () => {
    return <CodeInputTest value="123456" />
  })


const CodeInputTest: React.FC<ICodeInputProps> = p => {
  const [tags, setTags] = React.useState<string[]>([])
  const onTimeChanged = React.useCallback((selected: string | number) => {
    setTags([...tags, JSON.stringify(selected)])
    p.onCodeChange && p.onCodeChange(selected)
  }, [tags])
  return (
    <>
      {/* <input type="text" /> */}
      <CodeInput {...p} onCodeChange={onTimeChanged} />
      <ul>
        {tags.map((d, i) => <li key={i}>{d}</li>)}
      </ul>
    </>
  )
}