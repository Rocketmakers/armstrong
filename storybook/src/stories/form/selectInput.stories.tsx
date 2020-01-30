import * as React from "react";
import { useForm, CodeInput, SelectInput } from "../../_symlink";

import { storiesOf } from "@storybook/react";

import "../../theme/theme.scss";

storiesOf("Form/SelectInput", module)
  .addParameters({
    options: {
      showAddonPanel: true
    }
  })
  .add("Standard", () => {
    const initialValue = React.useMemo(() => ({ value1: undefined }), []);
    const { bind, dataBinder, DataForm } = useForm(initialValue);

    console.log(dataBinder.toJson());

    return (
      <DataForm>
          <p>How you say hi?</p>

          <SelectInput placeholder="Please select" {...bind.select('value1')} options={[
              {id: 'hi', name: 'hi'},
              {id: 'hello', name: 'hello'},
          ]} />
      </DataForm>
    );
  });
