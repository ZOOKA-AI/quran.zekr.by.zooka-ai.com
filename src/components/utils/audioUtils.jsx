export const audioUtils = {
  getAudioContext() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    return new AudioContext();
  },

  createGainNode(audioContext) {
    return audioContext.createGain();
  },

  setVolume(gainNode, volume) {
    gainNode.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), audioContext.currentTime);
  },

  normalizeAudio(audioContext, source) {
    const analyser = audioContext.createAnalyser();
    source.connect(analyser);
    return analyser;
  },

  getAudioData(analyser) {
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }
};