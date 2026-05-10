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

export type StorefrontCategoryChipIconKey =
  | "tools"
  | "fondants"
  | "boards"
  | "decorations"
  | "packaging"
  | "colour"
  | "sprinkles"
  | "basics"

export type StorefrontCategoryChip = {
  href: string
  label: string
  icon: StorefrontCategoryChipIconKey
}

export type TrendingStorefrontItem = {
  id: string
  category: string
  name: string
  description: string
  price: string
  unitPrice: number
  stock: number
  imageSrc: string
}

export type StorefrontProduct = {
  id: string
  slug: string
  name: string
  category: string
  categorySlug: string
  description: string
  price: string
  unitPrice: number
  stock: number
  badge: string
  finish: string
  imageSrc: string
  searchTerms: string[]
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
  { href: "/products?category=Tools", label: "Tools", icon: "tools" },
  {
    href: "/products?category=Fondants",
    label: "Fondants",
    icon: "fondants",
  },
  {
    href: "/products?category=Cake+Boards",
    label: "Cake Boards",
    icon: "boards",
  },
  {
    href: "/products?category=Decorations",
    label: "Decorations",
    icon: "decorations",
  },
  {
    href: "/products?category=Packaging",
    label: "Packaging",
    icon: "packaging",
  },
  {
    href: "/products?category=Edible+Colour",
    label: "Edible Colour",
    icon: "colour",
  },
  {
    href: "/products?category=Sprinkles",
    label: "Sprinkles",
    icon: "sprinkles",
  },
  {
    href: "/products?category=Baking+Basics",
    label: "Baking Basics",
    icon: "basics",
  },
]

export const trendingStorefrontItems: TrendingStorefrontItem[] = [
  {
    id: "angled-scraper-set",
    category: "Tools",
    name: "Angled Scraper Set",
    description: "Sharp edges for smoother buttercream finishes.",
    price: "P189",
    unitPrice: 189,
    stock: 12,
    imageSrc:
      "https://images.unsplash.com/photo-1760445528772-01c57126f275?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "rolled-fondant-ivory",
    category: "Fondants",
    name: "Rolled Fondant Ivory",
    description: "Soft stretch and clean coverage for celebration cakes.",
    price: "P129",
    unitPrice: 129,
    stock: 18,
    imageSrc: "https://images.unsplash.com/photo-1582180834946-f3d376b18376?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "signature-cake-board-pack",
    category: "Presentation",
    name: "Signature Cake Board Pack",
    description: "Rigid boards with a satin finish for polished handoff.",
    price: "P149",
    unitPrice: 149,
    stock: 10,
    imageSrc: "/trending/signature-cake-board-pack.svg",
  },
  {
    id: "piping-nozzle-collection",
    category: "Decorating",
    name: "Piping Nozzle Collection",
    description: "Star, petal, and round tips for crisp decorative work.",
    price: "P219",
    unitPrice: 219,
    stock: 7,
    imageSrc: "/trending/piping-nozzle-collection.svg",
  },
  {
    id: "edible-lustre-duo",
    category: "Finishing",
    name: "Edible Lustre Duo",
    description: "Gold and pearl highlights for premium final touches.",
    price: "P99",
    unitPrice: 99,
    stock: 14,
    imageSrc: "/trending/edible-lustre-duo.svg",
  },
  {
    id: "turntable-starter-kit",
    category: "Tools",
    name: "Turntable Starter Kit",
    description: "A stable spin base with the essentials for cleaner icing.",
    price: "P349",
    unitPrice: 349,
    stock: 5,
    imageSrc: "/trending/turntable-starter-kit.svg",
  },
  {
    id: "ombre-sprinkle-tin",
    category: "Decorations",
    name: "Ombre Sprinkle Tin",
    description: "Layered colour blends to brighten cupcakes and cookies.",
    price: "P79",
    unitPrice: 79,
    stock: 16,
    imageSrc: "/trending/ombre-sprinkle-tin.svg",
  },
  {
    id: "celebration-ribbon-bundle",
    category: "Presentation",
    name: "Celebration Ribbon Bundle",
    description: "Texture-rich trims for boxes, boards, and final wrap-up.",
    price: "P109",
    unitPrice: 109,
    stock: 11,
    imageSrc: "/trending/celebration-ribbon-bundle.svg",
  },
]

