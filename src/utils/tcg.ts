export const TCG_ASPECT_CLASS = "aspect-[25/35] object-contain object-center";

/**
 * This is just made up. Attempt to bubble "most rare" (or coolest) cards to the top.
 */
const TCG_RARITY_ORDER = [
  "Rare Holo EX",
  "Rare ACE",
  "Rare Holo V",
  "Rare Holo VMAX",
  "Classic Collection",
  "Rare Holo LV.X",
  "Rare Holo Star",
  "Rare Prime",
  "LEGEND",
  "Rare Shining",
  "Radiant Rare",
  "Rare Holo VSTAR",
  "Rare Rainbow",
  "Rare Holo GX",
  "Rare Prism Star",
  "Rare Shiny",
  "Rare Shiny GX",
  "Double Rare",
  "Illustration Rare",
  "Ultra Rare",
  "Rare Ultra",
  "Special Illustration Rare",
  "Hyper Rare",
  "Shiny Rare",
  "Shiny Ultra Rare",
  "ACE SPEC Rare",
  "Amazing Rare",
  "Rare BREAK",
  "Rare Holo",
  "Trainer Gallery Rare Holo",
  "Rare Secret",
  "Rare",
  "Promo",
  "Uncommon",
  "Common",
];

type TcgCardSlim = {
  rarity: string | null;
  number: number | null;
  subtypes: string | null;
  supertype: string | null;
};

export function sortTcgCardByBadassness(
  a: TcgCardSlim,
  b: TcgCardSlim,
): number {
  const rarityA = a.rarity ?? "Unknown";
  const rarityB = b.rarity ?? "Unknown";
  const isSupporterA = /supporter/i.test(a.subtypes ?? "");
  const isSupporterB = /supporter/i.test(b.subtypes ?? "");

  const indexA = TCG_RARITY_ORDER.indexOf(rarityA);
  const indexB = TCG_RARITY_ORDER.indexOf(rarityB);

  if (indexA === -1) return 1; // Unknown rarity goes to the end
  if (indexB === -1) return -1; // Unknown rarity goes to the end

  if (indexA !== indexB) {
    return indexA - indexB;
  }

  // If one is a supporter and the other is not, prioritize the non-supporter
  if (isSupporterA && !isSupporterB) return 1;
  if (!isSupporterA && isSupporterB) return -1;

  // If rarities are the same, deprioritize Energy supertypes
  if (a.supertype === "Energy" && b.supertype !== "Energy") return 1;
  if (a.supertype !== "Energy" && b.supertype === "Energy") return -1;

  // If rarities are the same, sort by number
  return (a.number ?? Infinity) - (b.number ?? Infinity);
}

/**
 * "Tag" a card based on rarity and subtypes. We'll omit some "boring" subtypes and rarities.
 */
export function getTcgCardTags(card: TcgCardSlim): string[] {
  const tags: string[] = ["All cards"];

  if (card.rarity && !/^common$/i.test(card.rarity)) {
    tags.push(
      card.rarity === "Rare" ? "Rare" : card.rarity.replace(/rare/i, "").trim(),
    );
  }

  if (card.subtypes) {
    tags.push(
      ...card.subtypes
        .split(",")
        .filter((subtype) => !SUBTYPES_EXCLUDED_FROM_TAGS.includes(subtype))
        .map((s) => s.trim()),
    );
  }

  if (/(ancient|future)/i.test(card.subtypes ?? "")) {
    tags.push("Paradox");
  }

  return tags;
}

const SUBTYPES_EXCLUDED_FROM_TAGS = [
  "Basic",
  "Stage 1",
  "Stage 2",
  "Supporter",
  // These will get grouped into Paradox
  "Future",
  "Ancient",
];
