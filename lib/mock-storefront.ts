export type StorefrontNavLink = {
  href: string
  label: string
  items?: StorefrontNavLink[]
}

export type StorefrontBrand = {
  mark: string
  name: string
  tagline: string
}

export type StorefrontNavbarData = {
  brand: StorefrontBrand
  links: StorefrontNavLink[]
  searchPlaceholder: string
  cartLabel: string
  cartCount: number
}

export type StorefrontCategoryChip = {
  href: string
  label: string
}

export type TrendingStorefrontItem = {
  id: string
  category: string
  name: string
  description: string
  price: string
  imageSrc: string
}

export const storefrontNavbarData: StorefrontNavbarData = {
  brand: {
    mark: "MS",
    name: "The Mega Store",
    tagline: "Baking Supply Co.",
  },
  links: [
    {
      href: "/products",
      label: "Products",
      items: [
        { href: "/products/tools", label: "Tools" },
        { href: "/products/fondants", label: "Fondants" },
        { href: "/products/cake-boards", label: "Cake Boards" },
        { href: "/products/decorations", label: "Decorations" },
      ],
    },
    { href: "/contact-us", label: "Contact Us" },
  ],
  searchPlaceholder: "Search products, tools, decorations...",
  cartLabel: "Cart",
  cartCount: 2,
}

export const storefrontCategoryChips: StorefrontCategoryChip[] = [
  { href: "/products/tools", label: "Tools" },
  { href: "/products/fondants", label: "Fondants" },
  { href: "/products/cake-boards", label: "Cake Boards" },
  { href: "/products/decorations", label: "Decorations" },
  { href: "/products/packaging", label: "Packaging" },
  { href: "/products/edible-colour", label: "Edible Colour" },
  { href: "/products/sprinkles", label: "Sprinkles" },
  { href: "/products/baking-basics", label: "Baking Basics" },
]

export const trendingStorefrontItems: TrendingStorefrontItem[] = [
  {
    id: "angled-scraper-set",
    category: "Tools",
    name: "Angled Scraper Set",
    description: "Sharp edges for smoother buttercream finishes.",
    price: "P189",
    imageSrc:
      "https://images.unsplash.com/photo-1760445528772-01c57126f275?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "rolled-fondant-ivory",
    category: "Fondants",
    name: "Rolled Fondant Ivory",
    description: "Soft stretch and clean coverage for celebration cakes.",
    price: "P129",
    imageSrc: "https://images.unsplash.com/photo-1582180834946-f3d376b18376?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "signature-cake-board-pack",
    category: "Presentation",
    name: "Signature Cake Board Pack",
    description: "Rigid boards with a satin finish for polished handoff.",
    price: "P149",
    imageSrc: "/trending/signature-cake-board-pack.svg",
  },
  {
    id: "piping-nozzle-collection",
    category: "Decorating",
    name: "Piping Nozzle Collection",
    description: "Star, petal, and round tips for crisp decorative work.",
    price: "P219",
    imageSrc: "/trending/piping-nozzle-collection.svg",
  },
  {
    id: "edible-lustre-duo",
    category: "Finishing",
    name: "Edible Lustre Duo",
    description: "Gold and pearl highlights for premium final touches.",
    price: "P99",
    imageSrc: "/trending/edible-lustre-duo.svg",
  },
  {
    id: "turntable-starter-kit",
    category: "Tools",
    name: "Turntable Starter Kit",
    description: "A stable spin base with the essentials for cleaner icing.",
    price: "P349",
    imageSrc: "/trending/turntable-starter-kit.svg",
  },
  {
    id: "ombre-sprinkle-tin",
    category: "Decorations",
    name: "Ombre Sprinkle Tin",
    description: "Layered colour blends to brighten cupcakes and cookies.",
    price: "P79",
    imageSrc: "/trending/ombre-sprinkle-tin.svg",
  },
  {
    id: "celebration-ribbon-bundle",
    category: "Presentation",
    name: "Celebration Ribbon Bundle",
    description: "Texture-rich trims for boxes, boards, and final wrap-up.",
    price: "P109",
    imageSrc: "/trending/celebration-ribbon-bundle.svg",
  },
]
