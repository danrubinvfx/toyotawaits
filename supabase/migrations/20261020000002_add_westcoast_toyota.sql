-- ============================================================================
-- MIGRATION: 20261020000002_add_westcoast_toyota.sql
-- Description: Register West Coast Toyota (Convertus VMS, cp=1218) as third Lower Mainland pilot dealer
-- ============================================================================

-- 1. Insert Ingestion Source for West Coast Toyota
INSERT INTO sources (code, name, platform, base_url, endpoint_url, is_active)
VALUES (
    'westcoast-toyota-convertus',
    'West Coast Toyota Feed',
    'convertus',
    'https://www.westcoasttoyota.com',
    'https://www.westcoasttoyota.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Fcp%3D1218%26ln%3Den%26sc%3Dnew%26pc%3D100',
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
    'westcoast-toyota',
    'West Coast Toyota',
    'Toyota',
    '19950 Lougheed Hwy',
    'Pitt Meadows',
    'BC',
    'CA',
    'V3Y 2S9',
    '(604) 465-9146',
    'https://www.westcoasttoyota.com/'
FROM sources s
WHERE s.code = 'westcoast-toyota-convertus'
ON CONFLICT (dealer_code) DO UPDATE SET
    name = EXCLUDED.name,
    address = EXCLUDED.address,
    city = EXCLUDED.city,
    postal_code = EXCLUDED.postal_code,
    phone = EXCLUDED.phone,
    website_url = EXCLUDED.website_url,
    updated_at = now();
