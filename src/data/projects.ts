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
    title: { en: 'Manufacturing Operations Portal', fr: 'Portail des opérations de production' },
    outcome: {
      en: 'Replaced spreadsheet tracking for a 1,700-person production floor.',
      fr: 'A remplacé le suivi sur tableur d’un atelier de 1 700 personnes.',
    },
    description: {
      en: 'An internal web platform giving production, planning and QA teams a shared live view of orders moving through the factory. Built as a Laravel API with a Vue front-end.',
      fr: 'Une plateforme web interne qui offre aux équipes de production, de planification et de qualité une vue partagée, en temps réel, des commandes en cours dans l’usine. Construite sur une API Laravel avec un front-end Vue.',
    },
    tech: ['Laravel', 'Vue.js', 'MySQL', 'Bootstrap'],
    featured: true,
    isPlaceholder: true,
  },
  {
    id: 'sample-crm-integration',
    title: { en: 'CRM Integration Layer', fr: 'Couche d’intégration CRM' },
    outcome: {
      en: 'Connected three disconnected business systems into one workflow.',
      fr: 'A relié trois systèmes métier cloisonnés en un seul flux de travail.',
    },
    description: {
      en: 'A service layer synchronising customer and sales data between an in-house CRM, an accounting system and a reporting warehouse.',
      fr: 'Une couche de services qui synchronise les données clients et ventes entre un CRM interne, un logiciel comptable et un entrepôt de reporting.',
    },
    tech: ['Symfony', 'PHP', 'MySQL', 'REST APIs'],
    featured: false,
    isPlaceholder: true,
  },
  {
    id: 'sample-mobile-app',
    title: { en: 'Field Operations Mobile App', fr: 'Application mobile terrain' },
    outcome: {
      en: 'Put a paper-based field process onto phones, offline-first.',
      fr: 'A remplacé un processus papier sur le terrain par une application mobile conçue pour fonctionner hors ligne.',
    },
    description: {
      en: 'A cross-platform mobile application for staff working away from a desk, syncing back to a central API when a connection is available.',
      fr: 'Une application mobile multiplateforme pour les équipes sur le terrain, qui se synchronise avec une API centrale dès qu’une connexion est disponible.',
    },
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
