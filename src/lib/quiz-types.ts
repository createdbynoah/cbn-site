export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  source: string;
  sourceUrl: string;
}

export interface QuizPermutation {
  id: number;
  questions: QuizQuestion[];
}

export interface QuizData {
  permutations: QuizPermutation[];
}
