import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Loader2, Send } from 'lucide-react';
import { profile } from '@/data/profile';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useLocale } from '@/hooks/useLocale';
import type { UiStrings } from '@/i18n/ui';
import { Button } from '@/components/ui/Button';
import { EASE_EXPO } from '@/lib/motionVariants';
import { cn } from '@/lib/cn';

const PROJECT_TYPES = ['web-app', 'mobile-app', 'api-backend', 'other'] as const;

/* Built per language so validation messages follow the switch. */
const makeSchema = (errors: UiStrings['form']['errors']) =>
  z.object({
    name: z.string().trim().min(2, errors.name),
    email: z.string().trim().email(errors.email),
    projectType: z.enum(PROJECT_TYPES),
    message: z.string().trim().min(20, errors.messageShort).max(4000, errors.messageLong),
    /* Honeypot: real people never fill this in. */
    company: z.string().max(0).optional(),
  });

type FormValues = z.infer<ReturnType<typeof makeSchema>>;

type Status = 'idle' | 'submitting' | 'success' | 'error';

const FORM_ENDPOINT = `https://formsubmit.co/ajax/${profile.email}`;

const fieldClass =
  'w-full rounded-xs border border-line bg-surface px-3.5 py-2.5 text-[0.9375rem] text-ink ' +
  'placeholder:text-ink-ghost transition-colors duration-200 ' +
  'focus:border-accent focus:outline-none';

export const ContactForm = () => {
  const reduced = usePrefersReducedMotion();
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const { t } = useLocale();
  const schema = useMemo(() => makeSchema(t.form.errors), [t]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { projectType: 'web-app' },
  });

  const onSubmit = async (values: FormValues): Promise<void> => {
    if (values.company !== undefined && values.company !== '') return;

    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          projectType: values.projectType,
          message: values.message,
          _subject: `Portfolio enquiry from ${values.name}`,
          _template: 'table',
        }),
      });

      if (!response.ok) throw new Error(`Request failed: ${response.status}`);

      setStatus('success');
      reset();
    } catch {
      setStatus('error');
      setErrorMessage(t.form.errors.send(profile.email));
    }
  };

  return (
    <div className="glass rounded-panel p-6 shadow-[var(--shadow-lg)] sm:p-8">
      <AnimatePresence mode="wait" initial={false}>
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0.2 : 0.5, ease: EASE_EXPO }}
            className="py-8 text-center"
          >
            <motion.span
              className="mx-auto mb-5 grid size-14 place-items-center rounded-full bg-live/12 text-live"
              initial={reduced ? undefined : { scale: 0.6 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, ease: EASE_EXPO, delay: 0.1 }}
            >
              <Check className="size-7" strokeWidth={2.4} />
            </motion.span>
            <h3 className="text-h3 text-ink">{t.form.sentTitle}</h3>
            <p className="mx-auto mt-2 max-w-[36ch] text-caption text-ink-soft">
              {t.form.sentBody}
            </p>
            <Button
              variant="secondary"
              size="sm"
              className="mt-6"
              onClick={() => setStatus('idle')}
            >
              {t.form.sendAnother}
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            noValidate
            onSubmit={(event) => void handleSubmit(onSubmit)(event)}
            initial={false}
            className="flex flex-col gap-5"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="cf-name" className="mono-label mb-2 block text-ink-faint">
                  {t.form.name}
                </label>
                <input
                  id="cf-name"
                  type="text"
                  autoComplete="name"
                  placeholder={t.form.namePlaceholder}
                  aria-invalid={errors.name !== undefined}
                  aria-describedby={errors.name !== undefined ? 'cf-name-error' : undefined}
                  className={cn(fieldClass, errors.name !== undefined && 'border-danger')}
                  {...register('name')}
                />
                {errors.name !== undefined ? (
                  <p id="cf-name-error" role="alert" className="mt-1.5 text-[0.75rem] text-danger">
                    {errors.name.message}
                  </p>
                ) : null}
              </div>

              <div>
                <label htmlFor="cf-email" className="mono-label mb-2 block text-ink-faint">
                  {t.form.email}
                </label>
                <input
                  id="cf-email"
                  type="email"
                  autoComplete="email"
                  placeholder={t.form.emailPlaceholder}
                  aria-invalid={errors.email !== undefined}
                  aria-describedby={errors.email !== undefined ? 'cf-email-error' : undefined}
                  className={cn(fieldClass, errors.email !== undefined && 'border-danger')}
                  {...register('email')}
                />
                {errors.email !== undefined ? (
                  <p id="cf-email-error" role="alert" className="mt-1.5 text-[0.75rem] text-danger">
                    {errors.email.message}
                  </p>
                ) : null}
              </div>
            </div>

            <div>
              <label htmlFor="cf-type" className="mono-label mb-2 block text-ink-faint">
                {t.form.projectType}
              </label>
              <select id="cf-type" className={fieldClass} {...register('projectType')}>
                {PROJECT_TYPES.map((value) => (
                  <option key={value} value={value}>
                    {t.form.types[value]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="cf-message" className="mono-label mb-2 block text-ink-faint">
                {t.form.message}
              </label>
              <textarea
                id="cf-message"
                rows={5}
                placeholder={t.form.messagePlaceholder}
                aria-invalid={errors.message !== undefined}
                aria-describedby={errors.message !== undefined ? 'cf-message-error' : undefined}
                className={cn(fieldClass, 'resize-y', errors.message !== undefined && 'border-danger')}
                {...register('message')}
              />
              {errors.message !== undefined ? (
                <p id="cf-message-error" role="alert" className="mt-1.5 text-[0.75rem] text-danger">
                  {errors.message.message}
                </p>
              ) : null}
            </div>

            {/* Honeypot — hidden from people, irresistible to bots. */}
            <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
              <label htmlFor="cf-company">{t.form.honeypot}</label>
              <input
                id="cf-company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                {...register('company')}
              />
            </div>

            {status === 'error' ? (
              <p role="alert" className="rounded-xs bg-danger/8 px-3.5 py-2.5 text-[0.8125rem] text-danger">
                {errorMessage}
              </p>
            ) : null}

            <Button type="submit" size="lg" disabled={status === 'submitting'} className="mt-1 w-full">
              {status === 'submitting' ? (
                <>
                  <Loader2 className="size-[18px] animate-spin" strokeWidth={2} />
                  {t.form.sending}
                </>
              ) : (
                <>
                  <Send className="size-[18px]" strokeWidth={1.9} />
                  {t.form.send}
                </>
              )}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};
