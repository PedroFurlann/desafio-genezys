'use client'

import { Eye, EyeSlash } from 'phosphor-react';
import React, { useState } from 'react';

type PasswordInputProps = {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const PasswordInput: React.FC<PasswordInputProps> = ({ placeholder = "", value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mb-4">
      <div className="relative">

        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full p-2 border border-gray-600 rounded bg-white text-black"
        />


        {showPassword ? (
          <EyeSlash
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
            size={20}
            onClick={() => setShowPassword((state) => !state)}
          />
        ) : (
          <Eye
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
            size={20}
            onClick={() => setShowPassword((state) => !state)}
          />
        )}
      </div>
    </div>
  );
};

export default PasswordInput;