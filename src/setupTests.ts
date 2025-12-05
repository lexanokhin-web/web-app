import '@testing-library/jest-dom';

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
    value: () => { },
    writable: true,
});

// Mock window.speechSynthesis
Object.defineProperty(window, 'speechSynthesis', {
    value: {
        getVoices: () => [],
        speak: () => { },
        cancel: () => { },
        pause: () => { },
        resume: () => { },
        paused: false,
        pending: false,
        speaking: false,
        addEventListener: () => { },
        removeEventListener: () => { },
        onvoiceschanged: null,
    },
    writable: true,
});

// Mock window.SpeechSynthesisUtterance
(window as unknown as { SpeechSynthesisUtterance: unknown }).SpeechSynthesisUtterance = class {
    text = '';
    lang = 'de-DE';
    pitch = 1;
    rate = 1;
    volume = 1;
    voice = null;
    onend = null;
    onerror = null;
    onstart = null;
    onpause = null;
    onresume = null;
    onmark = null;
    onboundary = null;
    constructor(text: string) {
        this.text = text;
    }
};
