import * as React from "react";
import { withRouter } from "react-router";
import { SampleForm } from "./sampleForm";

interface IFormComponentProps extends React.Props<FormComponent> {}

export class FormComponent extends React.Component<IFormComponentProps, {}> {
  render() {
    return <SampleForm sample={{ id: "s101", name: "", birthMonthDay: "", tags: [], accepts: true, reputation: 3 }} />;
  }
}

export const Form = FormComponent;
