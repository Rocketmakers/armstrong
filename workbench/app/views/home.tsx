// IMPORTS
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as moment from 'moment';
import * as _ from 'underscore';
import { Link } from "react-router";
import { Grid, Row, Col, SingleColumnRow } from './../../../source/components/layout/grid';
import { Button } from './../../../source/components/interaction/button';
import { Image } from './../../../source/components/display/image';
import { DatePickerInput } from './../../../source/components/form/inputs/datePickerInput';
import { Dialog } from './../../../source/components/display/dialog';
import { BurgerMenu } from './../../../source/components/navigation/burgerMenu';
import { CheckboxInput } from './../../../source/components/form/inputs/checkboxInput';
import { RadioInput } from './../../../source/components/form/inputs/radioInput';
import { TextInput } from './../../../source/components/form/inputs/textInput';
import { SelectInput } from './../../../source/components/form/inputs/selectInput';
import { ColorSwatch } from './../components/colorSwatch';
import { DropdownSelect } from './../../../source/components/form/dropdownSelect';
import { TimeSelector } from './../../../source/components/form/inputs/timeSelectorInput'
import apiClient from './../api/apiClient.ts';

interface HomeState {
  date?: moment.Moment;
  dialogOpen?: boolean;
  dialog2Open?: boolean;
  colorClasses?: string[];
  selectedColorClass?: string;
}

