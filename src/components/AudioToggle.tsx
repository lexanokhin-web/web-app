import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useAudio } from '../contexts/AudioContext';
import { motion } from 'framer-motion';

export const AudioToggle: React.FC = () => {
    const { isMuted, toggleMute } = useAudio();

    return (
        <motion.button
            onClick={toggleMute}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full bg-white/30 backdrop-blur-md hover:bg-white/50 transition-colors"
            title={isMuted ? 'Звук выключен' : 'Звук включен'}
        >
            {isMuted ? (
                <VolumeX className="w-5 h-5 text-gray-700" />
            ) : (
                <Volume2 className="w-5 h-5 text-gray-700" />
            )}
        </motion.button>
    );
};
