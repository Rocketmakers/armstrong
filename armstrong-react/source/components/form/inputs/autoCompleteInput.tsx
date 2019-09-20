import * as React from "react";
import { AutoCompleteMultiInput } from "./autoCompleteMultiInput";
import { IAutoCompleteOption, IAutoCompleteProps } from "./autoCompleteOptionHooks";
import { AutoCompleteSingleInput } from "./autoCompleteSingleInput";

export type IAutoCompleteSelectProps<TMulti extends "single" | "multiple", TOption> = { multiSelect: TMulti } & IAutoCompleteProps<TOption>

export const AutoCompleteInput: React.FunctionComponent<IAutoCompleteSelectProps<"single", IAutoCompleteOption> | IAutoCompleteSelectProps<"multiple", IAutoCompleteOption[]>> = p => {
  if (p.multiSelect === "multiple") {
    return <AutoCompleteMultiInput {...p} />
  }
  return <AutoCompleteSingleInput {...p} />
}
