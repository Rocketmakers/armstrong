import * as React from "react"
import { useForm, ThrottledTextInput, TextInput } from "../../_symlink"

import { storiesOf } from "@storybook/react"

import "../../theme/theme.scss"

storiesOf("Form/ThrottledTextInput", module)
  .addParameters({
    options: {
      showAddonPanel: true
    }
  })
  .add("Standard", () => {
    const initialValue = React.useMemo(() => ({ value1: "" }), [])
    const { bind, dataBinder, DataForm } = useForm(initialValue)

    return (
      <DataForm>
        <p>Can be bound like a normal text input, but only updates the value every x milliseconds after the user has stopped typing.</p>
        <p>
          Type here: <ThrottledTextInput className="m-top-xxsmall" {...bind.text("value1")} />
        </p>
        <p>
          Your throttled value is here: <TextInput className="m-top-xxsmall" disabled={true} value={dataBinder.getKeyValue("value1")} />
        </p>
      </DataForm>
    )
  })
