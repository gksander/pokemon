import { AppLink } from "@/components/AppLink";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { URLS } from "@/urls";

type Props = {
  title: string;
  pokemonName: string;
  description?: string;
};

export function SlimPokemonCard({ title, pokemonName, description }: Props) {
  return (
    <AppLink
      className="flex gap-2 items-center rounded drop-border-xs interactive p-2 h-16 bg-card-background"
      href={URLS.pokemonDetail({
        name: pokemonName,
      })}
    >
      <ImageWithFallback
        src={`/img/pokemon/${pokemonName}.avif`}
        alt={pokemonName}
        className="w-8 h-8"
      />
      <div className="overflow-hidden leading-none">
        <div className="truncate font-medium">{title}</div>
        {description && (
          <div className="text-sm text-muted-foreground truncate">
            {description}
          </div>
        )}
      </div>
    </AppLink>
  );
}
