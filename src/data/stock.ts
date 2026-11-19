/**
 * Stock photography (Unsplash / Pexels licences: free commercial use, no attribution required).
 * Provenance: ../STOCK-PHOTOS.md and assets/stock/stock_manifest.json (kind 'stock').
 * These are representative photos, NOT Finex projects: never caption them with a client or project name.
  * scripts/import-photos.py copies every stock id used below into public/img/.
 */
export type Stock = { id: string; alt: string; pos?: string }
const S = (id: string, alt: string, pos?: string): Stock => ({ id, alt, pos })

export const STOCK = {
  hero: S('floor-coating-crew', 'Crew applying a white floor coating across a large commercial unit', '50% 62%'),
  floorWide: S('floor-coating-wide', 'Crew rolling floor coating inside a large steel-framed building', '50% 60%'),
  openFitout: S('open-floor-fitout', 'Open-plan floor under fit-out with framing, ladders and exposed services'),
  drywall: S('drywall-mechanical', 'Interior fit-out with new drywall, bulkheads and mechanical rough-ins'),
  framing: S('steel-stud-framing', 'Steel stud framing and drywall sheets in a corridor under construction'),
  ceilingLift: S('ceiling-lift-install', 'Worker on a scissor lift installing ceiling components in a commercial space'),
  rooftopHvac: S('rooftop-hvac', 'Technician walking a commercial roof beside rooftop HVAC units'),
  accessPanel: S('ceiling-access-panel', 'Technician on a ladder working through a ceiling access panel'),
  firePump: S('fire-pump-room', 'Technician in hi-vis checking a fire pump controller in a mechanical room', '50% 40%'),
  panelTest: S('panel-testing', 'Electrician testing contactors in an electrical panel'),
  panelHivis: S('panel-hivis', 'Electrician in hi-vis working inside an outdoor electrical cabinet'),
  pipes: S('mechanical-room-pipes', 'Valves, pumps and insulated pipework in a mechanical room'),
  tile: S('tile-install', 'Gloved hand levelling large-format floor tiles on fresh thinset'),
  painters: S('painters-interior', 'Two painters finishing walls inside a bright interior', '50% 35%'),
  siteAerial: S('site-aerial-crew', 'Aerial view of a crew working among rebar on a concrete deck'),
  cranes: S('cranes-concrete-frame', 'Tower cranes over a concrete frame under construction'),
  cranesDusk: S('cranes-dusk', 'Tower cranes silhouetted against a navy evening sky'),
  toronto: S('toronto-skyline-sunset', 'Toronto skyline and CN Tower across Lake Ontario at sunset', '50% 45%'),
  mississauga: S('mississauga-aerial', 'Aerial view of Mississauga City Centre and the Absolute towers'),
  retailWhite: S('retail-fixtures-white', 'Bright new retail interior with white shelving and display tables'),
  retailDark: S('retail-interior-dark', 'Finished retail interior with black slatted ceiling and lit display fixtures'),
  office: S('office-fitout-finished', 'Finished open office with glass partitions and carpet tile'),
  blueprint: S('blueprint-detail', 'Pencil and scale ruler on a construction drawing'),
}

/** Program slug -> photo (services hub rows, program cards, program page heroes). */
export const PROGRAM_PHOTO: Record<string, Stock> = {
  'integrated-facilities-management': STOCK.office,
  'on-the-go-maintenance': STOCK.ceilingLift,
  'preventative-maintenance': STOCK.rooftopHvac,
}

/** Trade photos for the home trades strip (label = trade category only, no project claims). */
export const TRADE_PHOTOS: { trade: string; s: Stock }[] = [
  { trade: 'Electrical', s: STOCK.panelTest },
  { trade: 'Plumbing', s: STOCK.pipes },
  { trade: 'HVAC', s: STOCK.rooftopHvac },
  { trade: 'Flooring', s: STOCK.tile },
  { trade: 'Painting', s: STOCK.painters },
  { trade: 'Drywall and framing', s: STOCK.framing },
]

/** Kinds of work (projects hub + home): representative photos, captioned by the type of work only. */
export const WORK_TYPES: { label: string; s: Stock }[] = [
  { label: 'Build-outs', s: STOCK.openFitout },
  { label: 'Interior fit-outs', s: STOCK.drywall },
  { label: 'Finished retail space', s: STOCK.retailDark },
  { label: 'Office fit-outs', s: STOCK.office },
  { label: 'Facility maintenance', s: STOCK.firePump },
  { label: 'Floor coatings', s: STOCK.floorWide },
]
