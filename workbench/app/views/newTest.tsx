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

export class NewTest extends React.Component<{}, { code: string, binder: IDataBinder<{ tags: string[]; time: string; code: string }> }> {
  constructor(props) {
    super(props);
    this.state = {
      code: "",
      binder: Form.jsonDataBinder({ tags: ["hello", "world"], time: null, code: "" })
     };
  }
  render() {
    let validations = [
      { attribute: "name", message: "arghhh" },
    ];
    return (
      <div>
        <TextInput tabIndex={1}/>
        <CodeInput tabIndex={2} lengthPerBox={[2,2,2,2]} onChange={v => this.setState({ code: v})}/>
        <p>{this.state.code}</p>

        <Form dataBinder={this.state.binder} onDataBinderChange={d => this.setState({ binder: d })}>
        <CodeInput tabIndex={2} lengthPerBox={[1, 1, 1, 1, 1, 1, 1, 1]} {...Form.Bind.codeInput("code")} />
        </Form>
        <p>{this.state.binder.toJson().code}</p>

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