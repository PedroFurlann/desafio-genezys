type TextInputProps = {
  type: 'text' | 'email';
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const TextInput: React.FC<TextInputProps> = ({ placeholder = '', type, value, onChange }) => {
  return (
    <div className="mb-4">
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="w-full p-2 border border-gray-600 rounded bg-white text-black"
      />
    </div>
  );
};

export default TextInput;