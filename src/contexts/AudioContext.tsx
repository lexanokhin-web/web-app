import React, { createContext, useContext, useState, useEffect } from 'react';

interface AudioContextType {
    isMuted: boolean;
    volume: number;
    toggleMute: () => void;
    setVolume: (volume: number) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isMuted, setIsMuted] = useState(() => {
        const saved = localStorage.getItem('audio_muted');
        return saved ? JSON.parse(saved) : false;
    });

    const [volume, setVolumeState] = useState(() => {
        const saved = localStorage.getItem('audio_volume');
        return saved ? parseFloat(saved) : 0.5;
    });

    useEffect(() => {
        localStorage.setItem('audio_muted', JSON.stringify(isMuted));
    }, [isMuted]);

    useEffect(() => {
        localStorage.setItem('audio_volume', volume.toString());
    }, [volume]);

    const toggleMute = () => setIsMuted((prev: boolean) => !prev);
    const setVolume = (newVolume: number) => setVolumeState(Math.max(0, Math.min(1, newVolume)));

    return (
        <AudioContext.Provider value={{ isMuted, volume, toggleMute, setVolume }}>
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error('useAudio must be used within AudioProvider');
    }
    return context;
};
