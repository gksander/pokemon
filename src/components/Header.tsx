"use client";

import { AppLink } from "@/components/AppLink";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { Pokeball } from "@/components/Pokeball";
import { TypeIcon } from "@/components/TypeIcon";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { TYPE_COLORS } from "@/consts";
import { URLS } from "@/urls";
import type { PokemonSearchItem, TypeSearchItem } from "@/utils/search";
import { Layers2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type { PropsWithChildren } from "react";
import * as React from "react";
type Props = {
  allPokemon: PokemonSearchItem[];
  allTypes: TypeSearchItem[];
};

export function Header({ allPokemon, allTypes }: Props) {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const router = useRouter();

  // Open on cmd+k
  React.useEffect(() => {
    const controller = new AbortController();
    document.addEventListener(
      "keydown",
      (event) => {
        if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
          event.preventDefault();
          setIsSearchOpen((open) => !open);
        }
      },
      {
        signal: controller.signal,
      },
    );

    return function cleanup() {
      controller.abort();
    };
  }, []);

  return (
    <React.Fragment>
      <Button asChild>
        <AppLink href={URLS.home()}>
          <Pokeball className="w-4 h-4" />
          <span className="hidden sm:block">Pokémon</span>
        </AppLink>
      </Button>

      <div className="flex gap-2 flex-grow justify-end">
        <Button
          className="text-sm text-foreground/75 w-full sm:w-48 justify-between"
          onClick={() => setIsSearchOpen(true)}
        >
          <span>Search...</span>
          <kbd className="font-mono text-xs items-center gap-0.5 rounded-sm py-0.5 px-1 hidden sm:inline-flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>More</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="w-[240px]">
                  <LinkItem href={URLS.types()} title="Types">
                    Learn more about Pokemon types
                  </LinkItem>
                  <LinkItem href={URLS.moves()} title="Moves">
                    Learn more about Pokemon moves
                  </LinkItem>
                  <LinkItem href={URLS.about()} title="About">
                    Learn about this was built
                  </LinkItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <CommandDialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <CommandInput placeholder="Type a command or search..." />

        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Types">
            <CommandItem
              onSelect={() => {
                navigateTo(URLS.types());
              }}
            >
              <Layers2 className="w-4 h-4" />
              <span>All types</span>
            </CommandItem>
            {allTypes.map((pokeType) => (
              <CommandItem
                key={pokeType.name}
                onSelect={() => {
                  navigateTo(URLS.typeDetail({ name: pokeType.name }));
                }}
                className="flex gap-3"
              >
                {/* @ts-expect-error this is fine */}
                <span style={{ "--type-color": TYPE_COLORS[pokeType.name] }}>
                  <TypeIcon
                    name={pokeType.name}
                    className="w-6 h-6 text-[var(--type-color)]"
                  />
                </span>
                <span>{pokeType.display}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading="Pokemon">
            {allPokemon.map((pokemon) => {
              return (
                <CommandItem
                  key={pokemon.name}
                  onSelect={() => {
                    navigateTo(URLS.pokemonDetail({ name: pokemon.name }));
                  }}
                  className="flex gap-3"
                >
                  <ImageWithFallback
                    src={`/img/pokemon/${pokemon.name}.avif`}
                    alt={pokemon.display}
                    loading="lazy"
                    className="w-6 h-6 object-center object-contain"
                  />
                  <span>
                    {pokemon.display}{" "}
                    {pokemon.suffix && (
                      <span className="text-muted-foreground">
                        {pokemon.suffix}
                      </span>
                    )}
                  </span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </React.Fragment>
  );

  function navigateTo(url: string) {
    setIsSearchOpen(false);
    router.push(url);
  }
}

function LinkItem({
  href,
  onClick,
  title,
  children,
}: PropsWithChildren<{ href?: string; onClick?: () => void; title: string }>) {
  return (
    <li>
      <NavigationMenuLink href={href} onClick={onClick}>
        <div className="font-medium">{title}</div>
        <div className="text-gray-700">{children}</div>
      </NavigationMenuLink>
    </li>
  );
}
