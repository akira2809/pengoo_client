// components/RadioButton.tsx
import React from 'react';

interface RadioButtonProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  children?: React.ReactNode;
  className?: string;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  label,
  id,
  name,
  value,
  checked,
  onChange,
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`flex items-center mb-4 ${className}`}>
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
        {...props}
      />
      <label htmlFor={id} className="ml-2 block text-gray-700 font-medium">
        {label}
        {children} {/* For additional content like price or icons */}
      </label>
    </div>
  );
};

export default RadioButton;