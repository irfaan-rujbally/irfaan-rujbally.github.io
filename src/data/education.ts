import type { Degree } from '@/types';

export const education: Degree[] = [
  {
    id: 'polytech',
    credential: "Master's Degree",
    field: 'MIAGE',
    subtitle:
      'Applied Computer Science for Business Management, specialising in Information Systems in Healthcare',
    institution: 'Polytech Lyon',
    institutionUrl: 'https://polytech.univ-lyon1.fr/',
    logo: 'logos/org/polytech.svg',
    accent: '#2563eb',
    location: 'France',
    start: 'Sept 2018',
    end: 'Jun 2020',
    blurb:
      'The public engineering school of Université Claude Bernard Lyon 1, in Villeurbanne — part of the 16-school national Polytech network.',
  },
  {
    id: 'supinfo',
    credential: "Bachelor's Degree",
    field: 'Computer Science',
    subtitle:
      'Core computer science — algorithms and data structures, software engineering, systems, networks and databases',
    institution: 'SUPINFO Institute of Information Technology',
    institutionUrl: 'https://www.supinfo.com/',
    logo: 'logos/org/supinfo.png',
    accent: '#7c3aed',
    location: 'France',
    start: 'Sept 2016',
    end: 'Jul 2017',
    blurb:
      'French private IT school founded in 1965, with campuses in Caen, Lille, Lyon, Paris, Tours, Guadeloupe and Mauritius.',
  },
  {
    id: 'mcci',
    credential: 'BTS',
    field: 'IT Services for Organizations',
    subtitle:
      'Brevet de Technicien Supérieur in Services Informatiques aux Organisations — building and supporting the systems businesses run on',
    institution: 'MCCI Business School',
    institutionUrl: 'https://www.mccibusinessschool.org/',
    logo: 'logos/org/mcci.png',
    accent: '#f97316',
    location: 'Mauritius',
    start: 'Sept 2014',
    end: 'Jun 2016',
    blurb:
      'The training arm of the Mauritius Chamber of Commerce and Industry, in Ebène — French- and UK-accredited programmes, 15,000+ professionals trained.',
  },
];
