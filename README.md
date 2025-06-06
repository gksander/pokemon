## Some random guy's pokemon website

![Sample of the site](https://raw.githubusercontent.com/gksander/pokemon/refs/heads/main/docs/img/sample.png)

I built this for my kids and to have fun. The gist:

- PokeAPI data is available as a sqlite file and you can use Prisma to introspect the data and generate a type-safe client. Very cool.
- Built out type list/detail pages, and pokemon list/detail pages.
- Using Next.js in export mode to genearte a static site, leveraging server components to write nasty queries inside of components.
- Simple manifest file to turn this thing into a PWA.
- Some very hacky scraping to get images from bulbapedia.
- Use pokemon-tcg-data repo to get TCG data and insert into database.
- Using shadcn/UI for the hard UI stuff.

## Obligatory disclaimer

I claim no intellectual rights to any of the data or imagery used to build this site. I'm in no way affiliated with Pokemon company. There are no commercial intents here, simply building something cool around something I like (Pokemon).

## TODO

- [ ] Better suspense fallbacks for moves/cards

## Things I might build

- [ ] OG images
- [ ] Weight/height/gender etc
- [ ] Catching data: catch rates, locations, etc.
