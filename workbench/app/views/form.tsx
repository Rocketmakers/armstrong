import * as React from "react";
import { withRouter, InjectedRouter } from 'react-router';
import { SampleForm } from './sampleForm';

interface IFormComponentProps extends React.Props<FormComponent> {

}

export class FormComponent extends React.Component<IFormComponentProps, {}> {
  render(){
    return <SampleForm sample={{ id: "s101", name: "Keith2", birthMonthDay: "", tags: [], accepts: true }} />
  }
}

export const Form = withRouter(FormComponent)