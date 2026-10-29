const profile = {
  name: 'Avery Johnson',
  title: 'Frontend Developer & Product Designer',
  summary:
    'Creative and detail-oriented frontend developer with 5+ years of experience building accessible, user-centered web experiences. I turn complex product goals into clear interfaces, performant React apps, and polished design systems that help teams ship faster and users stay engaged.',
  email: 'avery.johnson.dev@gmail.com',
  phone: '+1 (415) 555-0192',
  location: 'Seattle, WA',
  website: 'averyjohnson.dev',
  linkedin: 'linkedin.com/in/averyjohnson',
  github: 'github.com/averyjohnson',
};

const experience = [
  {
    title: 'Senior Frontend Developer',
    company: 'Northstar Studio',
    period: '2022 — Present',
    description:
      'Lead the redesign of the company marketing and customer dashboard, improving conversion by 38% and reducing bounce rate by 24%. Worked closely with product and UX to ship accessible interactions, reusable components, and modern analytics-driven features.',
    bullets: [
      'Built React + TypeScript dashboards used by 12k+ active customers.',
      'Introduced design system standards that reduced UI bugs across 3 product teams.',
      'Collaborated with backend engineers to ship fast, resilient API-driven workflows.',
    ],
  },
  {
    title: 'Frontend Developer',
    company: 'BrightPath Labs',
    period: '2019 — 2022',
    description:
      'Developed responsive web applications for SaaS and fintech clients, improving usability, scalability, and implementation speed across client projects.',
    bullets: [
      'Delivered 8+ production releases for B2B product launches.',
      'Optimized page performance and accessibility with Lighthouse-driven improvements.',
      'Built reusable UI patterns for marketing pages, dashboards, and onboarding flows.',
    ],
  },
  {
    title: 'Web Designer / Developer',
    company: 'Freelance',
    period: '2017 — 2019',
    description:
      'Created visual concepts and front-end implementations for personal brands, small businesses, and startups.',
    bullets: [
      'Designed user interfaces tailored to business goals and customer journeys.',
      'Built landing pages and conversion-focused experiences used in campaigns.',
      'Maintained effective communication with clients and stakeholders throughout delivery.',
    ],
  },
];

const projects = [
  {
    name: 'TaskFlow Pro',
    type: 'Productivity SaaS',
    summary:
      'Built a collaborative task management product with real-time updates, project analytics, and role-based permissions.',
    stack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
  },
  {
    name: 'Insight Board',
    type: 'Analytics Dashboard',
    summary:
      'Designed and developed a reporting dashboard used to track KPIs, campaigns, and operational trends across departments.',
    stack: ['React', 'Chart.js', 'REST APIs', 'Figma'],
  },
  {
    name: 'Portfolio Builder',
    type: 'Creative Tool',
    summary:
      'Created a portfolio-generation tool for freelancers, allowing easier brand management and streamlined client presentation.',
    stack: ['Next.js', 'Tailwind', 'Vercel', 'CMS'],
  },
];

const skills = {
  core: ['React', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Accessibility', 'UI Design'],
  tools: ['Figma', 'Git', 'REST APIs', 'Tailwind', 'Vite', 'Webpack', 'Storybook'],
  strengths: ['Responsive Design', 'Design Systems', 'Performance Optimization', 'UX Strategy', 'Team Collaboration'],
};

const education = [
  {
    degree: 'B.A. in Interactive Design',
    school: 'University of Washington',
    period: '2013 — 2017',
  },
];

const achievements = [
  'Built and maintained a reusable UI system across 3 product teams.',
  'Improved average page speed score from 72 to 92 on core product pages.',
  'Presented design-to-code workflow improvements to leadership and engineering stakeholders.',
];

function SectionTitle({ label }) {
  return <h2 className="section-title">{label}</h2>;
}

function App() {
  return (
    <div className="resume-shell">
      <main className="resume-paper">
        <header className="resume-header">
          <div>
            <p className="eyebrow">Open to Product & Frontend Roles</p>
            <h1>{profile.name}</h1>
            <p className="headline">{profile.title}</p>
          </div>

          <div className="header-meta">
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            <a href={`tel:${profile.phone.replace(/\s+/g, '')}`}>{profile.phone}</a>
            <span>{profile.location}</span>
            <a href={`https://${profile.website}`} target="_blank" rel="noreferrer">
              {profile.website}
            </a>
            <a href={`https://${profile.linkedin}`} target="_blank" rel="noreferrer">
              {profile.linkedin}
            </a>
            <button type="button" onClick={() => window.print()}>
              Download PDF
            </button>
          </div>
        </header>

        <section className="summary-block">
          <p>{profile.summary}</p>
        </section>

        <div className="content-grid">
          <div className="main-column">
            <section className="resume-section">
              <SectionTitle label="Experience" />

              {experience.map((job) => (
                <article key={`${job.company}-${job.title}`} className="experience-item">
                  <div className="role-head">
                    <div>
                      <h3>{job.title}</h3>
                      <p className="company-name">{job.company}</p>
                    </div>
                    <span>{job.period}</span>
                  </div>

                  <p className="job-description">{job.description}</p>

                  <ul>
                    {job.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </section>

            <section className="resume-section">
              <SectionTitle label="Projects" />

              <div className="projects-grid">
                {projects.map((project) => (
                  <article key={project.name} className="project-card">
                    <div className="project-topline">
                      <h3>{project.name}</h3>
                      <span>{project.type}</span>
                    </div>
                    <p>{project.summary}</p>
                    <div className="tag-row">
                      {project.stack.map((item) => (
                        <span key={item} className="tag">
                          {item}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <aside className="sidebar">
            <section className="resume-section side-section">
              <SectionTitle label="Core Skills" />
              <div className="tag-row wrap">
                {skills.core.map((item) => (
                  <span key={item} className="tag soft">
                    {item}
                  </span>
                ))}
              </div>
            </section>

            <section className="resume-section side-section">
              <SectionTitle label="Tools" />
              <div className="tag-row wrap">
                {skills.tools.map((item) => (
                  <span key={item} className="tag muted">
                    {item}
                  </span>
                ))}
              </div>
            </section>

            <section className="resume-section side-section">
              <SectionTitle label="Strengths" />
              <ul className="mini-list">
                {skills.strengths.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="resume-section side-section">
              <SectionTitle label="Education" />
              {education.map((item) => (
                <div key={item.degree} className="edu-item">
                  <h3>{item.degree}</h3>
                  <p>{item.school}</p>
                  <span>{item.period}</span>
                </div>
              ))}
            </section>

            <section className="resume-section side-section">
              <SectionTitle label="Highlights" />
              <ul className="mini-list">
                {achievements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default App;
