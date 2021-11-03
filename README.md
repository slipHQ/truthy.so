# truthy.so

A coding quiz builder

[Truthy](https://www.truthy.so)

## Local Development

Create a [Supabase](https://www.supabase.io) account.

Apply the script from `schema.sql` to your Supabase database.
You can copy and paste the schema into the sql editor and run it.

You can find your Supabase credentials in the /settings/api section of your Supabase dashboard.

Create a `.env` file with the following contents, using your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_ANON_KEY=<Your Supabase ANON KEY>
NEXT_PUBLIC_HOME_URL=http://localhost:3000>
NEXT_PUBLIC_SUPABASE_URL=<Your Supabase URL>
```

Setup twitter auth for your supabase account by following [this guide](https://supabase.io/docs/guides/auth/auth-twitter)

Run `yarn dev` to start the development server.

---
