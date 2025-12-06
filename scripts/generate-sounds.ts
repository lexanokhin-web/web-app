// Script to generate simple sound effects using Web Audio API
// Run this in browser console to generate and download sound files

function generateSound(type: 'correct' | 'incorrect' | 'levelup' | 'click') {
    const audioContext = new AudioContext();
    const duration = type === 'levelup' ? 1.5 : type === 'click' ? 0.15 : 0.5;
    const sampleRate = audioContext.sampleRate;
    const numSamples = duration * sampleRate;
    const buffer = audioContext.createBuffer(1, numSamples, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        let value = 0;

        if (type === 'correct') {
            // Pleasant ascending tones
            value = Math.sin(2 * Math.PI * 523.25 * t) * 0.3 * Math.exp(-t * 3);
            value += Math.sin(2 * Math.PI * 659.25 * t) * 0.3 * Math.exp(-t * 3);
        } else if (type === 'incorrect') {
            // Gentle descending tone
            value = Math.sin(2 * Math.PI * 392 * t) * 0.2 * Math.exp(-t * 4);
            value += Math.sin(2 * Math.PI * 329.63 * t) * 0.2 * Math.exp(-t * 4);
        } else if (type === 'levelup') {
            // Celebratory ascending arpeggio
            const freq = t < 0.3 ? 523.25 : t < 0.6 ? 659.25 : t < 0.9 ? 783.99 : 1046.50;
            value = Math.sin(2 * Math.PI * freq * t) * 0.3 * Math.exp(-t * 2);
        } else if (type === 'click') {
            // Short click
            value = Math.sin(2 * Math.PI * 800 * t) * 0.1 * Math.exp(-t * 30);
        }

        data[i] = value;
    }

    // Convert to WAV and download
    const wav = audioBufferToWav(buffer);
    const blob = new Blob([wav], { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}.wav`;
    a.click();
}

function audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;

    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;

    const data = buffer.getChannelData(0);
    const dataLength = data.length * bytesPerSample;
    const headerLength = 44;
    const totalLength = headerLength + dataLength;

    const arrayBuffer = new ArrayBuffer(totalLength);
    const view = new DataView(arrayBuffer);

    // RIFF chunk descriptor
    writeString(view, 0, 'RIFF');
    view.setUint32(4, totalLength - 8, true);
    writeString(view, 8, 'WAVE');

    // fmt sub-chunk
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true); // fmt chunk size
    view.setUint16(20, format, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);

    // data sub-chunk
    writeString(view, 36, 'data');
    view.setUint32(40, dataLength, true);

    // Write audio data
    let offset = 44;
    for (let i = 0; i < data.length; i++) {
        const sample = Math.max(-1, Math.min(1, data[i]));
        view.setInt16(offset, sample * 0x7FFF, true);
        offset += 2;
    }

    return arrayBuffer;
}

function writeString(view: DataView, offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

// Generate all sounds
console.log('Generating sound files...');
generateSound('correct');
setTimeout(() => generateSound('incorrect'), 500);
setTimeout(() => generateSound('levelup'), 1000);
setTimeout(() => generateSound('click'), 1500);
console.log('Done! Check your downloads folder.');
