import React from 'react';
import './CardNeobrutalist.css';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'accent' | 'inverted' | 'bordered';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  shadow?: 'harsh' | 'brutal' | 'extreme' | 'none';
  interactive?: boolean;
  children: React.ReactNode;
}

const CardNeobrutalist = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className = '', 
    variant = 'default',
    padding = 'lg',
    shadow = 'brutal',
    interactive = false,
    children, 
    ...props 
  }, ref) => {
    const classes = [
      'brutal-card',
      `brutal-card--${variant}`,
      `brutal-card--padding-${padding}`,
      `brutal-card--shadow-${shadow}`,
      interactive && 'brutal-card--interactive',
      className
    ].filter(Boolean).join(' ');

    return (
      <div
        ref={ref}
        className={classes}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardNeobrutalist.displayName = 'CardNeobrutalist';

export default CardNeobrutalist;