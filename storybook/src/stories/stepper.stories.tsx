import * as React from "react";

import { storiesOf } from "@storybook/react";
import { useStepper, Icon, Button } from "../_symlink";
import { Stepper, Step } from "../_symlink/components/navigation/stepper";
import { TStepperDirection } from "../_symlink/hooks/useStepper";
storiesOf("Stepper", module).add("Simple Stepper", () => {
  const {
    currentStep,
    setStep,
    nextStep,
    hasStepCompleted,
    isLastStep,
  } = useStepper({
    initialCurrentStep: 0,
    numberOfSteps: 3,
  });

  const renderStages = React.useCallback(() => {
    switch (currentStep) {
      case 0: {
        return "World 1";
      }
      case 1: {
        return "World 2";
      }
      case 2: {
        return "World 3";
      }
      default:
        return null;
    }
  }, [currentStep]);

  const direction: TStepperDirection = "horizontal";
  return (
    <>
      <Stepper direction={direction}>
        {["here", "hello", "world"].map((st, idx) => (
          <Step spacer={!isLastStep(idx)}>
            <div onClick={() => setStep(idx)}>
              <div>
                {hasStepCompleted(idx) ? (
                  <Icon icon={Icon.Icomoon.checkmark} />
                ) : (
                  idx + 1
                )}
              </div>
              {st}
            </div>
          </Step>
        ))}
      </Stepper>
      {nextStep && (
        <Button onClick={() => setStep(nextStep, true)}>Butte</Button>
      )}
      {renderStages()}
    </>
  );
});
