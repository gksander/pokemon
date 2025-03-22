export const URLS = {
  home: () => `/`,
  about: () => `/about`,
  types: () => `/types`,
  moves: () => `/moves`,
  moveDetail: ({ name }: { name: string }) => `/moves/${name}`,
  pokemonListingPage: ({ page }: { page: number }) => `/page/${page}`,
  typeDetail: ({ name }: { name: string }) => `/types/${name}`,
  pokemonDetail: ({ name }: { name: string }) => `/pokemon/${name}`,
  cards: () => `/cards`,
} as const;
