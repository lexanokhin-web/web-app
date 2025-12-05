/**
 * Audio Service using Web Speech API (100% бесплатно!)
 * Поддерживает немецкое произношение
 */

interface SpeechOptions {
    lang?: string;
    rate?: number;
    pitch?: number;
    volume?: number;
}

class AudioService {
    private synth: SpeechSynthesis;
    private voices: SpeechSynthesisVoice[] = [];
    private germanVoice: SpeechSynthesisVoice | null = null;

    constructor() {
        this.synth = window.speechSynthesis;
        this.loadVoices();

        // Voices могут загружаться асинхронно
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = () => this.loadVoices();
        }
    }

    private loadVoices() {
        this.voices = this.synth.getVoices();

        // Найти немецкий голос
        this.germanVoice = this.voices.find(voice =>
            voice.lang.startsWith('de-') || voice.lang === 'de'
        ) || null;

        if (!this.germanVoice && this.voices.length > 0) {
            console.warn('German voice not found, using default');
        }
    }

    /**
     * Произнести текст на немецком
     */
    speak(text: string, options: SpeechOptions = {}) {
        // Остановить предыдущее воспроизведение
        this.stop();

        const utterance = new SpeechSynthesisUtterance(text);

        // Настройки
        utterance.lang = options.lang || 'de-DE';
        utterance.rate = options.rate || 0.9; // Чуть медленнее для обучения
        utterance.pitch = options.pitch || 1.0;
        utterance.volume = options.volume || 1.0;

        // Использовать немецкий голос если доступен
        if (this.germanVoice) {
            utterance.voice = this.germanVoice;
        }

        this.synth.speak(utterance);
    }

    /**
     * Остановить воспроизведение
     */
    stop() {
        if (this.synth.speaking) {
            this.synth.cancel();
        }
    }

    /**
     * Проверить поддержку браузером
     */
    isSupported(): boolean {
        return 'speechSynthesis' in window;
    }

    /**
     * Получить список доступных немецких голосов
     */
    getGermanVoices(): SpeechSynthesisVoice[] {
        return this.voices.filter(voice =>
            voice.lang.startsWith('de-') || voice.lang === 'de'
        );
    }

    /**
     * Получить все доступные голоса
     */
    getAllVoices(): SpeechSynthesisVoice[] {
        return this.voices;
    }
}

// Singleton instance
export const audioService = new AudioService();
