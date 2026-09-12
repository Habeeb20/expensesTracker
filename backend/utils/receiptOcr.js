import axios from 'axios';
import FormData from 'form-data';

const OCR_SPACE_API_KEY = process.env.OCR_SPACE_API_KEY;

export const extractTextFromImage = async (imageBuffer, filename = 'receipt.jpg') => {
  const form = new FormData();
  form.append('file', imageBuffer, filename);
  form.append('apikey', OCR_SPACE_API_KEY);
  form.append('language', 'eng');
  form.append('OCREngine', '2'); // engine 2 is better with numbers/receipts
  form.append('scale', 'true');
  form.append('detectOrientation', 'true');

  const { data } = await axios.post('https://apipro1.ocr.space/parse/image', form, {
    headers: form.getHeaders(),
    timeout: 20000,
  });

  if (data?.IsErroredOnProcessing) {
    throw new Error(data?.ErrorMessage?.[0] || 'OCR failed to process the image');
  }

  const rawText = data?.ParsedResults?.[0]?.ParsedText || '';
  return rawText;
};

// Pulls out plausible money figures from raw OCR text and filters out
// obvious non-amounts (dates, phone numbers, long reference codes).
export const extractFigures = (rawText) => {
  // Matches things like: 4,000  500000  ₦900  1,250.50  N2,000
  const matches = rawText.match(/[₦N]?\s?\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?|\b\d{2,7}(?:\.\d{1,2})?\b/g) || [];

  const seen = new Set();
  const figures = [];

  for (const raw of matches) {
    const cleaned = raw.replace(/[₦N,\s]/g, '');
    const num = parseFloat(cleaned);

    if (!num || isNaN(num)) continue;
    if (num < 10) continue;              // too small to be a real amount, likely a qty/line number
    if (num > 50_000_000) continue;      // implausibly large, likely a misread
    if (/^\d{2}\/\d{2}(\/\d{2,4})?$/.test(raw)) continue; // date-like, e.g. 12/09
    if (cleaned.length >= 10) continue;  // phone numbers / long codes

    if (!seen.has(num)) {
      seen.add(num);
      figures.push(num);
    }
  }

  return figures.sort((a, b) => b - a); // largest first, usually the total
};