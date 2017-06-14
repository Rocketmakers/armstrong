import * as React from "react";
import { Form, TextInput, DateInput, AutoCompleteInput, TimeInput, CalendarInput, SelectInput, ISelectInputProps, Button, CheckboxInput, RadioInput, IDataBinder, IFormBinder } from "armstrong-react";

class CustomFormBinder implements IFormBinder<ISelectInputProps, any> {
    constructor(public dataPath: string) { }
    setElementProperty(props: ISelectInputProps, dataBinder: IDataBinder<any>): void {
        props.value = dataBinder.getValue(this.dataPath)
    }
    handleValueChanged(props: ISelectInputProps, dataBinder: IDataBinder<any>, notifyChanged: () => void): void {
        props.change = c => {
            dataBinder.setValue(this.dataPath, c.id)
            notifyChanged()
        }
    }
}
export interface ISample {
    id: string
    name: string
    password?: string
    reputation?: number
    divisionId?: number
    userType?: string
    userTypeNumeric?: number
    tags: string[]
    accepts: boolean
    birthMonthDay: string
}

export interface ISampleForm {
    sample: ISample
}

function snapshot(obj) {
    if (obj == null || typeof (obj) != 'object') {
        return obj;
    }

    var temp = new obj.constructor();

    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            temp[key] = snapshot(obj[key]);
        }
    }

    return temp;
}
export class SampleForm extends React.Component<ISampleForm, { binder: IDataBinder<ISample> }>{
    constructor(props: ISampleForm) {
        super(props)
        this.state = { binder: Form.jsonDataBinder(snapshot(props.sample)) }
    }
    componentWillReceiveProps(nextProps: ISampleForm) {
        if (nextProps.sample !== this.props.sample) {
            this.setState({ binder: Form.jsonDataBinder(snapshot(nextProps.sample)) })
        }
    }
    render() {
        let validations = [
            {attribute:"name", message:"arghhh"},
            {attribute:"date", message:"arghhh"},
            {attribute:"time", message:"arghhh"},
            {attribute:"auto", message:"arghhh"},
            {attribute:"autoMulti", message:"arghhh"},
            {attribute:"expiry", message:"arghhh"},
            {attribute:"accepts", message:"arghhh"},
            {attribute:"divisionId", message:"arghhh"},
            {attribute:"division2Id", message:"arghhh"},
            {attribute:"userType", message:"arghhh"},
            {attribute:"userTypeNumeric", message:"arghhh"},
            {attribute:"reputation", message:"arghhh"},
            {attribute:"password", message:"arghhh"},
        ];
        return (
            <Form dataBinder={this.state.binder} validationResults={validations} onDataBinderChange={d => this.setState({ binder: d })}>
                <div>
                    <TextInput {...Form.Bind.hidden("id") } />
                </div>
                <div>
                    <AutoCompleteInput {...Form.Bind.autoCompleteInput("auto") } options={[{ id: 3, name: 'é' }, { id: 4, name: 'e' }, { id: 5, name: 'ę' }, { id: 6, name: 'f' }]} />
                    <AutoCompleteInput {...Form.Bind.autoCompleteInput("autoMulti") } multiSelect={true} ignoreDiacritics={true} options={[{ id: 3, name: 'é' }, { id: 4, name: 'e' }, { id: 5, name: 'ę' }]} />
                </div>
                <div>
                    <CalendarInput {...Form.Bind.calendarInput("date") } />
                    <DateInput className="test" futureDates={true} {...Form.Bind.dateInput("date") } />
                    <DateInput futureDates={false} startYearCap={2000} {...Form.Bind.dateInput("date") } datePartOrder={["year", "month", "day"]} monthLabel="M" dayLabel="D" yearLabel="Y" />
                    <DateInput futureDates={true} startYearCap={2030} {...Form.Bind.dateInput("expiry") } datePartOrder={["month", "year"]} monthLabel="Expiry Month" yearLabel="Expiry Year" />
                    <TextInput {...Form.Bind.text("expiry") } disabled={true} />
                    <DateInput futureDates={false} {...Form.Bind.dateInput("birthMonthDay") } datePartOrder={["day", "month"]} monthLabel="Birth Month" dayLabel="Birth Day" />
                    <TextInput {...Form.Bind.text("birthMonthDay") } disabled={true} />
                    <TimeInput {...Form.Bind.timeInput("time") } />
                    <TimeInput {...Form.Bind.timeInput("time") } minuteStep={5} hourLabel="Hour" minuteLabel="Minute" />
                </div>
                <div>
                    <TextInput placeholder="numbers plz" {...Form.Bind.textNumeric("reputation") } />
                    <TextInput {...Form.Bind.password("password") } />
                    <TextInput {...Form.Bind.text("name") } />
                    <TextInput defaultValue={this.state.binder.toJson().name} />
                </div>
                <div>
                    <CheckboxInput labelContent="accepts" {...Form.Bind.checkbox("accepts") } />
                </div>
                <div>
                    <SelectInput {...Form.Bind.selectNumeric("divisionId") } options={[{ id: 1, name: "D1" }, { id: 2, name: "D2" }, { id: 3, name: "D3" }]} />
                    <select {...Form.Bind.selectNumeric("division2Id") } >
                        <option value={""} disabled={true}>[Choose...]</option>
                        <option value={1}>D1</option>
                        <option value={2}>D2</option>
                        <option value={3}>D3</option>
                    </select>
                </div>
                <div>
                    <RadioInput labelContent="One" radioGroup="main" {...Form.Bind.radio("userType", "1") } />
                    <RadioInput labelContent="Two" radioGroup="main" {...Form.Bind.radio("userType", "2") } />
                    <RadioInput labelContent="Three" radioGroup="main" {...Form.Bind.radio("userType", "3") } />
                </div>
                <div>
                    <RadioInput labelContent="One" radioGroup="main1" {...Form.Bind.radioNumeric("userTypeNumeric", 1) } />
                    <RadioInput labelContent="Two" radioGroup="main1" {...Form.Bind.radioNumeric("userTypeNumeric", 2) } />
                    <RadioInput labelContent="Three" radioGroup="main1" {...Form.Bind.radioNumeric("userTypeNumeric", 3) } />
                </div>
                <Button onClick={e => alert(JSON.stringify(this.state.binder.toJson()))}>Save</Button>
            </Form>
        )
    }
}
