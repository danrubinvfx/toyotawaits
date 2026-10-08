-- Seed affiliate links for Delivery Day Prep Checklist accessories
-- Matches specs/data-contracts.md, data/affiliate-products.json, and src/lib/db/affiliates.ts

INSERT INTO affiliate_links (id, slug, destination_url, title, category, click_count, is_active)
VALUES
    ('f1000001-0001-4001-8001-000000000001', 'fitcamx-rav4', 'https://www.amazon.ca/s?k=Fitcamx+Toyota+RAV4+dash+cam&tag=toyotawaits-20', 'FitcamX OEM Integrated 4K Mirror Dashcam (RAV4)', 'visibility_protection', 0, true),
    ('f1000002-0002-4002-8002-000000000002', 'fitcamx-sienna', 'https://www.amazon.ca/s?k=Fitcamx+Toyota+Sienna+dash+cam&tag=toyotawaits-20', 'FitcamX OEM Integrated 4K Mirror Dashcam (Sienna)', 'visibility_protection', 0, true),
    ('f1000003-0003-4003-8003-000000000003', 'fitcamx-grand-highlander', 'https://www.amazon.ca/s?k=Fitcamx+Toyota+Grand+Highlander+dash+cam&tag=toyotawaits-20', 'FitcamX OEM Integrated 4K Mirror Dashcam (Grand Highlander)', 'visibility_protection', 0, true),
    ('f1000004-0004-4004-8004-000000000004', 'fitcamx-land-cruiser', 'https://www.amazon.ca/s?k=Fitcamx+Toyota+Land+Cruiser+250+dash+cam&tag=toyotawaits-20', 'FitcamX OEM Integrated 4K Mirror Dashcam (Land Cruiser 250)', 'visibility_protection', 0, true),
    ('f1000005-0005-4005-8005-000000000005', 'screen-protector-rav4', 'https://www.amazon.ca/s?k=Toyota+RAV4+tempered+glass+screen+protector&tag=toyotawaits-20', 'Anti-Glare 9H Tempered Glass Screen Protector (RAV4)', 'visibility_protection', 0, true),
    ('f1000006-0006-4006-8006-000000000006', 'screen-protector-sienna', 'https://www.amazon.ca/s?k=Toyota+Sienna+screen+protector+tempered+glass&tag=toyotawaits-20', 'Matte Anti-Glare Screen Protector (Toyota Sienna)', 'visibility_protection', 0, true),
    ('f1000007-0007-4007-8007-000000000007', 'screen-protector-grand-highlander', 'https://www.amazon.ca/s?k=Toyota+Grand+Highlander+12.3+screen+protector&tag=toyotawaits-20', '12.3-inch Anti-Glare Tempered Glass (Grand Highlander)', 'visibility_protection', 0, true),
    ('f1000008-0008-4008-8008-000000000008', 'screen-protector-land-cruiser', 'https://www.amazon.ca/s?k=Land+Cruiser+250+screen+protector+tempered+glass&tag=toyotawaits-20', 'Armor-Grade Multimedia Screen Shield (Land Cruiser 250)', 'visibility_protection', 0, true),
    ('f1000009-0009-4009-8009-000000000009', 'console-tray-rav4', 'https://www.amazon.ca/s?k=Toyota+RAV4+center+console+tray+organizer&tag=toyotawaits-20', 'Drop-In Center Console Divider & Coin Tray (RAV4)', 'cabin_organization', 0, true),
    ('f1000010-0010-4010-8010-000000000010', 'console-tray-sienna', 'https://www.amazon.ca/s?k=Toyota+Sienna+center+console+bridge+tray+organizer&tag=toyotawaits-20', 'Dual-Tier Center Console & Bridge Organizer (Sienna)', 'cabin_organization', 0, true),
    ('f1000011-0011-4011-8011-000000000011', 'console-tray-grand-highlander', 'https://www.amazon.ca/s?k=Toyota+Grand+Highlander+center+console+tray+organizer&tag=toyotawaits-20', 'Precision Armrest Divider & Upper Storage Tray (Grand Highlander)', 'cabin_organization', 0, true),
    ('f1000012-0012-4012-8012-000000000012', 'console-tray-land-cruiser', 'https://www.amazon.ca/s?k=Toyota+Land+Cruiser+250+center+console+organizer+tray&tag=toyotawaits-20', 'Heavy-Duty Armrest Storage Organizer (Land Cruiser 250)', 'cabin_organization', 0, true),
    ('f1000013-0013-4013-8013-000000000013', 'noco-gb40-jump-pack', 'https://www.amazon.ca/s?k=NOCO+Boost+Plus+GB40+1000A&tag=toyotawaits-20', 'NOCO Boost Plus GB40 1000A 12V UltraSafe Lithium Jump Starter', 'roadside_winter', 0, true),
    ('f1000014-0014-4014-8014-000000000014', 'j1772-charger-lock', 'https://www.amazon.ca/s?k=J1772+charger+lock+ring+Toyota+RAV4+Prime&tag=toyotawaits-20', 'J1772 Public EV Charging Port Combination Lock Ring', 'roadside_winter', 0, true)
ON CONFLICT (slug) DO UPDATE
SET destination_url = EXCLUDED.destination_url,
    title = EXCLUDED.title,
    category = EXCLUDED.category;
