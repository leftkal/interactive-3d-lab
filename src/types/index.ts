export type Grade = 'Α΄' | 'Β΄' | 'Γ΄'

export interface MemberInput {
  firstName: string
  lastName: string
  grade: Grade | ''
  section: string
}

export interface TeamInput {
  name: string
  members: MemberInput[]
  website?: string
}

export interface TeamMember extends MemberInput {
  id: string
}

export interface Team {
  id: string
  name: string
  created_at: string
  team_members: TeamMember[]
}
