import React from 'react';

type NumberInputProps = {
  placeholder?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
};

const NumberInput: React.FC<NumberInputProps> = ({ placeholder = '', value, onChange, min, max }) => {
  return (
    <div className="mb-4 w-full">
      <input
        type="number"
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        min={min}
        max={max}
        className="w-full p-2 border border-gray-600 rounded bg-white text-black"
      />
    </div>
  );
};

export default NumberInput;