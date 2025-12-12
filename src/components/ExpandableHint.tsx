import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './Button';

interface ExpandableHintProps {
    title: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    defaultOpen?: boolean;
    className?: string;
}

export const ExpandableHint: React.FC<ExpandableHintProps> = ({
    title,
    icon,
    children,
    defaultOpen = false,
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className={className}>
            <Button
                onClick={() => setIsOpen(!isOpen)}
                variant="secondary"
                className="w-full justify-center"
            >
                {icon && <span className="mr-2">{icon}</span>}
                {title}
                {isOpen ? (
                    <ChevronUp className="w-4 h-4 ml-2" />
                ) : (
                    <ChevronDown className="w-4 h-4 ml-2" />
                )}
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mt-2"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
