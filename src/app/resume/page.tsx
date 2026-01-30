import type { Metadata } from 'next';
import { resume } from '@/data/resume';
import SectionHeading from '@/components/SectionHeading';
import ScrollReveal from '@/components/ScrollReveal';
import ResumeEntry from '@/components/ResumeEntry';
import SkillGroup from '@/components/SkillGroup';

export const metadata: Metadata = {
  title: 'Resume',
  description:
    'Resume of Noah Rodgers — product engineer specializing in full-stack TypeScript applications.',
};

export default function ResumePage() {
  return (
    <main className="fade fade-2">
      <div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', marginBottom: '12px' }}>Resume</h1>
        <p className="sub">
          Product engineer specializing in full-stack TypeScript applications.
          Formerly photography &amp; videography, now building digital experiences.
        </p>
      </div>

      <ScrollReveal style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <SectionHeading className="scroll-reveal-item">Experience</SectionHeading>
        {resume.experience.map((exp) => (
          <ResumeEntry
            key={exp.company + exp.role}
            title={exp.role}
            subtitle={exp.company}
            location={exp.location}
            dateRange={`${exp.dateStart} – ${exp.dateEnd || 'Present'}`}
            highlights={exp.highlights}
            url={exp.url}
          />
        ))}

        <SectionHeading className="scroll-reveal-item">Skills</SectionHeading>
        <div
          className="card scroll-reveal-item"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            padding: '20px',
          }}
        >
          {resume.skills.map((group) => (
            <SkillGroup
              key={group.category}
              category={group.category}
              items={group.items}
            />
          ))}
        </div>

        <SectionHeading className="scroll-reveal-item">Education</SectionHeading>
        {resume.education.map((edu) => (
          <ResumeEntry
            key={edu.institution + edu.degree}
            title={edu.degree}
            subtitle={`${edu.institution} · ${edu.field}`}
            dateRange={`${edu.dateStart}${edu.dateEnd ? ` – ${edu.dateEnd}` : ''}`}
            highlights={edu.highlights || []}
          />
        ))}
      </ScrollReveal>
    </main>
  );
}
