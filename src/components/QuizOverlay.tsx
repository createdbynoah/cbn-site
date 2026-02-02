'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { QuizData, QuizPermutation } from '@/lib/quiz-types';
import '@/styles/quiz.css';

type Phase = 'intro' | 'question' | 'results';

interface QuizState {
  phase: Phase;
  permutation: QuizPermutation | null;
  currentQuestionIndex: number;
  selectedOption: number | null;
  answerRevealed: boolean;
  answers: (number | null)[];
  score: number;
}

const SCORE_MESSAGES: Record<number, { headline: string; body: string }> = {
  0: {
    headline: 'Zero for five.',
    body: 'This is actually impressive in its own way. You managed to avoid every correct answer. Statistically, that takes talent.',
  },
  1: {
    headline: 'Oof.',
    body: 'Did you just guess on all of them? The site will still be here when you come back.',
  },
  2: {
    headline: 'Room for improvement.',
    body: "I'd suggest checking out the resume page. And the projects. Actually, just read everything.",
  },
  3: {
    headline: 'Decent showing.',
    body: 'You got the gist. Maybe browse around a bit more before the next attempt?',
  },
  4: {
    headline: 'Not bad at all.',
    body: "You clearly spent some time here. That means a lot — or you're just really good at guessing.",
  },
  5: {
    headline: 'Flawless.',
    body: 'You either built this site or you have a very concerning attention to detail.',
  },
};

function pickRandomPermutation(quizData: QuizData): QuizPermutation {
  const idx = Math.floor(Math.random() * quizData.permutations.length);
  return quizData.permutations[idx];
}

