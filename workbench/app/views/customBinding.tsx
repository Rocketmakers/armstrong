import * as React from "react";

import {FormBinder} from "armstrong-react/dist/components/form/formBinders"
import { IFormBinderInjector, IFormBinder, IDataBinder } from "../../../armstrong-react/dist/components/form/formCore";
declare module "armstrong-react/dist/components/form/formBinders"{
    interface FormBinder{
        customTextInput(name: string): IFormBinderInjector<ICustomTextInput>
    }
}
FormBinder.prototype.customTextInput = function(name: string) {
    const binder: FormBinder = this
    return binder.custom(new CustomTextInputBinder(name));
}

class CustomTextInputBinder implements IFormBinder<ICustomTextInput, any> {
    constructor(public dataPath: string) { }
    setElementProperty(props: ICustomTextInput, dataBinder: IDataBinder<any>): void {
        props.value = dataBinder.getValue(this.dataPath)
    }
    handleValueChanged(props: ICustomTextInput, dataBinder: IDataBinder<any>, notifyChanged: () => void): void {
        props.change = c => {
            dataBinder.setValue(this.dataPath, c)
            notifyChanged()
        }
    }
}
export interface ICustomTextInput{
    value?: string
    change?: (value:string) => void
}
export class CustomTextInput extends React.Component<ICustomTextInput>{
    render(){
        return <input type="text" value={this.props.value} onChange={e => this.props.change(e.target.value)}/>
    }
}