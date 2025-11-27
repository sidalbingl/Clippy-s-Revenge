/**
 * Simple script to generate placeholder audio files
 * These are basic beeps - replace with better sounds later
 */

const fs = require('fs');
const path = require('path');

// Create sounds directory if it doesn't exist
const soundsDir = path.join(__dirname, '../public/sounds');
if (!fs.existsSync(soundsDir)) {
  fs.mkdirSync(soundsDir, { recursive: true });
}

// Generate simple sine wave audio data
function generateBeep(frequency, duration, volume) {
  const sampleRate = 44100;
  const numSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(numSamples);
  
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    samples[i] = Math.sin(2 * Math.PI * frequency * t) * volume;
  }
  
  return samples;
}

// Convert samples to WAV format
function samplesToWav(samples, sampleRate = 44100) {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  
  // WAV header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, samples.length * 2, true);
  
  // Audio data
  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const sample = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, sample * 0x7FFF, true);
    offset += 2;
  }
  
  return Buffer.from(buffer);
}

function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

// Generate sounds
console.log('Generating placeholder sounds...');

// Low severity - soft beep
const lowSamples = generateBeep(800, 0.1, 0.3);
const lowWav = samplesToWav(lowSamples);
fs.writeFileSync(path.join(soundsDir, 'low.wav'), lowWav);
console.log('✓ Generated low.wav');

// Medium severity - glitchy sound (multiple frequencies)
const mediumDuration = 0.3;
const mediumSamples = new Float32Array(Math.floor(44100 * mediumDuration));
for (let i = 0; i < mediumSamples.length; i++) {
  const t = i / 44100;
  mediumSamples[i] = (
    Math.sin(2 * Math.PI * 400 * t) * 0.3 +
    Math.sin(2 * Math.PI * 600 * t) * 0.2 +
    (Math.random() - 0.5) * 0.2
  );
}
const mediumWav = samplesToWav(mediumSamples);
fs.writeFileSync(path.join(soundsDir, 'medium.wav'), mediumWav);
console.log('✓ Generated medium.wav');

// High severity - deep bass + distortion
const highDuration = 0.5;
const highSamples = new Float32Array(Math.floor(44100 * highDuration));
for (let i = 0; i < highSamples.length; i++) {
  const t = i / 44100;
  const bass = Math.sin(2 * Math.PI * 100 * t) * 0.5;
  const distortion = Math.sin(2 * Math.PI * 200 * t) * 0.3;
  const noise = (Math.random() - 0.5) * 0.3;
  highSamples[i] = bass + distortion + noise;
}
const highWav = samplesToWav(highSamples);
fs.writeFileSync(path.join(soundsDir, 'high.wav'), highWav);
console.log('✓ Generated high.wav');

console.log('\nPlaceholder sounds generated successfully!');
console.log('Location:', soundsDir);
console.log('\nNote: These are basic beeps. Replace with better sounds for production.');
