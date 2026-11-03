/**
 * Every string a visitor reads lives in src/data/*.ts.
 * You can update the whole site without opening a component.
 */

export const profile = {
  name: 'Irfaan Rujbally',
  firstName: 'Irfaan',
  lastName: 'Rujbally',
  initials: 'IR',
  title: 'Software Engineer',
  dateOfBirth: '1995-02-14',

  location: 'Phoenix, Mauritius',
  locationLong: 'Route Closel, Phoenix, Mauritius',
  timezone: 'GMT+4',

  email: 'irfaan.rujbally@gmail.com',
  phone: '+230 5707 9335',
  phoneHref: 'tel:+23057079335',
  whatsappUrl: 'https://wa.me/23057079335',
  linkedinUrl: 'https://www.linkedin.com/in/irfaan-r-6a7a39152',
  /**
   * Widened for the same reason as portraitSrc: the object is `as const`, so a
   * literal here turns every `githubUrl !== ''` guard into a type error rather
   * than a runtime check. Blank it and the GitHub links hide again.
   */
  githubUrl: 'https://github.com/irfaan-rujbally' as string,

  /**
   * Pre-cropped to the 4:5 the About slot expects, anchored on the face rather
   * than the geometric centre — object-cover would otherwise crop the 3:4
   * original blind. 640x800 against a slot that renders 443px wide at every
   * breakpoint, so it lands at ~1.4x.
   *
   * Widened to `string` because the object is `as const`: without it the value
   * narrows to its own literal, and About's `!== ''` placeholder check becomes
   * a type error rather than a runtime branch. Blank it and the placeholder
   * comes back, which is the point.
   */
  portraitSrc: 'img/irfaan-portrait.webp' as string,
  /** Shown instead of portraitSrc while Star Wars mode is on. */
  starWarsPortraitSrc: 'img/irfaan-portrait-starwars.webp',

  cvPath: 'Irfaan-Rujbally-CV.pdf',

  availability: 'Available for projects',

  roles: [
    'Software Engineer',
    'Full-Stack Developer',
    'Laravel & React Specialist',
    'AI-Assisted Developer',
    'Mobile App Developer',
  ],

  heroLine:
    'I design and build scalable web applications — clean architecture, maintainable code, and interfaces people actually enjoy using. Ten years across Mauritius and France, from Laravel back-ends and React front ends to mobile apps.',

  /**
   * Rewritten from the CV summary, angled at clients rather than recruiters.
   *
   * NOTE: the CV summary says "freelance developer in Europe", but the experience
   * table puts the 2022 freelance year in Mauritius/Remote and the only French
   * role is the 2021 Lyon 1 assistantship. Until Irfaan confirms, the copy below
   * says "studied and worked in France" and makes no European-freelance claim.
   */
  about: [
    "I'm a software engineer based in Phoenix, Mauritius. I build web applications that hold up — the kind where the architecture still makes sense two years and three feature requests later.",
    "My route here ran through France: a BTS in Mauritius, then a Computer Science degree at SUPINFO and a Master's in MIAGE at Polytech Lyon, followed by a year of digital engineering and teaching at Université Claude Bernard Lyon 1. I came home in 2022 and have been building for Mauritian companies since — most recently at RT Knits and now at XEFI, where I build Laravel and React applications and set up AI environments that automate software development and team management.",
    "What that adds up to: European engineering standards, Mauritian availability, and someone who works comfortably in English and French. If you have a product to build, I'd like to hear about it.",
  ],

  stats: [
    { value: 10, suffix: '+', label: 'Years coding' },
    { value: 8, suffix: '', label: 'Roles held' },
    { value: 3, suffix: '', label: 'Degrees earned' },
    { value: 2, suffix: '', label: 'Countries worked' },
  ],

  languages: [
    { name: 'English', level: 'Fluent' },
    { name: 'French', level: 'Fluent' },
  ],

  interests: ['Football', 'Web Development', 'Diving', 'Hiking'],
} as const;

export const seo = {
  siteName: 'Irfaan Rujbally',
  title: 'Irfaan Rujbally — Software Engineer | Web & Mobile Apps, Mauritius',
  description:
    'Software engineer in Mauritius building scalable web and mobile applications. Laravel, React, TypeScript, Vue, C# and React Native. Trained in France, available for projects worldwide.',
  /** TODO: set to the final deployed URL before going live. */
  url: 'https://irfaan-rujbally.github.io/',
  ogImage: 'og-image.png',
} as const;
