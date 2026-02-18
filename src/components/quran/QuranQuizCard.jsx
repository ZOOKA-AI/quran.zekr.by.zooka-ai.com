import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Brain, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const QUIZ_QUESTIONS = [
  {
    question: 'كم عدد سور القرآن الكريم؟',
    options: ['110', '114', '120', '100'],
    correct: 1,
    surah: null
  },
  {
    question: 'ما هي أطول سورة في القرآن؟',
    options: ['البقرة', 'آل عمران', 'النساء', 'الأعراف'],
    correct: 0,
    surah: 2
  },
  {
    question: 'كم عدد أجزاء القرآن الكريم؟',
    options: ['20', '25', '30', '40'],
    correct: 2,
    surah: null
  },
  {
    question: 'ما هي السورة التي تسمى "قلب القرآن"؟',
    options: ['البقرة', 'يس', 'الكهف', 'الملك'],
    correct: 1,
    surah: 36
  },
  {
    question: 'كم عدد آيات سورة الفاتحة؟',
    options: ['5', '7', '9', '11'],
    correct: 1,
    surah: 1
  }
];

export default function QuranQuizCard() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const question = QUIZ_QUESTIONS[currentQuestion];

  const handleAnswer = (index) => {
    if (answered) return;
    
    setSelectedAnswer(index);
    setAnswered(true);
    
    if (index === question.correct) {
      setScore(score + 1);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleNext = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setAnswered(false);
  };

  if (showResult) {
    const percentage = (score / QUIZ_QUESTIONS.length) * 100;
    return (
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800">
        <CardContent className="pt-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-center"
          >
            <Trophy className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-purple-800 dark:text-purple-200 mb-2">
              نتيجتك النهائية
            </h3>
            <div className="text-5xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              {score} / {QUIZ_QUESTIONS.length}
            </div>
            <div className="text-lg text-purple-700 dark:text-purple-300 mb-4">
              {percentage}%
            </div>
            <p className="text-purple-600 dark:text-purple-400 mb-6">
              {percentage >= 80 ? '🌟 ممتاز! بارك الله فيك' : 
               percentage >= 60 ? '👍 جيد جداً! واصل التعلم' : 
               '💪 استمر في التدبر والتعلم'}
            </p>
            <Button
              onClick={handleReset}
              className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800"
            >
              <RotateCcw className="w-4 h-4 ml-2" />
              إعادة الاختبار
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-purple-800 dark:text-purple-200">
            <Brain className="w-5 h-5" />
            <span>اختبر معلوماتك القرآنية</span>
          </div>
          <div className="text-sm font-normal text-purple-600 dark:text-purple-400">
            {currentQuestion + 1} / {QUIZ_QUESTIONS.length}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
          <p className="text-lg font-bold text-purple-900 dark:text-purple-100 mb-4 font-arabic">
            {question.question}
          </p>
          <div className="space-y-2">
            {question.options.map((option, index) => {
              const isCorrect = index === question.correct;
              const isSelected = index === selectedAnswer;
              const showCorrect = answered && isCorrect;
              const showWrong = answered && isSelected && !isCorrect;

              return (
                <Button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={answered}
                  variant="outline"
                  className={`w-full justify-start text-right h-auto py-3 text-base font-arabic transition-all ${
                    showCorrect ? 'bg-green-100 border-green-500 text-green-800 dark:bg-green-900 dark:border-green-600 dark:text-green-200' :
                    showWrong ? 'bg-red-100 border-red-500 text-red-800 dark:bg-red-900 dark:border-red-600 dark:text-red-200' :
                    'hover:bg-purple-50 dark:hover:bg-purple-900'
                  }`}
                >
                  <span className="flex-1">{option}</span>
                  {showCorrect && <CheckCircle2 className="w-5 h-5 mr-2" />}
                  {showWrong && <XCircle className="w-5 h-5 mr-2" />}
                </Button>
              );
            })}
          </div>
        </div>

        {answered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button
              onClick={handleNext}
              className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800"
            >
              {currentQuestion < QUIZ_QUESTIONS.length - 1 ? 'السؤال التالي' : 'عرض النتيجة'}
            </Button>
          </motion.div>
        )}

        <div className="flex items-center justify-between text-sm text-purple-600 dark:text-purple-400">
          <span>النقاط: {score}</span>
          <span>الأسئلة المتبقية: {QUIZ_QUESTIONS.length - currentQuestion - 1}</span>
        </div>
      </CardContent>
    </Card>
  );
}