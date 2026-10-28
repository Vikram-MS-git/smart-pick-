import { getProductsByCategory } from "../data/products";

// Simulates an AI recommendation pass over the mock catalog.
// Scores products against the submitted requirement form, then buckets
// the top matches into "Best Overall / Best Value / Best Performance".
// This is intentionally simple and deterministic so it can be swapped
// for a real model call later without changing the page that uses it.

export function generateRecommendations({ category, budget, usage, priority }) {
  const pool = getProductsByCategory(category);
  const numericBudget = Number(budget) || Infinity;

  const scored = pool.map((product) => {
    let score = product.aiMatch;

    if (product.price <= numericBudget) score += 6;
    else score -= Math.min(30, Math.round(((product.price - numericBudget) / numericBudget) * 40));

    if (usage && product.tags.includes(usage)) score += 8;
    if (priority && product.tags.includes(priority)) score += 6;

    return { ...product, computedMatch: Math.max(35, Math.min(99, Math.round(score))) };
  });

  scored.sort((a, b) => b.computedMatch - a.computedMatch);

  // Respect the budget: recommend only what the user can afford when at least
  // three products fit it. Otherwise fall back to the full list so a very low
  // budget still returns something instead of an empty result.
  const affordable = scored.filter((p) => p.price <= numericBudget);
  const candidates = affordable.length >= 3 ? affordable : scored;
  const top = candidates.slice(0, Math.max(3, Math.min(6, candidates.length)));

  const bestOverall = [...top].sort((a, b) => b.computedMatch - a.computedMatch)[0];
  const bestValue = [...top].sort((a, b) => a.price - b.price)[0];
  const bestPerformance =
    [...top].sort((a, b) => b.price - a.price).find((p) => p.id !== bestOverall.id) || top[0];

  return {
    all: top,
    bestOverall,
    bestValue,
    bestPerformance,
  };
}
