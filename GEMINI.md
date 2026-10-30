# ToyotaWaits Guidelines & Memory

## Project Overview & Core Enforcements
For the ToyotaWaits project, always enforce zero-404 Amazon keyword search fallbacks (`/s?k=...`) via `buildAmazonAffiliateUrl` instead of direct `/dp/` ASINs. Canadian tag is `toyotawaits-20`, US tag is `toyotawaits07-20`. Any link audit must use browser-simulated GET requests to catch false-positive 405s and Dogs of Amazon 404 pages.

## Amazon Affiliate & Outbound Link Rules
- **Zero-404 Fallback Policy**: NEVER hardcode raw `/dp/[ASIN]` links for generic aftermarket accessories (screen protectors, console trays, harnesses, mud flaps).
- **Hero Brands**: Reserve direct ASINs strictly for verified, permanent hero brands (e.g. TuxMat, Grizzl-E).
- **Route Outbound Links**:
  - CA: `https://www.amazon.ca/s?k=[encodedQuery]&tag=toyotawaits-20`
  - US: `https://www.amazon.com/s?k=[encodedQuery]&tag=toyotawaits07-20`
- **Link Attributes**: `target="_blank" rel="sponsored noopener noreferrer nofollow"`.
- **Mandatory CI Pre-Push Check**: Run `npx tsx scripts/audit-all-links.ts` (must exit code 0 with 0 dead links).
