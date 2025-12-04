-- Check if clients table exists and its structure
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM 
    information_schema.columns
WHERE 
    table_name = 'clients'
ORDER BY 
    ordinal_position;

-- Check RLS policies on clients table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM 
    pg_policies
WHERE 
    tablename = 'clients';

-- Count existing clients
SELECT COUNT(*) as client_count FROM clients;

-- Show sample clients if any exist
SELECT * FROM clients LIMIT 5;
