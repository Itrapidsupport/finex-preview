/**
 * Finex Development Inc. site data. Every fact traces to finexdevelopment.com (read 2026-11-18):
 * home sections SERVICES / ABOUT / OUR CREDO / CLIENTS / A PROUD SPONSOR OF / CONTACT.
 * Copy is lightly edited for grammar only; no new claims, stats, awards or projects.
 */
export const SITE = {
  name: 'Finex Development Inc.',
  short: 'Finex',
  origin: 'https://www.finexdevelopment.com',
  preview: 'https://itrapidsupport.github.io/finex-preview',
  email: 'general@finexdevelopment.com',
  hrEmail: 'hr@finexdevelopment.com',
  phone: '905-826-1808',
  phoneHref: 'tel:+19058261808',
  tollFree: '1-888-513-4639',
  tollFreeHref: 'tel:+18885134639',
  street: '2179 Dunwin Drive, Unit 2',
  city: 'Mississauga',
  region: 'ON',
  postal: 'L5L 1X2',
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('2179 Dunwin Drive Unit 2, Mississauga, ON L5L 1X2'),
  established: 2002,
  tagline: 'Leaders in construction and facility maintenance',
}

export const NAV = [
  { to: '/services', label: 'Services' },
  { to: '/projects', label: 'Projects' },
  { to: '/about', label: 'About' },
  { to: '/community', label: 'Community' },
  { to: '/contact', label: 'Contact' },
]

/** Figures shown on the live site ("ABOUT" counters + services text). */
export const FIGURES = {
  // The live "109980 Projects Completed" counter is NOT shown: flagged as implausible in content/facts-to-confirm.md.
  contractors: { value: 440, label: 'Screened vendors and contractors', source: 'finexdevelopment.com: "more than 440 carefully screened vendors"; About counter "440 Contractors Appointed"' },
  provinces: { value: 10, label: 'Provinces covered', source: 'finexdevelopment.com, Services: "all 10 provinces and territories Canada wide"' },
}

/** The ten trades listed on the live site, in its order. */
export const TRADES = ['Plumbing', 'Handyman works', 'Electrical', 'Carpentry', 'Flooring', 'Painting', 'Drywall and plaster', 'HVAC', 'Landscaping', 'Restoration']

export type Program = { slug: string; n: string; name: string; short: string; lead: string; body: string[]; includes: string[]; tone: 'navy' | 'coral' | 'ink' }

/** The three service programs (live site "Integrated Facilities Management", "On-The-Go Maintenance", "Preventative Maintenance/Inspections"). */
export const PROGRAMS: Program[] = [
  {
    slug: 'integrated-facilities-management',
    n: '01',
    name: 'Integrated Facilities Management',
    short: 'Tell us what needs to be done and leave everything to us.',
    lead: 'Tell us what needs to be done and leave everything to us. We act on behalf of your company to handle all of your maintenance needs and keep your facilities in top shape.',
    body: [
      'We conduct regular inspections to see if anything needs to be fixed, maintain your facilities, and prevent future problems.',
      'Finex has provided integrated facilities maintenance management at competitive prices since 2002, so companies can focus on higher-level concerns while reducing operational costs.',
    ],
    includes: ['Regular inspections', 'Ongoing facility maintenance', 'Repairs before they become problems', 'One point of contact for every trade'],
    tone: 'navy',
  },
  {
    slug: 'on-the-go-maintenance',
    n: '02',
    name: 'On-The-Go Maintenance',
    short: 'No project is too big or too small for us.',
    lead: 'No project is too big or too small for us. Should you need someone to fix things or to conduct regular inspections, we can provide it at a competitive price.',
    body: [
      'Our management team has extensive experience within the industry and creates maintenance programs specifically designed around your needs.',
      'Plumbing, electrical, HVAC, carpentry, flooring, painting, drywall, landscaping, restoration and handyman work, all through one call.',
    ],
    includes: ['Repairs on request', 'Regular inspections', 'Programs designed to your needs', 'Competitive pricing'],
    tone: 'coral',
  },
  {
    slug: 'preventative-maintenance',
    n: '03',
    name: 'Preventative Maintenance and Inspections',
    short: 'Avoid major issues and keep your facilities in exceptional condition.',
    lead: 'To avoid major issues and keep clients’ facilities in exceptional condition, Finex Development can suggest a preventive maintenance schedule.',
    body: [
      'Our preventive maintenance program includes lighting, general maintenance and detailed inspections.',
    ],
    includes: ['Lighting', 'General maintenance', 'Detailed inspections', 'A suggested maintenance schedule'],
    tone: 'ink',
  },
]
export const programBySlug = (s?: string) => PROGRAMS.find((p) => p.slug === s)

