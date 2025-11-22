import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, Mic, MicOff, MessageSquare, Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import MessageBubble from '../components/assistant/MessageBubble';

export default function AssistantPage() {
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const queryClient = useQueryClient();

  // إنشاء محادثة جديدة عند تحميل الصفحة
  useEffect(() => {
    const initConversation = async () => {
      try {
        const conversation = await base44.agents.createConversation({
          agent_name: 'quran_assistant',
          metadata: {
            name: 'محادثة قرآنية',
            description: 'محادثة مع المساعد القرآني'
          }
        });
        setConversationId(conversation.id);
        setMessages(conversation.messages || []);
      } catch (error) {
        toast.error('حدث خطأ في إنشاء المحادثة');
      }
    };
    initConversation();
  }, []);

  // الاشتراك في تحديثات المحادثة
  useEffect(() => {
    if (!conversationId) return;

    const unsubscribe = base44.agents.subscribeToConversation(conversationId, (data) => {
      setMessages(data.messages);
      setIsSending(false);
    });

    return () => unsubscribe();
  }, [conversationId]);

  // التمرير التلقائي للأسفل
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // ميزة التعرف على الصوت
  const startVoiceRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('المتصفح لا يدعم التعرف على الصوت');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'ar-SA';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      toast.info('🎤 جاري الاستماع...');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      toast.error('حدث خطأ في التعرف على الصوت');
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const suggestedQuestions = [
    'ما تفسير آية الكرسي؟',
    'أخبرني عن سورة البقرة',
    'ما هي فضائل قراءة القرآن؟',
    'كيف أحفظ القرآن بسهولة؟'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 text-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                <Sparkles className="w-12 h-12 text-amber-300" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2">المساعد القرآني الذكي</h1>
            <p className="text-emerald-100">اسأل أي سؤال عن القرآن الكريم وسأجيبك بإذن الله</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Chat Container */}
        <Card className="bg-white shadow-xl border-2 border-emerald-100 h-[600px] flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <MessageSquare className="w-16 h-16 text-emerald-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">مرحباً بك!</h3>
                <p className="text-gray-600 mb-6">ابدأ بطرح سؤالك أو اختر أحد الأسئلة المقترحة</p>
                
                {/* Suggested Questions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                  {suggestedQuestions.map((question, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInputMessage(question)}
                      className="p-4 bg-emerald-50 hover:bg-emerald-100 rounded-lg text-right text-sm text-gray-700 transition-colors border border-emerald-200 hover:border-emerald-300"
                    >
                      {question}
                    </button>
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
                    <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center mt-0.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2.5">
                      <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t-2 border-emerald-100 p-4 bg-gray-50">
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="icon"
                className={`flex-shrink-0 ${isListening ? 'bg-red-50 border-red-300 text-red-600' : 'hover:bg-emerald-50 hover:border-emerald-300'}`}
                onClick={startVoiceRecognition}
                disabled={isListening || isSending}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </Button>
              
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="اكتب سؤالك هنا..."
                className="flex-1 h-12 text-lg border-2 border-emerald-200 focus:border-emerald-400"
                disabled={isSending}
              />
              
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isSending}
                className="flex-shrink-0 h-12 px-6 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              اضغط على أيقونة المايكروفون للتحدث أو اكتب سؤالك
            </p>
          </div>
        </Card>

        {/* WhatsApp Connection */}
        <div className="mt-6 text-center">
          <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
            <h3 className="font-bold text-gray-800 mb-2">💬 استخدم المساعد عبر واتساب</h3>
            <p className="text-sm text-gray-600 mb-4">تحدث مع المساعد القرآني في أي وقت عبر واتساب</p>
            <a href={base44.agents.getWhatsAppConnectURL('quran_assistant')} target="_blank" rel="noopener noreferrer">
              <Button className="bg-green-600 hover:bg-green-700">
                اتصل عبر واتساب
              </Button>
            </a>
          </Card>
        </div>
      </div>
    </div>
  );
}