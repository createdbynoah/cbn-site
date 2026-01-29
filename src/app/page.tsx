import Typewriter from '@/components/Typewriter';
import FeaturedProject from '@/components/FeaturedProject';
import ConnectLink from '@/components/ConnectLink';
import ScrollReveal from '@/components/ScrollReveal';
import SectionHeading from '@/components/SectionHeading';
import HomeClient from '@/components/HomeClient';
import { SOCIAL_LINKS } from '@/lib/constants';
import { getAllProjects } from '@/lib/content';

export default async function HomePage() {
  const projects = await getAllProjects();
  const currentFocusProject = projects.find((p) => p.frontmatter.currentFocus);
  const otherProjects = projects.filter((p) => !p.frontmatter.currentFocus);

  return (
    <main className="fade fade-2">
      <HomeClient />
      <Typewriter />

      <div>
        <h1 style={{ marginBottom: '12px' }}>
          I build rapid, scalable
          <br />
          software for the AI age.
        </h1>

        <p className="sub">
          I bridge the gap between creative vision and deployed code. Whether{' '}
          <em>managing</em> global dev teams or <em>shipping</em> AI-native mobile
          apps solo, I focus on velocity, aesthetics, and the bleeding edge of
          what&apos;s possible
        </p>
      </div>

      {currentFocusProject && (
        <FeaturedProject
          name={currentFocusProject.frontmatter.name}
          shortDescription={currentFocusProject.frontmatter.shortDescription}
          url={currentFocusProject.frontmatter.url}
          dateRange={formatProjectDateRange(currentFocusProject.frontmatter)}
        />
      )}

      <section className="launchpad fade fade-4" id="links" aria-label="Launchpad links">
        <div className="projects-section">
          <SectionHeading>Projects</SectionHeading>
          <ScrollReveal className="projects-grid">
            {otherProjects.map((project) => (
              <a
                key={project.slug}
                className="card scroll-reveal-item"
                href={project.frontmatter.url || '#'}
                {...(project.frontmatter.status === 'upcoming'
                  ? { 'aria-disabled': 'true' }
                  : project.frontmatter.url
                    ? { target: '_blank', rel: 'noreferrer' }
                    : {})}
              >
                <div className="info">
                  <div className="name">{project.frontmatter.name}</div>
                  <div className="hint">
                    {project.frontmatter.status === 'upcoming'
                      ? '[coming soon]'
                      : project.frontmatter.shortDescription}
                  </div>
                  <div className="dates">
                    {formatProjectDateRange(project.frontmatter)}
                  </div>
                </div>
                <div className="go">
                  {project.frontmatter.status === 'upcoming' ? 'not yet →' : 'view →'}
                </div>
              </a>
            ))}
          </ScrollReveal>
        </div>

        <div className="connect-section">
          <SectionHeading>Connect</SectionHeading>
          <ScrollReveal className="connect-grid">
            {SOCIAL_LINKS.map((link) => (
              <ConnectLink key={link.name} {...link} />
            ))}
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}

function formatProjectDateRange(fm: { dateStart: Date; dateEnd?: Date }): string {
  const fmt = (d: Date) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  return `${fmt(fm.dateStart)} – ${fm.dateEnd ? fmt(fm.dateEnd) : 'Present'}`;
}
