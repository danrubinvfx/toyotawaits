-- ============================================================================
-- SE TO XSE DIY MODS AFFILIATE REDIRECT SEED DATA
-- Migration: 20261008000006_se_mods_affiliates.sql
-- ============================================================================

INSERT INTO affiliate_links (slug, destination_url, title, category)
VALUES 
    ('jbl-club-dash-speakers', 'https://www.amazon.ca/dp/B08XJBL34T?tag=toyotawaits-20', 'JBL Club 3412T 3.5" Dash Tweeters / Midrange Speakers', 'audio'),
    ('toyota-speaker-harness', 'https://www.amazon.ca/dp/B07TOYSPKR?tag=toyotawaits-20', 'Red Wolf / Metra Toyota Dash Speaker Plug-and-Play Wiring Harness (Pair)', 'audio'),
    ('trim-removal-tools', 'https://www.amazon.ca/dp/B08TRIMKIT?tag=toyotawaits-20', 'Non-Marring Automotive Dash Pry & Trim Removal Tool Kit', 'tools'),
    ('clazzio-leather-covers', 'https://www.clazzio.com/toyota-rav4-prime?ref=toyotawaits', 'Clazzio Custom-Fit Leather / PVC Seat Covers (RAV4 Prime)', 'interior'),
    ('ekr-seat-covers', 'https://www.amazon.ca/dp/B09EKRLEAT?tag=toyotawaits-20', 'EKR Custom Tailored Full Leatherette Seat Covers (RAV4 Prime)', 'interior')
ON CONFLICT (slug) DO UPDATE 
SET destination_url = EXCLUDED.destination_url,
    title = EXCLUDED.title,
    category = EXCLUDED.category;
