// مدير الصوت المركزي - يضمن تشغيل صوت واحد فقط في كل الأوقات

class AudioManagerClass {
  constructor() {
    this.currentAudio = null;
    this.currentSource = null;
    this.listeners = new Set();
  }

  // تسجيل صوت جديد كالصوت الحالي
  register(audio, source) {
    // إيقاف الصوت السابق إذا وجد
    if (this.currentAudio && this.currentAudio !== audio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch (e) {
        console.log('Error stopping previous audio:', e);
      }
      this.notifyListeners(this.currentSource, 'stopped');
    }
    
    this.currentAudio = audio;
    this.currentSource = source;
    this.notifyListeners(source, 'playing');
  }

  // إيقاف الصوت الحالي
  stop() {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch (e) {
        console.log('Error stopping audio:', e);
      }
      this.notifyListeners(this.currentSource, 'stopped');
      this.currentAudio = null;
      this.currentSource = null;
    }
  }

  // التحقق إذا كان المصدر الحالي هو المشغل
  isPlaying(source) {
    return this.currentSource === source && this.currentAudio && !this.currentAudio.paused;
  }

  // إضافة مستمع للتغييرات
  addListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
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

  // الحصول على المصدر الحالي
  getCurrentSource() {
    return this.currentSource;
  }
}

// إنشاء instance واحد فقط
const AudioManager = new AudioManagerClass();

export default AudioManager;