/** "OUR CREDO" on the live site. */
export const CREDO = [
  {
    title: 'Commitment',
    body: 'Every project is organized around your individual needs and executed in a timely manner, so you can conduct business as usual with minimal disruption and focus on the bottom line.',
  },
  {
    title: 'Our staff and technicians',
    body: 'Our technicians are carefully screened to ensure quality of work. Our staff is our most important asset, and continuing education keeps every person in compliance with health and safety regulations.',
  },
  {
    title: 'Availability',
    body: 'We are available to our clients 24/7. No matter the time or day, we will be there to help with any issue that arises, so you can focus on the other important parts of your business.',
  },
  {
    title: 'Competitive rates',
    body: 'We believe everyone in the supply chain has a part to play in a lasting economic recovery. That is why we provide competitive rates without sacrificing quality.',
  },
]

export const ABOUT = {
  intro: 'Finex Development Inc. is a Canadian nationwide construction and facility maintenance company focusing on a wide spectrum of services, delivered by skilled and licensed professionals in all areas.',
  oneContact: 'We believe the key to customer satisfaction is providing the most reliable and affordable services. We think of ourselves as a “one point of contact” company.',
  coverage: 'Our coverage reaches all 10 provinces and territories, Canada-wide, with the support of more than 440 carefully screened vendors, so we can cater to whatever your needs are.',
  history: 'Established in 2002, Finex Development Inc. has been providing integrated facilities maintenance management services at competitive prices to fulfil its customers’ maintenance and renovation needs.',
  focus: 'We are committed to being a company that offers all sought-after services, so companies can focus on higher-level concerns while effectively reducing operational costs.',
  sectors: 'With years of experience offering cost-effective facilities management to multi-site operators, retailers and chain stores, our skilled contractors understand the unique demands of each industry: the pace of change, the value of brand equity, and the need to adapt a brand identity to local codes and standards.',
  malls: 'In shopping mall build-outs, we optimize existing and common spaces as well as shared services. The result is not only newer surroundings, but more functional and efficient spaces.',
  satisfaction: 'Customer satisfaction is our utmost goal. We work one-on-one with each client to understand their specific needs and design a flexible program that works best for them.',
}

/** "A PROUD SPONSOR OF" on the live site (text as published there). */
export const SPONSORS = [
  { name: 'Canadian Tire Jumpstart', logo: 'jumpstart', body: 'Committed to ensuring kids in need have equal access to sports and physical activity, an equal chance to be their best.' },
  { name: 'St. Matthew Catholic Elementary School', logo: 'st-matthew', body: 'An exciting place to learn and grow for children from Junior Kindergarten to grade 8.' },
  { name: 'Royal Canadian Legion', logo: 'legion', body: 'Committed to making a difference in the lives of Veterans and their families, providing essential services in our communities, and remembering those who sacrificed for our country.' },
  { name: 'The Hospital Activity Book for Children', logo: 'hospital-activity-book', body: 'Successful for over 23 years, with well over one million copies provided to children across Canada.' },
]

/** Letter from the President and CEO (live /project-1 "From CEO", signed Peter Fiwek). Grammar lightly corrected. */
export const CEO = {
  name: 'Peter Fiwek',
  title: 'President and CEO',
  paragraphs: [
    'As President and CEO of Finex Development Inc., I would like to offer you my personal thank you for taking the time to review our company, and share why we started it and what we believe in as our guiding principles.',
    'Finex Development is a Canadian nationwide construction and facility maintenance company focusing on a wide spectrum of services, from small handyman services to large construction projects. Over the last several years, we have focused on delivering great service with skilled and licensed professionals in all areas.',
    'Every project we undertake must create long-term value for the client. That is why we think of ourselves as a “one point of contact” company: our clients can focus on improving and expanding their business while we take care of all handyman, construction and maintenance needs.',
    'That is who we are, and that is what we do. I hope that Finex Development will have the opportunity to serve as your partner as well.',
  ],
}
