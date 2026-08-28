import { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, Mic, MicOff, Volume2, VolumeX, Loader2, Bot, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import MessageBubble from '../components/assistant/MessageBubble';

export default function AssistantPage() {
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const initConversation = async () => {
      try {
        const conversation = await base44.agents.createConversation({
          agent_name: 'quran_assistant',
          metadata: { name: 'محادثة قرآنية', description: 'محادثة مع المساعد القرآني' }
        });
        setConversationId(conversation.id);
        setMessages(conversation.messages || []);
      } catch (error) {
        toast.error('حدث خطأ في إنشاء المحادثة');
      }
    };
    initConversation();
  }, []);

  useEffect(() => {
    if (!conversationId) return;

    const unsubscribe = base44.agents.subscribeToConversation(conversationId, (data) => {
      const newMessages = data.messages;
      
      if (autoSpeak && newMessages.length > messages.length) {
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage.role === 'assistant' && lastMessage.content) {
          speakText(lastMessage.content);
        }
      }
      
      setMessages(newMessages);
      setIsSending(false);
    });

    return () => unsubscribe();
  }, [conversationId, messages.length, autoSpeak]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !conversationId || isSending) return;

    setIsSending(true);
    const messageText = inputMessage;
    setInputMessage('');

    try {
      const conversation = await base44.agents.getConversation(conversationId);
      await base44.agents.addMessage(conversation, {
        role: 'user',
        content: messageText
      });
    } catch (error) {
      toast.error('فشل إرسال الرسالة');
      setIsSending(false);
    }
  };

  const speakText = (text) => {
    if (!('speechSynthesis' in window)) return;

    try {
      speechSynthesis.cancel();
      const cleanText = text.replace(/[#*_~`]/g, '').trim();
      if (!cleanText) return;
      
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      setTimeout(() => speechSynthesis.speak(utterance), 100);
    } catch (error) {
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      toast.success('تم إيقاف القراءة');
    }
  };

  const startVoiceRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('⚠️ المتصفح لا يدعم التعرف على الصوت. استخدم Chrome أو Edge');
      return;
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'ar-SA';
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsListening(true);
        toast.success('🎤 ابدأ بالتحدث الآن...');
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        toast.success('✅ تم التعرف على الصوت');
      };

      recognition.onerror = (event) => {
        if (event.error === 'not-allowed') {
          toast.error('🔒 يرجى السماح بالوصول للميكروفون');
        } else {
          toast.error('❌ خطأ في التعرف على الصوت');
        }
        setIsListening(false);
      };

      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch (error) {
      toast.error('فشل تشغيل التعرف على الصوت');
      setIsListening(false);
    }
  };

  const suggestedQuestions = [
    'ما تفسير آية الكرسي؟',
    'أخبرني عن سورة البقرة',
    'ما فضائل قراءة القرآن؟',
    'كيف أحفظ القرآن بسهولة؟'
  ];

  return (
    <div className="min-h-screen relative pb-24" dir="rtl">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/90 via-purple-950/95 to-slate-950/98" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <Bot className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">المساعد القرآني الذكي</h1>
          <p className="text-xl text-indigo-200 font-arabic">﴿ فَاسْأَلُوا أَهْلَ الذِّكْرِ إِن كُنتُمْ لَا تَعْلَمُونَ ﴾</p>
          <p className="text-slate-300 mt-2">اسأل بصوتك أو اكتب سؤالك - والمساعد سيقرأ لك الإجابة 🎙️</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex gap-3 mb-6">
            <Button
              variant="outline"
              size="lg"
              className={`flex-1 border-indigo-500/50 hover:bg-indigo-500/20 ${
                isListening ? 'bg-red-500/20 border-red-400 text-red-300 animate-pulse' : 'text-indigo-200'
              }`}
              onClick={startVoiceRecognition}
              disabled={isListening || isSending}
            >
              {isListening ? <MicOff className="w-6 h-6 ml-2 animate-pulse" /> : <Mic className="w-6 h-6 ml-2" />}
              {isListening ? 'جاري الاستماع...' : 'اضغط للتحدث'}
            </Button>
            
            {isSpeaking && (
              <Button
                variant="outline"
                size="lg"
                className="flex-1 bg-amber-500/20 border-amber-400 text-amber-300"
                onClick={stopSpeaking}
              >
                <VolumeX className="w-6 h-6 ml-2" />
                إيقاف القراءة
              </Button>
            )}
            
            <Button
              variant="outline"
              size="icon"
              className={`${autoSpeak ? 'bg-purple-500/30 border-purple-400 text-purple-200' : 'border-slate-600 text-slate-400'}`}
              onClick={() => setAutoSpeak(!autoSpeak)}
            >
              <Volume2 className="w-6 h-6" />
            </Button>
          </div>
        </motion.div>

        <Card className="bg-slate-900/60 backdrop-blur-xl shadow-2xl border-indigo-500/30 h-[600px] flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <Sparkles className="w-20 h-20 text-indigo-400 mb-6" />
                <h3 className="text-2xl font-bold text-indigo-200 mb-3">مرحباً بك في المساعد القرآني!</h3>
                <p className="text-slate-400 text-lg mb-8">ابدأ بطرح سؤالك أو اختر سؤالاً مقترحاً</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                  {suggestedQuestions.map((question, idx) => (
                    <motion.button
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + idx * 0.05 }}
                      onClick={() => setInputMessage(question)}
                      className="p-5 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-xl text-right text-indigo-200 transition-all border border-indigo-500/30 hover:border-indigo-400/50 hover:shadow-xl"
                    >
                      {question}
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((message, idx) => (
                  <MessageBubble key={idx} message={message} />
                ))}
                {isSending && (
                  <div className="flex gap-3 justify-start">
                    <div className="h-8 w-8 rounded-lg bg-indigo-600/20 flex items-center justify-center">
                      <Bot className="h-5 w-5 text-indigo-400" />
                    </div>
                    <Card className="bg-slate-800/60 border-indigo-500/30 px-6 py-4">
                      <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                    </Card>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          <div className="border-t border-indigo-500/30 p-4 bg-slate-800/60">
            <div className="flex gap-3">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="اكتب سؤالك أو استخدم الميكروفون..."
                className="flex-1 h-14 text-lg border-indigo-500/30 bg-slate-900/60 text-white placeholder:text-slate-500"
                disabled={isSending}
              />
              
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isSending}
                size="lg"
                className="h-14 px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg"
              >
                <Send className="w-6 h-6" />
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-3 text-center">
              💡 استخدم الميكروفون للتحدث أو اكتب سؤالك • القراءة الصوتية التلقائية مفعّلة
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}