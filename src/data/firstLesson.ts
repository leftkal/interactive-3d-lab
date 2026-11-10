export interface FirstLessonWork {
  team: string
  title: string
  form: string
  senses: string
  response: string
  check: string
  art: string
}

// Transcribed from the six submitted Design Brief files from Εργασία 1.
export const firstLessonWorks: FirstLessonWork[] = [
  { team: 'PRINTERS', title: 'Έναν ανεμιστήρα', form: 'Κυκλικός με έλικες', senses: 'Κίνηση', response: 'Θα σε ακολουθεί ανάλογα με το πού πηγαίνεις', check: 'Θα δοκιμάσουμε αν μας ακολουθεί', art: 'printers.webp' },
  { team: 'NEXT PHASE', title: 'Έναν κυλινδρικό ουρανοξύστη', form: 'Ψηλός με πολλά μικρά παραθυράκια', senses: 'Το φως', response: 'Στην απουσία του φωτός', check: 'Σε σκοτεινό χώρο ανάβουν τα φώτα και παραμένουν ανοιχτά', art: 'next-phase.webp' },
  { team: 'teosty', title: 'Ένα αστέρι', form: 'Με βάση για να στέκεται και να γυαλίζει', senses: 'Αισθητήρας φωτός', response: 'Να ανάβει μόνο του στο σκοτάδι', check: 'Θα έχει όλα τα παραπάνω και θα λειτουργεί', art: 'teosty.webp' },
  { team: 'bomboclat.gr', title: 'Ένα φανάρι', form: 'Ένα φανάρι δρόμου με χρονοδιακόπτη', senses: 'Την κίνηση, ώστε να ανάβει τη σωστή ώρα', response: 'Θα ανάβει κόκκινο ή πράσινο τη σωστή στιγμή', check: 'Θα πάω κοντά και θα ανάβει', art: 'bomboclat.webp' },
  { team: 'Nikes', title: 'Ένα παράθυρο με αισθητήρα φωτεινότητας', form: 'Ένα παράθυρο', senses: 'Το φως', response: 'Θα αντιδρά ανάλογα με το φως', check: 'Αν θολώσει το τζάμι', art: 'nikes.webp' },
  { team: 'PRINTED TRIO', title: 'Νυχτερινή λειτουργία πάρτυ', form: 'Μια ντισκομπάλα εξωτερικού χώρου με φωτάκια RGB', senses: 'Το ηλιακό φως και το σκοτάδι', response: 'Όταν ανιχνεύσει σκοτάδι ξεκινάει το πάρτυ', check: 'Θα ανοίξει φώτα', art: 'printed-trio.webp' },
]
