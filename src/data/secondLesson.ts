export interface SecondLessonModel {
  team: string
  preview: string
  model: string
}

// Matched against the overview image and the individual previews in Εργασία 2.
export const secondLessonModels: SecondLessonModel[] = [
  { team: 'Nikes', preview: 'nikes.webp', model: 'nikes.stl' },
  { team: 'bomboclat.gr', preview: 'bomboclat.webp', model: 'bomboclat.stl' },
  { team: 'PRINTED TRIO', preview: 'printed-trio.webp', model: 'printed-trio.stl' },
  { team: 'teosty', preview: 'teosty.webp', model: 'teosty.stl' },
  { team: 'NEXT PHASE', preview: 'next-phase.webp', model: 'next-phase.stl' },
  { team: 'PRINTERS', preview: 'printers.webp', model: 'printers.stl' },
]
