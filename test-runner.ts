import fs from 'fs';
import { normalizeText } from './server/text-extract.js';
import { analyzePolicyMasterPrompt } from './server/gemini.js';
import { validatePolicy } from './server/validator.js';
import pdfParse from 'pdf-parse';

async function test() {
  console.log('1. Reading PDF...');
  const dataBuffer = fs.readFileSync('LIC_Jeevan_Shagun_front_r.pdf');
  const pdfData = await pdfParse(dataBuffer);
  const text = normalizeText(pdfData.text);
  console.log(`Extracted text length: ${text.length}`);

  console.log('2. Hitting Gemini with Master Prompt...');
  try {
    const analysis = await analyzePolicyMasterPrompt({
      rawText: text,
      provider: 'LIC',
      policyName: 'Jeevan Shagun',
    });
    console.log('3. Validating response schema...');
    validatePolicy(analysis);
    console.log('SUCCESS! Output payload:', JSON.stringify(analysis, null, 2));
  } catch (err: any) {
    console.error('ERROR during extraction or validation:', err);
  }
}

test();
