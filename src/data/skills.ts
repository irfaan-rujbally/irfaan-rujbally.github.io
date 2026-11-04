import type { Localized } from '@/i18n/localeStore';
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
  note: Localized = { en: '', fr: '' },
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
  s('php', 'PHP', 'language', true, { en: 'Primary back-end language since 2015.', fr: 'Langage back-end principal depuis 2015.' }),
  s('typescript', 'TypeScript', 'language', true, { en: 'Typed React front ends at XEFI.', fr: 'Front-ends React typés chez XEFI.' }),
  s('javascript', 'JavaScript', 'language', true, { en: 'Front-end work across every project.', fr: 'Le front-end de tous mes projets.' }),
  s('vuejs', 'Vue.js', 'language', true, { en: 'Component-driven interfaces.', fr: 'Interfaces à base de composants.' }),
  s('csharp', 'C#', 'language', true, { en: '.NET application development.', fr: 'Développement d’applications .NET.' }),
  s('java', 'Java', 'language', false, { en: 'Studied and applied during engineering school.', fr: 'Étudié et pratiqué en école d’ingénieurs.' }),
  s('html5', 'HTML5', 'language', false, { en: 'Semantic, accessible markup.', fr: 'Balisage sémantique et accessible.' }),
  s('css3', 'CSS3', 'language', false, { en: 'Layout, responsive design and animation.', fr: 'Mise en page, responsive design et animation.' }),
  s('jquery', 'jQuery', 'language', false, { en: 'Legacy and maintenance front-ends.', fr: 'Maintenance de front-ends existants.' }),
  s('dotnetcore', 'ASP.NET', 'language', false, { en: 'Server-side .NET applications.', fr: 'Applications .NET côté serveur.' }),
  s('ajax', 'Ajax', 'language', false, { en: 'Asynchronous request patterns.', fr: 'Requêtes asynchrones.' }),
  s('bash', 'Bash', 'language', false, { en: 'Scripting and automation under WSL.', fr: 'Scripts et automatisation sous WSL.' }),
  s('powershell', 'PowerShell', 'language', false, { en: 'Windows-side automation and legacy data exports.', fr: 'Automatisation sous Windows et exports de données d’anciens systèmes.' }),

  // ---- Frameworks ---------------------------------------------------------
  s('laravel', 'Laravel', 'framework', true, { en: 'Main PHP framework — APIs, import commands, tested with PHPUnit and PHPStan.', fr: 'Mon framework PHP principal : API et commandes d’import, testées avec PHPUnit et analysées avec PHPStan.' }),
  s('react', 'React', 'framework', true, { en: 'Front ends for Laravel REST APIs, with Next.js, TanStack Query and Vitest.', fr: 'Front-ends pour des API REST Laravel, avec Next.js, TanStack Query et Vitest.' }),
  s('symfony', 'Symfony', 'framework', true, { en: 'Enterprise PHP applications.', fr: 'Applications PHP d’entreprise.' }),
  s('reactnative', 'React Native', 'framework', true, { en: 'Cross-platform mobile applications.', fr: 'Applications mobiles multiplateformes.' }),
  s('bootstrap', 'Bootstrap', 'framework', false, { en: 'Rapid responsive UI delivery.', fr: 'Interfaces responsives livrées rapidement.' }),

  // ---- Databases ----------------------------------------------------------
  s('mysql', 'MySQL', 'database', true, { en: 'Schema design and query optimisation.', fr: 'Conception de schémas et optimisation des requêtes.' }),
  s('sql', 'SQL', 'database', false, { en: 'Relational modelling and reporting queries.', fr: 'Modélisation relationnelle et requêtes de reporting.' }),
  s('oracle', 'Oracle', 'database', false, { en: 'Enterprise database work.', fr: 'Bases de données d’entreprise.' }),
  s('sqlite', 'SQLite', 'database', false, { en: 'Fast, isolated test databases.', fr: 'Bases de test rapides et isolées.' }),

  // ---- Tools --------------------------------------------------------------
  s('git', 'Git', 'tool', true, { en: 'Version control on every project.', fr: 'Gestion de versions sur chaque projet.' }),
  s('docker', 'Docker', 'tool', true, { en: 'Containerised local and CI environments.', fr: 'Environnements locaux et CI conteneurisés.' }),
  s('gitlab', 'GitLab CI', 'tool', false, { en: 'Pipelines running tests and linting on every change.', fr: 'Pipelines qui exécutent tests et linting à chaque modification.' }),
  s('playwright', 'Playwright', 'tool', false, { en: 'End-to-end tests that walk through every screen.', fr: 'Tests de bout en bout qui parcourent chaque écran.' }),
  s('composer', 'Composer', 'tool', false, { en: 'PHP dependency management.', fr: 'Gestion des dépendances PHP.' }),
  s('npm', 'NPM', 'tool', false, { en: 'JavaScript tooling and package management.', fr: 'Outillage JavaScript et gestion des paquets.' }),
  s('visualstudio', 'Visual Studio', 'tool', false, { en: 'Primary .NET IDE.', fr: 'IDE principal pour .NET.' }),
  s('androidstudio', 'Android Studio', 'tool', false, { en: 'Mobile builds and debugging.', fr: 'Builds mobiles et débogage.' }),
  s('wordpress', 'WordPress', 'tool', false, { en: 'Client sites and content platforms.', fr: 'Sites clients et plateformes de contenu.' }),
  s('photoshop', 'Photoshop', 'tool', false, { en: 'Design assets and mockup handoff.', fr: 'Éléments graphiques et maquettes à transmettre aux développeurs.' }),
  s('msoffice', 'MS Office', 'tool', false, { en: 'Documentation and reporting.', fr: 'Documentation et reporting.' }),
  s('vm', 'Virtual Machines', 'tool', false, { en: 'Local environments and deployment testing.', fr: 'Environnements locaux et tests de déploiement.' }),
];

export const categoryOrder: Array<Skill['category']> = [
  'language',
  'framework',
  'database',
  'tool',
];
