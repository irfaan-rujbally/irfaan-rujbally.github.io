import type { Skill } from '@/types';

/**
 * Taken from the "Technical Skills" block of Irfaan's CV.
 *
 * ⚠️ TODO: confirm with Irfaan.
 *  1. The CV's Languages line was truncated after "Java" in the copy provided —
 *     check nothing is missing.
 *  2. `yearsOfUse` is 0 everywhere, which the UI reads as "not confirmed" and
 *     hides the bar for. Fill in real numbers.
 *  3. `note` should say where he actually used each one.
 *
 * Icon sourcing: Devicon (MIT). Ajax, SQL, Microsoft Office and Virtual Machines
 * have no Devicon entry, so they use hand-drawn accent glyphs instead.
 */
const s = (
  id: string,
  name: string,
  category: Skill['category'],
  featured: boolean,
  note = '',
  yearsOfUse = 0,
): Skill => ({
  id,
  name,
  category,
  featured,
  note,
  yearsOfUse,
  texture: `logos/tex/${id}.png`,
  icon: `logos/tech/${id}.svg`,
});

export const skills: Skill[] = [
  // ---- Languages ----------------------------------------------------------
  s('php', 'PHP', 'language', true, 'Primary back-end language since 2015.'),
  s('typescript', 'TypeScript', 'language', true, 'Typed React front ends at XEFI.'),
  s('javascript', 'JavaScript', 'language', true, 'Front-end work across every project.'),
  s('vuejs', 'Vue.js', 'language', true, 'Component-driven interfaces.'),
  s('csharp', 'C#', 'language', true, '.NET application development.'),
  s('java', 'Java', 'language', false, 'Studied and applied during engineering school.'),
  s('html5', 'HTML5', 'language', false, 'Semantic, accessible markup.'),
  s('css3', 'CSS3', 'language', false, 'Layout, responsive design and animation.'),
  s('jquery', 'jQuery', 'language', false, 'Legacy and maintenance front-ends.'),
  s('dotnetcore', 'ASP.NET', 'language', false, 'Server-side .NET applications.'),
  s('ajax', 'Ajax', 'language', false, 'Asynchronous request patterns.'),
  s('bash', 'Bash', 'language', false, 'Scripting and automation under WSL.'),
  s('powershell', 'PowerShell', 'language', false, 'Windows-side automation and legacy data exports.'),

  // ---- Frameworks ---------------------------------------------------------
  s('laravel', 'Laravel', 'framework', true, 'Main PHP framework — APIs, import commands, tested with PHPUnit and PHPStan.'),
  s('react', 'React', 'framework', true, 'Front ends for Laravel REST APIs, with Next.js, TanStack Query and Vitest.'),
  s('symfony', 'Symfony', 'framework', true, 'Enterprise PHP applications.'),
  s('reactnative', 'React Native', 'framework', true, 'Cross-platform mobile applications.'),
  s('bootstrap', 'Bootstrap', 'framework', false, 'Rapid responsive UI delivery.'),

  // ---- Databases ----------------------------------------------------------
  s('mysql', 'MySQL', 'database', true, 'Schema design and query optimisation.'),
  s('sql', 'SQL', 'database', false, 'Relational modelling and reporting queries.'),
  s('oracle', 'Oracle', 'database', false, 'Enterprise database work.'),
  s('sqlite', 'SQLite', 'database', false, 'Fast, isolated test databases.'),

  // ---- Tools --------------------------------------------------------------
  s('git', 'Git', 'tool', true, 'Version control on every project.'),
  s('docker', 'Docker', 'tool', true, 'Containerised local and CI environments.'),
  s('gitlab', 'GitLab CI', 'tool', false, 'Pipelines running tests and linting on every change.'),
  s('playwright', 'Playwright', 'tool', false, 'End-to-end tests that walk through every screen.'),
  s('composer', 'Composer', 'tool', false, 'PHP dependency management.'),
  s('npm', 'NPM', 'tool', false, 'JavaScript tooling and package management.'),
  s('visualstudio', 'Visual Studio', 'tool', false, 'Primary .NET IDE.'),
  s('androidstudio', 'Android Studio', 'tool', false, 'Mobile builds and debugging.'),
  s('wordpress', 'WordPress', 'tool', false, 'Client sites and content platforms.'),
  s('photoshop', 'Photoshop', 'tool', false, 'Design assets and mockup handoff.'),
  s('msoffice', 'MS Office', 'tool', false, 'Documentation and reporting.'),
  s('vm', 'Virtual Machines', 'tool', false, 'Local environments and deployment testing.'),
];

export const categoryLabels: Record<Skill['category'] | 'all', string> = {
  all: 'All',
  language: 'Languages',
  framework: 'Frameworks',
  database: 'Databases',
  tool: 'Tools',
};

export const categoryOrder: Array<Skill['category']> = [
  'language',
  'framework',
  'database',
  'tool',
];
