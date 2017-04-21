import * as React from "react";
import * as _ from "underscore";
import * as JSXToString from "jsx-to-string";
import * as ReactServerDOM from "react-dom/server";
import { Grid, Row, Col } from './../../../source/components/layout/grid';

export interface IPropInfo {
  name: string;
  type: string;
  value: string;
}

export interface ISampleProps extends React.Props<Sample> {
  component: JSX.Element;
  title: string;
  description?: string;
  showHtml?: boolean;
}

export class Sample extends React.Component<ISampleProps, {}> {
  getProps(): IPropInfo[] {
    return this.getPropInfo(this.props.component.props);
  }

  getPropInfo(props: any): IPropInfo[] {
    let ps = [];
    Object.keys(props).forEach(k => {
      let p = props[k];
      let t = '(' + typeof (p) + ')';
      if (t === "(object)") {
        t = String(p.$$typeof).replace('Symbol', '');
      }
      if (_.isArray(p)) {
        if (p[0].$$typeof !== undefined) {
          t = String(p[0].$$typeof).replace('Symbol', '') + '[]';
        } else {
          t = "(object[])"
        }
      }
      ps.push({ name: k, type: t, value: p.toString() });
    })
    return ps;
  }
  render() {
    return (
      <div className="element-sample">
        <h1>{this.props.title}</h1>
        <p>{this.props.description}</p>
        <h2>RESULT</h2>
        {this.props.component}
        <h2>PROPS</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Value (Example)</th>
            </tr>
          </thead>
          <tbody>
            {this.getProps().map((m, i) =>
              <tr key={`p_${i}_${m.name}`}>
                <td>{m.name}</td>
                <td>{m.type}</td>
                <td>{m.value}</td>
              </tr>
            )}
          </tbody>
        </table>
        <h2>JSX</h2>
        <pre>{JSXToString(this.props.component)}</pre>
        {this.props.showHtml && <h2>HTML</h2>}
        {this.props.showHtml && <pre>{ReactServerDOM.renderToStaticMarkup(this.props.component).replace(/</g, '\r\n<').trim()}</pre>}
      </div>
    )
  }
}