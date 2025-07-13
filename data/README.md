## Database

Data is sourced from PokeAPI: https://github.com/PokeAPI/pokeapi

PokeAPI releases now dump the database into pgsql/sqlite dumps and you can grab the sqlite file that contains all of the pokeapi data. However, pokeapi doesn't cut releases all that often, so I [forked the repo](https://github.com/gksander/pokeapi) and added a `Build` workflow so I could expose the database. Hopefully this is a temporary thing, but as of now – need to keep this manually synced up with upstream.

### Database massaging

There's some database massaging I had to do to make Prisma happy. Prisma (as of today) doesn't support boolean fields in SQLite so there's some massaging done in the `yarn db:massageRawData` script to convert boolean -> int.

## Data syncing

TODO: fill out details about GHA workflow that syncs data.

## Trading Card Game data

Trading card game data is sourced from [pokemon-tcg-data](https://github.com/PokemonTCG/pokemon-tcg-data). Run

```sh
node ./scripts/pull-cards.ts
```

to pull that data from github and insert it into the sqlite database.

## DB introspection

Run `yarn db:pull` to do a Prisma introspection and generate a prisma schema from the sqlite schema.

Then run `yarn db:generate` to generate the prisma client. Now you're ready to crush some code.
