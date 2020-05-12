import * as React from "react";

import { storiesOf } from "@storybook/react";
import { useStepper, Icon, Button, TextInput } from "../_symlink";
import { Stepper, Step } from "../_symlink/components/navigation/stepper";
import { TStepperDirection } from "../_symlink/hooks/useStepper";

const stageContainerStyle: React.CSSProperties = {
  display: "flex",
  border: "1px solid grey",
  alignItems: "center",
  boxShadow: "0 0 5px rgba(0,0,0,0.1)",
  height: 300,
  overflow: "hidden",
  justifyContent: "center",
  margin: "10px",
};

const buttonContainerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  height: 75,
  overflow: "hidden",
  justifyContent: "center",
  margin: "10px",
};

const stepContainerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  height: "auto",
  overflow: "hidden",
  justifyContent: "center",
  margin: "10px",
};

interface IStepperForm {
  name: string;
  component: JSX.Element;
}

interface IStepperFormContext {
  confirmPassword: string;
  email: string;
  firstname: string;
  password: string;
  surname: string;
}

const StepperFormContext = React.createContext<
  [
    IStepperFormContext,
    React.Dispatch<React.SetStateAction<IStepperFormContext>>,
  ]
>([
  {
    confirmPassword: "",
    email: "",
    firstname: "",
    password: "",
    surname: "",
  },
  () => null,
]);

const Form1: React.FunctionComponent = () => {
  const [state, setState] = React.useContext(StepperFormContext);
  return (
    <div>
      <label>Firstname</label>
      <TextInput
        onChange={e => setState({ ...state, firstname: e.target.value })}
        value={state.firstname}
      />
      <label>Surname</label>
      <TextInput
        onChange={e => setState({ ...state, surname: e.target.value })}
        value={state.surname}
      />
    </div>
  );
};

const Form2: React.FunctionComponent = () => {
  const [state, setState] = React.useContext(StepperFormContext);
  return (
    <div>
      <label>Email</label>
      <TextInput
        onChange={e => setState({ ...state, email: e.target.value })}
        value={state.email}
      />
    </div>
  );
};

const Form3: React.FunctionComponent = () => {
  const [state, setState] = React.useContext(StepperFormContext);
  return (
    <div>
      <label>Password</label>
      <TextInput
        onChange={e => setState({ ...state, password: e.target.value })}
        value={state.password}
      />
      <label>Confirm Password</label>
      <TextInput
        onChange={e => setState({ ...state, confirmPassword: e.target.value })}
        value={state.confirmPassword}
      />
    </div>
  );
};

storiesOf("Stepper", module)
  .add("Simple Stepper", () => {
    const steps: string[] = [
      "Stage 1",
      "Stage 2",
      "Stage 3",
      "Stage 4",
      "Stage 5",
      "Stage 6",
    ];

    const {
      canGoBack,
      currentStep,
      hasStepCompleted,
      isLastStep,
      lastStep,
      nextStep,
      setStep,
    } = useStepper({
      initialCurrentStep: 0,
      numberOfSteps: steps.length,
    });

    const renderStages = React.useCallback(() => {
      return steps[currentStep];
    }, [currentStep]);

    const direction: TStepperDirection = "horizontal";

    return (
      <>
        <Stepper direction={direction}>
          {steps.map((st, idx) => (
            <Step spacer={!isLastStep(idx)}>
              <div style={stepContainerStyle} onClick={() => setStep(idx)}>
                <span>{currentStep === idx ? "Current" : null}</span>
                <span>
                  {hasStepCompleted(idx) ? (
                    <Icon icon={Icon.Icomoon.checkmark} />
                  ) : null}
                </span>
                {st}
              </div>
            </Step>
          ))}
        </Stepper>
        <div style={stageContainerStyle}>{renderStages()}</div>
        <div style={buttonContainerStyle}>
          {canGoBack && (
            <Button onClick={() => setStep(lastStep, true)}>Back</Button>
          )}

          {nextStep && (
            <Button onClick={() => setStep(nextStep, true)}>Next</Button>
          )}
        </div>
      </>
    );
  })
  .add("Form Stepper", () => {
    const direction: TStepperDirection = "horizontal";
    const steps: IStepperForm[] = [
      { name: "Stage 1", component: <Form1 /> },
      { name: "Stage 2", component: <Form2 /> },
      { name: "Stage 3", component: <Form3 /> },
    ];

    const [state, setState] = React.useState<IStepperFormContext>({
      confirmPassword: "",
      email: "",
      firstname: "",
      password: "",
      surname: "",
    });

    const {
      canGoBack,
      currentStep,
      hasStepCompleted,
      isLastStep,
      lastStep,
      nextStep,
      setStep,
    } = useStepper({
      initialCurrentStep: 0,
      numberOfSteps: steps.length,
    });

    const renderStages = React.useCallback(() => {
      return steps[currentStep].component;
    }, [currentStep]);

    return (
      <StepperFormContext.Provider value={[state, setState]}>
        <Stepper direction={direction}>
          {steps.map((st: IStepperForm, idx) => (
            <Step spacer={!isLastStep(idx)}>
              <div style={stepContainerStyle} onClick={() => setStep(idx)}>
                <span>{currentStep === idx ? "Current" : null}</span>
                <span>
                  {hasStepCompleted(idx) ? (
                    <Icon icon={Icon.Icomoon.checkmark} />
                  ) : null}
                </span>
                {st.name}
              </div>
            </Step>
          ))}
        </Stepper>
        <div style={stageContainerStyle}>{renderStages()}</div>
        <div style={buttonContainerStyle}>
          {canGoBack && (
            <Button onClick={() => setStep(lastStep, true)}>Back</Button>
          )}

          {nextStep && (
            <Button onClick={() => setStep(nextStep, true)}>Next</Button>
          )}
        </div>
      </StepperFormContext.Provider>
    );
  });
