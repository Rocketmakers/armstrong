import * as React from "react";
import * as _ from "underscore";
import { Grid, Row } from '../../layout/grid';
import { ClassHelpers } from '../../../index';
import { DataValidationMessage } from '../formCore';
import { ValidationLabel } from '../validationWrapper';
import { IFormInputHTMLProps } from '../form';

export interface ICodeInputProps extends IFormInputHTMLProps<CodeInput, React.SelectHTMLAttributes<HTMLInputElement>> {
  length: number;
  lengthPerBox?: number;
  onChange?: (value: any) => void;
  value?: string;
  placeholder?: string;
  type?: string;
  numeric?: boolean;
  readonly?: boolean;
  blurOnEnd?: boolean;
}

export class CodeInput extends React.Component<ICodeInputProps, {}> {
  static defaultProps: Partial<ICodeInputProps> = {
    validationMode: "none",
    lengthPerBox: 1
  }
  private uniq = Math.random();
  focusNext(e: React.KeyboardEvent<HTMLInputElement>) {
    let movingBack = false;
    let current = (e.target as HTMLInputElement);
    let el;
    current.value = current.value.slice(0, this.props.lengthPerBox);
    if (e.keyCode === 8) {
      movingBack = true;
      if (current.value.length === 0) {
        el = (current.previousSibling as HTMLInputElement);
      } else {
        el = current;
      }
    } else {
      el = (current.nextSibling as HTMLInputElement);
    }
    if (current.value.length < this.props.lengthPerBox && !movingBack) {
      return;
    }
    if (el) {
      el.focus();
    }
    else {
      if (!movingBack && this.props.blurOnEnd) {
        current.blur();
      }
    }
  }
  buildValue() {
    let value: string | number = "";
    for (var index = 0; index < (this.props.length / this.props.lengthPerBox); index++) {
      var element = document.getElementById(`input_${this.uniq}_${index}`) as HTMLInputElement;
      value += element.value;
    }
    if (this.props.numeric) {
      value = parseInt(value);
    }
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  }
  handlePaste(e) {
    let pasted: string = e.clipboardData.getData('text/plain');
    pasted = pasted.substr(0, this.props.length);
    if (this.props.numeric) {
      let parsed = parseInt(pasted);
      if (isNaN(parsed)) {
        e.preventDefault();
        return false;
      }
    }

    let current = (e.target as HTMLInputElement);
    let splitArray = [];
    for (var index = 0; index < pasted.length / this.props.lengthPerBox; index++) {
      var element = pasted.length[index];
      var val = index * this.props.lengthPerBox;
      splitArray.push(pasted.slice(val, val + this.props.lengthPerBox));
    }
    let split = splitArray.reverse();
    this.updateAndMoveOn(current, split);
    e.preventDefault();
    return false;

  }
  updateAndMoveOn(target: HTMLInputElement, value: any[]) {
    let newV: string = value.pop();
    target.value = newV;
    target.focus();
    let newTarget = target.nextSibling as HTMLInputElement;
    if (newTarget && value.length !== 0) {
      this.updateAndMoveOn(newTarget, value);
    }
    if (!newTarget && newV.length === this.props.lengthPerBox) {
      target.blur();
    }
  }
  handleFocus(input: HTMLInputElement) {
    input.select();
  }
  componentDidMount() {
    if (this.props.value) {
      let chunks = _.groupBy(this.props.value.split(''), (element, index) => {
        return Math.floor(index / this.props.lengthPerBox);
      });
      for (var index = 0; index < (this.props.length / this.props.lengthPerBox); index++) {
        var element = document.getElementById(`input_${this.uniq}_${index}`) as HTMLInputElement;
        element.value = chunks[index].join('');
      }
      if (this.props.onChange) {
        this.props.onChange(this.props.value);
      }
    }
  }
  render() {
    const validationMessage = DataValidationMessage.get(this.props);
    const { onChange, validationMode, ...attrs } = this.props;
    const classes = ClassHelpers.classNames(
      "armstrong-input",
      "code-input",
      this.props.className,
      {
        "show-validation": (validationMode !== "none" && validationMessage)
      }
    );
    return (
      <div className={classes}>
        <div>
          {_.range(0, (this.props.length / this.props.lengthPerBox)).map(i =>
            <input id={`input_${this.uniq}_${i}`}
              readOnly={this.props.readonly}
              className="code-input-field"
              key={`cb_${this.uniq}_${i}`}
              type={this.props.type || 'text'}
              placeholder={this.props.placeholder}
              maxLength={this.props.lengthPerBox}
              onFocus={(e) => this.handleFocus(e.target as HTMLInputElement)}
              onKeyUp={e => this.focusNext(e)}
              onPaste={e => this.handlePaste(e)}
              onChange={e => this.buildValue()} />)}
        </div>
        <ValidationLabel message={validationMessage} mode={validationMode} />
      </div>
    )
  }
}

