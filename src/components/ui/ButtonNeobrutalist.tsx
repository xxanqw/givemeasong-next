import React from 'react';
import './ButtonNeobrutalist.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ReactNode;
  loading?: boolean;
  children: React.ReactNode;
}

const ButtonNeobrutalist = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className = '', 
    variant = 'primary', 
    size = 'md', 
    icon, 
    loading, 
    disabled,
    children, 
    ...props 
  }, ref) => {
    const classes = [
      'brutal-btn',
      `brutal-btn--${variant}`,
      `brutal-btn--${size}`,
      loading && 'brutal-btn--loading',
      disabled && 'brutal-btn--disabled',
      className
    ].filter(Boolean).join(' ');

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <div className="brutal-btn__content">
            <div className="brutal-spinner brutal-btn__spinner"></div>
            <span className="brutal-btn__text">ЗАВАНТАЖЕННЯ...</span>
          </div>
        ) : (
          <div className="brutal-btn__content">
            {icon && <span className="brutal-btn__icon">{icon}</span>}
            <span className="brutal-btn__text">{children}</span>
          </div>
        )}
      </button>
    );
  }
);

ButtonNeobrutalist.displayName = 'ButtonNeobrutalist';

export default ButtonNeobrutalist;