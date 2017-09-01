// IMPORTS
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Grid, Row, Col, AutoCompleteInput, CheckboxInput, CalendarInput, RadioInput, SelectInput, TextInput, TimeInput, DateInput, Icon } from 'armstrong-react';

export class FormElements extends React.Component<{}, {}> {

  navigateTo(path: string) {
    (this.props as any).history.push(path);
  }

  public render() {
    return (

      <Grid>
        <Row>
          <Col>
            <article>
              <h1>Components: Immutable Form & Elements</h1>

               <div className="alert bg-warning">
              <b>Note:</b> Documentation coming soon
            </div>

              <pre className="callout major">
                {`import { AutoCompleteInput, CheckboxInput, CalendarInput, RadioInput, SelectInput, TextInput, TimeInput } from 'armstrong-react';`}
              </pre>

              <h2 id="quickSummary">Quick summary of all form elements</h2>

              <Grid className="form-grid">
                <Row className="rs-xlarge-2col rs-small-1col rs-xlarge-spaced">
                  <Col>
                    <label>AutoCompleteInput</label>
                    <AutoCompleteInput placeholder="Select one item" options={[{ id: 1, name: "Option 1" }, { id: 2, name: "Option 2" }, { id: 3, name: "Option 3" }]} />
                  </Col>
                  <Col>
                    <label>AutoCompleteInput (multi) </label>
                    <AutoCompleteInput placeholder="Select one or more items" multiSelect={true} options={[{ id: 1, name: "Option 1" }, { id: 2, name: "Option 2" }, { id: 3, name: "Option 3" }]} />
                  </Col>
                  <Col>
                    <label>CalendarInput</label>
                    <CalendarInput icon={Icon.Icomoon.calendar2} />
                  </Col>
                  <Col>
                    <label>TextInput</label>
                    <TextInput placeholder="Enter your text here" />
                  </Col>
                  <Col>
                    <label>SelectInput</label>
                    <SelectInput placeholder="Select one or more items" options={[{ id: 1, name: "Option 1" }, { id: 2, name: "Option 2" }, { id: 3, name: "Option 3" }]} />
                  </Col>
                  <Col>
                    <label>TimeInput</label>
                    <TimeInput time="08:30" />
                  </Col>
                  <Col>
                    <label>DateInput</label>
                    <DateInput date="2016-05-05" />
                  </Col>
                  <Col>
                    <label>RadioInput</label>
                    <RadioInput name="test1" labelContent="Get" />
                    <RadioInput name="test1" labelContent="Ripped" />
                    <RadioInput name="test1" labelContent="Quick" />
                  </Col>
                  <Col>
                    <label>CheckboxInput</label>
                    <CheckboxInput labelContent="Get" />
                    <CheckboxInput labelContent="Ripped" />
                  </Col>
                </Row>
              </Grid>

              <hr />

              <h2 id="AutoCompleteInput">AutoCompleteInput</h2>

              <p><b>When to use: </b> The AutoCompleteInput is a jack of all trades selection control, allowing both local and remote data and single/multiple selection</p>

              <pre className="callout minor">
                {`<AutoCompleteInput
             placeholder="Search for an artist..."
             multiSelect={false}
             onSelected={(item) => console.log}
             canClear={true}
             remoteQuery={(input) => apiClient.searchForArtist(input).then((r) => _.map(r.json.artists.items, (r: any) => { return { id: r.id, name: r.name, data: r } })) }/>`}
              </pre>

              <table>
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Type</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>className</td>
                    <td>string</td>
                    <td>CSS classnames.Works well with armstrongs bg, fg schemes.</td>
                  </tr>
                  <tr>
                    <td>multiSelect</td>
                    <td>boolean</td>
                    <td>Wether or not the control allows multiple selection.</td>
                  </tr>
                  <tr>
                    <td>value</td>
                    <td>IAutoCompleteOption | IAutoCompleteOption[]</td>
                    <td>The currently selected values. An array if multiSelect=true, otherwise a single item.</td>
                  </tr>
                  <tr>
                    <td>minimumLength</td>
                    <td>number</td>
                    <td>The number of characters the user must type before the remote query executes</td>
                  </tr>
                  <tr>
                    <td>placeholder</td>
                    <td>string</td>
                    <td>The placeholder text in the main input</td>
                  </tr>
                  <tr>
                    <td>searchPlaceholder</td>
                    <td>string</td>
                    <td>The placeholder text in the dropdown input</td>
                  </tr>
                  <tr>
                    <td>noResultsMessage</td>
                    <td>string</td>
                    <td>The message to display when no results are found</td>
                  </tr>
                  <tr>
                    <td>options</td>
                    <td>IAutoCompleteOption[]</td>
                    <td>If you aren't using remote data, you can pass an array here to use these options instead</td>
                  </tr>
                  <tr>
                    <td>remoteThrottle</td>
                    <td>number</td>
                    <td>The amount of time in miliseconds to wait after keypresses to execute your remote query</td>
                  </tr>
                  <tr>
                    <td>remoteQuery</td>
                    <td>(query: string) => results: Object[]</td>
                    <td>The method that gets your remote data. You'll want to map the results into an IAutoCompleteOption (id, name, data)</td>
                  </tr>
                  <tr>
                    <td>remoteQueryOnOpen</td>
                    <td>boolean</td>
                    <td>If true, the remote query will automatically run when the user focuses the dropdown with a blank string for the query</td>
                  </tr>
                  <tr>
                    <td>hasGoButton</td>
                    <td>boolean</td>
                    <td>Wether or not to show a green 'Go' button next to the box</td>
                  </tr>
                  <tr>
                    <td>goButtonContent</td>
                    <td>string | JSX.Element</td>
                    <td>If you use the above option, allows you to customise the content of the button</td>
                  </tr>
                  <tr>
                    <td>onSelected</td>
                    <td>(IAutoCompleteOption | IAutoCompleteOption[]) => void</td>
                    <td>Event that fires when selection is changed</td>
                  </tr>
                  <tr>
                    <td>visibleItems</td>
                    <td>number</td>
                    <td>The number of visible options in the dropdown (defaults to 3)</td>
                  </tr>
                  <tr>
                    <td>canClear</td>
                    <td>boolean</td>
                    <td>If true, an x button will be visible to allow clearing of all selected values</td>
                  </tr>
                  <tr>
                    <td>disabled</td>
                    <td>boolean</td>
                    <td>If true, dissallows user interaction,</td>
                  </tr>
                </tbody>
              </table>

              <h3>Example: Single option select</h3>

              <AutoCompleteInput placeholder="Select one item" options={[{ id: 1, name: "Option 1" }, { id: 2, name: "Option 2" }, { id: 3, name: "Option 3" }]} />

              <pre>
                {`<AutoCompleteInput placeholder="Select one item" options={[{ id: 1, name: "Option 1" }, { id: 2, name: "Option 2" }, { id: 3, name: "Option 3" }]} />`}
              </pre>

              <hr />

              <h3>Example: Multiple option select</h3>

              <AutoCompleteInput multiSelect={true} placeholder="Select one or more items" options={[{ id: 1, name: "Option 1" }, { id: 2, name: "Option 2" }, { id: 3, name: "Option 3" }]} />

              <pre>
                {`<AutoCompleteInput multiSelect={true} placeholder="Select one or more items" options={[{ id: 1, name: "Option 1" }, { id: 2, name: "Option 2" }, { id: 3, name: "Option 3" }]} />`}
              </pre>


              <hr />

              <h2 id="CalendarInput">CalendarInput</h2>

              <p><b>When to use: </b> When you'd like a user to select a date from a calendar</p>

              <p><b>Note: </b> CalendarInput no longer takes a locale prop. Instead import ArmstrongConfig and call setLocale once, probably on app startup.</p>

              <pre className="callout minor">
                {`<CalendarInput icon={Icon.Icomoon.calendar2} />`}
              </pre>

              <table>
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Type</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>className</td>
                    <td>string</td>
                    <td>CSS classnames.Works well with armstrongs bg, fg schemes.</td>
                  </tr>
                  <tr>
                    <td>date</td>
                    <td>string</td>
                    <td>The date for the control to use. MUST be in the format 'YYYY-MM-DD'</td>
                  </tr>
                  <tr>
                    <td>format</td>
                    <td>string</td>
                    <td>The format the date will be displayed in. Defaults to 'DD/MM/YYYY'. For DISPLAY only.</td>
                  </tr>
                  <tr>
                    <td>min</td>
                    <td>string</td>
                    <td>The minimum date. MUST be in the format 'YYYY-MM-DD'</td>
                  </tr>
                  <tr>
                    <td>max</td>
                    <td>string</td>
                    <td>The maximum date. MUST be in the format 'YYYY-MM-DD'</td>
                  </tr>
                  <tr>
                    <td>onDateChanged</td>
                    <td>(string) => void</td>
                    <td>Fired when the date changes. Returns the selected date as a string in the format 'YYYY-MM-DD'</td>
                  </tr>
                  <tr>
                    <td>alwaysShowCalendar</td>
                    <td>boolean</td>
                    <td>If true, the control will just display a calendar for date selection rather than an input.</td>
                  </tr>
                  <tr>
                    <td>nativeInput</td>
                    <td>boolean</td>
                    <td>If true, will simply use an input with a type of date. Useful for mobile detection scenarios.</td>
                  </tr>
                  <tr>
                    <td>icon</td>
                    <td>string</td>
                    <td>Specify an iconfont character to use for the calendar. Defaults to icomoon calendar2.</td>
                  </tr>
                  <tr>
                    <td>disabled</td>
                    <td>boolean</td>
                    <td>If true, dis-allows user input.</td>
                  </tr>
                </tbody>
              </table>

              <h3>Example: Calendar icon and default date</h3>

              <CalendarInput date="2016-01-01" />

              <pre>
                {`<CalendarInput date="2016-01-01" />`}
              </pre>


              <hr />

              <h2 id="textInput">TextInput</h2>

              <p><b>When to use: </b> When you'd like a user to enter text</p>

              <pre className="callout minor">
                {`<TextInput />`}
              </pre>

              <table>
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Type</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>multiLine</td>
                    <td>boolean</td>
                    <td>If true, becomes a multiline textarea.</td>
                  </tr>
                  <tr>
                    <td>readOnly</td>
                    <td>boolean</td>
                    <td>If true, disables user interaction.</td>
                  </tr>
                  <tr>
                    <td>rightOverlayContent</td>
                    <td>string | JSX.Element</td>
                    <td>An element to overlay on the right of input box.</td>
                  </tr>
                  <tr>
                    <td>leftOverlayContent</td>
                    <td>string | JSX.Element</td>
                    <td>An element to overlay on the left of input box.</td>
                  </tr>
                  <tr>
                    <td>type</td>
                    <td>string</td>
                    <td>Override the input type</td>
                  </tr>
                  <tr>
                    <td>leftIcon</td>
                    <td>string</td>
                    <td>Specify an iconfont character to use to the left of the inputs data.</td>
                  </tr>
                  <tr>
                    <td>rightIcon</td>
                    <td>string</td>
                    <td>Specify an iconfont character to use to the right of the inputs data.</td>
                  </tr>
                  <tr>
                    <td>placeholder</td>
                    <td>string</td>
                    <td>The inputs placeholder text</td>
                  </tr>
                </tbody>
              </table>

              <h3>Example: Simple text input with placeholder</h3>

              <TextInput placeholder="Enter your response here" />

              <pre>
                {`<TextInput placeholder="Enter your response here" />`}
              </pre>

              <hr />

              <h3>Example: text input with left icon and right suffix text</h3>

              <TextInput defaultValue="100.00" leftIcon={Icon.Icomoon.coinPound} rightOverlayText="GBP" placeholder="Enter value" />

              <hr />

              <h2 id="selectInput">SelectInput</h2>

              <p><b>When to use: </b> When you'd like a user to select a value from an array.</p>

              <pre className="callout minor">
                {`<SelectInput />`}
              </pre>

              <table>
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Type</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>options</td>
                    <td>{`Array'<{ id: string|number, name: string }>`}</td>
                    <td>Options for the dropdown to show.</td>
                  </tr>
                  <tr>
                    <td>placeholder</td>
                    <td>string</td>
                    <td>The text placeholder to use before selection.</td>
                  </tr>
                </tbody>
              </table>

              <h3>Example: Simple select box</h3>

              <SelectInput options={[{ id: 1, name: "Option 1" }, { id: 2, name: "Option 2" }, { id: 3, name: "Option 3" }]} />

              <pre>
                {`<SelectInput options={[{ id: 1, name: "Option 1" }, { id: 2, name: "Option 2" }, { id: 3, name: "Option 3" }]} />`}
              </pre>



              <hr />

              <h2 id="TimeInput">TimeInput</h2>

              <p><b>When to use: </b> When you'd like a user to select a time.</p>

              <pre className="callout minor">
                {`<TimeInput />`}
              </pre>

              <table>
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Type</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>time</td>
                    <td>string</td>
                    <td>in HH:mm format</td>
                  </tr>
                </tbody>
              </table>

              <h3>Example: Simple time selector</h3>

              <TimeInput time="08:30" />

              <pre className="m-top-medium">
                {`<TimeInput time="08:30" />`}
              </pre>


              <hr />

              <h2 id="radioInput">RadioInput</h2>

              <p><b>When to use: </b> When you'd like a user to select one option from a selection of choices.</p>

              <pre className="callout minor">
                {`<RadioInput />`}
              </pre>

              <table>
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>labelContent</td>
                    <td>TODO</td>
                  </tr>
                </tbody>
              </table>

              <h3>Example: Simple radioInput</h3>

              <RadioInput labelContent="Select this item" />

              <pre className="m-top-small">
                {`<RadioInput labelContent="Select this item" />`}
              </pre>


              <hr />

              <h2 id="checkboxInput">CheckboxInput</h2>

              <p><b>When to use: </b> When you'd like a user to select one or multiple boolean values.</p>

              <pre className="callout minor">
                {`<CheckboxInput />`}
              </pre>

              <table>
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>label</td>
                    <td>TODO</td>
                  </tr>
                </tbody>
              </table>

              <h3>Example: Simple checkbox</h3>

              <CheckboxInput labelContent="Select this item" />

              <pre className="m-top-small">
                {`<CheckboxInput labelContent="Select this item" />`}
              </pre>

            </article>

          </Col>

          <Col className="secondary-nav" width={200}>
            <ul>
              <li><a href="#quickSummary">Quick Summary</a></li>
              <li><a href="#AutoCompleteInput">AutoCompleteInput</a></li>
              <li><a href="#CalendarInput">CalendarInput</a></li>
              <li><a href="#textInput">TextInput</a></li>
              <li><a href="#selectInput">SelectInput</a></li>
              <li><a href="#TimeInput">TimeInput</a></li>
              <li><a href="#radioInput">RadioInput</a></li>
              <li><a href="#checkboxInput">CheckboxInput</a></li>
            </ul>
          </Col>


        </Row>
      </Grid >


    );
  }
}