export class Home extends React.Component<{}, HomeState> {
  constructor() {
    super();
    this.state = { date: moment(), dialogOpen: false, dialog2Open: false, colorClasses: [], selectedColorClass: "" }
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
      <div className="p-small">
        <Dialog title="I am a dialog!" height={1000} width={1000} isOpen={this.state.dialogOpen} onClose={() => this.setState({ dialogOpen: false }) }
        footerContent={
          <div>
          <Button text="Ok" className="bg-positive"/>
          <Button text="Cancel" className="bg-negative"/>
          </div>
        }>
          <h1>Hello. This is a dialog</h1>
          <p>Not much going on tbh</p>
          <DatePickerInput alwaysShowCalendar={false} nativeInput={false} returnString={true} onDateChanged={(d) => console.log(d) } icon={DatePickerInput.Icomoon.calendar2}/>
          <div style={{ backgroundColor:  "red", height: "3000px" }}/>
        </Dialog>
        <Dialog title="I am another dialog!" isOpen={this.state.dialog2Open} onClose={() => this.setState({ dialog2Open: false }) }>
       <div style={{ height: "200px"}}>Hello world</div>
        </Dialog>
        <h1>Whats all this then?</h1>
        <h2>Background</h2>
        <p>Armstrong is an awesome React/SASS framework for rapid UI development. It's an ongoing work by <a target="_blank" href="http://www.rocketmakers.com/">Rocketmakers</a> used in practically evey project we create.
        The aim is to build a fast and flexible framework as a starting point for all web projects.
        </p>
        <p>This site is the beginnings of a combined development area for building new components as well as documenting them.</p>
        <hr/>
        <h1 className="m-top-large">Variables & helper classes</h1>
        <DropdownSelect placeholder="Search for an artist and something else to make this box way to long and it will break..."
        multiSelect={false}
        onSelected={(item)=> console.log}
        canClear={true}
        hasGoButton={true}
        remoteQuery={(input)=> apiClient.searchForArtist(input).then((r)=> _.map(r.json.artists.items, (r: any)=> { return { id: r.id, name: r.name, data: r }}))}/>
        <br/>
        <br/>
        <br/>
         <DropdownSelect placeholder="Search for an artist and something else to make this box way to long and it will break..."
        multiSelect={false}
        onSelected={(item)=> console.log}
        canClear={true}
        hasGoButton={true}
        remoteQuery={(input)=> apiClient.searchForArtist(input).then((r)=> _.map(r.json.artists.items, (r: any)=> { return { id: r.id, name: r.name, data: r }}))}/>
        <DropdownSelect placeholder="Search for an artist..."
        multiSelect={true}
        onSelected={(item)=> console.log}
        value={[{ id: 3, name: 'test 3' }]}
        options={[ { id: 1, name: 'test 1fdgdfgdfgdfgdfgfdgdf' }, { id: 2, name: 'test 2gerg dfgdfgdfgfdgdf' } , { id: 3, name: 'test 3 fdgfd gfdgfdgfdgfdgf' }  ]}/>
        <h2>Colors</h2>
        <pre className="m-bottom-small usage">{`<div className='bg-brand-primary fg-white' />`}</pre>
        <p>All colors can be used to set both the foreground and background of any element.Use <pre>fg-[colorname]</pre> for foreground and <pre>bg-[colorname]</pre> for backgrounds.A full list is as follows:
          <ul>
            <li><pre>brand-primary</pre> - Set this to your brands main color and use where you need a brand accent (headers, logos etc) </li>
            <li><pre>brand-secondary</pre> - Set this to your brands secondary color and use where you need a more minor brand accent (headers, logos etc) </li>
            <li><pre>positive</pre> - This color should be used for affirmative actions or messages (eg an OK button or a success message) </li>
            <li><pre>negative</pre> - This color should be used for negative actions or messages (eg a Cancel button or error message) </li>
            <li><pre>info</pre> - This color should be used for informational messages (eg a contextual action button or message like something is happening) </li>
            <li><pre>gray-very-dark</pre> - Use where it contrasts correctly with other colors</li>
            <li><pre>gray-dark</pre> - Use where it contrasts correctly with other colors</li>
            <li><pre>gray-medium</pre> - Use where it contrasts correctly with other colors</li>
            <li><pre>gray-light</pre> - Use where it contrasts correctly with other colors</li>
            <li><pre>gray-very-light</pre> - Use where it contrasts correctly with other colors</li>
            <li><pre>white</pre> - Used mainly to make foreground text visible on dark backgrounds</li>
          </ul>
        </p>
        {this.state.colorClasses.length !== 0 && this.state.colorClasses.map(cc => <ColorSwatch key={cc} selected={cc === this.state.selectedColorClass} onClick={() => this.setState({ selectedColorClass: cc }) } className={cc} name={`${cc.replace('-', ' ')}`}/>) }
        <h2 className="m-top-small">Font sizes</h2>
        <pre className="m-bottom-small usage">{`<p className='f-size-small'>A small paragraph</p>`}</pre>
        <p>Lets you adjust a fontsize on a per element basis: </p>
        <p className="f-size-xxsmall">f-size-xxsmall</p>
        <p className="f-size-xsmall">f-size-xsmall</p>
        <p className="f-size-small">f-size-small</p>
        <p className="f-size-medium">f-size-medium</p>
        <p className="f-size-large">f-size-large</p>
        <p className="f-size-xlarge">f-size-xlarge</p>
        <hr/>
        <h1 className="m-top-large">Components</h1>
        <h2>Grid</h2>
        <pre className="m-bottom-small usage">{`<Grid className='(string)' fillContainer='(boolean)' debugMode='(boolean)' table='(boolean)'/>`}</pre>
        <p>Grid takes the following props specifically, and will also spread additional HTML props to the top level div:
          <ul>
            <li><pre>className (string) </pre> - CSS classnames.Works well with armstrongs bg, fg schemes</li>
            <li><pre>fillContainer (boolean) </pre> - Makes the grid fill its container for subdividing</li>
            <li><pre>table (boolean) </pre> - Makes the grid render as a table.The first row is the headers</li>
            <li><pre>debugMode (boolean) </pre> - Turns on debug mode, allowing you to see individual cell rendering</li>
          </ul>
        </p>
        <h2>Row</h2>
        <pre className="m-bottom-small usage">{`<Row className='(string)' fixed='(boolean|number)' maxCols='(number)' />`}</pre>
        <p>Row should be used directly inside a grid and takes the following specifically, and will also spread additional HTML props to the top level div:
          <ul>
            <li><pre>className (string) </pre> - CSS classnames.Works well with armstrongs bg, fg schemes</li>
            <li><pre>maxCols (number) </pre> - After this number of cols is hit, they will wrap automatically</li>
            <li><pre>fixed (number|boolean) </pre> - Fixes the rows height.A boolean value will grow to fit its content where as a number will be that height in pixels.</li>
          </ul>
        </p>
        <h2>Col</h2>
        <pre className="m-bottom-small usage">{`<Col className='(string)' fixed='(boolean|number)' centerContent='(string|object)' />`}</pre>
        <p>Col should be used directly inside a row and takes the following props specifically, and will also spread additional HTML props to the top level div:
          <ul>
            <li><pre>className (string) </pre> - CSS classnames.Works well with armstrongs bg, fg schemes</li>
            <li><pre>centerContent (string|centerContent) </pre> - Controls content alignment.a string value of <pre>both</pre> will center horizontally and vertically.An object like <pre>{ '{{ vertical: \'center\', horizontal: \'right\' }}'}</pre> for example, allows finer grain control</li>
            <li><pre>fixed (number|boolean) </pre> - Fixes the columns width.A boolean value will grow to fit its content where as a number will be that width in pixels.</li>
          </ul>
        </p>
        <Grid debugMode={true} className="m-bottom-medium">
          <Row fixed={80} style={{ backgroundColor: "red"}}>
            <Col>Waddup</Col>
            <Col centerContent="both">Waddup</Col>
            <Col centerContent={{ horizontal: "right", vertical: "bottom" }}>Waddup</Col>
            <Col centerContent={{ horizontal: "left", vertical: "center" }}>Waddup</Col>
          </Row>
          <Row maxCols={3} style={{ backgroundColor: "red"}}>
            <Col style={{ backgroundColor: "red"}}>
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
        </Grid>
        <Grid debugMode={true} className="grid-p-inner-xsmall">
          <Row>
            <Col>a</Col>
            <Col>b</Col>
            <Col>c</Col>
            <Col>d</Col>
          </Row>
          <Row>
            <Col>a</Col>
            <Col>b</Col>
            <Col>c</Col>
            <Col>d</Col>
          </Row>
          <Row>
            <Col>a</Col>
          </Row>
        </Grid>
        <h2 className="m-top-small">Button</h2>
        <pre className="m-bottom-small usage">{`<Button className='(string)' onClick='(e?: SyntheticEvent)=> void' leftIcon='(string)' rightIcon='(string)' text='(string)' />`}</pre>
        <p>Buttons take the following props:
          <ul>
            <li><pre>className (string)</pre> - CSS classnames.Works well with armstrongs bg, fg schemes</li>
            <li><pre>leftIcon (string)</pre> - An icon to the left of the text</li>
            <li><pre>rightIcon (string)</pre> - An icon to the right of the text</li>
            <li><pre>text (string)</pre> - The text in the button</li>
            <li><pre>onClick ((e: SyntheticEvent)=> void)</pre> - An event handler for clicking</li>
            <li><pre>disabled (boolean)</pre> - Disallows user interaction</li>
          </ul>
        </p>
        <Button leftIcon={Button.Icomoon.aidKit2} text="Click me!" className={`bg-${this.state.selectedColorClass} m-right-xsmall`}/>
        <Button rightIcon={Button.Icomoon.aidKit2} text="Click me!" className={`bg-${this.state.selectedColorClass} m-right-xsmall`}/>
        <Button text="Click me also!" className={`bg-${this.state.selectedColorClass} m-right-xsmall`}/>
        <Button disabled={true} text="Click me also!" className={`bg-${this.state.selectedColorClass} m-right-xsmall`} rounded={true}/>
        <h2>Dialog</h2>
        <pre className="m-bottom-small usage">{`<Dialog title='(string)' subTitle='(string)' isOpen='(boolean)' layerClass='(string)' onOpen='(()=> void)' onClose='(()=> void)' onXClicked='(()=> void)'>I am some dialog content</Dialog>`}</pre>
        <p>A multipurpose dialog, rendered high up into the DOM using subtree rendering to avoid any weird CSS positioning issues
          <ul>
            <li><pre>className (string)</pre> - CSS classnames.Works well with armstrongs bg, fg schemes</li>
            <li><pre>isOpen (string)</pre> - A boolean for the current visible state of the dialog. Works well with state</li>
            <li><pre>title (string)</pre> - The title in the header of the dialog</li>
            <li><pre>subtitle (string)</pre> - A second smaller title</li>
            <li><pre>layerClass (string)</pre> - This allows you to layer dialogs (a confirmation for example) by setting a class with a higher <pre>z-index</pre></li>
            <li><pre>onOpen (()=> void))</pre> - Fires when the dialog opens</li>
            <li><pre>onClose (()=> void))</pre> - Fires when the dialog closes</li>
            <li><pre>onXClicked (()=> void))</pre> - Fires when the user clicks the X in the topright of the dialog. Useful for confirmations</li>
          </ul>
        </p>
        <Button text="Click for sick dialog" className={`bg-${this.state.selectedColorClass} m-right-xsmall`} onClick={() => this.setState({ dialogOpen: true }) }/>
        <Button text="Click for other even sicker dialog" className={`bg-${this.state.selectedColorClass} m-right-xsmall`} onClick={() => this.setState({ dialog2Open: true }) }/>
        <h2>Image</h2>
        <pre className="m-bottom-small usage">{`<Image height='(number)' width='(number)' sampleUser='(boolean)' sampleUserSeed='(string)' rounded='(boolean)' noPlaceholder='(boolean)'/>`}</pre>
        <p>Usable as both a placeholder (for users and generic) aswell as real images
        <ul>
            <li><pre>className (string)</pre> - CSS classnames.Works well with armstrongs bg, fg schemes</li>
            <li><pre>rounded (boolean)</pre> - Makes the image into a circle</li>
            <li><pre>source (string)</pre> - The source of the image</li>
            <li><pre>height (number)</pre> - The height of the image. Will scale to aspect with width if not set.</li>
            <li><pre>width (number)</pre> - The width of the image. Will scale to aspect with height if not set.</li>
            <li><pre>sampleUser (boolean)</pre> - If true will pull a random user image from randomuser.me</li>
            <li><pre>sampleUserSeed (string)</pre> - Set this to a static value to force the same sample user every time</li>
            <li><pre>noPlaceholder (boolean)</pre> - If true will stop any usage of placeholder images</li>
          </ul>
        </p>
        <Image className="m-right-xsmall" height={256} />
        <Image className="m-right-xsmall" height={128} width={128} rounded={true}/>
        <Image className="m-right-xsmall" height={128} width={128} rounded={true} sampleUser={true}/>
        <Image className="m-right-xsmall" height={128} width={128} rounded={true} source="http://www.famousbirthdays.com/headshots/jaden-smith-1.jpg"/><br/>
        <hr/>
        <h1 className="m-top-large">Forms</h1>
        <h2>Form</h2>
        <pre className="m-bottom-small usage">{`<Form onDataChanged='((data:T)=> void)' dataBinder='(IDataBinder<T>)'/>`}</pre>
        <p>The form control supports multiple inputs and allows simple editing of data via an entity:
        <ul>
            <li><pre>onDataChanged ((data:T>)=> void)</pre> - Fires when the data in the form changes. Normally you can just set to {`{this.forceUpdate()}`}</li>
            <li><pre>dataBinder (IDateBinder of T)</pre> - This is  how you bind your entity to your form. Use something like <pre>Form.jsonDataBinder(YOUR_ENTITY);</pre></li>
          </ul>
        </p>
        <h2>Text Input</h2>
        <pre className="m-bottom-small usage">{`<TextInput {...Form.Bind.text("YOUR_PROPERTY_NAME") }/>`}</pre>
        <p>
        Used to edit text within your form. You can use the following Form.Bind values : <pre>text, textEmail, textNumeric, password</pre>
         <ul>
            <li><pre>className (string)</pre> - CSS classnames.Works well with armstrongs bg, fg schemes</li>
            <li><pre>leftIcon (string)</pre> - An icon to the left of the text</li>
            <li><pre>rightIcon (string)</pre> - An icon to the right of the text</li>
            <li><pre>rightTextOverlay (string)</pre> - A text label to the right of the text</li>
          </ul>
        </p>
        <TextInput placeholder="what is your rocket called?" leftIcon={TextInput.Icomoon.rocket}/>
        <TextInput className="m-top-xsmall m-bottom-xsmall" placeholder="do you even lift?" rightIcon={TextInput.Icomoon.dumbbell}/>
        <TextInput className="m-bottom-xsmall" defaultValue="599" leftIcon={TextInput.Icomoon.coinDollar} rightOverlayText="%"/>
        <TextInput readonly={true} className="m-bottom-xsmall" defaultValue="599" leftOverlayText="$"/>
        <TextInput disabled={true}  multiLine={true}/>
        <h2 className="m-top-small">Checkbox Input</h2>
        <pre className="m-bottom-small usage">{`<CheckboxInput {...Form.Bind.checkbox("YOUR_PROPERTY_NAME: boolean") }/>`}</pre>
        <p>
        Used to edit boolean values within your form. Use the following Form.Bind values : <pre>checkBox</pre>
        </p>
        <CheckboxInput label="Check me!"/>
        <h2 className="m-top-small">Radio Input</h2>
        <pre className="m-bottom-small usage">{`<RadioInput {...Form.Bind.radio("YOUR_PROPERTY_NAME: boolean") }/>`}</pre>
        <p>
        Used to edit linked boolean values within your form. Use the following Form.Bind values : <pre>radio</pre>
        </p>
        <RadioInput disabled={true}  name="r-g" labelContent="Check me!"/>
        <RadioInput name="r-g" labelContent="Check me!"/>
        <RadioInput name="r-g" labelContent="Check me!"/>
        <h2 className="m-top-small">Select Input</h2>
        <pre className="m-bottom-small usage">{`<SelectInput options='(array)' {...Form.Bind.select("YOUR_PROPERTY_NAME") }/>`}</pre>
        <p>
        Used to edit a value via a dropdown list. Use the following Form.Bind values : <pre>select, selectId, selectNumeric</pre>
        </p>
        <SelectInput disabled={true}  options={[{ id: 1, name: 'test item 1'},{ id: 2, name: 'test item 2'},{ id: 3, name: 'test item 3'}]}/>
        <h2 className="m-top-small">Datepicker Input</h2>
        <pre className="m-bottom-small usage">{`<DatePickerInput date='(moment)' locale='(string)' format='(string)' alwaysShowCalendar='(boolean)' nativeInput='(boolean)' disabled='(boolean)' onDateChanged='((date:moment)=> void)' icon='(string)' min='(moment)' max='(moment)'/>`}</pre>
        <p>Allows you to pick dates.Supports many parameters:
          <ul>
            <li><pre>className (string) </pre> - CSS classnames</li>
            <li><pre>locale (string) </pre> - The datepickers locale setting.Defaults to en-gb.Takes other ISO formatted locale codes (see moment docs for more) </li>
            <li><pre>date (moment) </pre> - The pickers current/initial date as a moment object</li>
            <li><pre>format (string) </pre> - A string determining the displayed date format.Defaults to DD/MM/YYYY</li>
            <li><pre>min (moment) </pre> - The minimum date as a moment</li>
            <li><pre>max (moment) </pre> - The maximum date as a moment</li>
            <li><pre>onDateChanged (moment) => void</pre> - Fires when a new date is selected and returns a moment object</li>
            <li><pre>alwaysShowCalendar (boolean) </pre> - Render the calendar all the time, even when not focused</li>
            <li><pre>nativeInput (boolean) </pre> - Use a input type date instead of the picker.Using logic to determine mobile platform here is a good idea</li>
            <li><pre>icon (string) </pre> - The icon to show on the left of the date (DatePickerInput.Icomoon.Calendar2 for example) </li>
            <li><pre>disabled (boolean) </pre> - Wether the control is interactable by the user</li>
          </ul>
        </p>
        <DatePickerInput alwaysShowCalendar={false} nativeInput={false} returnString={true} onDateChanged={(d) => console.log(d) } icon={DatePickerInput.Icomoon.calendar2}/>
        <p className="bg-info fg-white p-small m-top-medium t-align-center">Note - Docs from this point are very hazy as I haven't gotten this far yet ;)</p>
        <hr/>
        <h1 className="m-top-large">FAQs</h1>
        <h2>I dont agree with x/y/z or this could be done better</h2>
        <p>Everything you see here is open source and on <a target="_blank" href="https://github.com/Rocketmakers/armstrong-react">GitHub</a> so please feel free to fork and make suggestions.</p>
        <h2>Why dont you have this component or Ive got an idea for a new component</h2>
        <p>We add components we use a lot in our day to day development. We try not to add very specific, project based components here. That said, if theres something obvbious just stick a feature request in on <a target="_blank" href="https://github.com/Rocketmakers/armstrong-react">GitHub</a></p>
        <h2>It looks very plain..</h2>
        <p>Armstrong is not and will never be anything like Bootstrap. Its intentionally styled very minimally so a dedicated designer can work with it, not against it. Its built on top of variables which are designed to be overridden.</p>
        <h2>Is it responsive?</h2>
        <p>At the moment thats up to you. We tried building responsiveness into some controls, but we realised the approach varies so much from project to project it didnt make sense to try and build it in. Obviously, this could change if we come up with something magical ;)</p>
      </div>
    );
  }
}
