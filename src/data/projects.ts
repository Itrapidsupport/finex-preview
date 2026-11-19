/**
 * Projects = the before/after photo gallery of the archived Finex site (finexdevelopment.com, 2011,
 * "Photo gallery": Discount, Tommy Hilfiger, Canadian Tire, KFC, Tommy Hilfiger 2nd project).
 * Names as published there; Canadian Tire captions verbatim from the gallery. Other captions describe only what the photos show.
 * Photo ids map to src/data/images.json (AVIF/WebP derivatives in public/img/).
 */
export type Photo = { id: string; alt: string; cap?: string }
export type Project = { slug: string; name: string; client: string; scope: string; summary: string; cover: Photo; photos: Photo[] }

const P = (id: string, alt: string, cap?: string): Photo => ({ id, alt, cap })

export const PROJECTS: Project[] = [
  {
    slug: 'tommy-hilfiger',
    name: 'Tommy Hilfiger',
    client: 'Tommy Hilfiger',
    scope: 'Store flooring',
    summary: 'Hardwood flooring in a Tommy Hilfiger store, from boards on the floor during installation to the finished sales floor.',
    cover: P('tommy-hilfiger-floor-17', 'Finished hardwood sales floor in a Tommy Hilfiger store', 'Finished floor'),
    photos: [
      P('tommy-hilfiger-floor-17', 'Wide view of the finished hardwood sales floor', 'Finished floor'),
      P('tommy-hilfiger-floor-01', 'Flooring installation in progress, boards and packaging on the store floor', 'During installation'),
      P('tommy-hilfiger-floor-03', 'New flooring boards being laid in the store', 'During installation'),
      P('tommy-hilfiger-floor-06', 'Finished hardwood floor', 'Finished floor'),
      P('tommy-hilfiger-floor-13', 'Finished floor beside store fixtures', 'Finished floor'),
      P('tommy-hilfiger-floor-08', 'Floor meeting a red display fixture', 'Detail'),
    ],
  },
  {
    slug: 'tommy-hilfiger-second-project',
    name: 'Tommy Hilfiger, 2nd project',
    client: 'Tommy Hilfiger',
    scope: 'Columns, walls and fixtures',
    summary: 'A second Tommy Hilfiger store: column cladding and corners, wall finishes, thermostats and fixtures across the sales floor.',
    cover: P('tommy-hilfiger-store-44', 'Finished white column on the Tommy Hilfiger sales floor', 'Sales floor'),
    photos: [
      P('tommy-hilfiger-store-44', 'Finished column on the sales floor', 'Sales floor'),
      P('tommy-hilfiger-store-36', 'Column and display area in the store', 'Sales floor'),
      P('tommy-hilfiger-store-35', 'Wall shelving with merchandise beside a finished wall', 'Fixtures'),
      P('tommy-hilfiger-store-34', 'Finished wall corner with shelving', 'Fixtures'),
      P('tommy-hilfiger-store-41', 'Column cladding detail', 'Column'),
      P('tommy-hilfiger-store-30', 'Thermostat mounted on a finished column', 'Detail'),
    ],
  },
  {
    slug: 'discount',
    name: 'Discount',
    client: 'Discount Car & Truck Rentals',
    scope: 'Office interiors',
    summary: 'A Discount Car & Truck Rentals location: the building, a corridor, an office with a painted feature wall, and a stairway.',
    cover: P('discount-office-03', 'Office with a navy feature wall, window and new carpet', 'Office'),
    photos: [
      P('discount-office-03', 'Office with a painted navy feature wall', 'Office'),
      P('discount-office-01', 'Building exterior with the Discount Car and Truck Rentals sign', 'Exterior'),
      P('discount-office-02', 'Corridor with flooring and ceiling lights', 'Corridor'),
      P('discount-office-04', 'Stairway with railing and carpeted treads', 'Stairway'),
    ],
  },
  {
    slug: 'canadian-tire',
    name: 'Canadian Tire',
    client: 'Canadian Tire',
    scope: 'Entrances and roof, before and after',
    summary: 'A Canadian Tire store photographed before and after the work: back entrance, roof top and front entrance.',
    cover: P('canadian-tire-04', 'Canadian Tire storefront and front entrance after the work', 'Front entrance after'),
    photos: [
      P('canadian-tire-04', 'Canadian Tire front entrance after the work', 'Front entrance after'),
      P('canadian-tire-01', 'Canadian Tire back entrance before the work', 'Back entrance before'),
      P('canadian-tire-03', 'Canadian Tire roof top before the work', 'Roof top before'),
    ],
  },
  {
    slug: 'kfc',
    name: 'KFC',
    client: 'KFC',
    scope: 'Rear exterior',
    summary: 'The rear exterior of a KFC restaurant: red-painted brick, service door and bay.',
    cover: P('kfc-01', 'Rear exterior of a KFC restaurant with red brick wall and service bay', 'Rear exterior'),
    photos: [
      P('kfc-01', 'Rear exterior of a KFC restaurant, red brick wall and service bay', 'Rear exterior'),
      P('kfc-02', 'Rear wall and service door', 'Rear wall'),
    ],
  },
]
export const projectBySlug = (s?: string) => PROJECTS.find((p) => p.slug === s)
