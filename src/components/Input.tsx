import React from 'react';

interface InputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    onSubmit?: () => void;
    disabled?: boolean;
    className?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>((
    {
        value,
        onChange,
        placeholder = '',
        onSubmit,
        disabled = false,
        className = ''
    },
    ref
) => {
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && onSubmit) {
            onSubmit();
        }
    };

    return (
        <input
            ref={ref}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete="off"
            autoCorrect="off"
            className={`
        w-full px-6 py-4 rounded-xl
        bg-white/40 backdrop-blur-md
        border-2 border-white/60
        focus:border-blue-400 focus:outline-none
        text-gray-800 text-lg font-medium
        placeholder-gray-500/70
        shadow-lg
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
        />
    );
});

Input.displayName = 'Input';
