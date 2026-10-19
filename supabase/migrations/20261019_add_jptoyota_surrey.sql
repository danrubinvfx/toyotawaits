-- ============================================================================
-- MIGRATION: 20261019_add_jptoyota_surrey.sql
-- Description: Register Jim Pattison Toyota Surrey (Convertus VMS) as second pilot dealer
-- ============================================================================

-- 1. Insert Ingestion Source for Jim Pattison Toyota Surrey
INSERT INTO sources (code, name, platform, base_url, endpoint_url, is_active)
VALUES (
    'jp-toyota-surrey-convertus',
    'Jim Pattison Toyota Surrey Feed',
    'convertus',
    'https://www.jptoyota-surrey.com',
    'https://www.jptoyota-surrey.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Fcp%3D1249%26ln%3Den%26sc%3Dnew%26pc%3D100',
    true
)
ON CONFLICT (code) DO UPDATE SET
    endpoint_url = EXCLUDED.endpoint_url,
    base_url = EXCLUDED.base_url,
    is_active = true,
    updated_at = now();

-- 2. Insert Dealership Catalog Record
INSERT INTO dealers (source_id, dealer_code, name, brand, address, city, province, country, postal_code, phone, website_url)
SELECT
    s.id,
    'jptoyota-surrey',
    'Jim Pattison Toyota Surrey',
    'Toyota',
    '15389 Guildford Drive',
    'Surrey',
    'BC',
    'CA',
    'V3R 0H9',
    '(604) 495-4100',
    'https://www.jptoyota-surrey.com/'
FROM sources s
WHERE s.code = 'jp-toyota-surrey-convertus'
ON CONFLICT (dealer_code) DO UPDATE SET
    name = EXCLUDED.name,
    address = EXCLUDED.address,
    city = EXCLUDED.city,
    postal_code = EXCLUDED.postal_code,
    phone = EXCLUDED.phone,
    website_url = EXCLUDED.website_url,
    updated_at = now();
