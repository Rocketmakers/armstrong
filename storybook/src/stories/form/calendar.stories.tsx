import * as React from "react";
import { useForm, CalendarInput } from "../../_symlink";

import { storiesOf } from "@storybook/react";

import "../../theme/theme.scss";

storiesOf("Form/Calendar", module)
  .addParameters({
    options: {
      showAddonPanel: true
    }
  })
  .add("Standard", () => {
    const initialValue = React.useMemo(() => ({ value1: undefined }), []);
    const { DataForm } = useForm(initialValue);

    return (
      <DataForm>
        <CalendarInput />
      </DataForm>
    );
  })
  .add("AlwaysShow", () => {
    const initialValue = React.useMemo(() => ({ value1: undefined }), []);
    const { DataForm } = useForm(initialValue);

    return (
      <DataForm>
        <CalendarInput alwaysShowCalendar />
      </DataForm>
    );
  });
