# ToyotaWaits Codebase Rules & Guidelines

## Amazon Affiliate & Outbound Link Standards

### 1. Zero-404 Fallback Policy
- **NEVER** hardcode raw `/dp/[ASIN]` links for generic aftermarket accessories (e.g., screen protectors, console trays, harnesses, mud flaps).
- Reserve direct ASINs strictly for verified, permanent hero brands (e.g., TuxMat, Grizzl-E).
- Route all outbound affiliate links through `buildAmazonAffiliateUrl` (defined in `src/lib/gear/affiliate.ts`):
  - **CA Market**: `https://www.amazon.ca/s?k=[encodedQuery]&tag=toyotawaits-20`
  - **US Market**: `https://www.amazon.com/s?k=[encodedQuery]&tag=toyotawaits07-20`

### 2. Required Anchor Attributes
All outbound affiliate anchor tags must include:
```html
target="_blank" rel="sponsored noopener noreferrer nofollow"
```

### 3. Mandatory Pre-Push & CI Audit Check
- Before pushing changes or deploying, run the link audit suite:
  ```bash
  npx tsx scripts/audit-all-links.ts
  ```
- The audit **must exit with code 0** and report **0 dead links**.
- Link audits must use browser-simulated `GET` requests with desktop browser user agents and headers to catch false-positive 405s and "Dogs of Amazon" soft-404 responses.
