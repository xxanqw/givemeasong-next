import React from 'react';
import './InputNeobrutalist.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'accent' | 'error';
}

const InputNeobrutalist = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className = '', 
    label,
    error,
    helper,
    icon,
    variant = 'default',
    ...props 
  }, ref) => {
    const inputClasses = [
      'brutal-input',
      `brutal-input--${variant}`,
      error && 'brutal-input--error',
      icon && 'brutal-input--with-icon',
      className
    ].filter(Boolean).join(' ');

    return (
      <div className="brutal-input-wrapper">
        {label && (
          <label className="brutal-input__label">
            {label}
          </label>
        )}
        
        <div className="brutal-input__container">
          {icon && (
            <div className="brutal-input__icon">
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            className={inputClasses}
            {...props}
          />
        </div>
        
        {(error || helper) && (
          <div className={`brutal-input__message ${error ? 'brutal-input__message--error' : ''}`}>
            {error || helper}
          </div>
        )}
      </div>
    );
  }
);

InputNeobrutalist.displayName = 'InputNeobrutalist';

export default InputNeobrutalist;