import * as React from "react";

export type TStepperDirection = "vertical" | "horizontal";

export interface IUseStepperProps {
  numberOfSteps: number;
  initialCurrentStep?: number;
}

export interface IUseStepper {
  canGoBack: boolean;
  currentStep: number;
  hasStepCompleted: (step: number) => boolean;
  isLastStep: (step: number) => boolean;
  lastStep: number | undefined;
  nextStep: number | undefined;
  onLastStep: boolean;
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
      return step < currentStep;
    },
    [currentStep],
  );

  const isLastStep = React.useCallback(
    (step: number) => {
      return step === numberOfSteps - 1;
    },
    [currentStep],
  );

  const finalStep = numberOfSteps - 1;
  return {
    canGoBack: currentStep >= 1,
    currentStep,
    hasStepCompleted,
    isLastStep,
    lastStep: currentStep >= 1 ? currentStep - 1 : undefined,
    nextStep: currentStep < finalStep ? currentStep + 1 : undefined,
    onLastStep: currentStep === finalStep,
    setStep,
  };
}
