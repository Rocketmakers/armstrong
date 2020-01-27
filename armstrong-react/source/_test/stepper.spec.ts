import assert = require("assert");
import { act, renderHook } from "react-hooks-testing-library";
import { useStepper } from "../hooks/useStepper";

describe("useStepper", () => {
  it("Simple", async () => {
    const steps: string[] = ["Stage 1", "Stage 2", "Stage 3"];

    const { result } = renderHook(() =>
      useStepper({
        initialCurrentStep: 0,
        numberOfSteps: 3,
      }),
    );

    assert(
      result.current.currentStep === 0,
      "Current Step should be equal to 0",
    );

    act(() => result.current.setStep(result.current.nextStep));

    assert(
      result.current.currentStep === 0,
      "Current Step should be equal to 0, if setStep force not true",
    );

    act(() => result.current.setStep(result.current.nextStep, true));

    assert(
      result.current.currentStep === 1,
      "Current Step should be equal to 1",
    );
    act(() => result.current.setStep(result.current.lastStep, true));

    assert(
      result.current.currentStep === 0,
      "Current Step should be equal to 0",
    );

    act(() => result.current.setStep(2, true));

    assert(
      result.current.currentStep === 2,
      "Current Step should be equal to 2",
    );

    assert(
      result.current.isLastStep(result.current.currentStep) === true,
      "Should be on the last step",
    );
  });
});
