import * as React from "react";
import { TagInput } from "armstrong-react";
import { IDataBinder } from "../../../armstrong-react/dist/components/form/formCore";
import { ISample } from "./sampleForm";
import { Form, ParentFormContext } from "../../../armstrong-react/dist/components/form/form";
import { Button } from "../../../armstrong-react/dist/components/interaction/button";
import { TimeInput } from "../../../armstrong-react/dist/components/form/inputs/timeInput";
import { CodeInput } from "../../../armstrong-react/dist/components/form/inputs/codeInput";
import { TextInput } from "../../../armstrong-react/dist/components/form/inputs/textInput";
import { TabControl, TabItem } from "../../../armstrong-react/dist/components/navigation/tabControl";
import { BurgerMenu, BurgerMenuItem } from "../../../armstrong-react/dist/components/navigation/burgerMenu";

const suggestions = ["apple", "orange", "pear", "Peach", "Apple", "Avocado", "Plum"]

export class NewTest extends React.Component<{}, { code: string, binder: IDataBinder<{ tags: string[]; time: string; code: string, nested: { propA?: string, propB?: string } }> }> {
  constructor(props) {
    super(props);
    this.state = {
      code: "",
      binder: Form.jsonDataBinder({ name: "test", tags: ["hello", "world"], time: null, code: "", nested: { propA: "cool", propB: "beans" } })
     };
  }
  updateProp(){
    //this.state.binder.setValue("nested.propA", "hello");
    this.state.binder.setKeyValue("nested", { propA: "hello", propB: "world" });
    this.forceUpdate()
  }
  render() {
    let validations = [
      { attribute: "name", message: "arghhh" },
    ];
    return (
      <div>

        <Form focusFirstEmptyInput={true} dataBinder={this.state.binder} validationResults={validations} onDataBinderChange={d => this.setState({ binder: d })}>
        <TextInput {...Form.Bind.text("name")} />
        <TextInput {...Form.Bind.text("nested.propA")} />
        <TextInput {...Form.Bind.text("nested.propB")} />

        </Form>
        <Button onClick={()=> this.updateProp()}>Update nested prop</Button>

      </div>
    );
  }
}

class ChildFormBinding extends React.Component {
  render() {
    return (
      <ParentFormContext>
        <TagInput {...Form.Bind.tagInput("tags") } suggestions={suggestions} />
      </ParentFormContext>
    )
  }
}