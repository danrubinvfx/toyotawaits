import { z } from 'zod';
import {
  CANADIAN_PROVINCES,
  US_STATES,
  usStateSchema,
  countryCodeSchema,
  submissionStatusSchema,
  submissionStageSchema,
  sanitizedNotesSchema,
  pricingTypeSchema,
} from '@/lib/validations/schemas';

export const ALL_REGIONS = [...CANADIAN_PROVINCES, ...US_STATES] as const;
export const regionCodeSchema = z.enum(ALL_REGIONS as unknown as [string, ...string[]]);

export const submissionCountrySchema = z.enum(['CA', 'US']);
export const submissionCurrencySchema = z.enum(['CAD', 'USD']);
export const submissionPricingTypeSchema = z.enum([
  'at_msrp',
  'markup',
  'discount',
  'mandatory_addons',
]);

export const submissionSchema = z
  .object({
    modelId: z.string().uuid({ message: 'Valid modelId UUID is required' }),
    powertrainId: z.string().uuid({ message: 'Valid powertrainId UUID is required' }),
    trimId: z.string().uuid({ message: 'Valid trimId UUID is required' }),
    modelSlug: z.string().optional(),
    powertrainSlug: z.string().optional(),
    trimSlug: z.string().optional(),
    model: z.string().optional(),
    powertrain: z.string().optional(),
    trim: z.string().optional(),

    // Dual-market fields
    country: submissionCountrySchema.default('CA'),
    countryCode: countryCodeSchema.optional(),
    country_code: countryCodeSchema.optional(),
    currency: submissionCurrencySchema.default('CAD'),
    province: regionCodeSchema,
    state: usStateSchema.optional().nullable(),
    adm_markup: z.number().optional().nullable(),
    dealerMarkupAdm: z.number().optional().nullable(),
    dealer_markup_adm: z.number().optional().nullable(),
    pricing_type: submissionPricingTypeSchema.optional().nullable(),
    pricing: z.union([pricingTypeSchema, submissionPricingTypeSchema]).default('undisclosed'),

    portDestination: z.string().trim().max(100).optional().nullable(),
    port_destination: z.string().trim().max(100).optional().nullable(),
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
      .refine((date) => new Date(date).getTime() <= Date.now() + 86400000, {
        message: 'Order date cannot be in the future',
      }),
    deliveryDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Delivery date must be in YYYY-MM-DD format')
      .refine((date) => new Date(date).getTime() <= Date.now() + 86400000, {
        message: 'Delivery date cannot be in the future',
      })
      .optional()
      .nullable(),
    status: submissionStatusSchema.default('pending'),
    stage: submissionStageSchema.default('deposit_placed'),
    mandatoryAddonsCad: z
      .number()
      .min(0, 'Mandatory add-ons cannot be negative')
      .max(50000, 'Add-on amount exceeds reasonable limit')
      .default(0),
    tradeInRequired: z.boolean().default(false),
    notes: sanitizedNotesSchema,
    // Bot & Security checks
    turnstileToken: z.string().min(1, 'Cloudflare Turnstile verification is required'),
    honeypot: z.string().max(0, 'Bot trap triggered').optional(),
  })
  .superRefine((data, ctx) => {
    const activeCountry = data.country || data.country_code || data.countryCode || 'CA';
    if (activeCountry === 'CA') {
      if (!CANADIAN_PROVINCES.includes(data.province as any)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Province is required and must be a valid Canadian province',
          path: ['province'],
        });
      }
    } else if (activeCountry === 'US') {
      const stateCode = data.state || data.province;
      if (!stateCode || !US_STATES.includes(stateCode as any)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'State is required for U.S. submissions and must be a valid U.S. state code',
          path: data.state ? ['state'] : ['province'],
        });
      }
    }

    if (data.status === 'delivered') {
      if (!data.deliveryDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Delivery date is required when status is delivered',
          path: ['deliveryDate'],
        });
      } else {
        const orderTime = new Date(data.orderDate).getTime();
        const deliveryTime = new Date(data.deliveryDate).getTime();
        if (deliveryTime < orderTime) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Delivery date cannot precede order date',
            path: ['deliveryDate'],
          });
        }
        const diffDays = (deliveryTime - orderTime) / (1000 * 60 * 60 * 24);
        if (diffDays > 1825) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Reported wait duration exceeds plausible 5-year maximum',
            path: ['deliveryDate'],
          });
        }
      }
    }
  });

export type SubmissionInput = z.infer<typeof submissionSchema>;
export { submissionSchema as submissionCreateSchema };
