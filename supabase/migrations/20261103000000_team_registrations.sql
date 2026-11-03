-- Interactive 3D Lab: private team registrations
create extension if not exists citext;

create table public.teacher_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.teams (
  id uuid primary key default gen_random_uuid(),
  name citext not null unique,
  created_at timestamptz not null default now(),
  constraint teams_name_length check (char_length(trim(name::text)) between 1 and 80)
);

create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  grade text not null check (grade in ('Α΄', 'Β΄', 'Γ΄')),
  section text not null,
  created_at timestamptz not null default now(),
  constraint team_members_first_name_length check (char_length(trim(first_name)) between 1 and 80),
  constraint team_members_last_name_length check (char_length(trim(last_name)) between 1 and 80),
  constraint team_members_section_length check (char_length(trim(section)) between 1 and 20)
);

-- The same student cannot be entered twice in one team, regardless of case or surrounding spaces.
create unique index team_members_unique_person_per_team
  on public.team_members (team_id, lower(trim(first_name)), lower(trim(last_name)), grade, lower(trim(section)));

-- Stores only a one-way fingerprint of the source IP for short-lived rate limiting.
create table public.registration_attempts (
  id bigint generated always as identity primary key,
  fingerprint text not null,
  created_at timestamptz not null default now()
);
create index registration_attempts_recent on public.registration_attempts (fingerprint, created_at desc);

alter table public.teacher_roles enable row level security;
alter table public.teams enable row level security;
alter table public.team_members enable row level security;
alter table public.registration_attempts enable row level security;

create or replace function public.is_teacher()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.teacher_roles where user_id = auth.uid());
$$;

-- Database-level guard: no route, including a privileged function, can add a fifth member.
create or replace function public.limit_team_members()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare member_count integer;
begin
  perform 1 from public.teams where id = new.team_id for update;
  select count(*) into member_count from public.team_members where team_id = new.team_id;
  if member_count >= 4 then
    raise exception 'Κάθε ομάδα μπορεί να έχει έως 4 μέλη.' using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

create trigger enforce_team_member_limit
before insert on public.team_members
for each row execute function public.limit_team_members();

create or replace function public.validate_members_payload(p_members jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare item jsonb;
declare members_count integer;
begin
  if jsonb_typeof(p_members) <> 'array' then
    raise exception 'Τα μέλη της ομάδας δεν είναι έγκυρα.' using errcode = '22023';
  end if;
  members_count := jsonb_array_length(p_members);
  if members_count < 1 or members_count > 4 then
    raise exception 'Η ομάδα πρέπει να έχει από 1 έως 4 μέλη.' using errcode = '22023';
  end if;
  for item in select value from jsonb_array_elements(p_members) loop
    if jsonb_typeof(item->'first_name') <> 'string'
       or jsonb_typeof(item->'last_name') <> 'string'
       or jsonb_typeof(item->'grade') <> 'string'
       or jsonb_typeof(item->'section') <> 'string'
       or char_length(trim(item->>'first_name')) not between 1 and 80
       or char_length(trim(item->>'last_name')) not between 1 and 80
       or char_length(trim(item->>'section')) not between 1 and 20
       or (item->>'grade') not in ('Α΄', 'Β΄', 'Γ΄') then
      raise exception 'Τα στοιχεία ενός μέλους δεν είναι έγκυρα.' using errcode = '22023';
    end if;
  end loop;
  if exists (
    select 1 from (
      select lower(trim(value->>'first_name')) as first_name, lower(trim(value->>'last_name')) as last_name,
             value->>'grade' as grade, lower(trim(value->>'section')) as section, count(*)
      from jsonb_array_elements(p_members)
      group by 1, 2, 3, 4
      having count(*) > 1
    ) duplicates
  ) then
    raise exception 'Το ίδιο μέλος έχει καταχωριστεί περισσότερες από μία φορές.' using errcode = '22023';
  end if;
end;
$$;

create or replace function public.create_team_registration(p_name text, p_members jsonb)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare new_team_id uuid;
begin
  if char_length(trim(coalesce(p_name, ''))) not between 1 and 80 then
    raise exception 'Το όνομα της ομάδας δεν είναι έγκυρο.' using errcode = '22023';
  end if;
  perform public.validate_members_payload(p_members);
  if exists (select 1 from public.teams where name = trim(p_name)::citext) then
    raise exception 'Υπάρχει ήδη ομάδα με αυτό το όνομα.' using errcode = 'unique_violation';
  end if;
  insert into public.teams(name) values (trim(p_name)) returning id into new_team_id;
  insert into public.team_members (team_id, first_name, last_name, grade, section)
  select new_team_id, trim(value->>'first_name'), trim(value->>'last_name'), value->>'grade', trim(value->>'section')
  from jsonb_array_elements(p_members);
  return new_team_id;
exception when unique_violation then
  raise exception 'Υπάρχει ήδη ομάδα με αυτό το όνομα.' using errcode = 'unique_violation';
end;
$$;

create or replace function public.admin_update_team(p_team_id uuid, p_name text, p_members jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_teacher() then
    raise exception 'Δεν επιτρέπεται η ενέργεια.' using errcode = '42501';
  end if;
  if char_length(trim(coalesce(p_name, ''))) not between 1 and 80 then
    raise exception 'Το όνομα της ομάδας δεν είναι έγκυρο.' using errcode = '22023';
  end if;
  perform public.validate_members_payload(p_members);
  update public.teams set name = trim(p_name) where id = p_team_id;
  if not found then raise exception 'Η ομάδα δεν βρέθηκε.' using errcode = 'P0002'; end if;
  delete from public.team_members where team_id = p_team_id;
  insert into public.team_members (team_id, first_name, last_name, grade, section)
  select p_team_id, trim(value->>'first_name'), trim(value->>'last_name'), value->>'grade', trim(value->>'section')
  from jsonb_array_elements(p_members);
exception when unique_violation then
  raise exception 'Υπάρχει ήδη ομάδα με αυτό το όνομα ή διπλό μέλος.' using errcode = 'unique_violation';
end;
$$;

create or replace function public.enforce_registration_rate_limit(p_fingerprint text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  perform pg_advisory_xact_lock(hashtext(p_fingerprint));
  if (select count(*) from public.registration_attempts where fingerprint = p_fingerprint and created_at > now() - interval '1 hour') >= 3 then
    return false;
  end if;
  insert into public.registration_attempts(fingerprint) values (p_fingerprint);
  delete from public.registration_attempts where created_at < now() - interval '2 days';
  return true;
end;
$$;

-- No student data is public. Only authenticated users present in teacher_roles can read it.
create policy "Teachers can read teams" on public.teams for select to authenticated using (public.is_teacher());
create policy "Teachers can update teams" on public.teams for update to authenticated using (public.is_teacher()) with check (public.is_teacher());
create policy "Teachers can delete teams" on public.teams for delete to authenticated using (public.is_teacher());
create policy "Teachers can read members" on public.team_members for select to authenticated using (public.is_teacher());

revoke all on public.teacher_roles, public.teams, public.team_members, public.registration_attempts from anon, authenticated;
grant select, update, delete on public.teams to authenticated;
grant select on public.team_members to authenticated;
revoke execute on function public.create_team_registration(text, jsonb) from public, anon, authenticated;
revoke execute on function public.enforce_registration_rate_limit(text) from public, anon, authenticated;
grant execute on function public.create_team_registration(text, jsonb) to service_role;
grant execute on function public.enforce_registration_rate_limit(text) to service_role;
grant execute on function public.admin_update_team(uuid, text, jsonb) to authenticated;
