// components/RadioButton.tsx
import React from 'react';

interface RadioButtonProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  id: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  children?: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  isCustomClass?: boolean;
  price?: number;
  formatPrice?: (amount: number) => string;
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
  icon,
  isCustomClass,
  ...props
}) => {
  // Filter out props that shouldn't be passed to the DOM
  const { formatPrice, price, ...filteredProps } = props;
  
  return (
    <div className={`flex items-center mb-4 ${className}`}>
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className={`form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out ${isCustomClass ? '' : 'mr-2'}`}
        {...filteredProps}
      />
      <label 
        htmlFor={id} 
        className={`flex items-center ${isCustomClass ? '' : 'text-gray-700 font-medium'}`}
      >
        {icon && <span className="mr-2">{icon}</span>}
        <span className="flex-1">{label}</span>
        {price !== undefined && formatPrice && (
          <span className="ml-2 font-medium">
            {formatPrice(price)}
          </span>
        )}
        {children}
      </label>
    </div>
  );
};

export default RadioButton;