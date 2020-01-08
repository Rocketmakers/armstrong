import * as React from "react";

import { storiesOf } from "@storybook/react";

import "../../theme/theme.scss";
import { TextInput } from "../../_symlink";
import { useForm } from "../../_symlink/components/form/formHooks";
import { IFormValidationResult } from "../../_symlink/components/form/formCore";

storiesOf("Form", module)
  .addParameters({
    options: {
      showAddonPanel: false
    }
  })
  .add("Binding / useForm", () => {
    const initialData = React.useMemo(
      () => ({
        inputOne: "foo",
        inputTwo: "bar",
        inputThree: 45
      }),
      []
    );

    const { dataBinder, DataForm, bind } = useForm(initialData);

    return (
      <>
        <p>
          A stateless data bindable form - state is held within the 'dataBinder'
          property. It triggers a rerender in the component containing the
          useForm hook upon each change in a bound form element, allowing the
          state returned in dataBinder to be used for (for example) API
          requests.
        </p>
        <p>
          The returned object bind contains methods that return binding props
          for various types, to be spread onto the Armstrong form components.
        </p>
        <pre>
          {`const initialData = React.useMemo(() => ({`}
          <br />
          {`  textValue: ''`}
          <br />
          {`  numValue: 0`}
          <br />
          {`}), [])`}
          <br />
          <br />
          {`const {dataBinder, DataForm, bind} = useForm(initialData)`}
          <br />
          <br />
          {`return (`}
          <br />
          {`  <DataForm>`}
          <br />
          {`    <TextInput {...bind.text("textValue")} />`}
          <br />
          {`    <TextInput {...bind.textNumeric("numValue")} />`}
          <br />
          <br />
          {`    <p>`}
          <br />
          {`      {JSON.stringify(dataBinder.toJson())}`}
          <br />
          {`    </p>`}
          <br />
          {`  </DataForm>`}
          <br />
          {`)`}
          <br />
        </pre>
        <br />
        <p>
          Change the values of these inputs to see the the useForm state trigger
          rerenders, updating the stringified JSON below
        </p>
        <br />
        <DataForm>
          <TextInput {...bind.text("inputOne")} />
          <TextInput {...bind.text("inputTwo")} />
          <TextInput {...bind.textNumeric("inputThree")} />
        </DataForm>
        <br />
        <p>{JSON.stringify(dataBinder.toJson())}</p>
      </>
    );
  })
  .add("Validation Errors", () => {
    const initialData = React.useMemo(
      () => ({
        inputOne: "foo",
        inputTwo: "bar",
        inputThree: 45
      }),
      []
    );

    const { DataForm, bind } = useForm(initialData);

    const validationErrors = React.useMemo<IFormValidationResult[]>(
      () => [
        // {
        //   attribute: "inputOne",
        //   message: "Something was wrong with this value"
        // },
        {
          attribute: "inputTwo",
          message: "Something was wrong with this value"
        },
        {
          attribute: "inputThree",
          message: "Something was wrong with this value"
        }
      ],
      []
    );

    return (
      <>
        <p>
          Validation errors are passed into the <strong>DataForm </strong>
          component to enable easy to handle form validation warnings on
          Armstrong input elements, bound using the <strong>useForm </strong>
          hook
        </p>
        <p>
          These errors must be passed into the validationResults prop of the
          <strong> DataForm</strong> component, and must be and array of objects
          shaped as follows
        </p>

        <pre>
          {`[
  {
    attribute: "THE KEY OF THE ATTRIBUTE IN THE BINDER",
    message: "THE MESSAGE TO DISPLAY IN VALIDATION"
  }
]`}
        </pre>

        <br />
        <br />

        <DataForm validationResults={validationErrors} validationMode="below">
          <TextInput {...bind.text("inputOne")} />
        </DataForm>
        <DataForm validationResults={validationErrors} validationMode="icon">
          <TextInput {...bind.text("inputTwo")} />
        </DataForm>
        <DataForm validationResults={validationErrors} validationMode="both">
          <TextInput {...bind.text("inputThree")} />
        </DataForm>
      </>
    );
  });
