import * as React from "react";
import * as _ from "underscore";
import { IFormValidationResult, DataValidationMessage } from "../formCore";
import { Grid, Row, Col } from "../../layout/grid";
import { IFormInputProps, IFormInputHTMLProps } from "../form";
import { ClassHelpers } from "../../../index";
import { ValidationLabel } from "../validationWrapper";

export interface ICodeInputProps extends IFormInputHTMLProps<React.SelectHTMLAttributes<HTMLInputElement>> {
  lengthPerBox: number[];
  onChange?: (value: any) => void;
  value?: string;
  placeholder?: string;
  type?: string;
  numeric?: boolean;
  readonly?: boolean;
}

export class CodeInput extends React.Component<ICodeInputProps, { focusIndex: number }> {
  static defaultProps: Partial<ICodeInputProps> = {
    lengthPerBox: [2, 2, 2],
    validationMode: "none"
  };
  constructor(props) {
    super(props);
    this.state = { focusIndex: null };
  }
  private uniq = Math.random();
  focusNext(e: React.KeyboardEvent<HTMLInputElement>) {
    let movingBack = false;
    let current = e.target as HTMLInputElement;
    let el;
    let currentVal = current.value.trim();
    let lpb = this.props.lengthPerBox[this.state.focusIndex];
    let retFromStore = false;
    currentVal = currentVal.slice(0, lpb);
    if (e.keyCode === 8) {
      movingBack = true;
      if (currentVal.length === 0) {
        el = current.previousSibling as HTMLInputElement;
      } else {
        el = current;
      }
    } else {
      el = current.nextSibling as HTMLInputElement;

      if (this.storedKey && el && !el.value) {
        el.value = this.storedKey;
        this.storedKey = null;
        retFromStore = true;
      }
    }
    if (currentVal.length < lpb && !movingBack) {
      return;
    }
    if (el) {
      el.focus();
      if (el && el.value && !movingBack && !retFromStore) {
        el.value = "";
      }
    }
    this.buildValue();
  }
  buildValue() {
    let value: string | number = "";

    let current = document.getElementById(`input_${this.uniq}_0`) as HTMLInputElement;

    this.props.lengthPerBox.forEach((lpb, i) => {
      value += current.value;
      current = current.nextSibling as HTMLInputElement;
    });

    if (this.props.numeric) {
      value = parseInt(value);
    }
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  }
  handlePaste(e) {
    var length = _.reduce(
      this.props.lengthPerBox,
      function(memo, num) {
        return memo + num;
      },
      0
    );
    let pasted: string = e.clipboardData.getData("text/plain").replace(/\s/g, "");
    pasted = pasted.substr(0, length);

    if (this.props.numeric) {
      let parsed = parseInt(pasted);
      if (isNaN(parsed)) {
        e.preventDefault();
        return false;
      }
    }

    let current = e.target as HTMLInputElement;
    let splitArray = [];

    let currentIndex = 0;

    this.props.lengthPerBox.forEach((lpb, i) => {
      let chunk = pasted.substr(currentIndex, lpb);
      currentIndex += lpb;
      splitArray.push(chunk);
      current.value = chunk;
      current = current.nextSibling as HTMLInputElement;
    });

    this.buildValue();
  }
  handleFocus(index: number, input: HTMLInputElement) {
    this.setState({ focusIndex: index });
    this.storedKey = null;
  }
  private storedKey;
  keyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    console.log(e.key)
    let lpb = this.props.lengthPerBox[this.state.focusIndex];
    let selectionLength = window.getSelection().toString().length;
    if (selectionLength === lpb) {
      return;
    }
    if (e.currentTarget["value"].length === lpb) {

      if (e.keyCode >= 48 && e.keyCode <= 57) {
        this.storedKey = e.key;
      }
      if (e.keyCode >= 65 && e.keyCode <= 90) {
        this.storedKey = e.key;
      }
    }
  }
  handleClick(e: React.MouseEvent<HTMLInputElement>) {
    if (e.currentTarget.value) {
      e.currentTarget.select();
    }
  }

  componentDidMount() {
    if (this.props.value) {
      let currentIndex = 0;
      this.props.lengthPerBox.forEach((lpb, i) => {
        let input = document.getElementById(`input_${this.uniq}_${i}`) as HTMLInputElement;
        let chunk = this.props.value.substr(currentIndex, lpb);
        currentIndex += lpb;
        input.value = chunk;
      });
    }
  }
  calcTabIndex(tabIndex: number | undefined, fieldIndex: number){
    if (tabIndex === undefined || tabIndex === -1){
      return tabIndex;
    }
    return tabIndex + fieldIndex;
  }
  render() {
    const validationMessage = DataValidationMessage.get(this.props);
    const { onChange, validationMode, lengthPerBox, numeric, type, className, tabIndex, ...attrs } = this.props;
    const classes = ClassHelpers.classNames("armstrong-input", "code-input", this.props.className, {
      "show-validation": validationMode !== "none" && validationMessage
    });
    return (
      <div className={classes}>
        <div>
          {this.props.lengthPerBox.map((lpb, i) => (
            <input
              id={`input_${this.uniq}_${i}`}
              className="code-input-field"
              tabIndex={this.calcTabIndex(this.props.tabIndex, i)}
              key={`cb_${this.uniq}_${i}`}
              type={this.props.type || "text"}
              placeholder={this.props.placeholder}
              maxLength={lpb}
              readOnly={this.props.readonly}
              onClick={e => this.handleClick(e)}
              onFocus={e => this.handleFocus(i, e.target as HTMLInputElement)}
              onKeyUp={e => this.focusNext(e)}
              onKeyDown={e => this.keyDown(e)}
              onPaste={e => this.handlePaste(e)}
              onChange={e => this.buildValue()}
            />
          ))}
        </div>
        <ValidationLabel message={validationMessage} mode={validationMode} />
      </div>
    );
  }
}
