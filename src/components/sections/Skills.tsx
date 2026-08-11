import { SectionShell } from '@/components/layout/SectionShell';
import { SkillsGlobe } from '@/components/globe/SkillsGlobe';

export const Skills = () => (
  <SectionShell
    id="skills"
    eyebrow="Skills"
    heading="The stack I work in."
    intro="Drag the sphere to explore. Click a logo to pin it and see where I've used it."
  >
    <SkillsGlobe />
  </SectionShell>
);
