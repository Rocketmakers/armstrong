import * as React from "react";
import {
  useOptions,
  IAutoCompleteOption,
  AutoCompleteSingleInput,
  Icon
} from "../../_symlink";

import { storiesOf } from "@storybook/react";

import "../../theme/theme.scss";
import { AutoCompleteMultiInput } from "../../_symlink/components/form/inputs/autoCompleteMultiInput";

storiesOf("Form/AutocompleteInput", module)
  .addParameters({
    options: {
      showAddonPanel: true
    }
  })
  .add("Standard", () => {
    const { options, filter, setFilter } = useOptions([
      { id: 1, name: "1" },
      { id: 2, name: "2" },
      { id: 3, name: "3" }
    ]);
    const [value, onValueChange] = React.useState<IAutoCompleteOption>(
      undefined
    );
    return (
      <AutoCompleteSingleInput
        leftIcon={Icon.Icomoon.search}
        value={value}
        onValueChange={onValueChange}
        options={options}
        filter={filter}
        onFilterChange={setFilter}
      />
    );
  })
  .add("Multiple", () => {
    const { options, filter, setFilter } = useOptions([
      { id: 1, name: "1" },
      { id: 2, name: "2" },
      { id: 3, name: "3" }
    ]);
    const [value, onValueChange] = React.useState<IAutoCompleteOption[]>(
      []
    );
    return (
      <AutoCompleteMultiInput
        leftIcon={Icon.Icomoon.search}
        value={value}
        onValueChange={onValueChange}
        options={options}
        filter={filter}
        onFilterChange={setFilter}
      />
    );
  });
