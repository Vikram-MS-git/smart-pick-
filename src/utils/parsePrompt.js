// Naive keyword parser used to prefill the recommendation form from the
// free-text hero prompt. This stands in for real NLP/AI parsing, which
// can replace this function later without touching the calling page.

// Order matters: Earphones must be checked before Mobile, because "earphones"
// and "headphones" both contain the substring "phone".
const categoryKeywords = {
  Laptop: ["laptop", "notebook"],
  Earphones: ["earphone", "earbud", "headphone", "tws"],
  Mobile: ["mobile", "phone", "smartphone"],
  PC: ["pc", "desktop", "build"],
};

const usageKeywords = ["Gaming", "Coding", "Office", "Editing", "Music"];
const priorityKeywords = ["Performance", "Camera", "Battery", "Display", "Sound"];

export function parsePrompt(text = "") {
  const lower = text.toLowerCase();
  const result = { category: "", budget: "", usage: "", priority: "" };

  for (const [cat, words] of Object.entries(categoryKeywords)) {
    if (words.some((w) => lower.includes(w))) {
      result.category = cat;
      break;
    }
  }

  const budgetMatch = lower.match(/(?:under|below|around|₹|rs\.?)\s*([\d,]{3,7})/);
  if (budgetMatch) {
    result.budget = budgetMatch[1].replace(/,/g, "");
  }

  const usageHit = usageKeywords.find((w) => lower.includes(w.toLowerCase()));
  if (usageHit) result.usage = usageHit;

  const priorityHit = priorityKeywords.find((w) => lower.includes(w.toLowerCase()));
  if (priorityHit) result.priority = priorityHit;

  return result;
}
