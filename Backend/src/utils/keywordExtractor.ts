const STOP_WORDS = [
  'a','an','the','and','or','but','in','on','at','to','for',
  'of','with','by','from','as','is','was','are','were','be',
  'been','being','have','has','had','do','does','did','will',
  'would','could','should','may','might','can','shall','not',
  'no','nor','so','if','than','that','this','these','those',
  'it','its','i','me','my','we','our','you','your','he','she',
  'they','them','their','what','which','who','whom','when',
  'where','why','how','all','each','every','both','few','more',
  'most','other','some','such','only','own','same','here',
  'there','about','just','also','very','too','really','much',
  'still','well','back','over','after','into','through','during',
  'before','between','under','again','further','once','then',
  'than','now','up','out','off','down','like','get','got','one',
  'two','go','went','see','know','think','make','take','come',
  'want','use','find','tell','ask','try','leave','call','give',
  'put','set','let',
];

const TECHNICAL_TERMS = [
  'react','node','javascript','typescript','python','java','go',
  'rust','docker','kubernetes','aws','azure','gcp','api','rest',
  'graphql','sql','nosql','mongodb','postgres','mysql','redis',
  'css','html','frontend','backend','fullstack','devops','ml','ai',
  'machine','learning','deep','neural','data','blockchain','web3',
  'nft','cloud','serverless','microservices','agile','scrum',
  'kotlin','swift','flutter','reactnative','expo','nextjs','vue',
  'angular','svelte','tailwind','sass','less','redux','zustand',
  'tanstack','query','prisma','compose','ci','cd','github',
  'actions','gitlab','figma','sketch','adobe','ui','ux','design',
  'prototype','saas','startup','founder','venture','capital','pitch',
  'growth','marketing','seo','product','manager','leadership',
  'remote','hybrid','onsite','workshop','hackathon','conference',
  'meetup','webinar','bootcamp','tutorial','course','certification',
];

const stopWordsSet = new Set(STOP_WORDS);
const technicalTermsSet = new Set(TECHNICAL_TERMS);

export function extractKeywords(text: string | null | undefined): string[] {
  if (!text || typeof text !== 'string') return [];

  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s#+]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2);

  const keywords: string[] = [];

  for (const word of words) {
    if (technicalTermsSet.has(word)) {
      keywords.push(word);
    } else if (word.startsWith('#')) {
      keywords.push(word.slice(1));
    } else if (!stopWordsSet.has(word) && word.length >= 4) {
      keywords.push(word);
    }
  }

  return [...new Set(keywords)];
}

export function buildKeywordProfile(allTexts: string[]): Record<string, number> {
  const freq: Record<string, number> = {};
  for (const text of allTexts) {
    const keywords = extractKeywords(text);
    for (const kw of keywords) {
      freq[kw] = (freq[kw] || 0) + 1;
    }
  }

  const values = Object.values(freq);
  const maxFreq = values.length > 0 ? Math.max(...values, 1) : 1;
  const profile: Record<string, number> = {};
  for (const [word, count] of Object.entries(freq)) {
    profile[word] = count / maxFreq;
  }
  return profile;
}

export function computeKeywordSimilarity(
  userProfile: Record<string, number> | null | undefined,
  eventKeywords: string[] | null | undefined
): number {
  if (!userProfile || Object.keys(userProfile).length === 0) return 0;
  if (!eventKeywords || eventKeywords.length === 0) return 0;

  let dotProduct = 0;
  let userMagnitude = 0;
  let eventMagnitude = 0;

  for (const [word, weight] of Object.entries(userProfile)) {
    userMagnitude += weight * weight;
    if (eventKeywords.includes(word)) {
      dotProduct += weight;
    }
  }

  eventMagnitude = eventKeywords.length;
  userMagnitude = Math.sqrt(userMagnitude);
  eventMagnitude = Math.sqrt(eventMagnitude);

  if (userMagnitude === 0 || eventMagnitude === 0) return 0;

  return dotProduct / (userMagnitude * eventMagnitude);
}
