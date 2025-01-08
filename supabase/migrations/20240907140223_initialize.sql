-- Create customers table to map Paddle customer_id to email
create table
  public.customers (
    customer_id uuid primary key references auth.users (id) on delete cascade,
    constraint customers_pkey primary key (customer_id),
    role text check (role in ('student', 'teacher')),
    full_name text,
    username text,
  ) tablespace pg_default;

-- Create subscription table to store webhook events sent by Paddle
create table
  public.subscriptions (
    subscription_id text not null,
    subscription_status text not null,
    price_id text null,
    product_id text null,
    scheduled_change text null,
    customer_id uuid references public.customers (customer_id) on delete cascade not null,
    constraint subscriptions_pkey primary key (subscription_id),
    constraint public_subscriptions_customer_id_fkey foreign key (customer_id) references customers (customer_id)
  ) tablespace pg_default;

-- Grant access to authenticated users to read the customers table to get the customer_id based on the email
create policy "Enable read access for authenticated users to customers" on "public"."customers" as PERMISSIVE for SELECT to authenticated using ( true );

create policy "Public profiles are viewable by everyone"
    on profiles for select
    using ( true );
create policy "Users can insert their own profile"
    on profiles for insert
    with check ( auth.uid() = id );

create policy "Users can update their own profile"
    on profiles for update
    using ( auth.uid() = id );

-- Grant access to authenticated users to read the subscriptions table
create policy "Enable read access for authenticated users to subscriptions" on "public"."subscriptions" as PERMISSIVE for SELECT to authenticated using ( true );

create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
    insert into public.customers (customer_id, username)
    values (
        new.id,
        new.raw_user_meta_data->>'username'
    );
    return new;
end;
$$;

-- Trigger for new user creation
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();