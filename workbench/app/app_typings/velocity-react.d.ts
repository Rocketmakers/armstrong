interface IVelocityComponentProps{
  animation: any;
  easing: any;
  duration: number;
}


declare module "velocity-react" {

  import * as React from "react";

  class VelocityComponent extends React.Component<IVelocityComponentProps, any> {}
  class VelocityTransitionGroup extends React.Component<any, any>{}

}
