import { SectionShell } from '@/components/layout/SectionShell';
import { SkillsGlobe } from '@/components/globe/SkillsGlobe';
import { useLocale } from '@/hooks/useLocale';

export const Skills = () => {
  const { t } = useLocale();

  return (
    <SectionShell
      id="skills"
      eyebrow={t.skills.eyebrow}
      heading={t.skills.heading}
      intro={t.skills.intro}
    >
      <SkillsGlobe />
    </SectionShell>
  );
};
