import React from 'react';

/**
 * 공통 버튼 컴포넌트 (간단 버전)
 * variant: filled | outline | danger
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'outline' | 'danger';
  size?: 'sm' | 'md';
}

export default function Button({
  variant = 'filled',
  size = 'md',
  className = '',
  ...rest
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 text-base',
  }[size];

  const variants = {
    filled: 'bg-[#13233D] text-white hover:bg-[#0f1c31]',
    outline:
      'border border-[#13233D] text-[#13233D] bg-white hover:bg-[#F8F9FA]',
    danger:
      'bg-red-500 text-white hover:bg-red-600',
  }[variant];

  return <button className={`${base} ${sizes} ${variants} ${className}`} {...rest} />;
}