export const storefrontProducts: StorefrontProduct[] = [
  {
    id: "angled-scraper-set",
    slug: "angled-scraper-set",
    name: "Angled Scraper Set",
    category: "Tools",
    categorySlug: "tools",
    description: "Sharp edges for cleaner buttercream walls and neater sides.",
    price: "P189",
    unitPrice: 189,
    stock: 12,
    badge: "Bestseller",
    finish: "Stainless set",
    imageSrc:
      "https://images.unsplash.com/photo-1760445528772-01c57126f275?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    searchTerms: ["scraper", "icing", "buttercream", "smooth finish"],
  },
  {
    id: "turntable-starter-kit",
    slug: "turntable-starter-kit",
    name: "Turntable Starter Kit",
    category: "Tools",
    categorySlug: "tools",
    description: "Stable spin base with the everyday tools needed for cleaner icing.",
    price: "P349",
    unitPrice: 349,
    stock: 5,
    badge: "Starter pick",
    finish: "Cake studio essential",
    imageSrc: "/trending/turntable-starter-kit.svg",
    searchTerms: ["turntable", "icing", "kit", "decorating"],
  },
  {
    id: "piping-nozzle-collection",
    slug: "piping-nozzle-collection",
    name: "Piping Nozzle Collection",
    category: "Decorations",
    categorySlug: "decorations",
    description: "Star, petal, and round tips for crisp borders, rosettes, and florals.",
    price: "P219",
    unitPrice: 219,
    stock: 7,
    badge: "Decorator favorite",
    finish: "24-piece tin",
    imageSrc: "/trending/piping-nozzle-collection.svg",
    searchTerms: ["piping", "nozzle", "tips", "cupcakes"],
  },
  {
    id: "rolled-fondant-ivory",
    slug: "rolled-fondant-ivory",
    name: "Rolled Fondant Ivory",
    category: "Fondants",
    categorySlug: "fondants",
    description: "Soft stretch, smooth coverage, and a neutral tone for wedding tiers.",
    price: "P129",
    unitPrice: 129,
    stock: 18,
    badge: "Bakery staple",
    finish: "1 kg pack",
    imageSrc:
      "https://images.unsplash.com/photo-1582180834946-f3d376b18376?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    searchTerms: ["fondant", "wedding", "smooth", "covering"],
  },
  {
    id: "rolled-fondant-blush",
    slug: "rolled-fondant-blush",
    name: "Rolled Fondant Blush",
    category: "Fondants",
    categorySlug: "fondants",
    description: "A soft pink finish for baby showers, florals, and celebration sets.",
    price: "P135",
    unitPrice: 135,
    stock: 9,
    badge: "New shade",
    finish: "1 kg pack",
    imageSrc:
      "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    searchTerms: ["fondant", "pink", "celebration", "baby shower"],
  },
  {
    id: "signature-cake-board-pack",
    slug: "signature-cake-board-pack",
    name: "Signature Cake Board Pack",
    category: "Cake Boards",
    categorySlug: "cake-boards",
    description: "Rigid boards with a satin finish for a polished handoff at pickup.",
    price: "P149",
    unitPrice: 149,
    stock: 10,
    badge: "Studio finish",
    finish: "Pack of 6",
    imageSrc: "/trending/signature-cake-board-pack.svg",
    searchTerms: ["board", "presentation", "pickup", "display"],
  },
  {
    id: "scalloped-display-board",
    slug: "scalloped-display-board",
    name: "Scalloped Display Board",
    category: "Cake Boards",
    categorySlug: "cake-boards",
    description: "A decorative edge for boutique cakes that need a softer presentation line.",
    price: "P99",
    unitPrice: 99,
    stock: 8,
    badge: "Display-ready",
    finish: "12 inch board",
    imageSrc:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1189&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    searchTerms: ["board", "scalloped", "cake stand", "presentation"],
  },
  {
    id: "celebration-ribbon-bundle",
    slug: "celebration-ribbon-bundle",
    name: "Celebration Ribbon Bundle",
    category: "Packaging",
    categorySlug: "packaging",
    description: "Texture-rich trims for boxes, boards, and final wrap-up before collection.",
    price: "P109",
    unitPrice: 109,
    stock: 11,
    badge: "Gift-ready",
    finish: "Assorted widths",
    imageSrc: "/trending/celebration-ribbon-bundle.svg",
    searchTerms: ["ribbon", "packaging", "gift", "wrap"],
  },
  {
    id: "window-cake-box-pair",
    slug: "window-cake-box-pair",
    name: "Window Cake Box Pair",
    category: "Packaging",
    categorySlug: "packaging",
    description: "Tall, clear-top boxes that keep finished cakes protected and visible.",
    price: "P139",
    unitPrice: 139,
    stock: 6,
    badge: "Weekend prep",
    finish: "Pair set",
    imageSrc:
      "https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    searchTerms: ["box", "cake box", "window", "transport"],
  },
  {
    id: "ombre-sprinkle-tin",
    slug: "ombre-sprinkle-tin",
    name: "Ombre Sprinkle Tin",
    category: "Sprinkles",
    categorySlug: "sprinkles",
    description: "Layered colour blends to brighten cupcakes, cookies, and dessert jars.",
    price: "P79",
    unitPrice: 79,
    stock: 16,
    badge: "Party pick",
    finish: "150 g tin",
    imageSrc: "/trending/ombre-sprinkle-tin.svg",
    searchTerms: ["sprinkles", "cupcakes", "cookies", "party"],
  },
  {
    id: "golden-confetti-mix",
    slug: "golden-confetti-mix",
    name: "Golden Confetti Mix",
    category: "Sprinkles",
    categorySlug: "sprinkles",
    description: "Metallic pearls, rods, and sequins for birthdays and luxe dessert tables.",
    price: "P89",
    unitPrice: 89,
    stock: 4,
    badge: "Shiny finish",
    finish: "120 g jar",
    imageSrc:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    searchTerms: ["sprinkles", "gold", "pearls", "confetti"],
  },
  {
    id: "edible-lustre-duo",
    slug: "edible-lustre-duo",
    name: "Edible Lustre Duo",
    category: "Edible Colour",
    categorySlug: "edible-colour",
    description: "Gold and pearl highlights for premium final touches on fondant and buttercream.",
    price: "P99",
    unitPrice: 99,
    stock: 14,
    badge: "Finishing touch",
    finish: "2-shade set",
    imageSrc: "/trending/edible-lustre-duo.svg",
    searchTerms: ["lustre", "edible colour", "gold", "pearl"],
  },
  {
    id: "gel-colour-trio",
    slug: "gel-colour-trio",
    name: "Gel Colour Trio",
    category: "Edible Colour",
    categorySlug: "edible-colour",
    description: "Concentrated red, leaf green, and sky blue for batters, icing, and fondant.",
    price: "P119",
    unitPrice: 119,
    stock: 13,
    badge: "Colour lab",
    finish: "3 x 25 ml",
    imageSrc:
      "https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    searchTerms: ["gel colour", "icing", "batter", "fondant"],
  },
  {
    id: "vanilla-bean-bake-bundle",
    slug: "vanilla-bean-bake-bundle",
    name: "Vanilla Bean Bake Bundle",
    category: "Baking Basics",
    categorySlug: "baking-basics",
    description: "Vanilla paste, cupcake liners, and parchment rounds for steady bake days.",
    price: "P159",
    unitPrice: 159,
    stock: 15,
    badge: "Everyday essential",
    finish: "3-piece bundle",
    imageSrc:
      "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    searchTerms: ["vanilla", "liners", "parchment", "baking"],
  },
  {
    id: "measuring-mise-set",
    slug: "measuring-mise-set",
    name: "Measuring Mise Set",
    category: "Baking Basics",
    categorySlug: "baking-basics",
    description: "Nested cups and spoons with engraved marks for repeatable prep work.",
    price: "P129",
    unitPrice: 129,
    stock: 9,
    badge: "Prep bench",
    finish: "10-piece set",
    imageSrc:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    searchTerms: ["measuring", "cups", "spoons", "prep"],
  },
]
