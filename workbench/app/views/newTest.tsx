import * as React from "react";
import { TagInput } from "armstrong-react";
import { IDataBinder } from "../../../armstrong-react/dist/components/form/formCore";
import { ISample } from "./sampleForm";
import { Form, ParentFormContext } from "../../../armstrong-react/dist/components/form/form";
import { Button } from "../../../armstrong-react/dist/components/interaction/button";
import { TimeInput } from "../../../armstrong-react/dist/components/form/inputs/timeInput";

const suggestions=["apple", "orange", "pear", "Peach", "Apple", "Avocado", "Plum"]

export class NewTest extends React.Component<{}, { binder: IDataBinder<{ tags: string[]; time: string }> }> {
  constructor(props) {
    super(props);
    this.state = { binder: Form.jsonDataBinder({ tags: ["hello", "world"], time: null }) };
  }
  render() {
    return (
      <Form focusFirstEmptyInput={true} dataBinder={this.state.binder} onDataBinderChange={d => this.setState({ binder: d })}>
        <div className="p-medium">
          <label>Tag your boy</label>
          <ChildFormBinding/>
          <TagInput {...Form.Bind.tagInput("tags")} suggestions={suggestions} />
          <TimeInput zeroMinutesOnHourSelected={true} {...Form.Bind.timeInput("time")} />
          <Button onClick={() => alert(JSON.stringify(this.state.binder.toJson()))}>bam</Button>
        </div>
      </Form>
    );
  }
}

class ChildFormBinding extends React.Component{
  render(){
    return (
      <ParentFormContext>
          <TagInput {...Form.Bind.tagInput("tags")} suggestions={suggestions} />
      </ParentFormContext>
    )
  }
}