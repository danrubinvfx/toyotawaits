-- Seed affiliate links for Sienna, Grand Highlander, and Land Cruiser 250 mod guides
-- Matches specs/data-contracts.md and src/lib/db/affiliates.ts

INSERT INTO affiliate_links (id, slug, destination_url, title, category, click_count, is_active)
VALUES
    ('f0000001-0001-4001-8001-000000000001', 'sienna-console-bridge-tray', 'https://www.amazon.ca/s?k=Toyota+Sienna+center+console+bridge+tray+organizer&tag=toyotawaits-20', 'Toyota Sienna Center Console Bridge Under-Tray Organizer', 'interior', 0, true),
    ('f0000002-0002-4002-8002-000000000002', 'sienna-air-lift-1000', 'https://www.amazon.ca/s?k=Air+Lift+1000+Toyota+Sienna&tag=toyotawaits-20', 'Air Lift 1000 In-Coil Rear Air Helper Spring Kit', 'suspension', 0, true),
    ('f0000003-0003-4003-8003-000000000003', 'sienna-fitcamx-dashcam', 'https://www.amazon.ca/s?k=Fitcamx+Toyota+Sienna+dash+cam&tag=toyotawaits-20', 'FitcamX OEM Integrated 4K Mirror Dash Cam (Toyota Sienna)', 'electronics', 0, true),
    ('f0000004-0004-4004-8004-000000000004', 'sienna-hatch-led-lights', 'https://www.amazon.ca/s?k=Toyota+Sienna+rear+hatch+cargo+LED+lights&tag=toyotawaits-20', 'Powerty Dual Rear Cargo Liftgate LED Flood Lights', 'lighting', 0, true),
    ('f0000005-0005-4005-8005-000000000005', 'gh-console-organizer-tray', 'https://www.amazon.ca/s?k=Toyota+Grand+Highlander+center+console+tray+organizer&tag=toyotawaits-20', 'Toyota Grand Highlander Center Console Armrest Divider & Tray', 'interior', 0, true),
    ('f0000006-0006-4006-8006-000000000006', 'gh-rear-cargo-lamps', 'https://www.amazon.ca/s?k=Grand+Highlander+rear+cargo+hatch+lights&tag=toyotawaits-20', 'Grand Highlander Dual Rear Cargo Hatch LED Lamps (PT944 Style)', 'lighting', 0, true),
    ('f0000007-0007-4007-8007-000000000007', 'gh-wireless-charger-mat', 'https://www.amazon.ca/s?k=Toyota+Grand+Highlander+wireless+charger+mat&tag=toyotawaits-20', 'Grand Highlander Anti-Slip Silicone Wireless Charging Pad Mat', 'interior', 0, true),
    ('f0000008-0008-4008-8008-000000000008', 'lc250-speaker-upgrade', 'https://www.amazon.ca/s?k=Land+Cruiser+250+speaker+upgrade+dash+door&tag=toyotawaits-20', 'Land Cruiser 250 (1958 Trim) 3.5" Dash & Front Speaker Drop-In Upgrade', 'audio', 0, true),
    ('f0000009-0009-4009-8009-000000000009', 'lc250-rock-sliders', 'https://www.amazon.ca/s?k=Land+Cruiser+250+rock+sliders+armor&tag=toyotawaits-20', 'Land Cruiser 250 Heavy-Duty Frame-Mounted Rock Sliders & Sills', 'exterior', 0, true)
ON CONFLICT (slug) DO UPDATE
SET destination_url = EXCLUDED.destination_url,
    title = EXCLUDED.title,
    category = EXCLUDED.category;
