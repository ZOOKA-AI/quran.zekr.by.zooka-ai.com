export const audioUtils = {
  getAudioContext() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    return new AudioContext();
  },

  createGainNode(audioContext) {
    return audioContext.createGain();
  },

  async getAudioDuration(url) {
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.onloadedmetadata = () => resolve(audio.duration);
      audio.onerror = () => resolve(0);
      audio.src = url;
    });
  },

  async preloadAudio(url) {
    const audio = new Audio();
    return new Promise((resolve, reject) => {
      audio.onloadeddata = () => resolve(audio);
      audio.onerror = reject;
      audio.src = url;
    });
  },

  getAudioUrl(reciterId, surahNumber) {
    return `https://quran.api.example.com/audio/${reciterId}/${surahNumber}.mp3`;
  }
};