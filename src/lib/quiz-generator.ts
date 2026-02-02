import { resume } from '@/data/resume';
import { getAllProjects, getAllJournalPosts } from '@/lib/content';
import { KICKER_MESSAGES, SOCIAL_LINKS } from '@/lib/constants';
import type { QuizQuestion, QuizData } from './quiz-types';

// ── Seeded PRNG (deterministic shuffle) ──────────────────────────
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) & 0xffffffff;
  }
  return hash >>> 0;
}

function shuffle<T>(arr: T[], rand: () => number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// ── Question factories ───────────────────────────────────────────
// Each returns a QuizQuestion built from live content data

type Tier = 'easy' | 'medium' | 'hard';
interface TieredQuestion {
  tier: Tier;
  question: QuizQuestion;
}

function buildQuestionPool(
  projects: Awaited<ReturnType<typeof getAllProjects>>,
  _journalPosts: Awaited<ReturnType<typeof getAllJournalPosts>>,
): TieredQuestion[] {
  const pool: TieredQuestion[] = [];

  // Helper: find a project by slug
  const findProject = (slug: string) =>
    projects.find((p) => p.slug === slug);

  const binit = findProject('binit');
  const expensePlanner = findProject('expense-planner');

  // ── EASY ──────────────────────────────────────────
  pool.push({
    tier: 'easy',
    question: {
      id: 'easy-title',
      question: "What is Noah's professional title?",
      options: ['Product Engineer', 'Software Architect', 'Frontend Developer', 'UX Designer'],
      correctIndex: 0,
      source: 'From the Resume page',
      sourceUrl: '/resume',
    },
  });

  const projectNames = projects
    .filter((p) => p.frontmatter.status !== 'upcoming')
    .map((p) => p.frontmatter.name);
  if (projectNames.length > 0) {
    pool.push({
      tier: 'easy',
      question: {
        id: 'easy-project',
        question: "Which of these is one of Noah's projects?",
        options: [
          projectNames[0],
          'CloudSync',
          'TaskMaster',
          'DevBoard',
        ],
        correctIndex: 0,
        source: 'From the Projects page',
        sourceUrl: '/projects',
      },
    });
  }

  pool.push({
    tier: 'easy',
    question: {
      id: 'easy-framework',
      question: 'What framework is this portfolio built with?',
      options: ['Next.js', 'Gatsby', 'Remix', 'Astro'],
      correctIndex: 0,
      source: 'From the Resume page',
      sourceUrl: '/resume',
    },
  });

  pool.push({
    tier: 'easy',
    question: {
      id: 'easy-company',
      question: 'Which company did Noah work at as Lead Product Engineer?',
      options: [
        resume.experience[0]?.company ?? 'Binit',
        'Stripe',
        'Vercel',
        'Linear',
      ],
      correctIndex: 0,
      source: 'From the Resume page',
      sourceUrl: '/resume',
    },
  });

  pool.push({
    tier: 'easy',
    question: {
      id: 'easy-location',
      question: "What is Noah's work location?",
      options: [
        resume.experience[0]?.location ?? 'Remote',
        'San Francisco',
        'New York',
        'Austin',
      ],
      correctIndex: 0,
      source: 'From the Resume page',
      sourceUrl: '/resume',
    },
  });

  pool.push({
    tier: 'easy',
    question: {
      id: 'easy-education',
      question: 'How is Noah\'s education described?',
      options: ['Self-directed', 'Stanford University', 'MIT Bootcamp', 'Georgia Tech'],
      correctIndex: 0,
      source: 'From the Resume page',
      sourceUrl: '/resume',
    },
  });

  // ── MEDIUM ────────────────────────────────────────
  if (binit) {
    pool.push({
      tier: 'medium',
      question: {
        id: 'medium-binit-mobile',
        question: 'What technology does the Binit app use for mobile?',
        options: ['React Native', 'Flutter', 'Swift', 'Kotlin'],
        correctIndex: 0,
        source: 'From the Projects page',
        sourceUrl: '/projects',
      },
    });
  }

  pool.push({
    tier: 'medium',
    question: {
      id: 'medium-education-year',
      question: 'What year did Noah begin self-directed education?',
      options: [
        resume.education[0]?.dateStart ?? '2023',
        '2020',
        '2021',
        '2022',
      ],
      correctIndex: 0,
      source: 'From the Resume page',
      sourceUrl: '/resume',
    },
  });

  if (expensePlanner) {
    pool.push({
      tier: 'medium',
      question: {
        id: 'medium-expense-db',
        question: 'What database does Expense Planner use?',
        options: ['PostgreSQL', 'MongoDB', 'MySQL', 'SQLite'],
        correctIndex: 0,
        source: 'From the Projects page',
        sourceUrl: '/projects',
      },
    });

    pool.push({
      tier: 'medium',
      question: {
        id: 'medium-expense-orm',
        question: 'What ORM does Expense Planner use?',
        options: ['Prisma', 'Drizzle', 'TypeORM', 'Sequelize'],
        correctIndex: 0,
        source: 'From the Projects page',
        sourceUrl: '/projects',
      },
    });
  }

  pool.push({
    tier: 'medium',
    question: {
      id: 'medium-current-focus',
      question: "Which project is Noah's current focus?",
      options: [
        projects.find((p) => p.frontmatter.currentFocus)?.frontmatter.name ?? 'Expense Planner',
        'Binit',
        'Fitness Wiki',
        'Portfolio Site',
      ],
      correctIndex: 0,
      source: 'From the Projects page',
      sourceUrl: '/projects',
    },
  });

  pool.push({
    tier: 'medium',
    question: {
      id: 'medium-kicker',
      question: 'Which of these is a tagline from the homepage?',
      options: [
        KICKER_MESSAGES[0],
        'Move fast, break things',
        'Code is poetry',
        'Ship it yesterday',
      ],
      correctIndex: 0,
      source: 'From the Homepage',
      sourceUrl: '/',
    },
  });

  const languages = resume.skills.find((s) => s.category === 'Languages');
  if (languages) {
    pool.push({
      tier: 'medium',
      question: {
        id: 'medium-language',
        question: 'Which programming language does Noah list on his resume?',
        options: [
          'Python',
          'Rust',
          'Go',
          'C++',
        ],
        correctIndex: 0,
        source: 'From the Resume page',
        sourceUrl: '/resume',
      },
    });
  }

  // ── HARD ──────────────────────────────────────────
  const twitterLink = SOCIAL_LINKS.find((l) => l.name === 'Twitter / X');
  if (twitterLink) {
    pool.push({
      tier: 'hard',
      question: {
        id: 'hard-twitter',
        question: "What is Noah's Twitter/X handle?",
        options: [
          twitterLink.handle,
          '@noahrodgers',
          '@noahbuilds',
          '@noahdev',
        ],
        correctIndex: 0,
        source: 'From the Homepage',
        sourceUrl: '/',
      },
    });
  }

  const githubLink = SOCIAL_LINKS.find((l) => l.name === 'GitHub');
  if (githubLink) {
    pool.push({
      tier: 'hard',
      question: {
        id: 'hard-github',
        question: "What is Noah's GitHub username?",
        options: [
          githubLink.handle,
          '@noahrodgers',
          '@noahdev',
          '@nrodgers10',
        ],
        correctIndex: 0,
        source: 'From the Homepage',
        sourceUrl: '/',
      },
    });
  }

  const skillCategories = resume.skills.map((s) => s.category);
  pool.push({
    tier: 'hard',
    question: {
      id: 'hard-not-skill-category',
      question: 'Which of these is NOT one of Noah\'s resume skill categories?',
      options: ['DevOps', ...skillCategories.slice(0, 3)],
      correctIndex: 0,
      source: 'From the Resume page',
      sourceUrl: '/resume',
    },
  });

  pool.push({
    tier: 'hard',
    question: {
      id: 'hard-cv-project',
      question: 'Which project integrates computer vision?',
      options: [
        binit?.frontmatter.name ?? 'Binit',
        'Expense Planner',
        'Fitness Wiki',
        'Portfolio Site',
      ],
      correctIndex: 0,
      source: 'From the Resume page',
      sourceUrl: '/resume',
    },
  });

  const emailLink = SOCIAL_LINKS.find((l) => l.name === 'Email');
  if (emailLink) {
    pool.push({
      tier: 'hard',
      question: {
        id: 'hard-email',
        question: "What is Noah's professional email?",
        options: [
          emailLink.handle,
          'noah@createdbynoah.com',
          'hello@noahrodgers.com',
          'noah.rodgers@gmail.com',
        ],
        correctIndex: 0,
        source: 'From the Homepage',
        sourceUrl: '/',
      },
    });
  }

  pool.push({
    tier: 'hard',
    question: {
      id: 'hard-binit-role',
      question: "What was Noah's exact title at Binit?",
      options: [
        resume.experience[0]?.role ?? 'Lead Product Engineer',
        'Senior Software Engineer',
        'CTO',
        'Full-Stack Developer',
      ],
      correctIndex: 0,
      source: 'From the Resume page',
      sourceUrl: '/resume',
    },
  });

  pool.push({
    tier: 'hard',
    question: {
      id: 'hard-site-domain',
      question: "What is the domain of Noah's portfolio site?",
      options: [
        'createdbynoah.com',
        'noahrodgers.dev',
        'noahcancode.com',
        'noahrodgers.com',
      ],
      correctIndex: 0,
      source: 'From the Homepage',
      sourceUrl: '/',
    },
  });

  return pool;
}

// ── Permutation builder ──────────────────────────────────────────
// Permutation distribution:
// 0: 3 easy, 2 medium, 0 hard  (Welcoming)
// 1: 2 easy, 2 medium, 1 hard  (Balanced)
// 2: 1 easy, 2 medium, 2 hard  (Challenging)
// 3: 0 easy, 2 medium, 3 hard  (Expert)

const TIER_DISTRIBUTION: [number, number, number][] = [
  [3, 2, 0],
  [2, 2, 1],
  [1, 2, 2],
  [0, 2, 3],
];

export async function generateQuizData(): Promise<QuizData> {
  const projects = await getAllProjects();
  const journalPosts = await getAllJournalPosts();

  const pool = buildQuestionPool(projects, journalPosts);

  // Build content fingerprint for deterministic seeding
  const fingerprint = JSON.stringify({
    projects: projects.map((p) => p.slug + p.frontmatter.name),
    skills: resume.skills,
    social: SOCIAL_LINKS.map((l) => l.handle),
    kickers: KICKER_MESSAGES,
  });
  const seed = hashString(fingerprint);
  const rand = seededRandom(seed);

  const easy = shuffle(
    pool.filter((q) => q.tier === 'easy'),
    rand,
  );
  const medium = shuffle(
    pool.filter((q) => q.tier === 'medium'),
    rand,
  );
  const hard = shuffle(
    pool.filter((q) => q.tier === 'hard'),
    rand,
  );

  const permutations = TIER_DISTRIBUTION.map(([eCount, mCount, hCount], i) => {
    const selected = [
      ...easy.slice(0, eCount),
      ...medium.slice(0, mCount),
      ...hard.slice(0, hCount),
    ];

    // Shuffle the selected questions so tiers aren't grouped
    const questions = shuffle(selected, rand).map((q) => q.question);

    return { id: i, questions };
  });

  return { permutations };
}
