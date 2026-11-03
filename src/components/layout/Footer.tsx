import { Mail } from 'lucide-react';
import { LinkedinIcon } from '@/components/ui/BrandIcons';
import { profile } from '@/data/profile';

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative pb-10">
      <div className="shell">
        <div className="hairline-rule mb-8" />

        <div className="flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
          <p className="text-caption text-ink-faint">
            © {year} {profile.name}
          </p>

          <p className="mono-label text-ink-ghost">
            Built with React · Three.js · Tailwind
          </p>

          <ul className="flex items-center gap-1">
            <li>
              <a
                data-magnetic
                href={profile.linkedinUrl}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="LinkedIn profile"
                className="grid size-9 place-items-center rounded-full text-ink-faint transition-colors hover:bg-surface-sunk hover:text-ink"
              >
                <LinkedinIcon className="size-[17px]" />
              </a>
            </li>
            <li>
              <a
                data-magnetic
                href={`mailto:${profile.email}`}
                aria-label={`Email ${profile.firstName}`}
                className="grid size-9 place-items-center rounded-full text-ink-faint transition-colors hover:bg-surface-sunk hover:text-ink"
              >
                <Mail className="size-[18px]" strokeWidth={1.7} />
              </a>
            </li>
          </ul>
        </div>

        <p className="mt-8 text-center text-[0.6875rem] leading-relaxed text-ink-ghost md:text-left">
          All company and institution names and marks are the property of their
          respective owners and appear here for identification purposes only.
        </p>
        <p className="mt-2 text-center text-[0.6875rem] leading-relaxed text-ink-ghost md:text-left">
          “
          <a
            href="https://sketchfab.com/3d-models/millennium-falcon-d7f48553ff084205853334300aeaa9c6"
            target="_blank"
            rel="noreferrer noopener"
            className="underline-offset-2 hover:underline"
          >
            Millennium Falcon
          </a>
          ” by Green Squadron, licensed under{' '}
          <a
            href="https://creativecommons.org/licenses/by/4.0/"
            target="_blank"
            rel="noreferrer noopener"
            className="underline-offset-2 hover:underline"
          >
            CC BY 4.0
          </a>
          , compressed for the web.
        </p>
      </div>
    </footer>
  );
};
