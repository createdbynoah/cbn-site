import crypto from 'crypto';
import { resume } from '@/data/resume';
import { getAllProjects, getAllJournalPosts } from '@/lib/content';
import { SOCIAL_LINKS, KICKER_MESSAGES, SITE_URL } from '@/lib/constants';

export async function distillSiteContent(): Promise<{
  summary: string;
  fingerprint: string;
}> {
  const projects = await getAllProjects();
  const journalPosts = await getAllJournalPosts();

  // ── Build plain-text summary (~600-750 tokens) ──────────────────
  const sections: string[] = [];

  // Person
  sections.push(`=== PERSON ===
Name: Noah Rodgers
Title: Product Engineer
Site: ${SITE_URL.replace('https://', '')}
Framework: Next.js 15`);

  // Experience
  const expLines = resume.experience.map((e) => {
    const period = e.dateEnd ? `${e.dateStart} - ${e.dateEnd}` : `${e.dateStart} - Present`;
    const highlights = e.highlights.map((h) => `  * ${h}`).join('\n');
    return `- ${e.company} | ${e.role} | ${e.location} | ${period}\n${highlights}`;
  });
  sections.push(`=== EXPERIENCE ===\n${expLines.join('\n')}`);

  // Skills
  const skillLines = resume.skills.map(
    (s) => `- ${s.category}: ${s.items.join(', ')}`,
  );
  sections.push(`=== SKILLS ===\n${skillLines.join('\n')}`);

  // Education
  const eduLines = resume.education.map((e) => {
    const period = e.dateEnd ? `${e.dateStart} - ${e.dateEnd}` : `${e.dateStart} - Present`;
    return `- ${e.institution} | ${e.degree} | ${e.field} | ${period}`;
  });
  sections.push(`=== EDUCATION ===\n${eduLines.join('\n')}`);

  // Projects
  const projLines = projects.map((p) => {
    const flags: string[] = [];
    if (p.frontmatter.status === 'active') flags.push('active');
    if (p.frontmatter.currentFocus) flags.push('CURRENT FOCUS');
    const flagStr = flags.length > 0 ? ` [${flags.join(', ')}]` : '';
    const tech =
      p.frontmatter.techStack.length > 0
        ? `\n  Tech: ${p.frontmatter.techStack.join(', ')}`
        : '';
    return `- ${p.frontmatter.name}${flagStr} — ${p.frontmatter.shortDescription}${tech}`;
  });
  sections.push(`=== PROJECTS ===\n${projLines.join('\n')}`);

  // Journal posts (titles only to save tokens)
  if (journalPosts.length > 0) {
    const postLines = journalPosts
      .slice(0, 5)
      .map((p) => `- ${p.frontmatter.title}`);
    sections.push(`=== JOURNAL ===\n${postLines.join('\n')}`);
  }

  // Social links
  const socialLines = SOCIAL_LINKS.map(
    (l) => `- ${l.name}: ${l.handle}`,
  );
  sections.push(`=== SOCIAL LINKS ===\n${socialLines.join('\n')}`);

  // Kicker messages
  sections.push(`=== TAGLINES ===\n${KICKER_MESSAGES.map((m) => `- ${m}`).join('\n')}`);

  const summary = sections.join('\n\n');

  // ── Deterministic fingerprint ──────────────────────────────────
  const rawData = JSON.stringify({
    resume,
    projects: projects.map((p) => ({ slug: p.slug, frontmatter: p.frontmatter })),
    journalPosts: journalPosts.map((p) => ({ slug: p.slug, title: p.frontmatter.title })),
    socialLinks: SOCIAL_LINKS,
    kickerMessages: KICKER_MESSAGES,
  });
  const fingerprint = crypto.createHash('sha256').update(rawData).digest('hex');

  return { summary, fingerprint };
}
