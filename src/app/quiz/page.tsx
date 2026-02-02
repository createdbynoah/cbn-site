import type { Metadata } from 'next';
import { generateQuizData } from '@/lib/quiz-generator';
import QuizOverlay from '@/components/QuizOverlay';

export const metadata: Metadata = {
  title: 'Quiz',
  description:
    'How well do you know Noah Rodgers? Take this quick 5-question quiz to find out.',
};

export default async function QuizPage() {
  const quizData = await generateQuizData();

  return <QuizOverlay quizData={quizData} />;
}
