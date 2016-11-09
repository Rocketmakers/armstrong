import * as React from "react";
import { Form } from "./../../../source/components/simpleForm/form"
import { TextInput } from './../../../source/components/simpleForm/inputs/textInput';
import { Button } from './../../../source/components/interaction/button'

interface Name {
  firstName: string;
  lastName: string;
}

export class NameForm extends React.Component<{}, { name: Name }> {
  constructor() {
    super();
    this.state = { name: { firstName: "", lastName: "" } }
  }
  render() {
    return (
      <Form entity={this.state.name}>
        <TextInput prop="firstName" />
        <TextInput prop="lastName" />
        <Button className="bg-positive" onClick={() => alert(JSON.stringify(this.state.name))}>Submit</Button>
      </Form>
    )
  }
}