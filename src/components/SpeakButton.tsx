import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { audioService } from '../services/audio/AudioService';
import { motion } from 'framer-motion';

interface SpeakButtonProps {
    text: string;
    lang?: string;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export const SpeakButton: React.FC<SpeakButtonProps> = ({
    text,
    lang = 'de-DE',
    className = '',
    size = 'md'
}) => {
    const [isSpeaking, setIsSpeaking] = React.useState(false);

    const handleSpeak = () => {
        if (!audioService.isSupported()) {
            alert('Ваш браузер не поддерживает Text-to-Speech');
            return;
        }

        setIsSpeaking(true);
        audioService.speak(text, { lang });

        // Reset после 2 секунд (примерно)
        setTimeout(() => setIsSpeaking(false), 2000);
    };

    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12'
    };

    const iconSizes = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6'
    };

    return (
        <motion.button
            onClick={handleSpeak}
            className={`
        ${sizeClasses[size]}
        rounded-full
        bg-gradient-to-br from-blue-400 to-blue-600
        hover:from-blue-500 hover:to-blue-700
        text-white
        shadow-lg hover:shadow-xl
        transition-all duration-200
        flex items-center justify-center
        ${className}
      `}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Произнести"
        >
            {isSpeaking ? (
                <VolumeX className={iconSizes[size]} />
            ) : (
                <Volume2 className={iconSizes[size]} />
            )}
        </motion.button>
    );
};
