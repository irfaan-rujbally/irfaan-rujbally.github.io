import type { Localized } from '@/i18n/localeStore';

export type SkillCategory = 'language' | 'framework' | 'database' | 'tool';

export type Skill = {
  id: string;
  name: string;
  category: SkillCategory;
  /** Path (base-relative) to the rasterised 256px PNG used as a globe texture. */
  texture: string;
  /** Path to the source SVG, used by the DOM fallback grid. */
  icon: string;
  /** 0 means "not yet confirmed" — the UI hides the bar rather than showing 0. */
  yearsOfUse: number;
  note: Localized;
  featured: boolean;
};

export type EmploymentType = 'full-time' | 'freelance' | 'internship';

export type Role = {
  id: string;
  title: Localized;
  company: string;
  companyUrl?: string;
  companyBlurb?: Localized;
  /** Colour of the light that orbits this card's border. A CSS colour. */
  accent: string;
  location: Localized;
  /** ISO month, "2024-10". Formatted per language at render time. */
  start: string;
  /** ISO month; omitted while the role is ongoing. */
  end?: string;
  year: string;
  type: EmploymentType;
  current: boolean;
  highlights: Localized<string[]>;
  /** True while `highlights` are still generic role descriptions, not confirmed achievements. */
  highlightsUnconfirmed: boolean;
};

export type Degree = {
  id: string;
  /** The award itself — "Master's Degree", "BTS". Rendered as the card's kicker. */
  credential: Localized;
  /** What it was in — "MIAGE", "Computer Science". Rendered as the card's headline. */
  field: Localized;
  subtitle?: Localized;
  institution: string;
  institutionUrl?: string;
  /** Path under public/logos/org/. Falls back to an <OrgMark> monogram when absent. */
  logo?: string;
  /** Institution's brand colour, as a CSS colour. Tints the card at low opacity. */
  accent: string;
  location: Localized;
  /** ISO months, "2018-09". */
  start: string;
  end: string;
  blurb: Localized;
};

export type Project = {
  id: string;
  title: Localized;
  outcome: Localized;
  description: Localized;
  tech: string[];
  image?: string;
  liveUrl?: string;
  codeUrl?: string;
  featured: boolean;
  isPlaceholder: boolean;
};

export type SectionId =
  | 'hero'
  | 'about'
  | 'skills'
  | 'experience'
  | 'education'
  | 'projects'
  | 'contact';
