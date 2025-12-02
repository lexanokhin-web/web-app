import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    animate?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
    children,
    className = '',
    onClick,
    animate = true
}) => {
    const Component = animate ? motion.div : 'div';

    const animationProps = animate ? {
        whileHover: { scale: 1.02, y: -4 },
        whileTap: { scale: 0.98 },
        transition: { type: "spring" as const, stiffness: 300, damping: 20 }
    } : {};

    return (
        <Component
            className={`
        relative overflow-hidden rounded-2xl
        bg-white/30 backdrop-blur-md
        border border-white/50
        shadow-xl shadow-blue-200/50
        hover:shadow-2xl hover:shadow-blue-300/60
        transition-all duration-300
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
            onClick={onClick}
            {...animationProps}
        >
            {/* Liquid glass shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-blue-100/30 pointer-events-none" />

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </Component>
    );
};
