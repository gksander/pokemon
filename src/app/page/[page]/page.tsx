import { PokemonListPage } from "@/components/PokemonListPage";
import { PAGE_SIZE } from "@/consts";
import { db } from "@/db";

export default async function PokemonListPaginatedPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;

  return <PokemonListPage pageNum={Number(page)} />;
}

export async function generateStaticParams() {
  const numPokemon = await db.pokemon_v2_pokemonspecies.count();
  const numPages = Math.ceil(numPokemon / PAGE_SIZE);

  return Array.from({ length: numPages }, (_, i) => ({
    page: (i + 1).toString(),
  }));
}
