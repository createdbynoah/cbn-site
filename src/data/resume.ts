export interface ResumeExperience {
  company: string;
  role: string;
  location: string;
  dateStart: string;
  dateEnd?: string;
  highlights: string[];
  url?: string;
}

export interface ResumeEducation {
  institution: string;
  degree: string;
  field: string;
  dateStart: string;
  dateEnd?: string;
  highlights?: string[];
}

export interface ResumeSkillGroup {
  category: string;
  items: string[];
}

export interface ResumeData {
  experience: ResumeExperience[];
  education: ResumeEducation[];
  skills: ResumeSkillGroup[];
  projects: string[];
}

export const resume: ResumeData = {
  experience: [
    {
      company: 'Binit',
      role: 'Lead Product Engineer',
      location: 'Remote',
      dateStart: 'Jul 2024',
      dateEnd: 'Dec 2025',
      highlights: [
        'Architected and shipped an AI-native mobile app for waste tracking using React Native and Expo',
        'Led cross-functional development from concept through App Store submission',
        'Integrated computer vision models for automated waste classification',
        'Managed global development team, coordinating across multiple time zones',
      ],
      url: 'https://www.getbinit.com/',
    },
  ],
  education: [
    {
      institution: 'Self-directed',
      degree: 'Full-Stack Engineering',
      field: 'Software Development',
      dateStart: '2023',
      highlights: [
        'Full-stack TypeScript (React, Next.js, Node.js)',
        'AI/ML integration and prompt engineering',
        'Mobile development with React Native',
      ],
    },
  ],
  skills: [
    {
      category: 'Languages',
      items: ['TypeScript', 'JavaScript', 'Python', 'SQL', 'HTML', 'CSS'],
    },
    {
      category: 'Frameworks',
      items: ['Next.js', 'React', 'React Native', 'Expo', 'Node.js', 'Express'],
    },
    {
      category: 'Infrastructure',
      items: ['PostgreSQL', 'Prisma', 'Vercel', 'Cloudflare', 'Docker', 'Git'],
    },
    {
      category: 'Specialties',
      items: [
        'AI Integration',
        'Product Engineering',
        'Mobile Development',
        'Full-Stack Architecture',
        'UI/UX Design',
      ],
    },
  ],
  projects: ['expense-planner', 'binit', 'fitness-wiki'],
};
