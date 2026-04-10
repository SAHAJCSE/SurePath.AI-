import pdfParse from 'pdf-parse';

export async function extractTextFromUpload(file: Express.Multer.File): Promise<string> {
  const mime = file.mimetype || '';

  if (mime === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
    const parsed = await pdfParse(file.buffer);
    return normalizeText(parsed.text || '');
  }

  // Text-like uploads
  const raw = file.buffer.toString('utf-8');
  return normalizeText(raw);
}

export function normalizeText(text: string) {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

