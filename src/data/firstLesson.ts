export interface FirstLessonWork {
  team: string
  title: string
  form: string
  senses: string
  response: string
  check: string
  art: string
}

// Based on the six submitted Design Brief files from Εργασία 1; lightly edited for clarity.
export const firstLessonWorks: FirstLessonWork[] = [
  { team: 'PRINTERS', title: 'Ένας ανεμιστήρας', form: 'Κυκλικός, με έλικες', senses: 'Την κίνηση', response: 'Θα ακολουθεί τον χρήστη, ανάλογα με το πού κινείται.', check: 'Θα ελέγξουμε αν ακολουθεί τον χρήστη.', art: 'printers.webp' },
  { team: 'NEXT PHASE', title: 'Ένας κυλινδρικός ουρανοξύστης', form: 'Ψηλός, με πολλά μικρά παράθυρα', senses: 'Το φως', response: 'Θα ενεργοποιείται όταν δεν υπάρχει φως.', check: 'Σε σκοτεινό χώρο, τα φώτα θα ανάβουν και θα παραμένουν ανοιχτά.', art: 'next-phase.webp' },
  { team: 'teosty', title: 'Ένα αστέρι', form: 'Με βάση, ώστε να στέκεται όρθιο και να γυαλίζει', senses: 'Το φως', response: 'Θα ανάβει αυτόματα στο σκοτάδι.', check: 'Θα ελέγξουμε ότι διαθέτει όλα τα παραπάνω και λειτουργεί σωστά.', art: 'teosty.webp' },
  { team: 'bomboclat.gr', title: 'Ένα φανάρι', form: 'Ένα φανάρι δρόμου με χρονοδιακόπτη', senses: 'Την κίνηση, ώστε να ανάβει όταν χρειάζεται', response: 'Θα ανάβει με κόκκινο ή πράσινο φως τη σωστή στιγμή.', check: 'Θα πλησιάζουμε και θα ελέγχουμε αν ανάβει.', art: 'bomboclat.webp' },
  { team: 'Nikes', title: 'Ένα παράθυρο με αισθητήρα φωτεινότητας', form: 'Ένα παράθυρο', senses: 'Το φως', response: 'Θα αντιδρά ανάλογα με την ένταση του φωτός.', check: 'Θα ελέγξουμε αν θολώνει το τζάμι.', art: 'nikes.webp' },
  { team: 'PRINTED TRIO', title: 'Νυχτερινή λειτουργία πάρτι', form: 'Μια ντισκομπάλα εξωτερικού χώρου με φωτάκια RGB', senses: 'Το ηλιακό φως και το σκοτάδι', response: 'Όταν ανιχνεύει σκοτάδι, θα ξεκινά το πάρτι.', check: 'Θα ελέγξουμε αν ανάβουν τα φώτα.', art: 'printed-trio.webp' },
]
