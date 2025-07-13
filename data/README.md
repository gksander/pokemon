## The data

Data for this site is sourced from two primary places:

- Pokemon data from [PokeAPI](https://github.com/PokeAPI/pokeapi)
- Trading Card Game data from [pokemon-tcg-data](https://github.com/PokemonTCG/pokemon-tcg-data)

PokeAPI releases now dump the database into pgsql/sqlite dumps and you can grab the sqlite file that contains all of the pokeapi data. However, pokeapi doesn't cut releases all that often, so I [forked the repo](https://github.com/gksander/pokeapi) and added a `Build` workflow so I could expose the database. Hopefully this is a temporary thing, but as of now – need to keep this manually synced up with upstream.

## Syncing data

There's a workflow file at `.github/workflows/refresh-data.yml` that syncs the data from the two main sources (and does a little bit of database massaging in between). This can be run manually from GitHub Actions to pull in the latest data.

### Database massaging

There's some database massaging I had to do to make Prisma happy. Prisma (as of today) doesn't support boolean fields in SQLite so there's some massaging done in the `yarn db:massageRawData` script to convert boolean -> int.

## DB introspection

Prisma handles introspecting the database schema and generating a client for us to use in code.

Run `yarn db:pull` to do a Prisma introspection and generate a prisma schema from the sqlite schema.

Then run `yarn db:generate` to generate the prisma client. Now you're ready to crush some code.
