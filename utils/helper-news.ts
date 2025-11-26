import { News } from "@/types/admin/news";

const asRecord = (v: unknown): Record<string, unknown> | null =>
  typeof v === "object" && v !== null ? (v as Record<string, unknown>) : null;

const extractNameFromPossibleValue = (val: unknown): string[] => {
  // Accepts: string, { name: string }, array of strings or objects with name
  if (val == null) return [];

  if (typeof val === "string") {
    return [val];
  }

  if (Array.isArray(val)) {
    const out: string[] = [];
    for (const el of val) {
      if (typeof el === "string") out.push(el);
      else {
        const rec = asRecord(el);
        if (rec && typeof rec.name === "string") out.push(rec.name);
      }
    }
    return out;
  }

  const rec = asRecord(val);
  if (rec && typeof rec.name === "string") return [rec.name];

  return [];
};

export const extractCategoryNamesFromArticle = (article: News): string[] => {
  const rec = asRecord(article);
  if (!rec) return [];

  // Try multiple common fields defensively
  const candidates: unknown[] = [
    rec["category"],
    rec["categories"],
    rec["category_name"],
    rec["tags"],
    rec["tag"],
    rec["tags_list"],
  ];

  const names = new Set<string>();

  for (const c of candidates) {
    for (const n of extractNameFromPossibleValue(c)) {
      if (n && n.trim()) names.add(n.trim());
    }
  }

  // fallback: if no explicit category found, maybe use first word of title
  if (names.size === 0) {
    const title =
      typeof rec["title"] === "string" ? String(rec["title"]).trim() : "";
    if (title) {
      const firstWord = title.split(/\s+/)[0];
      if (firstWord) names.add(firstWord);
    }
  }

  return Array.from(names);
};
