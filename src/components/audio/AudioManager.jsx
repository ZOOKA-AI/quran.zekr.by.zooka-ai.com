// مدير الصوت المركزي - يمنع تداخل الأصوات
class AudioManagerClass {
  constructor() {
    this.currentAudio = null;
    this.currentSource = null;
    this.listeners = [];
  }

  // إيقاف أي صوت حالي قبل تشغيل صوت جديد
  stopAll() {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch (e) {
        console.log('Error stopping audio:', e);
      }
    }
    this.currentAudio = null;
    this.currentSource = null;
    this.notifyListeners(null, 'stopped');
  }

  // تسجيل صوت جديد - يوقف أي صوت سابق تلقائياً
  register(audioElement, source) {
    // إيقاف أي صوت حالي أولاً
    if (this.currentAudio && this.currentAudio !== audioElement) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch (e) {
        console.log('Error stopping previous audio:', e);
      }
      this.notifyListeners(this.currentSource, 'stopped');
    }

    this.currentAudio = audioElement;
    this.currentSource = source;
    this.notifyListeners(source, 'playing');
  }

  // إيقاف الصوت الحالي
  stop() {
    this.stopAll();
  }

  // التحقق من المصدر الحالي
  getCurrentSource() {
    return this.currentSource;
  }

  // التحقق مما إذا كان مصدر معين يُشغّل حالياً
  isPlaying(source) {
    return this.currentSource === source && this.currentAudio && !this.currentAudio.paused;
  }

  // إضافة مستمع للتغييرات
  addListener(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  // إشعار المستمعين
  notifyListeners(source, status) {
    this.listeners.forEach(callback => {
      try {
        callback(source, status);
      } catch (e) {
        console.log('Listener error:', e);
      }
    });
  }
}

const AudioManager = new AudioManagerClass();
export default AudioManager;