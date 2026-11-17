import type { LineItem, LineItemCategory } from '@/lib/compliance/quote-auditor';

const IGNORE_LINE_REGEX =
  /^(?:sub-?total|total\b|grand\s*total|balance\s*due|amount\s*financed|cash\s*price|vehicle\s*price|base\s*msrp|msrp\b|gst\b|hst\b|pst\b|qst\b|sales\s*tax|tax\s*\(|deposit\b|trade-?in|down\s*payment)/i;

const TAX_ONLY_REGEX = /\b(?:gst|hst|pst|qst|sales\s*tax|tax\s*amount)\b/i;

const CATEGORY_PATTERNS: Array<{ category: LineItemCategory; regex: RegExp }> = [
  {
    category: 'doc_fee',
    regex: /doc(?:umentation)?\s*(?:&|and)?\s*(?:admin(?:istration)?)?\s*fee|admin(?:istration)?\s*fee|dealer\s*prep|doc\s*\/\s*admin/i,
  },
  {
    category: 'block_heater',
    regex: /block\s*heater/i,
  },
  {
    category: 'protection',
    regex: /rust|xpel|ppf|paint\s*protect|ceramic|etch|nitrogen|tire\s*(?:&|and)\s*rim|security\s*pack/i,
  },
  {
    category: 'warranty',
    regex: /ecp|extended\s*warranty|mechanical\s*breakdown|service\s*contract/i,
  },
  {
    category: 'statutory',
    regex: /freight|pdi|air\s*(?:cond|tax)|tire\s*(?:levy|tax)|amvic|omvic|vsa|licen[cs]ing/i,
  },
];

/**
 * Classifies a raw line item label into a QuoteAuditor LineItemCategory.
 */
export function categorizeWorksheetLine(label: string): LineItemCategory {
  for (const { category, regex } of CATEGORY_PATTERNS) {
    if (regex.test(label)) {
      return category;
    }
  }
  return 'other';
}

/**
 * Parses pasted raw text from a dealer quote, email, or OCR / Live Text photo
 * into structured LineItem[] for the AMVIC / OMVIC / VSA Quote Auditor.
 *
 * Ignores subtotal, total, and GST/HST/PST tax lines to prevent double-counting.
 */
export function parseRawDealerWorksheet(rawText: string): LineItem[] {
  if (!rawText || !rawText.trim()) {
    return [];
  }

  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const items: LineItem[] = [];
  let index = 0;

  for (const line of lines) {
    if (IGNORE_LINE_REGEX.test(line)) {
      continue;
    }

    // Match currency amounts like "$888", "$802.40", "$1,500", "1,500.00", "888.00"
    // Prefer the rightmost currency/amount token on the line.
    const amountMatches = Array.from(
      line.matchAll(/(?:\$\s*)(\d{1,3}(?:,\d{3})+|\d+)(?:\.(\d{1,2}))?|\b(\d{1,3}(?:,\d{3})+|\d+)(?:\.(\d{1,2}))?\s*(?:cad|usd|\$)?\s*$/gi)
    );

    if (amountMatches.length === 0) {
      continue;
    }

    const lastMatch = amountMatches[amountMatches.length - 1];
    const wholePart = (lastMatch[1] ?? lastMatch[3] ?? '').replace(/,/g, '');
    const decPart = lastMatch[2] ?? lastMatch[4];
    if (!wholePart) {
      continue;
    }

    const amount = Number(decPart !== undefined ? `${wholePart}.${decPart}` : wholePart);
    if (!Number.isFinite(amount) || amount <= 0 || amount > 250000) {
      continue;
    }

    // Extract label by stripping the trailing matched amount and separators
    const matchStart = lastMatch.index ?? line.length;
    let label = line
      .slice(0, matchStart)
      .replace(/[:\-–—•*|\t]+$/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim();

    if (!label) {
      // Fallback: strip the matched substring anywhere in the line
      label = line
        .replace(lastMatch[0], '')
        .replace(/[:\-–—•*|\t]+$/g, '')
        .replace(/\s{2,}/g, ' ')
        .trim();
    }

    if (!label || IGNORE_LINE_REGEX.test(label) || TAX_ONLY_REGEX.test(label)) {
      continue;
    }

    const category = categorizeWorksheetLine(label);
    index += 1;
    items.push({
      id: `parsed-${index}-${category}`,
      name: label,
      category,
      amount: Math.round(amount * 100) / 100,
    });
  }

  return items;
}
