import * as React from "react";
import {
  IAutoCompleteOption,
  AutoCompleteSingleInput,
  Icon
} from "../../_symlink";
import { AutoCompleteMultiInput } from "../../_symlink/components/form/inputs/autoCompleteMultiInput";

import { storiesOf } from "@storybook/react";

import "../../theme/theme.scss";

storiesOf("Form/AutocompleteInput", module)
  .addParameters({
    options: {
      showAddonPanel: false
    }
  })
  .add("Standard", () => {
    const [value, onValueChange] = React.useState<IAutoCompleteOption>(
      undefined
    );

    const [filter, setFilter] = React.useState<string>();

    const opts = [
      { id: 1, name: "1" },
      { id: 2, name: "2" },
      { id: 3, name: "3" }
    ];
    return (
      <AutoCompleteSingleInput
      value={value}
      onValueChange={onValueChange}
        leftIcon={Icon.Icomoon.search}
        options={opts}
        filter={filter}
        onFilterChange={f => setFilter(f)}
        canClear={true}
      />
    );
  })
  .add("Multiple", () => {
    const [value, onValueChange] = React.useState<IAutoCompleteOption[]>(
      []
    );

    const [filter, setFilter] = React.useState<string>();

    const opts = [
      { id: 1, name: "1" },
      { id: 2, name: "2" },
      { id: 3, name: "3" }
    ];
    return (
      <AutoCompleteMultiInput
        leftIcon={Icon.Icomoon.search}
        value={value}
        onValueChange={onValueChange}
        options={opts}
        filter={filter}
        onFilterChange={setFilter}
      />
    );
  });
