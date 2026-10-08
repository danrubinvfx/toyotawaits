-- Update affiliate links to verified live Amazon Canada search URLs and Clazzio homepage
-- Replaces non-functioning dummy ASINs with high-intent search queries that never 404

UPDATE affiliate_links
SET destination_url = 'https://www.amazon.ca/s?k=JBL+Club+3.5+speakers&tag=toyotawaits-20'
WHERE slug = 'jbl-club-dash-speakers';

UPDATE affiliate_links
SET destination_url = 'https://www.amazon.ca/s?k=RED+WOLF+Toyota+dash+speaker+wiring+harness&tag=toyotawaits-20'
WHERE slug = 'toyota-speaker-harness';

UPDATE affiliate_links
SET destination_url = 'https://www.amazon.ca/s?k=auto+trim+removal+tool+kit&tag=toyotawaits-20'
WHERE slug = 'trim-removal-tools';

UPDATE affiliate_links
SET destination_url = 'https://www.clazzio.com/'
WHERE slug = 'clazzio-leather-covers';

UPDATE affiliate_links
SET destination_url = 'https://www.amazon.ca/s?k=EKR+custom+fit+car+seat+covers+Toyota+RAV4&tag=toyotawaits-20'
WHERE slug = 'ekr-seat-covers';

UPDATE affiliate_links
SET destination_url = 'https://www.amazon.ca/s?k=TuxMat+Toyota+RAV4&tag=toyotawaits-20'
WHERE slug = 'tuxmat-rav4';

UPDATE affiliate_links
SET destination_url = 'https://www.amazon.ca/s?k=TuxMat+Toyota+Sienna&tag=toyotawaits-20'
WHERE slug = 'tuxmat-sienna';

UPDATE affiliate_links
SET destination_url = 'https://www.amazon.ca/s?k=VIOFO+A229+Pro+4K&tag=toyotawaits-20'
WHERE slug = 'viofo-a229-pro';

UPDATE affiliate_links
SET destination_url = 'https://www.amazon.ca/s?k=Toyota+RAV4+12.3+screen+protector&tag=toyotawaits-20'
WHERE slug = 'screen-protector-12-3';

UPDATE affiliate_links
SET destination_url = 'https://www.amazon.ca/s?k=A-Premium+mud+flaps+Toyota+RAV4&tag=toyotawaits-20'
WHERE slug = 'no-drill-mud-flaps-rav4';

UPDATE affiliate_links
SET destination_url = 'https://www.amazon.ca/s?k=Grizzl-E+Level+2+EV+Charger&tag=toyotawaits-20'
WHERE slug = 'grizzl-e-charger';

UPDATE affiliate_links
SET destination_url = 'https://www.amazon.ca/s?k=FLO+Home+EV+Charger&tag=toyotawaits-20'
WHERE slug = 'flo-g5';
