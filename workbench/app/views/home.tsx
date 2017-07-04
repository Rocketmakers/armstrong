// IMPORTS
import * as React from 'react';
import { Icon, TabControl, Button, Grid, Row, Col, AutoCompleteInput, Sample, SelectInput, TabItem, Dialog } from "armstrong-react";
import { SampleForm } from "./sampleForm";

export class Home extends React.Component<{}, { dialogOpen?: boolean, canClick?: boolean, pending?: boolean }> {
  /**
   *
   */
  constructor() {
    super();
    this.state = { dialogOpen: false, canClick: true, pending: false }
  }
  private tabControl: TabControl;

  public render() {
    let options = [{ id: 3, name: 'é' }, { id: 4, name: 'e' }, { id: 4, name: 'ę' }];
    return (
      <div>
      <Grid debugMode={true} className="m-bottom-xlarge">
          <Row className="bg-brand-primary" height={60}>
            <Col>
              HEADER
            </Col>
          </Row>
          <Row>
            <Col width={300}>1</Col>
            <Col>2</Col>
            <Col width="auto">3</Col>
            <Col>4</Col>
            <Col>
              <Grid debugMode={true}>>
                <Row>
                  <Col>5</Col>
                  <Col>6</Col>
                  <Col>7</Col>
                  <Col>8</Col>
                  <Col>waddup
                  </Col>
                </Row>
              </Grid>
            </Col>
          </Row>
          <Row>
            <Col>
            <Grid debugMode={true}>
              <Row className="bg-red" height={60}>
                <Col>
                  HEADER
            </Col>
              </Row>
              <Row>
                <Col width={300}>1</Col>
                <Col>2</Col>
                <Col width="auto">3</Col>
                <Col>4</Col>
                <Col>
                  <Grid debugMode={true}>>
                <Row>
                      <Col>5</Col>
                      <Col>6</Col>
                      <Col>7</Col>
                      <Col>8</Col>
                      <Col>waddup
                  </Col>
                    </Row>
                  </Grid>
                </Col>
              </Row>
            </Grid>
            </Col>
          </Row>
        </Grid>

        <Button disabled={true} onClick={() => alert('testing 123')}>test disabled</Button>
        <Button onClick={() => this.setState({ pending: !this.state.pending })}>waddup?</Button>
        <Button rounded={true} pending={this.state.pending} >waddup!</Button>
        <SampleForm sample={{ id: "s101", name: "Keith2", tags: [], accepts: true, birthMonthDay:"12-14" }} />
        <AutoCompleteInput ignoreDiacritics={true} options={options} />

        <Button onClick={() => this.setState({ dialogOpen: true })}>open dialog plz</Button>

        <Dialog closeOnBackgroundClick={true} isOpen={this.state.dialogOpen} onClose={() => this.setState({ dialogOpen: false })} footerContent={
          <Button disabled={!this.state.canClick}>OH NO</Button>
        }>
          oh sheee, waddup?<Button onClick={() => this.setState({ canClick: false })}>disable BUTT</Button>
        </Dialog>

        <Sample title="Select Input"
          description="A select input with 4 options"
          component={
            <SelectInput change={(i) => alert(i)}
              options={[
                { id: 1, name: "Talent Matters" },
                { id: 2, name: "P3 Hub" },
                { id: 3, name: "Pathway toolkit" }]} />
          } />

        <Sample title="Grid"
          description="A grid with 3 columns"
          component={
            <Grid debugMode={true}>
              <Row>
                <Col>1</Col>
                <Col width="2*">2</Col>
                <Col>3</Col>
              </Row>
            </Grid>
          } />
        <Sample title="Button"
          description="A green button"
          component={
            <Button className="bg-positive">I am a button, click me!</Button>
          } />
        <Sample title="Tab control"
          description="A tab control with 4 tabs, one with an icon"
          component={
            <TabControl ref={t => this.tabControl = t}>
              <TabItem title="Tab 1">I am the content for tab 1</TabItem>
              <TabItem title="Tab 2">I am the content for tab 2</TabItem>
              <TabItem title="Tab 3">I am the content for tab 3</TabItem>
              <TabItem title="Tab 4">I am the content for tab 4</TabItem>
            </TabControl>
          } />

        <Button className="m-top-large" onClick={() => this.tabControl.changeTab(3)}>Change to tab 4</Button>
        </div>
    );
  }
}
