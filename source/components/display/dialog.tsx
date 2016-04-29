import * as React from "react";
import {classNames, cd} from "./../../utilities/classBuilder";
import { Icon } from "./icon";
import { Grid, Row, Col, SingleColumnRow } from './../layout/grid';

export interface IDialogProps extends React.HTMLProps<Dialog> {
  layerClass?: string;
  title?: string;
  subtitle?: string;
  isOpen: boolean;
  onClose?: () => void;
  onOpen?: () => void;
  xClicked?: () => void;
}

export class Dialog extends React.Component<IDialogProps, {}>{
  private dialogContentElement;
  public closeClicked() {
    if (this.props.onClose) {
      this.props.onClose();
    }
  }
  public scrollToTop() {
    this.dialogContentElement.scrollTop = 0;
  }
  componentDidMount() {
    this.dialogContentElement = document.getElementById("dialog-content");
  }
  componentWillReceiveProps(newProps: IDialogProps){
    var open = newProps.isOpen;
    if (open && open != this.props.isOpen && this.props.onOpen){
      this.props.onOpen();
    }
  }

  render() {
    var classes = classNames("dialog-layer", cd("open", this.props.isOpen), this.props.layerClass);
    var style = { width: this.props.width || "500px", height: this.props.height || "auto" }
    return (
      <div className={classes}>
        <div className="dialog" style={style} role="dialog" aria-hidden={ !this.props.isOpen } aria-labelledby={ this.props.title } aria-describedby={ this.props.subtitle } { ...this.props as any }>
          <Grid>
            <Row className={classNames("dialog-header", cd("dialog-header-no-title", !this.props.title))} fixed={true}>
              <Col centerContent={{ vertical: "center" }}>
                {this.props.title &&
                  <div className="flex-override">
                    <div className="dialog-titles">
                      {this.props.title && <div className="dialog-title">{this.props.title}</div>}
                      {this.props.subtitle && <div className="dialog-subtitle">{this.props.subtitle}</div> }
                    </div>
                  </div>
                }
              </Col>
              <Col fixed={true}>
                <div className="close-dialog-button" onClick={() => this.props.xClicked ? this.props.xClicked() : this.closeClicked() }/>
              </Col>
            </Row>
            <SingleColumnRow id="dialog-content" className="dialog-content">
              {this.props.children}
            </SingleColumnRow>
          </Grid>
        </div>
      </div>
    );
  }
}
