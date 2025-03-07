import { PageTitle } from "@/components/PageTitle";
import { TypeBadge } from "@/components/TypeBadge";
import { ENGLISH_LANG_ID, MAX_TYPE_ID } from "@/consts";
import { db } from "@/db";

export default async function TypeListingPage() {
  const allTypes = await db.pokemon_v2_type.findMany({
    where: {
      id: {
        lte: MAX_TYPE_ID,
      },
    },
    include: {
      pokemon_v2_typename: {
        where: {
          language_id: {
            equals: ENGLISH_LANG_ID,
          },
        },
      },
    },
  });

  return (
    <div className="flex flex-col gap-16">
      <PageTitle>Types</PageTitle>

      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {allTypes.map((pokeType) => (
          <li key={pokeType.id}>
            <TypeBadge
              name={pokeType.name}
              displayName={pokeType.pokemon_v2_typename[0].name}
              variant="square"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