export default function QuizOverlay({ quizData }: { quizData: QuizData }) {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);
  const startButtonRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const announceRef = useRef<HTMLDivElement>(null);

  const [state, setState] = useState<QuizState>({
    phase: 'intro',
    permutation: null,
    currentQuestionIndex: 0,
    selectedOption: null,
    answerRevealed: false,
    answers: [],
    score: 0,
  });

  // Pick permutation on mount (client-side randomness)
  useEffect(() => {
    setState((s) => ({
      ...s,
      permutation: pickRandomPermutation(quizData),
    }));
  }, [quizData]);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Focus management
  useEffect(() => {
    if (state.phase === 'intro') {
      startButtonRef.current?.focus();
    } else if (state.phase === 'question' && !state.answerRevealed) {
      optionRefs.current[0]?.focus();
    } else if (state.phase === 'results') {
      headlineRef.current?.focus();
    }
  }, [state.phase, state.currentQuestionIndex, state.answerRevealed]);

  const currentQuestion =
    state.permutation?.questions[state.currentQuestionIndex] ?? null;

  const startQuiz = useCallback(() => {
    setState((s) => ({ ...s, phase: 'question' }));
  }, []);

  const selectOption = useCallback(
    (optionIndex: number) => {
      if (state.answerRevealed || !currentQuestion) return;

      const isCorrect = optionIndex === currentQuestion.correctIndex;

      setState((s) => ({
        ...s,
        selectedOption: optionIndex,
        answerRevealed: true,
        answers: [...s.answers, optionIndex],
        score: isCorrect ? s.score + 1 : s.score,
      }));

      // Announce result for screen readers
      if (announceRef.current) {
        announceRef.current.textContent = isCorrect
          ? 'Correct!'
          : `Wrong. The correct answer was: ${currentQuestion.options[currentQuestion.correctIndex]}`;
      }

      // Auto-advance
      const delay = isCorrect ? 1200 : 2200;
      setTimeout(() => {
        setState((s) => {
          const nextIndex = s.currentQuestionIndex + 1;
          const totalQuestions = s.permutation?.questions.length ?? 5;
          if (nextIndex >= totalQuestions) {
            return {
              ...s,
              phase: 'results',
              selectedOption: null,
              answerRevealed: false,
            };
          }
          return {
            ...s,
            currentQuestionIndex: nextIndex,
            selectedOption: null,
            answerRevealed: false,
          };
        });
      }, delay);
    },
    [state.answerRevealed, currentQuestion],
  );

  const tryAgain = useCallback(() => {
    setState({
      phase: 'question',
      permutation: pickRandomPermutation(quizData),
      currentQuestionIndex: 0,
      selectedOption: null,
      answerRevealed: false,
      answers: [],
      score: 0,
    });
  }, [quizData]);

  const backToSite = useCallback(() => {
    router.push('/');
  }, [router]);

  // Keyboard support
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (state.phase === 'intro' && e.key === 'Enter') {
        e.preventDefault();
        startQuiz();
        return;
      }

      if (state.phase === 'question' && !state.answerRevealed) {
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= 4) {
          e.preventDefault();
          selectOption(num - 1);
          return;
        }
      }

      if (state.phase === 'results') {
        if (e.key === 'Enter') {
          e.preventDefault();
          backToSite();
          return;
        }
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        backToSite();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.phase, state.answerRevealed, startQuiz, selectOption, backToSite]);

  const scoreMessage = SCORE_MESSAGES[state.score] ?? SCORE_MESSAGES[0];

  return (
    <div
      ref={overlayRef}
      className="quiz-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Quiz"
    >
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        ref={announceRef}
      />

      {/* ── Intro ── */}
      {state.phase === 'intro' && (
        <div className="quiz-intro quiz-fade-in">
          <h1 className="quiz-title">How well do you know Noah?</h1>
          <p className="quiz-subtitle">
            Five questions. Based on what you&apos;ll find around this site.
          </p>
          <button
            ref={startButtonRef}
            className="quiz-btn quiz-btn-primary"
            onClick={startQuiz}
          >
            Start Quiz
          </button>
        </div>
      )}

      {/* ── Question ── */}
      {state.phase === 'question' && currentQuestion && state.permutation && (
        <div
          className="quiz-question-screen quiz-fade-in"
          key={state.currentQuestionIndex}
        >
          {/* Progress */}
          <div className="quiz-progress">
            {state.permutation.questions.map((_, i) => (
              <div
                key={i}
                className={`quiz-progress-dot${
                  i === state.currentQuestionIndex ? ' active' : ''
                }${i < state.currentQuestionIndex ? ' completed' : ''}`}
              />
            ))}
          </div>

          <span className="quiz-question-number">
            Question {state.currentQuestionIndex + 1} of{' '}
            {state.permutation.questions.length}
          </span>

          <h2 className="quiz-question-text question-slide-in">
            {currentQuestion.question}
          </h2>

          <div className="quiz-options">
            {currentQuestion.options.map((option, i) => {
              let className = 'quiz-option';
              if (state.answerRevealed) {
                if (i === currentQuestion.correctIndex) {
                  className += ' correct';
                } else if (
                  i === state.selectedOption &&
                  i !== currentQuestion.correctIndex
                ) {
                  className += ' wrong';
                } else {
                  className += ' dimmed';
                }
              }

              return (
                <button
                  key={i}
                  ref={(el) => {
                    optionRefs.current[i] = el;
                  }}
                  className={className}
                  onClick={() => selectOption(i)}
                  disabled={state.answerRevealed}
                  aria-label={`Option ${i + 1}: ${option}`}
                >
                  <span className="quiz-option-badge">{i + 1}</span>
                  <span className="quiz-option-text">{option}</span>
                  {state.answerRevealed &&
                    i === currentQuestion.correctIndex && (
                      <span className="quiz-option-label">Correct</span>
                    )}
                  {state.answerRevealed &&
                    i === state.selectedOption &&
                    i !== currentQuestion.correctIndex && (
                      <span className="quiz-option-label">Wrong</span>
                    )}
                </button>
              );
            })}
          </div>

          {state.answerRevealed &&
            state.selectedOption !== currentQuestion.correctIndex && (
              <p className="quiz-source source-reveal">
                {currentQuestion.source}
              </p>
            )}
        </div>
      )}

      {/* ── Results ── */}
      {state.phase === 'results' && (
        <div className="quiz-results results-fade-in">
          <div className="quiz-score-display">
            <span className="quiz-score-number">
              {state.score}/{state.permutation?.questions.length ?? 5}
            </span>
            <span className="quiz-score-label">Score</span>
          </div>

          <h2 className="quiz-results-headline" ref={headlineRef} tabIndex={-1}>
            {scoreMessage.headline}
          </h2>
          <p className="quiz-results-body">{scoreMessage.body}</p>

          <div className="quiz-results-actions">
            <button className="quiz-btn quiz-btn-primary" onClick={backToSite}>
              Back to Site
            </button>
            <button className="quiz-btn quiz-btn-secondary" onClick={tryAgain}>
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
