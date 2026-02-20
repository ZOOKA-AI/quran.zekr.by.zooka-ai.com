import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Download, Trash2, Check, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

// مدير التخزين المحلي للصوتيات
class AudioCache {
  constructor() {
    this.dbName = 'QuranAudioDB';
    this.storeName = 'audio';
    this.version = 1;
  }

  async openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'url' });
          store.createIndex('reciter_surah', ['reciter_id', 'surah_number'], { unique: false });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async cacheAudio(reciterId, surahNumber, audioUrl) {
    try {
      const response = await fetch(audioUrl);
      if (!response.ok) throw new Error('Failed to fetch audio');
      
      const blob = await response.blob();
      const db = await this.openDB();
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      await store.put({
        url: audioUrl,
        reciter_id: reciterId,
        surah_number: surahNumber,
        blob: blob,
        timestamp: Date.now(),
        size: blob.size
      });
      
      return true;
    } catch (err) {
      console.error('Failed to cache audio:', err);
      throw err;
    }
  }

  async getCachedAudio(audioUrl) {
    try {
      const db = await this.openDB();
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      
      return new Promise((resolve, reject) => {
        const request = store.get(audioUrl);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } catch (err) {
      console.error('Failed to get cached audio:', err);
      return null;
    }
  }

  async getAllCached() {
    try {
      const db = await this.openDB();
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      
      return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } catch (err) {
      console.error('Failed to get all cached audio:', err);
      return [];
    }
  }

  async deleteCached(audioUrl) {
    try {
      const db = await this.openDB();
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      await store.delete(audioUrl);
      return true;
    } catch (err) {
      console.error('Failed to delete cached audio:', err);
      throw err;
    }
  }

  async clearAll() {
    try {
      const db = await this.openDB();
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      await store.clear();
      return true;
    } catch (err) {
      console.error('Failed to clear cache:', err);
      throw err;
    }
  }

  async getCacheSize() {
    try {
      const cached = await this.getAllCached();
      return cached.reduce((total, item) => total + (item.size || 0), 0);
    } catch (err) {
      return 0;
    }
  }
}

const audioCache = new AudioCache();

export default function OfflineAudioManager() {
  const [recitations, setRecitations] = useState([]);
  const [cachedItems, setCachedItems] = useState([]);
  const [downloading, setDownloading] = useState({});
  const [cacheSize, setCacheSize] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [dbRecitations, cached] = await Promise.all([
        base44.entities.Recitation.list(),
        audioCache.getAllCached()
      ]);
      
      setRecitations(dbRecitations);
      setCachedItems(cached);
      
      const size = await audioCache.getCacheSize();
      setCacheSize(size);
    } catch (err) {
      console.error('Failed to load data:', err);
      toast.error('فشل في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const downloadAudio = async (recitation) => {
    const key = `${recitation.reciter_id}-${recitation.surah_number}`;
    setDownloading(prev => ({ ...prev, [key]: { progress: 0 } }));
    
    try {
      await audioCache.cacheAudio(
        recitation.reciter_id,
        recitation.surah_number,
        recitation.audio_url
      );
      
      toast.success('تم التحميل بنجاح');
      await loadData();
    } catch (err) {
      console.error('Failed to download audio:', err);
      toast.error('فشل في تحميل الصوت');
    } finally {
      setDownloading(prev => {
        const newState = { ...prev };
        delete newState[key];
        return newState;
      });
    }
  };

  const deleteAudio = async (audioUrl) => {
    try {
      await audioCache.deleteCached(audioUrl);
      toast.success('تم حذف الصوت');
      await loadData();
    } catch (err) {
      console.error('Failed to delete audio:', err);
      toast.error('فشل في حذف الصوت');
    }
  };

  const clearAllCache = async () => {
    if (!confirm('هل أنت متأكد من حذف جميع الصوتيات المحملة؟')) return;
    
    try {
      await audioCache.clearAll();
      toast.success('تم حذف جميع الصوتيات');
      await loadData();
    } catch (err) {
      console.error('Failed to clear cache:', err);
      toast.error('فشل في حذف الصوتيات');
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const isCached = (audioUrl) => {
    return cachedItems.some(item => item.url === audioUrl);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* إحصائيات */}
      <Card className="p-6 bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-200">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Download className="w-5 h-5 text-emerald-600" />
          التحميلات المحلية
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">عدد الصوتيات المحملة</p>
            <p className="text-2xl font-bold text-emerald-700">{cachedItems.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">حجم التخزين المستخدم</p>
            <p className="text-2xl font-bold text-emerald-700">{formatSize(cacheSize)}</p>
          </div>
        </div>
        {cachedItems.length > 0 && (
          <Button
            onClick={clearAllCache}
            variant="outline"
            className="w-full mt-4 text-red-600 border-red-300 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 ml-2" />
            حذف جميع التحميلات
          </Button>
        )}
      </Card>

      {/* قائمة التلاوات */}
      <div className="space-y-3">
        {recitations.map((recitation) => {
          const key = `${recitation.reciter_id}-${recitation.surah_number}`;
          const isDownloading = downloading[key];
          const cached = isCached(recitation.audio_url);

          return (
            <Card key={recitation.id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-bold text-gray-800">سورة رقم {recitation.surah_number}</p>
                  <p className="text-sm text-gray-600">
                    {recitation.bitrate} • {recitation.duration ? Math.floor(recitation.duration / 60) : 0} دقيقة
                  </p>
                </div>
                
                {cached ? (
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-emerald-600" />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => deleteAudio(recitation.audio_url)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ) : isDownloading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                    <span className="text-sm text-gray-600">جاري التحميل...</span>
                  </div>
                ) : (
                  <Button
                    size="icon"
                    onClick={() => downloadAudio(recitation)}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export { audioCache };