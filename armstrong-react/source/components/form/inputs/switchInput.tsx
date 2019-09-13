import * as React from 'react';

interface IOrbitSwitchProps {
  name?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export const SwitchInput: React.FunctionComponent<IOrbitSwitchProps> = ({
  checked,
  onChange,
  name
}) => {
  const [clicked, setClicked] = React.useState(false);

  return (
    <input
      name={name}
      type='checkbox'
      className='armstrong-input switch-input'
      checked={checked}
      onChange={e => onChange(e.currentTarget.checked)}
      onClick={() => setClicked(true)}
      onMouseLeave={() => setClicked(false)}
      data-has-clicked={clicked}
    />
  );
};
