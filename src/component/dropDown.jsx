import { useState } from "react";

const Dropdown = ({ options, onSelect }) => {
  const [selectedOption, setSelectedOption] = useState("");

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedOption(value);
    onSelect(value);
  };

  return (
    <select value={selectedOption} onChange={handleChange}>
      <option value="" disabled>
        Select an asset
      </option>
      {options.map((asset, index) => (
        <option key={index} value={asset}>
          {asset}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;
