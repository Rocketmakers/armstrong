import * as React from "react";
import { IDataBinder } from "../../form/formCore";
import { FormBinderBase } from "../../form/formBinders";
import { Form } from "../form";
import { Grid, Row, Col, SingleColumnRow } from "./../../layout/grid";
import * as _ from "underscore";

export interface ITimeSelectorProps extends React.HTMLProps<TimeSelector> {
  timeOfDay?: any;
  timeOfDayChanged?: (tod: any)=> void;
}

export class TimeSelector extends React.Component<ITimeSelectorProps, {}>{
  render(){
    var hours = [];
    var minutes = [];
    _.each(_.range(0,24,1), hour =>{
      hours.push(<option key={"hour_"+ hour + "_" + Math.random()}>{hour}</option>);
    });
    _.each(_.range(0,60,5), minute =>{
      minutes.push(<option key={"minute_"+ minute + "_" + Math.random()}>{minute}</option>);
    });
    return (
     <Form dataBinder={Form.jsonDataBinder(this.props.timeOfDay)} onDataChanged={(d) => this.props.timeOfDayChanged(d)}>
        <Grid className="time-selector">
          <Row>
            <Col>
              <select {...Form.Bind.selectNumeric("hour")}>
              {hours}
              </select>
            </Col>
            <Col fixed={15} className="center-both">:</Col>
            <Col>
              <select {...Form.Bind.selectNumeric("minute")}>
              {minutes}
              </select>
            </Col>
          </Row>
        </Grid>
	  </Form>
    );
  }
}

export class TimeSelectorFormBinder extends FormBinderBase<ITimeSelectorProps, any, any>{
  static customValue(dataName: string){
    return new TimeSelectorFormBinder(dataName, "timeOfDay");
  }

  handleValueChanged(props: ITimeSelectorProps, dataBinder:IDataBinder<any>, notifyChanged: () => void) {
    props.timeOfDayChanged = (e) => {
      this.onChanged(dataBinder, e, notifyChanged);
    };
  }
}
