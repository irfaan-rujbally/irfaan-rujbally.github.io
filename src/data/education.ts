import type { Degree } from '@/types';

export const education: Degree[] = [
  {
    id: 'polytech',
    credential: { en: "Master's Degree", fr: 'Master' },
    field: { en: 'MIAGE', fr: 'MIAGE' },
    subtitle: {
      en: 'Applied Computer Science for Business Management, specialising in Health Information Systems',
      fr: 'Méthodes informatiques appliquées à la gestion des entreprises, spécialité systèmes d’information en santé',
    },
    institution: 'Polytech Lyon',
    institutionUrl: 'https://polytech.univ-lyon1.fr/',
    logo: 'logos/org/polytech.svg',
    accent: '#2563eb',
    location: { en: 'France', fr: 'France' },
    start: '2018-09',
    end: '2020-06',
    blurb: {
      en: 'The public engineering school of Université Claude Bernard Lyon 1, in Villeurbanne — part of the 16-school national Polytech network.',
      fr: 'École publique d’ingénieurs de l’Université Claude Bernard Lyon 1, à Villeurbanne, membre du réseau national Polytech qui compte 16 écoles.',
    },
  },
  {
    id: 'supinfo',
    credential: { en: "Bachelor's Degree", fr: 'Bachelor' },
    field: { en: 'Computer Science', fr: 'Informatique' },
    subtitle: {
      en: 'Core computer science — algorithms and data structures, software engineering, systems, networks and databases',
      fr: 'Les fondamentaux de l’informatique : algorithmique et structures de données, génie logiciel, systèmes, réseaux et bases de données',
    },
    institution: 'SUPINFO Institute of Information Technology',
    institutionUrl: 'https://www.supinfo.com/',
    logo: 'logos/org/supinfo.png',
    accent: '#7c3aed',
    location: { en: 'France', fr: 'France' },
    start: '2016-09',
    end: '2017-07',
    blurb: {
      en: 'French private IT school founded in 1965, with campuses in Caen, Lille, Lyon, Paris, Tours, Guadeloupe and Mauritius.',
      fr: 'École privée d’informatique fondée en 1965, avec des campus à Caen, Lille, Lyon, Paris, Tours, en Guadeloupe et à Maurice.',
    },
  },
  {
    id: 'mcci',
    credential: { en: 'BTS', fr: 'BTS' },
    field: { en: 'IT Services for Organisations', fr: 'Services informatiques aux organisations' },
    subtitle: {
      en: 'Brevet de Technicien Supérieur in Services Informatiques aux Organisations — building and supporting the systems businesses run on',
      fr: 'Brevet de technicien supérieur SIO : concevoir et maintenir les systèmes sur lesquels reposent les entreprises',
    },
    institution: 'MCCI Business School',
    institutionUrl: 'https://www.mccibusinessschool.org/',
    logo: 'logos/org/mcci.png',
    accent: '#f97316',
    location: { en: 'Mauritius', fr: 'Maurice' },
    start: '2014-09',
    end: '2016-06',
    blurb: {
      en: 'The training arm of the Mauritius Chamber of Commerce and Industry, in Ebène — French- and UK-accredited programmes, 15,000+ professionals trained.',
      fr: 'Pôle formation de la Chambre de commerce et d’industrie de Maurice, à Ébène : programmes accrédités en France et au Royaume-Uni, plus de 15 000 professionnels formés.',
    },
  },
];
