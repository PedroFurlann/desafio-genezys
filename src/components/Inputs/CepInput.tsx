import { maskCep } from '@/utils/maskCep';
import React from 'react';

type CepInputProps = {
  placeholder?: string;
  value: string;
  onChange: (maskedValue: string, originalValue: string) => void;
};

const CepInput: React.FC<CepInputProps> = ({ placeholder = "", value, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const originalValue = e.target.value;
    const maskedValue = maskCep(originalValue);
    onChange(maskedValue, originalValue);
  }

  return (
    <div className="mb-4">
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        className="w-full p-2 border border-gray-600 rounded bg-white text-black"
        maxLength={9}
      />
    </div>
  );
};

export default CepInput;
