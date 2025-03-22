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
