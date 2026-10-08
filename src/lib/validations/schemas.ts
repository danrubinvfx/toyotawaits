import { z } from 'zod';

// ============================================================================
// REUSABLE PRIMITIVE ENUMS & SCHEMAS
// ============================================================================

export const CANADIAN_PROVINCES = [
  'AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'
] as const;

export const canadianProvinceSchema = z.enum(CANADIAN_PROVINCES);

export const SUBMISSION_STATUSES = ['pending', 'delivered', 'cancelled'] as const;
export const submissionStatusSchema = z.enum(SUBMISSION_STATUSES);

export const SUBMISSION_STAGES = [
  'deposit_placed',
  'allocation_confirmed',
  'freight_transit',
  'arrived_at_dealer',
  'delivered',
] as const;
export const submissionStageSchema = z.enum(SUBMISSION_STAGES);

export const PRICING_TYPES = ['at_msrp', 'above_msrp', 'below_msrp', 'undisclosed'] as const;
export const pricingTypeSchema = z.enum(PRICING_TYPES);

// ----------------------------------------------------------------------------
// REGEX SCRUBBERS FOR PII PREVENTION (ZERO-PII POLICY)
// ----------------------------------------------------------------------------
export const vinRegex = /[A-HJ-NPR-Z0-9]{17}/i;
export const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
export const phoneRegex = /\+?1?[-. ]?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}/;
export const postalRegex = /[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d/;

export const sanitizedNotesSchema = z
  .string()
  .max(280, 'Notes cannot exceed 280 characters')
  .refine((val) => !val || !vinRegex.test(val), {
    message: 'Notes cannot contain Vehicle Identification Numbers (VIN).'
  })
  .refine((val) => !val || !emailRegex.test(val), {
    message: 'Notes cannot contain email addresses.'
  })
  .refine((val) => !val || !phoneRegex.test(val), {
    message: 'Notes cannot contain telephone numbers.'
  })
  .refine((val) => !val || !postalRegex.test(val), {
    message: 'Notes cannot contain postal codes.'
  })
  .optional()
  .nullable();

// ----------------------------------------------------------------------------
// 1. SUBMISSION CREATION SCHEMA (POST /api/submissions)
// ----------------------------------------------------------------------------
export const submissionCreateSchema = z
  .object({
    modelId: z.string().uuid({ message: 'Valid modelId UUID is required' }),
    powertrainId: z.string().uuid({ message: 'Valid powertrainId UUID is required' }),
    trimId: z.string().uuid({ message: 'Valid trimId UUID is required' }),
    province: canadianProvinceSchema,
    dealershipCity: z.string().trim().max(100).optional().nullable(),
    dealershipName: z.string().trim().max(150).optional().nullable(),
    modelYear: z
      .number()
      .int()
      .min(2019, 'Model year must be 2019 or newer')
      .max(new Date().getFullYear() + 2, 'Model year cannot exceed future release year'),
    orderDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Order date must be in YYYY-MM-DD format')
      .refine((date) => new Date(date) <= new Date(), {
        message: 'Order date cannot be in the future'
      }),
    deliveryDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Delivery date must be in YYYY-MM-DD format')
      .refine((date) => new Date(date) <= new Date(), {
        message: 'Delivery date cannot be in the future'
      })
      .optional()
      .nullable(),
    status: submissionStatusSchema.default('pending'),
    stage: submissionStageSchema.default('deposit_placed'),
    pricing: pricingTypeSchema.default('undisclosed'),
    mandatoryAddonsCad: z
      .number()
      .min(0, 'Mandatory add-ons cannot be negative')
      .max(50000, 'Add-on amount exceeds reasonable limit')
      .default(0),
    tradeInRequired: z.boolean().default(false),
    notes: sanitizedNotesSchema,
    // Bot & Security checks
    turnstileToken: z.string().min(1, 'Cloudflare Turnstile verification is required'),
    honeypot: z.string().max(0, 'Bot trap triggered').optional()
  })
  .superRefine((data, ctx) => {
    // If delivered, deliveryDate is strictly mandatory and must be >= orderDate
    if (data.status === 'delivered') {
      if (!data.deliveryDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Delivery date is required when status is delivered',
          path: ['deliveryDate']
        });
      } else {
        const orderTime = new Date(data.orderDate).getTime();
        const deliveryTime = new Date(data.deliveryDate).getTime();
        if (deliveryTime < orderTime) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Delivery date cannot precede order date',
            path: ['deliveryDate']
          });
        }
        // Plausibility clamp: wait time cannot exceed 5 years (1825 days)
        const diffDays = (deliveryTime - orderTime) / (1000 * 60 * 60 * 24);
        if (diffDays > 1825) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Reported wait duration exceeds plausible 5-year maximum',
            path: ['deliveryDate']
          });
        }
      }
    }
  });

export type SubmissionCreateInput = z.infer<typeof submissionCreateSchema>;

// ----------------------------------------------------------------------------
// 2. SUBMISSION UPDATE SCHEMA (PATCH /api/submissions/:id)
// ----------------------------------------------------------------------------
export const submissionUpdateSchema = z.object({
  id: z.string().uuid(),
  editKey: z.string().min(16, 'Valid edit key is required').optional(),
  stage: submissionStageSchema.optional(),
  status: z.enum(['pending', 'delivered', 'cancelled']).optional(),
  deliveryDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Delivery date must be YYYY-MM-DD')
    .refine((date) => new Date(date) <= new Date(), {
      message: 'Delivery date cannot be in the future'
    })
    .optional()
    .nullable(),
  notes: sanitizedNotesSchema
});

export type SubmissionUpdateInput = z.infer<typeof submissionUpdateSchema>;

// ----------------------------------------------------------------------------
// 3. AGGREGATE ANALYTICS QUERY SCHEMA (GET /api/aggregate)
// ----------------------------------------------------------------------------
export const aggregateQuerySchema = z.object({
  model: z.string().min(1).max(50),
  powertrain: z.string().min(1).max(50).optional(),
  province: canadianProvinceSchema.optional(),
  trim: z.string().min(1).max(80).optional(),
  timeframe: z.enum(['all', '30d', '90d', '180d', '365d']).default('365d')
});

export type AggregateQueryParams = z.infer<typeof aggregateQuerySchema>;

// ----------------------------------------------------------------------------
// 4. DATA EXPORT QUERY SCHEMA (GET /api/export)
// ----------------------------------------------------------------------------
export const exportQuerySchema = z.object({
  model: z.string().max(50).optional(),
  powertrain: z.string().max(50).optional(),
  province: canadianProvinceSchema.optional(),
  status: submissionStatusSchema.optional(),
  format: z.literal('csv').default('csv')
});

export type ExportQueryParams = z.infer<typeof exportQuerySchema>;

// ----------------------------------------------------------------------------
// 5. AFFILIATE REDIRECT SLUG SCHEMA (GET /out/:slug)
// ----------------------------------------------------------------------------
export const affiliateSlugSchema = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase alphanumeric characters and hyphens')
    .max(80)
});

export type AffiliateSlugParams = z.infer<typeof affiliateSlugSchema>;
