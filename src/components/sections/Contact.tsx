import { Mail, MessageCircle, Phone } from 'lucide-react';
import { LinkedinIcon } from '@/components/ui/BrandIcons';
import type { ComponentType, SVGProps } from 'react';
import { profile } from '@/data/profile';
import { Reveal } from '@/components/ui/Reveal';
import { CopyButton } from '@/components/ui/CopyButton';
import { useLocale } from '@/hooks/useLocale';
import type { UiStrings } from '@/i18n/ui';
import { Suspense, lazy } from 'react';

/* zod + react-hook-form are ~60kB gzipped and the form sits below the fold. */
const ContactForm = lazy(() =>
  import('./ContactForm').then((m) => ({ default: m.ContactForm })),
);

type Channel = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  value: string;
  href: string;
  copyValue?: string;
  external?: boolean;
};

const channelsFor = (t: UiStrings): Channel[] => [
  {
    icon: Mail,
    label: t.contact.email,
    value: profile.email,
    href: `mailto:${profile.email}`,
    copyValue: profile.email,
  },
  {
    icon: Phone,
    label: t.contact.phone,
    value: profile.phone,
    href: profile.phoneHref,
    copyValue: profile.phone,
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: t.contact.whatsappValue,
    href: profile.whatsappUrl,
    external: true,
  },
  {
    icon: LinkedinIcon,
    label: 'LinkedIn',
    value: 'irfaan-r',
    href: profile.linkedinUrl,
    external: true,
  },
];

export const Contact = () => {
  const { t, l } = useLocale();
  const channels = channelsFor(t);

  return (
  <section id="contact" aria-labelledby="contact-heading" className="section-y relative">
    <div className="shell">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <Reveal>
            <p className="mono-label mb-4 flex items-center gap-2 text-accent">
              <span className="hairline-rule inline-block w-6" />
              {t.contact.eyebrow}
            </p>
            <h2 id="contact-heading" className="text-h1 text-ink">
              {t.contact.heading}
            </h2>
            <p className="mt-5 max-w-[46ch] text-body-l text-ink-soft">
              {t.contact.intro}
            </p>
          </Reveal>

          <Reveal delay={0.12}>
            <ul className="mt-10 flex flex-col divide-y divide-line border-y border-line">
              {channels.map((channel) => (
                <li key={channel.label} className="flex items-center gap-3 py-3.5">
                  <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-surface-sunk text-ink-soft">
                    <channel.icon className="size-4" strokeWidth={1.8} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="mono-label text-ink-faint">{channel.label}</p>
                    <a
                      data-magnetic
                      href={channel.href}
                      target={channel.external === true ? '_blank' : undefined}
                      rel={channel.external === true ? 'noreferrer noopener' : undefined}
                      className="block truncate text-caption font-medium text-ink hover:text-accent hover:underline"
                    >
                      {channel.value}
                    </a>
                  </div>

                  {channel.copyValue !== undefined ? (
                    <CopyButton value={channel.copyValue} label={channel.label} />
                  ) : null}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-6 text-caption text-ink-faint">
              {t.contact.basedIn(l(profile.location), profile.timezone)}
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="lg:col-span-6">
          <Suspense
            fallback={
              <div
                aria-hidden="true"
                className="glass h-[32rem] rounded-panel shadow-[var(--shadow-lg)]"
              />
            }
          >
            <ContactForm />
          </Suspense>
        </Reveal>
      </div>
    </div>
  </section>
  );
};
