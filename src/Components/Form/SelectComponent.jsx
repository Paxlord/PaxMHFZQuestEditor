import { Listbox } from "@headlessui/react";
import { useEffect } from "react";
import { useState } from "react";

const SelectComponent = ({
  options,
  defaultValue,
  title,
  onChange,
  className,
}) => {
  return (
    <div className={className}>
      <p className="text-white">{title}</p>
      <select
        value={defaultValue}
        className="w-full shadow-sm border-none text-white bg-zinc-300 bg-opacity-30 rounded focus:text-black focus:ring-green-500 focus:border-green-500"
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => {
          return <option value={option.value}>{option.label}</option>;
        })}
      </select>
    </div>
  );
};

const ListBoxComponent = ({ options, defaultValue, title, onChange }) => {
  const [selectedOption, setSelectedOption] = useState(() =>
    options.filter((element) => element.value === defaultValue)
  );

  useEffect(() => {
    setSelectedOption(
      options.filter((element) => element.value === defaultValue)
    );
  }, []);

  const onOptionClick = (option) => {
    onChange(option.value);
    setSelectedOption(option);
  };

  return (
    <Listbox
      value={selectedOption}
      onChange={(option) => onOptionClick(option)}
    >
      <Listbox.Button className={""}>{selectedOption.label}</Listbox.Button>
      <Listbox.Options className={""}>
        {options.map((option) => (
          <Listbox.Option
            className={""}
            key={option.label + option.value}
            value={option}
          >
            {option.label}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </Listbox>
  );
};

export default SelectComponent;
