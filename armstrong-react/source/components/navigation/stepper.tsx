import * as React from "react";

import { TStepperDirection } from "../../hooks/useStepper";
import "./stepper.scss";

export interface IStepperProps {
  /** (TStepperDirection) Should the stepper be vertical or horizontal */
  direction: TStepperDirection;
}

const StepperContent = React.createContext<IStepperProps>(undefined);
export const Stepper: React.FunctionComponent<React.PropsWithChildren<IStepperProps>> = ({
  children,
  direction,
}) => {
  return (
    <StepperContent.Provider value={{ direction }}>
      <div className="stepper" data-direction={direction}>
        {children}
      </div>
    </StepperContent.Provider>
  );
};

export interface IStepProps {
  /** (JSX.Element) Custom Spacer Item */
  customSpacer?: JSX.Element;
  /** (boolean) Should there be a spacer */
  spacer?: boolean;
}

export const Step: React.FunctionComponent<React.PropsWithChildren<IStepProps>> = ({
  children,
  customSpacer,
  spacer,
}) => {
  const ctx = React.useContext(StepperContent);
  return (
    <>
      {children}
      {spacer ? (
        customSpacer ? (
          customSpacer
        ) : (
          <DefaultSpacer direction={ctx.direction} />
        )
      ) : null}
    </>
  );
};

interface IStepperSpacerProps {
  direction: TStepperDirection;
}
export const DefaultSpacer: React.FunctionComponent<IStepperSpacerProps> = ({
  direction,
}) => {
  return <span className="stepper-spacer" data-direction={direction} />;
};
