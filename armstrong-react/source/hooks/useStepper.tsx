import * as React from "react";

export type TStepperDirection = "vertical" | "horizontal";

export interface IUseStepperProps {
  numberOfSteps: number;
  initialCurrentStep?: number;
}

export interface IUseStepper {
  currentStep: number;
  nextStep: number | undefined;
  onLastStep: boolean;
  isLastStep: (step: number) => boolean;
  hasStepCompleted: (step: number) => boolean;
  setStep: (step: number, force?: boolean) => void;
}

export function useStepper({
  numberOfSteps,
  initialCurrentStep,
}: IUseStepperProps): IUseStepper {
  const [currentStep, setCurrentStep] = React.useState<number>(
    initialCurrentStep || 0,
  );

  const setStep = React.useCallback(
    (step: number, force?: boolean) => {
      if (step < numberOfSteps && (force || step < currentStep)) {
        setCurrentStep(step);
      }
    },
    [currentStep, numberOfSteps],
  );

  const hasStepCompleted = React.useCallback(
    (step: number) => {
      return step <= currentStep;
    },
    [currentStep],
  );

  const isLastStep = React.useCallback(
    (step: number) => {
      return step === numberOfSteps - 1;
    },
    [currentStep],
  );

  const lastStep = numberOfSteps - 1;
  return {
    currentStep,
    setStep,
    hasStepCompleted,
    isLastStep,
    onLastStep: currentStep === lastStep,
    nextStep: currentStep < lastStep ? currentStep + 1 : undefined,
  };
}
