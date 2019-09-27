import * as React from "react";

import { TStepperDirection } from "../../hooks/useStepper";
import "./stepper.scss";

export interface IStepperProps {
  direction: TStepperDirection;
}

const stepperContent = React.createContext<IStepperProps>(undefined);
export const Stepper: React.FunctionComponent<IStepperProps> = ({
  children,
  direction,
}) => {
  return (
    <stepperContent.Provider value={{ direction }}>
      <div className="stepper" data-direction={direction}>
        {children}
      </div>
    </stepperContent.Provider>
  );
};

export interface IStepProps {
  customSpacer?: JSX.Element;
  spacer?: boolean;
}

export const Step: React.FunctionComponent<IStepProps> = ({
  children,
  customSpacer,
  spacer,
}) => {
  const ctx = React.useContext(stepperContent);
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
