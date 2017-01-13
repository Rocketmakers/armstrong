<p align="center">
<img src="http://armstrongcss.org/assets/logolarge.svg" width="256" height="256" />
</p>

# Form Component

An extended HTML `form` React component to enable binding data objects to html forms.

## Form Context

`Form` components are nestable - only the root `Form` will render as an html `form`, child `Form` components will be rendered as an html div. This function is provided by putting a `form` (`IFormContext`) property onto the React components context.
This `Form Context `contains the current IDataBinder and the parent `Form Context` (if one exists).


# Getting Started

You construct the `Form` in the same way you would a standard HTML `form`, the main differences are the additional data binding attributes required on both the `Form` and the bound `Form Element`'s (that are described below the example)

## Example

```typescript
import * as React from "react";
import {Form,TextInput, SelectInput, Button} from "armstrong-react";
import {IDataBinder} from "armstrong-react/dist/components/form/formCore";

export interface IPerson{
  id: string
  name: string
  reputation?: number
  divisionId?: number
}

export interface IPersonForm{
  person: IPerson
}

export class PersonForm extends React.Component<IPersonForm,{binder: IDataBinder<IPerson>}>{
  constructor(props: IPersonForm){
    super(props)
    this.state = {binder: Form.jsonDataBinder(props.person)}
  }
  componentWillReceiveProps(nextProps: IPersonForm){
    if (nextProps.person !== this.props.person) {
      this.setState({binder: Form.jsonDataBinder(nextProps.person)})
    }
  }
  render(){
    return (
      <Form dataBinder={this.state.binder} onDataBinderChange={binder => this.setState({binder})}>
        <div>
          <TextInput {...Form.Bind.text("id")} />
        </div>
        <div>
          <TextInput {...Form.Bind.textNumeric("reputation")} />
          <TextInput {...Form.Bind.text("name")} />
          <SelectInput {...Form.Bind.select("divisionId")} options={[{id:1, name:"D1"},{id:2, name:"D2"},{id:3, name:"D3"}]} />
        </div>
        <Button onClick={e => alert(JSON.stringify(this.state.binder.toJson()))}>Save</Button>
      </Form>
    )
  }
}
```

## Data Binding

### IDataBinder

A data binder (`IDataBinder`) provides a formal read/write data model.

By default the `Form` provides a function to create a simple JSON `dataBinder` instance.
This `dataBinder` provides a dot notation convention to access properties of the JSON object.

e.g.

```javascript
// Create a Data Binder
const binder = Form.jsonDataBinder(dataObject)

// Sample dot notation
const name = binder.getValue("name") // name
const title = binder.getValue("addresses.0.title") // First address title
const mobile = binder.getValue("contact.mobile") // Mobile contact number
```

## Form

The `Form` is a stateless component

#### attributes

(required) `dataBinder`: a data binder that contains the data you want to bind to the `Form`

(optional) `onDataBinderChange(dataBinder: IDataBinder) => void`: Notification with dataBinder, Called when bound `Form` data changes: NOTE, this is called on every key stroke/interaction on any of the bound fields

(optional) `onDataChanged(data: any) => void`: Notification with changed JSON data, Called when bound `Form` data changes: NOTE, this is called on every key stroke/interaction on any of the bound fields

```html
<Form dataBinder={Form.jsonDataBinder(this.props.jsonObject)}>
</Form>
```

As `Form` is stateless, you should handle either `onDataBinderChange` or `onDataChanged` to trigger a refresh of your component.
If your keypresses and interactions are not reflected in the UI (feels like a locked or frozen form), its likely because you are not handling these events correctly.

It is recommended that you put your `dataBinder` in component state, and use `onDataBinderChange` to `setState(...)`

## Form Elements

A `Form` generally contains `input` html elements to handle user interaction. The `Form` provides a binding framework to allow simple assignment of core html element values to data (and vice versa).

The `Form` also permits custom (3rd party) input elements to be bound (you need to author simple custom binders to permit this - see `custom` binder below)

These `Form Elements` need a Binding Injector to participate within the `Form` lifecycle

### IFormBinderInjector

To bind data to a `Form Element` you just spread a binding object (`IFormBinderInjector`) onto the element, you should supply the dot notation data path of the property you want to bind to.

```html
<input {...Form.Bind.text("name")} />
<input {...Form.Bind.text("contact.mobile")} />
<input {...Form.Bind.checkbox("accept")} />
```

The `Form` comes with a default set of Form Binder Injectors catering for `input` and `select` elements (accessed via `Form.Bind.*`)

