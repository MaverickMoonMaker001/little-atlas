-- 1. Fix handle_new_user: pin search_path and revoke direct execution by anon/authenticated.
--    The function is only meant to fire as a trigger (via the auth.users trigger),
--    not be callable via the REST API.

CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = ''
AS $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Revoke public execute permission so anon and authenticated cannot call it via RPC.
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;

-- The trigger itself runs as the function owner (superuser), so revoking
-- EXECUTE from these roles does not affect trigger behaviour.

-- 2. Remove the two overly-broad SELECT policies on storage.objects for child-photos.
--    Public buckets serve object URLs without needing a storage.objects SELECT policy.
--    These policies were allowing clients to enumerate (list) all files in the bucket.

DROP POLICY IF EXISTS "child_photos_select"       ON storage.objects;
DROP POLICY IF EXISTS "public_read_child_photos"  ON storage.objects;
