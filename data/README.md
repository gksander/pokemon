## Database

Data is sourced from PokeAPI: https://github.com/PokeAPI/pokeapi

PokeAPI releases now dump the database into pgsql/sqlite dumps and you can grab the sqlite file that contains all of the pokeapi data. Drop that bad boy in `./data/pokeapi.sqlite3`.

Prisma doesn't support `bool` fields at the time of this writing, so I've been manually turning `bool` fields into `int` fields in JetBrains, but need to automate that.

## Trading Card Game data

Trading card game data is sourced from [pokemon-tcg-data](https://github.com/PokemonTCG/pokemon-tcg-data). Run

```sh
node ./scripts/pull-cards.ts
```

to pull that data from github and insert it into the sqlite database.

## DB introspection

Run `yarn db:pull` to do a Prisma introspection and generate a prisma schema from the sqlite schema.

Then run `yarn db:generate` to generate the prisma client. Now you're ready to crush some code.
