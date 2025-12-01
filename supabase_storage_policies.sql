-- Storage policies for service-images bucket

-- Allow public read access to service images
CREATE POLICY "Public read access for service images"
ON storage.objects FOR SELECT
USING (bucket_id = 'service-images');

-- Allow authenticated users (admin) to upload service images
CREATE POLICY "Authenticated users can upload service images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'service-images');

-- Allow authenticated users (admin) to update service images
CREATE POLICY "Authenticated users can update service images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'service-images');

-- Allow authenticated users (admin) to delete service images
CREATE POLICY "Authenticated users can delete service images"
ON storage.objects FOR DELETE
USING (bucket_id = 'service-images');
