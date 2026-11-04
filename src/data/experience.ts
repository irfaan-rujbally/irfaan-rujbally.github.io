import type { Role } from '@/types';

/**
 * Titles, employers, locations and dates follow Irfaan's English and French CVs.
 *
 * Both XEFI entries are confirmed achievements. ⚠️ TODO: every other entry still
 * describes the scope of the role in generic terms and is marked
 * `highlightsUnconfirmed: true`. Replace them with real "built X, which did Y"
 * statements and flip the flag to false.
 */
export const experience: Role[] = [
  {
    id: 'xefi-ai',
    accent: '#a855f7',
    title: { en: 'AI Software Engineer', fr: 'Concepteur d’application IA' },
    company: 'XEFI Mauritius',
    companyUrl: 'https://www.xefi.fr/',
    companyBlurb: {
      en: 'French IT-services group for SMEs, with 150+ agencies across France, Spain, Switzerland, Belgium and Monaco. The Mauritius centre in Ebène covers CRM, web development and digitalisation.',
      fr: 'Groupe français de services informatiques aux PME, fort de plus de 150 agences en France, en Espagne, en Suisse, en Belgique et à Monaco. Son centre mauricien, à Ébène, couvre le CRM, le développement web et la transformation numérique.',
    },
    location: { en: 'Mauritius', fr: 'Maurice' },
    start: '2026-11',
    year: '2026',
    type: 'full-time',
    current: true,
    highlights: {
      en: [
        'Process and test automation.',
        'Integration and coordination of AI agents throughout the development lifecycle.',
      ],
      fr: [
        'Automatisation de processus et de tests.',
        'Intégration et coordination d’agents IA dans le cycle de développement.',
      ],
    },
    highlightsUnconfirmed: false,
  },
  {
    id: 'xefi',
    accent: '#2563eb',
    title: { en: 'Software Engineer', fr: 'Ingénieur logiciel' },
    company: 'XEFI Mauritius',
    companyUrl: 'https://www.xefi.fr/',
    location: { en: 'Mauritius', fr: 'Maurice' },
    start: '2024-10',
    end: '2026-10',
    year: '2024',
    type: 'full-time',
    current: false,
    highlights: {
      en: [
        'Set up AI development environments with Claude Code to automate software delivery — from spec and planning through implementation, testing and code review.',
        'Use AI agents for team management: shared task tracking, automated progress reporting and coordinated cross-review between developers.',
        'Built several applications as Laravel REST APIs with React front ends, using Laravel REST API and the OSDD modular architecture.',
        "Review teammates' merge requests and keep quality gates — automated tests, static analysis and linting — running on every change.",
      ],
      fr: [
        'Mise en place d’environnements de développement IA avec Claude Code pour automatiser la livraison logicielle — de la spécification et de la planification jusqu’à l’implémentation, aux tests et à la revue de code.',
        'Recours à des agents IA pour la gestion d’équipe : suivi partagé des tâches, rapports d’avancement automatisés et relectures croisées coordonnées entre développeurs.',
        'Développement de plusieurs applications en API REST Laravel avec des front-ends React, en s’appuyant sur Laravel REST API et l’architecture modulaire OSDD.',
        'Relecture des merge requests de l’équipe et maintien des contrôles qualité (tests automatisés, analyse statique et linting) sur chaque modification.',
      ],
    },
    highlightsUnconfirmed: false,
  },
  {
    id: 'rtknits',
    accent: '#06b6d4',
    title: { en: 'Full-Stack Engineer', fr: 'Ingénieur full-stack' },
    company: 'RT Knits',
    companyUrl: 'https://rtknits.com/',
    companyBlurb: {
      en: 'Vertically integrated circular-knits garment manufacturer in Pointe aux Sables, with around 1,700 employees and roughly 17M pieces of annual capacity.',
      fr: 'Fabricant de vêtements en maille circulaire verticalement intégré, installé à Pointe aux Sables : environ 1 700 salariés et une capacité de quelque 17 millions de pièces par an.',
    },
    location: { en: 'Mauritius', fr: 'Maurice' },
    start: '2023-02',
    end: '2024-09',
    year: '2023',
    type: 'full-time',
    current: false,
    highlights: {
      en: [
        'Developed and maintained in-house web applications supporting manufacturing operations.',
        'Worked end to end — database design, back-end services and front-end interfaces.',
        'Supported and extended existing systems in production use across the business.',
      ],
      fr: [
        'Développement et maintenance d’applications web internes au service de la production.',
        'Intervention de bout en bout : conception de la base de données, services back-end et interfaces front-end.',
        'Support et évolution des systèmes en production utilisés dans toute l’entreprise.',
      ],
    },
    highlightsUnconfirmed: true,
  },
  {
    id: 'freelance',
    accent: '#10b981',
    title: { en: 'Freelance Developer', fr: 'Développeur freelance' },
    company: 'Independent',
    companyBlurb: {
      en: 'Contract web development for clients, working directly with owners and stakeholders.',
      fr: 'Développement web pour le compte de clients, en lien direct avec les dirigeants et les parties prenantes.',
    },
    location: { en: 'Mauritius / Remote', fr: 'Maurice / à distance' },
    start: '2022-01',
    end: '2022-11',
    year: '2022',
    type: 'freelance',
    current: false,
    highlights: {
      en: [
        'Delivered websites and web applications for independent clients.',
        'Handled the full engagement — scoping, build, delivery and handover.',
      ],
      fr: [
        'Réalisation de sites et d’applications web pour des clients indépendants.',
        'Prise en charge de la mission de bout en bout : cadrage, développement, livraison et transfert.',
      ],
    },
    highlightsUnconfirmed: true,
  },
  {
    id: 'lyon1',
    accent: '#f59e0b',
    title: { en: 'Digital Learning Engineer', fr: 'Ingénieur techno-pédagogique numérique' },
    company: 'Université Claude Bernard Lyon 1',
    companyUrl: 'https://www.univ-lyon1.fr/',
    companyBlurb: {
      en: 'French public university in Villeurbanne (La Doua campus) with around 46,000 students, specialising in science, technology and health.',
      fr: 'Université publique française implantée à Villeurbanne (campus de la Doua), qui accueille environ 46 000 étudiants en sciences, technologies et santé.',
    },
    location: { en: 'Lyon, France', fr: 'Lyon, France' },
    start: '2021-01',
    end: '2021-12',
    year: '2021',
    type: 'full-time',
    current: false,
    highlights: {
      en: [
        'Supported digital engineering work and teaching activities within the university.',
        'Assisted students with practical software development coursework.',
      ],
      fr: [
        'Appui aux projets d’ingénierie pédagogique numérique et aux activités d’enseignement de l’université.',
        'Accompagnement des étudiants dans leurs travaux pratiques de développement logiciel.',
      ],
    },
    highlightsUnconfirmed: true,
  },
  {
    id: 'yulounge-php',
    accent: '#f97316',
    title: { en: 'PHP/Vue.js Developer', fr: 'Développeur PHP/Vue.js' },
    company: 'Yu Lounge Ltd',
    companyBlurb: {
      en: 'Operator of a private VIP terminal and lounge at SSR International Airport, Plaine Magnien.',
      fr: 'Exploitant d’un terminal et d’un salon VIP privés à l’aéroport international SSR de Plaine Magnien.',
    },
    location: { en: 'Mauritius', fr: 'Maurice' },
    start: '2017-10',
    end: '2018-07',
    year: '2017',
    type: 'full-time',
    current: false,
    highlights: {
      en: [
        'Built and maintained PHP web applications supporting lounge operations.',
        'Worked with MySQL data models and server-rendered interfaces.',
      ],
      fr: [
        'Développement et maintenance d’applications web PHP pour l’exploitation du salon.',
        'Travail sur des modèles de données MySQL et des interfaces rendues côté serveur.',
      ],
    },
    highlightsUnconfirmed: true,
  },
  {
    id: 'yulounge-intern',
    accent: '#ef4444',
    title: { en: 'Developer', fr: 'Développeur' },
    company: 'Yu Lounge Ltd',
    companyBlurb: {
      en: 'Internship — academic support placement.',
      fr: 'Stage effectué dans le cadre de ma formation.',
    },
    location: { en: 'Mauritius', fr: 'Maurice' },
    start: '2017-08',
    end: '2017-10',
    year: '2017',
    type: 'internship',
    current: false,
    highlights: {
      en: ['Academic support internship in web development.'],
      fr: ['Stage de développement web effectué dans le cadre de ma formation.'],
    },
    highlightsUnconfirmed: true,
  },
  {
    id: 'automaster',
    accent: '#ec4899',
    title: { en: 'Developer', fr: 'Développeur' },
    company: 'Automaster Ltd',
    companyBlurb: {
      en: 'Car dealership in Belle Rose, Quatre Bornes. Internship — academic support placement.',
      fr: 'Concessionnaire automobile à Belle Rose, Quatre Bornes. Stage effectué dans le cadre de ma formation.',
    },
    location: { en: 'Mauritius', fr: 'Maurice' },
    start: '2016-02',
    end: '2016-03',
    year: '2016',
    type: 'internship',
    current: false,
    highlights: {
      en: ['Academic support internship in software development.'],
      fr: ['Stage de développement logiciel effectué dans le cadre de ma formation.'],
    },
    highlightsUnconfirmed: true,
  },
  {
    id: 'bquad',
    accent: '#8b5cf6',
    title: { en: 'Web Developer', fr: 'Développeur web' },
    company: 'Bquad Interactive Ltd',
    companyUrl: 'https://www.bquad.mu/',
    companyBlurb: {
      en: 'Mauritian digital agency covering web design and development, digital marketing, SEO and hosting. Internship — academic support placement.',
      fr: 'Agence web mauricienne : conception et développement de sites, marketing numérique, référencement et hébergement. Stage effectué dans le cadre de ma formation.',
    },
    location: { en: 'Mauritius', fr: 'Maurice' },
    start: '2015-06',
    end: '2015-08',
    year: '2015',
    type: 'internship',
    current: false,
    highlights: {
      en: ['First professional placement — agency web development.'],
      fr: ['Premier stage professionnel : développement web en agence.'],
    },
    highlightsUnconfirmed: true,
  },
];
