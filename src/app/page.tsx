import { PageTitle } from "@/components/PageTitle";
import { PokemonListPage } from "@/components/PokemonListPage";

export default async function Home() {
  return (
    <PokemonListPage pageNum={1}>
      <PageTitle className="mb-16">Pokemon</PageTitle>
    </PokemonListPage>
  );
}
