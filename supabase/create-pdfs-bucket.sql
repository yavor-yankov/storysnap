-- Run this in Supabase SQL Editor to create the pdfs storage bucket
-- Dashboard → SQL Editor → New query → paste & run

-- Create the pdfs bucket (public so download links work)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('pdfs', 'pdfs', true, 52428800, ARRAY['application/pdf'])
on conflict (id) do nothing;

-- Allow service role to upload/read PDFs
create policy "Service role manages pdfs" on storage.objects
  for all using (bucket_id = 'pdfs')
  with check (bucket_id = 'pdfs');
