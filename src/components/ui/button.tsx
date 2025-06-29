import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'default', 
  size = 'md', 
  className = '', 
  children, 
  ...props 
}) => {
  const baseClasses = "rounded-[10px] border-2 border-black transition-all duration-200 flex items-center justify-center";
  
  const variantClasses = {
    default: "bg-[#fab049] text-[#B74B28] shadow-[5px_6px_0px_#000000] hover:shadow-[2px_3px_0px_#000000] hover:translate-x-[3px] hover:translate-y-[3px]",
    outline: "bg-white text-[#B74B28] shadow-[3px_3px_0px_#000000] hover:bg-[#fab049] hover:shadow-[1px_1px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px]",
    ghost: "bg-transparent text-[#B74B28] border-transparent hover:bg-[#fab049] hover:border-black"
  };
  
  const sizeClasses = {
    sm: "px-3 py-2 text-lg",
    md: "px-4 py-2 text-xl",
    lg: "px-6 py-3 text-2xl"
  };
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};