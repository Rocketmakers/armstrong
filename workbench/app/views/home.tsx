// IMPORTS
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as moment from 'moment';
import { Link } from "react-router";
import { Grid, Row, Col, SingleColumnRow, FixedCentralColumnRow } from './../../../source/components/layout/grid';
import { Button } from './../../../source/components/interaction/button';
import { Image } from './../../../source/components/display/image';
import { DatePickerInput } from './../../../source/components/form/inputs/datePickerInput';
import { Dialog } from './../../../source/components/display/dialog';
import { BurgerMenu } from './../../../source/components/navigation/burgerMenu';
import { CheckboxInput } from './../../../source/components/form/inputs/checkboxInput';
import { TextInput } from './../../../source/components/form/inputs/textInput';
import { ColorSwatch } from './../components/colorSwatch';

interface HomeState {
  date?: moment.Moment;
  dialogOpen?: boolean;
  colorClasses?: string[];
  selectedColorClass?: string;
}

export class Home extends React.Component<{}, HomeState> {
  constructor() {
    super();
    this.state = { date: moment(), dialogOpen: false, colorClasses: [], selectedColorClass: "" }
  }
  componentWillMount() {
    var colors = [];
    colors.push("brand-primary");
    colors.push("brand-secondary");
    colors.push("positive");
    colors.push("negative");
    colors.push("warning");
    colors.push("info");
    colors.push("gray-very-dark");
    colors.push("gray-dark");
    colors.push("gray-medium");
    colors.push("gray-light");
    colors.push("gray-very-light");
    colors.push("white");
    this.setState({ colorClasses: colors });
  }

  public render() {
    return (
      <Grid debugMode={false} className="p-small">
        <Dialog title="I am a dialog!" isOpen={this.state.dialogOpen} onClose={() => this.setState({ dialogOpen: false }) }>
          hello world!
        </Dialog>
        <h2>Grid</h2>
        <p>Grid takes the following props specifically, and will also spread additional HTML props to the top level div:
          <ul>
            <li><pre>className (string) </pre> - Css classnames. Works well with armstrongs bg, fg schemes</li>
            <li><pre>fillContainer (boolean) </pre> - Makes the grid fill its container for subdividing</li>
            <li><pre>table (boolean) </pre> - Makes the grid render as a table.The first row is the headers</li>
          </ul>
        </p>
        <h2>Row</h2>
        <p>Row should be used directly inside a grid and takes the following specifically, and will also spread additional HTML props to the top level div:
          <ul>
            <li><pre>className (string) </pre> - Css classnames.Works well with armstrongs bg, fg schemes</li>
            <li><pre>maxCols (number) </pre> - After this number of cols is hit, they will wrap automatically</li>
            <li><pre>fixed (number|boolean) </pre> - Fixes the rows height. A boolean value will grow to fit its content where as a number will be that height in pixels.</li>
          </ul>
        </p>
        <h2>Col</h2>
        <p>Col should be used directly inside a row and takes the following props specifically, and will also spread additional HTML props to the top level div:
          <ul>
            <li><pre>className (string) </pre> - Css classnames.Works well with armstrongs bg, fg schemes</li>
            <li><pre>centerContent (string|centerContent) </pre> - Controls content alignment. a string value of <pre>both</pre> will center horizontally and vertically. An object like <pre>{ '{{ vertical: \'center\', horizontal: \'right\' }}'}</pre> for example, allows finer grain control</li>
            <li><pre>fixed (number|boolean) </pre> - Fixes the columns width. A boolean value will grow to fit its content where as a number will be that width in pixels.</li>
          </ul>
        </p>
        <FixedCentralColumnRow>
          test
        </FixedCentralColumnRow>
        <Row maxCols={3}>
          <Col>
            <div>Hello</div>
          </Col>
          <Col>
            <div>Hello</div>
          </Col>
          <Col>
            <div>Hello</div>
          </Col>
          <Col>
            <div>Hello</div>
          </Col>
          <Col>
            <div>Hello</div>
          </Col>
          <Col>
            <div>Hello</div>
          </Col>
          <Col>
            <div>Hello</div>
          </Col>
          <Col>
            <div>Hello</div>
          </Col>
        </Row>
        <SingleColumnRow padding="medium">
          <h2>Colors</h2>
          <p>All colors can be used to set both the foreground and background of any element.Use <pre>fg-[colorname]</pre> for foreground and <pre>bg-[colorname]</pre> for backgrounds</p>
          {this.state.colorClasses.length !== 0 && this.state.colorClasses.map(cc => <ColorSwatch selected={cc === this.state.selectedColorClass} onClick={() => this.setState({ selectedColorClass: cc }) } className={cc} name={`${cc.replace('-', ' ')}`}/>) }
          <h2>Button</h2>
          <p>Buttons take the following props:
            <ul>
              <li><pre>className</pre> - Css classnames.Works well with armstrongs bg, fg schemes</li>
              <li><pre>leftIcon</pre> - An icon to the left of the text</li>
              <li><pre>rightIcon</pre> - An icon to the right of the text</li>
              <li><pre>text</pre> - The text in the button</li>
              <li><pre>onClick</pre> - An event handler for clicking</li>
            </ul>
          </p>
          <Button leftIcon={Button.Icomoon.aidKit2} text="Click me!" className={`bg-${this.state.selectedColorClass} m-right-xsmall`}/>
          <Button rightIcon={Button.Icomoon.aidKit2} text="Click me!" className={`bg-${this.state.selectedColorClass} m-right-xsmall`}/>
          <Button text="Click me also!" className={`bg-${this.state.selectedColorClass} m-right-xsmall`}/>
          <Button disabled={true} text="Click me also!" className={`bg-${this.state.selectedColorClass} m-right-xsmall`} rounded={true}/>
          <h2>Font sizes</h2>
          <p>Lets you adjust a fontsize on a per element basis :</p>
          <p className="f-size-xxsmall">f-size-xxsmall</p>
          <p className="f-size-xsmall">f-size-xsmall</p>
          <p className="f-size-small">f-size-small</p>
          <p className="f-size-medium">f-size-medium</p>
          <p className="f-size-large">f-size-large</p>
          <p className="f-size-xlarge">f-size-xlarge</p>

          <h2>Datepicker</h2>
          <p>Picks dates</p>
          <DatePickerInput disabled={true} nativeInput={true} onDateChanged={(d) => console.log(d) } icon={DatePickerInput.Icomoon.calendar2}/>
          <br/>
          <br/>
          <h2>Dialog</h2>
          <p>Is a dialog</p>
          <Button text="Click me also!" className={`bg-${this.state.selectedColorClass} m-right-xsmall`} onClick={() => this.setState({ dialogOpen: true }) }/>
          <br/>
          <br/>
          <h2>Image</h2>
          <p>Again pretty self explanatory</p>
          <Image height={128} width={128}/>
          <Image height={128} width={128} rounded={true}/>
          <Image height={128} width={128} rounded={true} sampleUser={true}/>
          <Image height={128} width={128} rounded={true} source="http://www.famousbirthdays.com/headshots/jaden-smith-1.jpg"/><br/>
          <br/>
          <br/>
          <h2>Checkbox</h2>
          <p>Again pretty self explanatory</p>
          <CheckboxInput label="Check me!"/>
          <TextInput leftIcon={TextInput.Icomoon.alarm}/>
          <TextInput rightIcon={TextInput.Icomoon.alarm}/>
        </SingleColumnRow>

      </Grid>
    );
  }
}
