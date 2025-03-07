import colors from "@/generated/pokemonColors.json";

export function getPokemonColors(name: string): Palette {
  return colors[name as unknown as keyof typeof colors] ?? {};
}

type Palette = {
  lightVibrant?: string | null;
  // darkVibrant?: string | null;
  // vibrant?: string | null;
  // lightMuted?: string | null;
  // darkMuted?: string | null;
  // muted?: string | null;
};
