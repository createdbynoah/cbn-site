import type { Metadata } from 'next';
import { getAllProjects } from '@/lib/content';
import FeaturedProject from '@/components/FeaturedProject';
import ProjectCard from '@/components/ProjectCard';
import SectionHeading from '@/components/SectionHeading';
import ScrollReveal from '@/components/ScrollReveal';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Full-stack TypeScript projects by Noah Rodgers — apps, tools, and experiments.',
};

export default async function ProjectsPage() {
  const projects = await getAllProjects();
  const currentFocusProject = projects.find((p) => p.frontmatter.currentFocus);
  const otherProjects = projects.filter((p) => !p.frontmatter.currentFocus);

  return (
    <main className="fade fade-2">
      <div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', marginBottom: '12px' }}>Projects</h1>
        <p className="sub">
          Things I&apos;ve built, shipped, and am currently working on.
        </p>
      </div>

      {currentFocusProject && (
        <FeaturedProject
          name={currentFocusProject.frontmatter.name}
          shortDescription={currentFocusProject.frontmatter.shortDescription}
          description={currentFocusProject.frontmatter.description}
          url={currentFocusProject.frontmatter.url}
          techStack={currentFocusProject.frontmatter.techStack}
          dateRange={formatDateRange(currentFocusProject.frontmatter.dateStart, currentFocusProject.frontmatter.dateEnd)}
          showDescription
          showTechStack
        />
      )}

      <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <SectionHeading>All Projects</SectionHeading>
        <ScrollReveal style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {otherProjects.map((project) => (
            <ProjectCard
              key={project.slug}
              name={project.frontmatter.name}
              shortDescription={project.frontmatter.shortDescription}
              description={project.frontmatter.description}
              url={project.frontmatter.url}
              techStack={project.frontmatter.techStack}
              status={project.frontmatter.status}
              dateRange={formatDateRange(project.frontmatter.dateStart, project.frontmatter.dateEnd)}
              showTechStack
              showDescription
            />
          ))}
        </ScrollReveal>
      </section>
    </main>
  );
}

function formatDateRange(start: Date, end?: Date): string {
  const fmt = (d: Date) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  return `${fmt(start)} – ${end ? fmt(end) : 'Present'}`;
}
