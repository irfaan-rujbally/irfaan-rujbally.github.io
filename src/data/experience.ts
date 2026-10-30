import type { Role } from '@/types';

/**
 * Roles, titles, employers, locations and dates are taken verbatim from Irfaan's CV.
 *
 * XEFI's highlights are confirmed achievements. ⚠️ TODO: every other entry still
 * describes the scope of the role in generic terms and is marked
 * `highlightsUnconfirmed: true`. Replace them with real "built X, which did Y"
 * statements and flip the flag to false.
 */
export const experience: Role[] = [
  {
    id: 'xefi',
    accent: '#2563eb',
    title: 'Software Engineer',
    company: 'XEFI Mauritius',
    companyUrl: 'https://www.xefi.fr/',
    companyBlurb:
      'French IT-services group for SMEs, with 150+ agencies across France, Spain, Switzerland, Belgium and Monaco. The Mauritius centre in Ebène covers CRM, web development and digitalisation.',
    location: 'Mauritius',
    start: 'Oct 2024',
    end: 'Present',
    year: '2024',
    type: 'full-time',
    current: true,
    highlights: [
      'Set up AI development environments with Claude Code to automate software delivery — from spec and planning through implementation, testing and code review.',
      'Use AI agents for team management: shared task tracking, automated progress reporting and coordinated cross-review between developers.',
      'Built several applications as Laravel REST APIs with React front ends, using Laravel REST API and the OSDD modular architecture.',
      "Review teammates' merge requests and keep quality gates — automated tests, static analysis and linting — running on every change.",
    ],
    highlightsUnconfirmed: false,
  },
  {
    id: 'rtknits',
    accent: '#06b6d4',
    title: 'Full Stack Engineer',
    company: 'RT Knits',
    companyUrl: 'https://rtknits.com/',
    companyBlurb:
      'Vertically integrated circular-knits garment manufacturer in Pointe aux Sables, with around 1,700 employees and roughly 17M pieces of annual capacity.',
    location: 'Mauritius',
    start: 'Feb 2023',
    end: 'Sept 2024',
    year: '2023',
    type: 'full-time',
    current: false,
    highlights: [
      'Developed and maintained in-house web applications supporting manufacturing operations.',
      'Worked end to end — database design, back-end services and front-end interfaces.',
      'Supported and extended existing systems in production use across the business.',
    ],
    highlightsUnconfirmed: true,
  },
  {
    id: 'freelance',
    accent: '#10b981',
    title: 'Freelance Web Developer',
    company: 'Independent',
    companyBlurb:
      'Contract web development for clients, working directly with owners and stakeholders.',
    location: 'Mauritius / Remote',
    start: 'Jan 2022',
    end: 'Nov 2022',
    year: '2022',
    type: 'freelance',
    current: false,
    highlights: [
      'Delivered websites and web applications for independent clients.',
      'Handled the full engagement — scoping, build, delivery and handover.',
    ],
    highlightsUnconfirmed: true,
  },
  {
    id: 'lyon1',
    accent: '#f59e0b',
    title: 'Digital Engineering & Teaching Assistant',
    company: 'Université Claude Bernard Lyon 1',
    companyUrl: 'https://www.univ-lyon1.fr/',
    companyBlurb:
      'French public university in Villeurbanne (La Doua campus) with around 46,000 students, specialising in science, technology and health.',
    location: 'Lyon, France',
    start: 'Jan 2021',
    end: 'Dec 2021',
    year: '2021',
    type: 'full-time',
    current: false,
    highlights: [
      'Supported digital engineering work and teaching activities within the university.',
      'Assisted students with practical software development coursework.',
    ],
    highlightsUnconfirmed: true,
  },
  {
    id: 'yulounge-php',
    accent: '#f97316',
    title: 'PHP Developer',
    company: 'Yu Lounge Ltd',
    companyBlurb:
      'Operator of a private VIP terminal and lounge at SSR International Airport, Plaine Magnien.',
    location: 'Mauritius',
    start: 'Oct 2017',
    end: 'Jul 2018',
    year: '2017',
    type: 'full-time',
    current: false,
    highlights: [
      'Built and maintained PHP web applications supporting lounge operations.',
      'Worked with MySQL data models and server-rendered interfaces.',
    ],
    highlightsUnconfirmed: true,
  },
  {
    id: 'yulounge-intern',
    accent: '#ef4444',
    title: 'Developer',
    company: 'Yu Lounge Ltd',
    companyBlurb: 'Internship — academic support placement.',
    location: 'Mauritius',
    start: 'Aug 2017',
    end: 'Oct 2017',
    year: '2017',
    type: 'internship',
    current: false,
    highlights: ['Academic support internship in web development.'],
    highlightsUnconfirmed: true,
  },
  {
    id: 'automaster',
    accent: '#ec4899',
    title: 'Developer',
    company: 'Automaster Ltd',
    companyBlurb:
      'Car dealership in Belle Rose, Quatre Bornes. Internship — academic support placement.',
    location: 'Mauritius',
    start: 'Feb 2016',
    end: 'Mar 2016',
    year: '2016',
    type: 'internship',
    current: false,
    highlights: ['Academic support internship in software development.'],
    highlightsUnconfirmed: true,
  },
  {
    id: 'bquad',
    accent: '#8b5cf6',
    title: 'Web Developer',
    company: 'Bquad Interactive Ltd',
    companyUrl: 'https://www.bquad.mu/',
    companyBlurb:
      'Mauritian digital agency covering web design and development, digital marketing, SEO and hosting. Internship — academic support placement.',
    location: 'Mauritius',
    start: 'Jun 2015',
    end: 'Aug 2015',
    year: '2015',
    type: 'internship',
    current: false,
    highlights: ['First professional placement — agency web development.'],
    highlightsUnconfirmed: true,
  },
];