These Injectors effectively add a `data-form-binder` property onto the `Form Element` with the value being a `IFormBinder` instance.

### IFormBinder

At runtime, the `Form` component processes all its contained `Form Element` - effectively inspecting each child until it finds a `data-form-binder` property.

The `Form` then uses the contained IFormBinder to bind the `Form Element` to the data property specified (typically using `value` and `onChange`), along with any other attributes and event handlers that are needed

## Form Binders

### Hidden

Bind a `string` property `name` to a hidden `TextInput` (or html `input`)

```javascript
hidden(dataPath: string)
```

```html
<TextInput {...Form.Bind.hidden("name")} />
<input {...Form.Bind.hidden("name")} />
```

### Text

Bind a `string` property `name` to a `TextInput` (or html `input`)

```javascript
text(dataPath: string)
```

```html
<TextInput {...Form.Bind.text("name")} />
<input {...Form.Bind.text("name")} />
```

### Password

Bind a 'secure' `string` property `password` to a `TextInput` (or html `input`)

```javascript
password(dataPath: string)
```

```html
<TextInput {...Form.Bind.password("password")} />
<input {...Form.Bind.password("password")} />
```

### Number

Bind a `number` property `reputation` to a `TextInput` (or html `input`)

```javascript
textNumeric(dataPath: string)
```

```html
<TextInput {...Form.Bind.textNumeric("reputation")} />
<input {...Form.Bind.textNumeric("reputation")} />
```

### Checkbox

Bind a `boolean` property `accepts` to a `CheckboxInput` (or html `input`)

```javascript
checkbox(dataPath: string)
```

```html
<CheckboxInput labelContent="accepts" {...Form.Bind.checkbox("accepts")} />
<input {...Form.Bind.checkbox("accepts")} />
```

### Radio

Bind a `string` property `userType` to a `RadioInput` (or html `input`)

```javascript
radio(dataPath: string, radioValue: string)
```

```html
<RadioInput labelContent="One" radioGroup="main" {...Form.Bind.radio("userType", "1")}/>
<RadioInput labelContent="Two" radioGroup="main" {...Form.Bind.radio("userType", "2")}/>
<RadioInput labelContent="Three" radioGroup="main" {...Form.Bind.radio("userType", "3")}/>

<input radioGroup="main" {...Form.Bind.radio("userType", "1")}/>
<input radioGroup="main" {...Form.Bind.radio("userType", "2")}/>
<input radioGroup="main" {...Form.Bind.radio("userType", "3")}/>
```

Bind a `number` property `userTypeNumeric` to a `RadioInput` (or html `input`)

```javascript
radioNumeric(dataPath: string, radioValue: number)
```

```html
<RadioInput labelContent="One" radioGroup="main" {...Form.Bind.radioNumeric("userTypeNumeric", 1)}/>
<RadioInput labelContent="Two" radioGroup="main" {...Form.Bind.radioNumeric("userTypeNumeric", 2)}/>
<RadioInput labelContent="Three" radioGroup="main" {...Form.Bind.radioNumeric("userTypeNumeric", 3)}/>

<input radioGroup="main" {...Form.Bind.radioNumeric("userTypeNumeric", 1)}/>
<input radioGroup="main" {...Form.Bind.radioNumeric("userTypeNumeric", 2)}/>
<input radioGroup="main" {...Form.Bind.radioNumeric("userTypeNumeric", 3)}/>
```


### Custom

You can author simple Form Binders to allow 3rd party controls to be directly bound within your application

```javascript
custom(formBinder: IFormBinder)
```

```javascript
class SelectInputFormBinder implements IFormBinder<ISelectInputProps, any> {
  constructor(private dataPath: string){}
  // set the value property of the `SelectInput`
  setElementProperty(props: ISelectInputProps, dataBinder: IDataBinder<any>): void{
    props.value = dataBinder.getValue(this.dataPath)
  }
  // handle the change property of the `SelectInput` - setting the dataBinder value and notifying on change
  handleValueChanged(props: ISelectInputProps, dataBinder: IDataBinder<any>, notifyChanged: () => void): void{
    props.change = c => {
      dataBinder.setValue(this.dataPath, c.id)
      notifyChanged()
    }
  }
}
```

And apply them via the `custom` method

```html
<SelectInput {...Form.Bind.custom(new SelectInputFormBinder("divisionId"))} options={[{id:1, name:"D1"},{id:2, name:"D2"},{id:3, name:"D3"}]} />
```
