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
  note: string;
  featured: boolean;
};

export type EmploymentType = 'full-time' | 'freelance' | 'internship';

export type Role = {
  id: string;
  title: string;
  company: string;
  companyUrl?: string;
  companyBlurb?: string;
  location: string;
  start: string;
  end: string;
  year: string;
  type: EmploymentType;
  current: boolean;
  highlights: string[];
  /** True while `highlights` are still generic role descriptions, not confirmed achievements. */
  highlightsUnconfirmed: boolean;
};

export type Degree = {
  id: string;
  title: string;
  subtitle?: string;
  institution: string;
  institutionUrl?: string;
  location: string;
  start: string;
  end: string;
  blurb: string;
};

export type Project = {
  id: string;
  title: string;
  outcome: string;
  description: string;
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
