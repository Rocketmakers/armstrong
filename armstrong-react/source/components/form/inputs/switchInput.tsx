import * as React from "react";
import "./orbitSwitch.scss";

interface IOrbitSwitchProps {
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const SwitchO: React.FunctionComponent<IOrbitSwitchProps> = ({
  checked,
  onChange,
  name
}) => {
  const [clicked, setClicked] = React.useState(false);

  return (
    <input
      name={name}
      type="checkbox"
      className="armstrong-input switch-input"
      checked={checked}
      onChange={e => onChange(e.currentTarget.checked)}
      onClick={() => setClicked(true)}
      onMouseLeave={() => setClicked(false)}
      data-has-clicked={clicked}
    />
  );
};
