import { createClient } from 'npm:@supabase/supabase-js@2'

const projectUrl = Deno.env.get('SUPABASE_URL')!
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const allowedOrigins = (Deno.env.get('ALLOWED_ORIGINS') ?? '').split(',').map((origin) => origin.trim()).filter(Boolean)
const registrationsOpen = Deno.env.get('REGISTRATION_OPEN') !== 'false'
const admin = createClient(projectUrl, serviceRoleKey, { auth: { persistSession: false } })

function headers(origin: string) {
  return { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Vary': 'Origin', 'Content-Type': 'application/json; charset=utf-8' }
}

function response(origin: string, body: object, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: headers(origin) })
}

function validRequest(data: unknown): data is { name: string; members: Array<{ firstName: string; lastName: string; grade: string; section: string }>; website?: string } {
  if (!data || typeof data !== 'object') return false
  const input = data as Record<string, unknown>
  if (typeof input.name !== 'string' || !Array.isArray(input.members) || input.members.length < 1 || input.members.length > 4) return false
  return input.members.every((member) => member && typeof member === 'object' && ['firstName', 'lastName', 'grade', 'section'].every((key) => typeof (member as Record<string, unknown>)[key] === 'string'))
}

async function fingerprint(ip: string) {
  const bytes = new TextEncoder().encode(`${Deno.env.get('RATE_LIMIT_SALT') ?? ''}:${ip}`)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

Deno.serve(async (request) => {
  const origin = request.headers.get('origin') ?? ''
  if (!allowedOrigins.length) return response(origin || 'null', { error: 'Η υπηρεσία εγγραφών δεν έχει ρυθμιστεί.' }, 503)
  if (!allowedOrigins.includes(origin)) return response('null', { error: 'Η προέλευση του αιτήματος δεν επιτρέπεται.' }, 403)
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: headers(origin) })
  if (request.method !== 'POST') return response(origin, { error: 'Η μέθοδος δεν επιτρέπεται.' }, 405)
  if (!registrationsOpen) return response(origin, { error: 'Οι δηλώσεις ομάδων έχουν ολοκληρωθεί.' }, 403)
  try {
    const input: unknown = await request.json()
    if (!validRequest(input)) return response(origin, { error: 'Τα στοιχεία της ομάδας δεν είναι έγκυρα.' }, 400)
    if (input.website) return response(origin, { error: 'Η εγγραφή δεν ολοκληρώθηκε.' }, 400)
    const rawIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const { data: allowed, error: rateError } = await admin.rpc('enforce_registration_rate_limit', { p_fingerprint: await fingerprint(rawIp) })
    if (rateError) throw rateError
    if (!allowed) return response(origin, { error: 'Έγιναν πολλές προσπάθειες. Δοκιμάστε ξανά αργότερα.' }, 429)
    const members = input.members.map((member) => ({ first_name: member.firstName, last_name: member.lastName, grade: member.grade, section: member.section }))
    const { data: teamId, error } = await admin.rpc('create_team_registration', { p_name: input.name, p_members: members })
    if (error) return response(origin, { error: error.message === 'Υπάρχει ήδη ομάδα με αυτό το όνομα.' ? error.message : 'Η εγγραφή δεν ολοκληρώθηκε. Ελέγξτε τα στοιχεία σας.' }, error.code === '23505' ? 409 : 400)
    return response(origin, { id: teamId }, 201)
  } catch (error) {
    console.error('register-team error', error)
    return response(origin, { error: 'Προέκυψε πρόβλημα επικοινωνίας. Προσπαθήστε ξανά.' }, 500)
  }
})
