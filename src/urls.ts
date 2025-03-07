export const URLS = {
  home: () => `/`,
  about: () => `/about`,
  types: () => `/types`,
  pokemonListingPage: ({ page }: { page: number }) => `/page/${page}`,
  typeDetail: ({ name }: { name: string }) => `/types/${name}`,
  pokemonDetail: ({ name }: { name: string }) => `/pokemon/${name}`,
} as const;
