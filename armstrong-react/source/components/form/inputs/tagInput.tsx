import * as React from "react";
import * as _ from "underscore";
import { IFormInputHTMLProps } from "../form";
import { Icon } from "./../../display/icon";
import { ValidationLabel } from "../validationWrapper";
import { ClassHelpers } from "../../../utilities/classNames";

export type ITagInputProps = IFormInputHTMLProps<TagInput, React.InputHTMLAttributes<HTMLInputElement>> & {
  suggestions?: string[];
  onChange?: (tags: string[]) => any;
  value?: string[];
};

export class TagInput extends React.Component<ITagInputProps, { tags: string[]; suggestions: string[] }> {
  static defaultProps = {};
  public input: HTMLInputElement | HTMLTextAreaElement;
  constructor(props) {
    super(props);
    this.state = { tags: [], suggestions: [] };
  }
  public focus() {
    if (this.input) {
      this.input.focus();
    }
  }
  public blur() {
    if (this.input) {
      this.input.blur();
    }
  }

  componentWillMount() {
    this.setState({ tags: this.props.value || [] });
  }

  findOne(haystack: any[], arr: any[]) {
    return arr.some(function(v) {
      return haystack.indexOf(v) >= 0;
    });
  }

  handleKeys(e: React.KeyboardEvent<HTMLInputElement>) {
    let input = e.target;
    let value = input["value"];
    if (e.keyCode === 13 && value) {
      let match = this.state.tags.indexOf(value);
      if (match === -1) {
        let tags = [...this.state.tags, value];
        this.setState({ tags, suggestions: [] });
        this.props.onChange(tags);
      }
      input["value"] = "";
      return;
    }
    if (value) {
      let filteredSuggestions = this.props.suggestions.filter(s => s.lastIndexOf(value, 0) === 0);
      let suggestions = filteredSuggestions.filter(s => this.state.tags.indexOf(s) === -1);
      this.setState({ suggestions });
    } else {
      this.setState({ suggestions: [] });
    }
  }
  handleDeletion(e: React.KeyboardEvent<HTMLInputElement>) {
    let input = e.target;
    let value = input["value"];
    if (e.keyCode === 8 && this.state.tags.length !== 0 && !value) {
      let tags = _.clone(this.state.tags);
      tags.splice(-1, 1);
      this.setState({ tags, suggestions: [] });
      this.props.onChange(tags);
    }
  }
  addTag(tag: string) {
    let tags = [...this.state.tags, tag];
    this.setState({ tags, suggestions: [] });
    this.props.onChange(tags);
    this.input.value = "";
    this.input.focus();
  }

  removeTag(index: number) {
    let tags = _.clone(this.state.tags);
    tags.splice(index, 1);
    this.setState({ tags });
    this.input.focus();
  }

  render() {
    const validationMessage = this.props["data-validation-message"];
    var classes = ClassHelpers.classNames("armstrong-input", "tag-input", this.props.className, {
      "show-validation": this.props.validationMode !== "none" && validationMessage
    });
    return (
      <div className={classes}>
        {this.state.tags.map((t, i) => (
          <div className="tag">
            {t}
            <Icon icon={Icon.Icomoon.cross} onClick={() => this.removeTag(i)} />
          </div>
        ))}
        <input onKeyDown={e => this.handleDeletion(e)} ref={r => (this.input = r)} onKeyUp={e => this.handleKeys(e)} type="text" />
        {this.props.suggestions && this.state.suggestions.length !== 0 && <div className="suggestions">{this.state.suggestions.map(s => <div onClick={() => this.addTag(s)}>{s}</div>)}</div>}
        <ValidationLabel message={validationMessage} mode={this.props.validationMode} />
      </div>
    );
  }
}
