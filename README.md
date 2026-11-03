# Interactive 3D Lab

Μικρός ιστότοπος του Ομίλου **Interactive 3D Lab – Από τον τρισδιάστατο σχεδιασμό στην πραγματικότητα** του Δημόσιου Ωνάσειου Σχολείου – Ημερήσιου Γυμνασίου Αχαρνών, για το σχολικό έτος 2026–2027.

Το περιεχόμενο του Ομίλου και το χρονοδιάγραμμα (Νοέμβριος: 4, Δεκέμβριος: 4, Ιανουάριος: 3, Φεβρουάριος: 4, Μάρτιος: 4, Απρίλιος: 4, Μάιος: 1, Ιούνιος: 2 συναντήσεις) προέρχονται από το αρχείο `aitisi-D18EA_orario_2ores_ana_synantisi.xlsx`.

## Τοπική εκτέλεση

Απαιτείται Node.js 20 ή νεότερο.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Συμπληρώστε στο `.env.local` το URL του Supabase project και το **anon key**. Το anon key είναι δημόσιο κλειδί και ασφαλίζεται από RLS· **μην** προσθέσετε ποτέ `service_role` κλειδί σε αρχείο `VITE_*` ή στο GitHub.

```bash
npm run build
npm run preview
```

## Ρύθμιση Supabase

1. Δημιουργήστε ένα νέο Supabase project.
2. Εγκαταστήστε και συνδεθείτε στο [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started).
3. Συνδέστε το project και εφαρμόστε τη βάση:

   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   supabase db push --remote
   ```

   Εναλλακτικά, εκτελέστε το περιεχόμενο του `supabase/migrations/20261103000000_team_registrations.sql` στον SQL Editor, μία φορά.

4. Στο **Authentication → Providers → Email** ενεργοποιήστε το Email provider. Δημιουργήστε τον λογαριασμό του/της εκπαιδευτικού από **Authentication → Users → Add user** (ή με `supabase auth users create`).
5. Αντιγράψτε το UUID του χρήστη και εκτελέστε στον SQL Editor:

   ```sql
   insert into public.teacher_roles (user_id)
   values ('UUID_ΤΟΥ_ΕΚΠΑΙΔΕΥΤΙΚΟΥ');
   ```

   Μόνο χρήστες σε αυτόν τον πίνακα μπορούν να δουν, τροποποιήσουν ή διαγράψουν εγγραφές στο `/#/admin`.

6. Ρυθμίστε τα μυστικά του Edge Function. Το `ALLOWED_ORIGINS` είναι το origin, **χωρίς** το όνομα του αποθετηρίου:

   ```bash
   supabase secrets set ALLOWED_ORIGINS=https://USERNAME.github.io,http://localhost:5173
   supabase secrets set RATE_LIMIT_SALT="$(openssl rand -hex 32)"
   ```

   Το `SUPABASE_URL` και το `SUPABASE_SERVICE_ROLE_KEY` παρέχονται στο Edge Runtime από το Supabase. Το δεύτερο χρησιμοποιείται μόνο στο Function και δεν στέλνεται στον browser.

7. Αναπτύξτε το Function:

   ```bash
   supabase functions deploy register-team --no-verify-jwt
   ```

Το δημόσιο Function κάνει έλεγχο πεδίου και honeypot, περιορισμό 3 προσπαθειών ανά ώρα ανά μονόδρομο αποτύπωμα IP και καλεί μία atomic PostgreSQL συνάρτηση. Η βάση επιβάλλει επιπλέον 1–4 μέλη, μοναδικό όνομα ομάδας χωρίς διάκριση πεζών/κεφαλαίων και μη διπλό μέλος μέσα στην ίδια ομάδα. Τα στοιχεία μαθητών δεν έχουν δημόσιο policy ανάγνωσης ή εγγραφής.

## GitHub Pages

1. Δημιουργήστε GitHub repository και στείλτε τον κώδικα στον κλάδο `main`.
2. Στο **Settings → Secrets and variables → Actions**, δημιουργήστε τα repository secrets:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Στο **Settings → Pages**, επιλέξτε ως Source το **GitHub Actions**.
4. Κάντε push στον `main`. Το `.github/workflows/deploy.yml` κάνει build με `VITE_BASE_PATH=/<repository>/` και δημοσιεύει αυτόματα στο:

   ```text
   https://USERNAME.github.io/REPOSITORY_NAME/
   ```

Χρησιμοποιείται `HashRouter`, επομένως το `/#/admin` και οι υπόλοιπες διαδρομές λειτουργούν χωρίς ρυθμίσεις server στο GitHub Pages.

## Έλεγχοι πριν από τη χρήση

- Δοκιμάστε εγγραφή με κενά πεδία, πέμπτο μέλος, διπλό μέλος και ίδιο όνομα ομάδας με διαφορετικά κεφαλαία.
- Συνδεθείτε στο `/#/admin` με τον teacher account, δοκιμάστε επεξεργασία, διαγραφή και άνοιγμα του CSV στο Excel.
- Επιβεβαιώστε με ανώνυμο browser session ότι δεν επιτρέπεται `select` στους πίνακες `teams` και `team_members`.
- Ελέγξτε μία εγγραφή από κινητό και το τελικό URL του GitHub Pages.
