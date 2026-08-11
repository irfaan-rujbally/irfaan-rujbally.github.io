import type { Project } from '@/types';

/**
 * ══════════════════════════════════════════════════════════════════════════════
 *  ⚠️  THIS FILE IS THE HIGHEST-IMPACT THING LEFT TO FILL IN.
 * ══════════════════════════════════════════════════════════════════════════════
 *
 * Everything below is a PLACEHOLDER (`isPlaceholder: true`). Placeholder cards
 * render with a visible "SAMPLE" ribbon in dev, and are HIDDEN ENTIRELY in a
 * production build — so nothing invented ever reaches a client. If you deploy
 * without editing this file, the Projects section shows an honest empty state
 * instead of fake work.
 *
 * For each real project, supply:
 *   title       — what it is
 *   outcome     — ONE line, the result, not the feature list.
 *                 "Cut order processing time by 40%"  ✔
 *                 "Built with Laravel and Vue"        ✘  (that's what `tech` is for)
 *   description — 1–3 sentences on the problem and your approach
 *   tech        — the stack, as short labels
 *   image       — put a screenshot in public/img/projects/ and reference it as
 *                 'img/projects/my-project.webp' (16:10, ideally 1600×1000)
 *   liveUrl     — omit if there is nothing public
 *   codeUrl     — omit if the repo is private
 *   featured    — exactly ONE project should be `true`; it gets the wide hero card
 *   isPlaceholder — set to FALSE once the entry is real
 */
export const projects: Project[] = [
  {
    id: 'sample-manufacturing-portal',
    title: 'Manufacturing Operations Portal',
    outcome: 'Replaced spreadsheet tracking for a 1,700-person production floor.',
    description:
      'An internal web platform giving production, planning and QA teams a shared live view of orders moving through the factory. Built as a Laravel API with a Vue front-end.',
    tech: ['Laravel', 'Vue.js', 'MySQL', 'Bootstrap'],
    featured: true,
    isPlaceholder: true,
  },
  {
    id: 'sample-crm-integration',
    title: 'CRM Integration Layer',
    outcome: 'Connected three disconnected business systems into one workflow.',
    description:
      'A service layer synchronising customer and sales data between an in-house CRM, an accounting system and a reporting warehouse.',
    tech: ['Symfony', 'PHP', 'MySQL', 'REST APIs'],
    featured: false,
    isPlaceholder: true,
  },
  {
    id: 'sample-mobile-app',
    title: 'Field Operations Mobile App',
    outcome: 'Put a paper-based field process onto phones, offline-first.',
    description:
      'A cross-platform mobile application for staff working away from a desk, syncing back to a central API when a connection is available.',
    tech: ['React Native', 'Laravel', 'MySQL'],
    featured: false,
    isPlaceholder: true,
  },
];

export const hasRealProjects = projects.some((p) => !p.isPlaceholder);

/** Placeholders are dev-only. Production shows an honest empty state instead. */
export const visibleProjects = import.meta.env.DEV
  ? projects
  : projects.filter((p) => !p.isPlaceholder);
