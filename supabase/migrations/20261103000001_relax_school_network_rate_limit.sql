-- A school network can place many students behind one public IP address.
-- Keep a meaningful abuse limit while allowing all intended groups to register.
create or replace function public.enforce_registration_rate_limit(p_fingerprint text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  perform pg_advisory_xact_lock(hashtext(p_fingerprint));
  if (select count(*) from public.registration_attempts where fingerprint = p_fingerprint and created_at > now() - interval '1 hour') >= 30 then
    return false;
  end if;
  insert into public.registration_attempts(fingerprint) values (p_fingerprint);
  delete from public.registration_attempts where created_at < now() - interval '2 days';
  return true;
end;
$$;
