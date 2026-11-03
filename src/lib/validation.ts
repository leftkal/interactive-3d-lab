import type { MemberInput, TeamInput } from '../types'

const normalized = (value: string) => value.trim().toLocaleLowerCase('el-GR')

export function emptyMember(): MemberInput {
  return { firstName: '', lastName: '', grade: '', section: '' }
}

export function validateTeam(input: TeamInput): string | null {
  if (!input.name.trim()) return 'Συμπληρώστε το όνομα της ομάδας.'
  if (input.name.trim().length > 80) return 'Το όνομα της ομάδας είναι πολύ μεγάλο.'
  if (input.members.length < 1 || input.members.length > 4) return 'Η ομάδα πρέπει να έχει από 1 έως 4 μέλη.'

  const seen = new Set<string>()
  for (const member of input.members) {
    if (!member.firstName.trim() || !member.lastName.trim() || !member.grade || !member.section.trim()) {
      return 'Συμπληρώστε όλα τα στοιχεία κάθε μέλους.'
    }
    if (member.firstName.trim().length > 80 || member.lastName.trim().length > 80 || member.section.trim().length > 20) {
      return 'Κάποιο στοιχείο μέλους είναι πολύ μεγάλο.'
    }
    const fingerprint = [member.firstName, member.lastName, member.grade, member.section].map(normalized).join('|')
    if (seen.has(fingerprint)) return 'Το ίδιο μέλος έχει καταχωριστεί περισσότερες από μία φορές.'
    seen.add(fingerprint)
  }
  return null
}
