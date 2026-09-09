// src/utils/voiceTransactionParser.js
import {  CATEGORIES,
  INCOME_TYPE_WORDS,
  EXPENSE_TYPE_WORDS,
  INCOME_LEANING_CATEGORIES, } from '../components/categories';


const STOPWORDS = new Set([
  'for', 'on', 'from', 'of', 'the', 'a', 'an', 'to', 'my', 'and',
  'naira', 'ngn', 'add', 'transaction', 'expense', 'income',
]);

const AMOUNT_REGEX = /\d[\d,]*(\.\d+)?/;

function extractAmount(text) {
  const match = text.match(AMOUNT_REGEX);
  if (!match) return { amount: null, matchedToken: null };
  const amount = parseFloat(match[0].replace(/,/g, ''));
  return { amount: isNaN(amount) ? null : amount, matchedToken: match[0] };
}

function detectType(lowerText) {
  if (INCOME_TYPE_WORDS.some((w) => lowerText.includes(w))) return 'income';
  if (EXPENSE_TYPE_WORDS.some((w) => lowerText.includes(w))) return 'expense';
  return null; // decided later, once category is known
}

function detectCategory(lowerText) {
  for (const cat of CATEGORIES) {
    if (cat.key === 'other') continue;
    const hit = cat.keywords.find((kw) => lowerText.includes(kw));
    if (hit) return { key: cat.key, matchedToken: hit };
  }
  return { key: 'other', matchedToken: null };
}

function buildDescription(rawText, tokensToStrip) {
  const words = rawText.split(/\s+/);
  const stripSet = new Set(
    tokensToStrip
      .filter(Boolean)
      .flatMap((t) => t.toLowerCase().split(/\s+/))
  );

  const remaining = words.filter((w) => {
    const clean = w.toLowerCase().replace(/[.,!?]/g, '');
    return !stripSet.has(clean) && !STOPWORDS.has(clean);
  });

  const description = remaining.join(' ').trim();
  return description.charAt(0).toUpperCase() + description.slice(1);
}

// Turns "income salary 30000" into a structured, editable draft.
export function parseVoiceTransaction(rawTranscript) {
  const text = rawTranscript.trim();
  const lowerText = text.toLowerCase();

  const { amount, matchedToken: amountToken } = extractAmount(text);
  const { key: categoryKey, matchedToken: categoryToken } = detectCategory(lowerText);

  let type = detectType(lowerText);
  if (!type) {
    type = INCOME_LEANING_CATEGORIES.includes(categoryKey) ? 'income' : 'expense';
  }

  const matchedTypeWord =
    [...INCOME_TYPE_WORDS, ...EXPENSE_TYPE_WORDS].find((w) => lowerText.includes(w)) || null;

  const description = buildDescription(text, [amountToken, categoryToken, matchedTypeWord]);

  const category = CATEGORIES.find((c) => c.key === categoryKey);

  return {
    amount,
    type,
    category: categoryKey,
    categoryLabel: category?.label ?? 'Other',
    description,
    rawTranscript: text,
    // If we couldn't find an amount at all, the parse isn't usable — force review.
    needsReview: amount === null,
  };
}