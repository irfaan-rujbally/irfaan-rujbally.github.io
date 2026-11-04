import { profile, seo } from '@/data/profile';
import { education } from '@/data/education';
import { experience } from '@/data/experience';
import { skills } from '@/data/skills';

/** JSON-LD Person schema, built from the same data the page renders. */
export const injectStructuredData = (): void => {
  if (typeof document === 'undefined') return;

  const currentRole = experience.find((role) => role.current);

  const sameAs = [profile.linkedinUrl, profile.githubUrl].filter(
    (url) => url !== '',
  );

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.title.en,
    description: seo.description,
    url: seo.url,
    email: `mailto:${profile.email}`,
    telephone: profile.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Phoenix',
      addressCountry: 'MU',
    },
    nationality: { '@type': 'Country', name: 'Mauritius' },
    knowsLanguage: profile.languages.map((language) => language.name.en),
    alumniOf: education.map((degree) => ({
      '@type': 'EducationalOrganization',
      name: degree.institution,
      ...(degree.institutionUrl !== undefined ? { url: degree.institutionUrl } : {}),
    })),
    ...(currentRole !== undefined
      ? {
          worksFor: {
            '@type': 'Organization',
            name: currentRole.company,
            ...(currentRole.companyUrl !== undefined
              ? { url: currentRole.companyUrl }
              : {}),
          },
        }
      : {}),
    knowsAbout: skills.map((skill) => skill.name),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
};
