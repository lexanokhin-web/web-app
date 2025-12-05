import React from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: 'primary' | 'secondary' | 'success' | 'danger';
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    className = '',
    disabled,
    ...props
}) => {
    const variantStyles = {
        primary: 'bg-blue-500/80 hover:bg-blue-600/80 text-white',
        secondary: 'bg-gray-500/80 hover:bg-gray-600/80 text-white',
        success: 'bg-green-500/80 hover:bg-green-600/80 text-white',
        danger: 'bg-red-500/80 hover:bg-red-600/80 text-white',
    };

    return (
        <motion.button
            disabled={disabled}
            whileHover={!disabled ? { scale: 1.05 } : {}}
            whileTap={!disabled ? { scale: 0.95 } : {}}
            className={`
        px-6 py-3 rounded-xl font-semibold
        backdrop-blur-sm border border-white/30
        shadow-lg transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${className}
      `}
            {...props}
        >
            {children}
        </motion.button>
    );
};
