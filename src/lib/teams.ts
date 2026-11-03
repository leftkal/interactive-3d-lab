import { functionsUrl, isSupabaseConfigured, supabase } from './supabase'
import type { Team, TeamInput } from '../types'

export async function registerTeam(input: TeamInput) {
  if (!isSupabaseConfigured || !supabase) throw new Error('Η υπηρεσία εγγραφών δεν έχει ρυθμιστεί ακόμη.')
  const { data: { session } } = await supabase.auth.getSession()
  const response = await fetch(`${functionsUrl}/register-team`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      ...(session ? { Authorization: `Bearer ${session.access_token}` } : {}),
    },
    body: JSON.stringify(input),
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.error || 'Η εγγραφή δεν ολοκληρώθηκε. Προσπαθήστε ξανά.')
  return payload
}

export async function getTeams(): Promise<Team[]> {
  if (!supabase) throw new Error('Η υπηρεσία δεν έχει ρυθμιστεί.')
  const { data, error } = await supabase.from('teams').select('id, name, created_at, team_members(id, first_name, last_name, grade, section)').order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map((team) => ({
    ...team,
    team_members: (team.team_members ?? []).map((member) => ({
      id: member.id,
      firstName: member.first_name,
      lastName: member.last_name,
      grade: member.grade,
      section: member.section,
    })),
  })) as Team[]
}

export async function updateTeam(id: string, input: TeamInput) {
  if (!supabase) throw new Error('Η υπηρεσία δεν έχει ρυθμιστεί.')
  const { error } = await supabase.rpc('admin_update_team', {
    p_team_id: id,
    p_name: input.name.trim(),
    p_members: input.members.map((m) => ({ first_name: m.firstName.trim(), last_name: m.lastName.trim(), grade: m.grade, section: m.section.trim() })),
  })
  if (error) throw error
}

export async function deleteTeam(id: string) {
  if (!supabase) throw new Error('Η υπηρεσία δεν έχει ρυθμιστεί.')
  const { error } = await supabase.from('teams').delete().eq('id', id)
  if (error) throw error
}
