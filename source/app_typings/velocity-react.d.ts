interface IVelocityComponentProps{
  animation?: any;
  duration?: number;
  easing?: string;
  complete?: ()=> void;
}


declare module "velocity-react" {

  import * as React from "react";

  class VelocityComponent extends React.Component<IVelocityComponentProps, any> {}
  class VelocityTransitionGroup extends React.Component<any, any>{}

}
