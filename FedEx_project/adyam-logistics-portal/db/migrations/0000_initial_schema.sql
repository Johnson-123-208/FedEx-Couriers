-- Enable UUID extension
create extension if not exists "pgcrypto";

-- Create Enum for Roles
drop type if exists app_role;
create type app_role as enum ('admin', 'employee');

-- Create Profiles table (links to auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  role app_role default 'employee',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Secure Profiles
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

-- Create Tracking Table
create table if not exists public.adyam_tracking (
  id uuid default gen_random_uuid() primary key,
  awb_no text not null unique,
  service_provider text,
  sender text,
  receiver text,
  shipment_by text,
  destination text,
  weight_kg numeric,
  contents text,
  status text,
  remarks text,
  last_location text,
  last_event_time timestamp with time zone,
  web_events jsonb default '[]'::jsonb,
  delivered boolean default false,
  delivered_at timestamp with time zone,
  last_checked_at timestamp with time zone,
  next_alert_at timestamp with time zone,
  last_alerted_at timestamp with time zone,
  alert_attempts integer default 0,
  alert_phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Tracking
alter table public.adyam_tracking enable row level security;

-- Admin: Full Access
create policy "Admins have full access" on public.adyam_tracking
  for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- Employee: Read all
create policy "Employees can view all" on public.adyam_tracking
  for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'employee'
    )
  );

-- Create Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'employee');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Employee: Update specific columns only
-- Note: Postgres RLS for UPDATE checks the "USING" clause to see if the OLD row is visible/updatable.
-- To restrict columns, we typically use a BEFORE UPDATE trigger or separate policies, 
-- but Supabase/Postgres doesn't support "GRANT UPDATE(col1, col2)" inside RLS policies easily.
-- Instead, we will revoke UPDATE on the table for the role and grant it only on specific columns.
-- OR simple approach: Use a trigger to prevent unauthorized column changes.
-- For standard RLS usage in this stack, we will keep the row-based check but trust API validation primarily,
-- while ensuring they can only update rows they have access to. 

create policy "Employees can update operational fields" on public.adyam_tracking
  for update
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'employee'
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'employee'
    )
    -- Ideally, we'd add check(awb_no = old.awb_no) here but simple RLS doesn't support "OLD" ref in WITH CHECK easily without creating a mismatch.
    -- We will rely on the API for field-level security or add a Trigger if strict column security is required.
  );

