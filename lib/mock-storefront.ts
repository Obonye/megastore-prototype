export type StorefrontNavLink = {
  href: string
  label: string
  comingSoon?: boolean
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

export type StorefrontHeroSlide = {
  id: string
  eyebrow: string
  title: string
  description: string
  primaryCtaLabel: string
  primaryCtaHref: string
  secondaryCtaLabel: string
  secondaryCtaHref: string
  imageSrc: string
  imageAlt: string
  overlayClassName: string
  accentClassName: string
  titleColorClassName?: string
  primaryButtonClassName?: string
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
  imageSrc: string
  imageAlt: string
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

export type VariantOption = {
  value: string
  label: string
  color?: string          // hex — for swatch rendering
  imageSrc?: string       // swaps product image when selected
  priceModifier?: number  // added to base unitPrice
}

export type VariantGroup = {
  id: string
  label: string
  type: "colour" | "size" | "quantity"
  options: VariantOption[]
  defaultValue: string
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
  variants?: VariantGroup[]
}

export const storefrontNavbarData: StorefrontNavbarData = {
  brand: {
    mark: "MS",
    name: "The Mega Store",
    tagline: "Baking Supply Co.",
  },
  links: [
    { href: "/products", label: "Shop All" },
    {
      href: "/products",
      label: "Products",
      items: [
        { href: "/products?category=Baking+Basics", label: "Ingredients" },
        { href: "/products?category=Decorations", label: "Decor" },
        { href: "/products?category=Cake+Boards", label: "Bakeware" },
        { href: "/products?category=Packaging", label: "Packaging" },
      ],
    },
    { href: "/contact", label: "Contact Us" },
    { href: "/loyalty", label: "Loyalty Program", comingSoon: true },
  ],
  searchPlaceholder: "Search products...",
  cartLabel: "Cart",
  cartCount: 2,
}

export const storefrontHeroSlides: StorefrontHeroSlide[] = [
  {
    id: "baking-inspiration",
    eyebrow: "Baking Inspiration",
    title: "Shop Baking Essentials.",
    description:
      "Find cake tools, smooth fondants, sturdy boards, and decorating staples for birthday bakes, celebration orders, and everyday prep.",
    primaryCtaLabel: "Shop Essentials",
    primaryCtaHref: "/products",
    secondaryCtaLabel: "Browse Categories",
    secondaryCtaHref: "/#shop-categories-heading",
    imageSrc: "/hero1.jpg",
    imageAlt: "A decorated cake photographed in a bright baking setting.",
    overlayClassName:
      "bg-[linear-gradient(90deg,rgba(35,28,24,0.48),rgba(35,28,24,0.22),rgba(35,28,24,0.08))]",
    accentClassName: "bg-[oklch(0.74_0.13_170)] text-[oklch(0.19_0.02_185)]",
    titleColorClassName: "text-[#ff6b9a]",
    primaryButtonClassName: "bg-[#ff6b9a] hover:bg-[#f85a8d]",
  },
  {
    id: "precision-tools",
    eyebrow: "Professional Equipment",
    title: "Build Your Tool Kit.",
    description:
      "Shop scrapers, turntables, measuring sets, and everyday bench tools that make icing, smoothing, and prep work faster and cleaner.",
    primaryCtaLabel: "Shop Tools",
    primaryCtaHref: "/products?category=Tools",
    secondaryCtaLabel: "See Best Sellers",
    secondaryCtaHref: "/#best-sellers-heading",
    imageSrc: "/hero2.jpg",
    imageAlt:
      "Baking and decorating tools arranged on a work surface.",
    overlayClassName:
      "bg-[linear-gradient(90deg,rgba(44,24,30,0.5),rgba(44,24,30,0.24),rgba(44,24,30,0.08))]",
    accentClassName: "bg-[#d9dcff] text-[#1a2330]",
    titleColorClassName: "text-[#fff4df]",
    primaryButtonClassName: "bg-[#fff4df] hover:bg-[#f6e8cd]",
  },
  {
    id: "premium-ingredients",
    eyebrow: "Premium Ingredients",
    title: "Taste the Difference.",
    description:
      "From vanilla, colour, and sprinkles to pantry staples you reach for every week, shop ingredients chosen for better flavour, richer aroma, and more beautiful finishes.",
    primaryCtaLabel: "Shop Ingredients",
    primaryCtaHref: "/products?category=Baking+Basics",
    secondaryCtaLabel: "Browse Baking Basics",
    secondaryCtaHref: "/products?category=Baking+Basics",
    imageSrc: "/hero3.jpg?v=2",
    imageAlt: "Assorted baking ingredients and tools arranged for prep.",
    overlayClassName:
      "bg-[linear-gradient(90deg,rgba(46,28,12,0.5),rgba(46,28,12,0.24),rgba(46,28,12,0.08))]",
    accentClassName: "bg-[oklch(0.8_0.14_80)] text-[oklch(0.28_0.05_70)]",
    titleColorClassName: "text-[#ff9f43]",
    primaryButtonClassName: "bg-[#ff9f43] hover:bg-[#f28f2f]",
  },
]

export const storefrontCategoryChips: StorefrontCategoryChip[] = [
  {
    href: "/products?category=Tools",
    label: "Tools",
    icon: "tools",
    imageSrc:
      "https://images.unsplash.com/photo-1760445528772-01c57126f275?q=80&w=687&auto=format&fit=crop",
    imageAlt: "Metal icing tools and scrapers laid out on a work surface.",
  },
  {
    href: "/products?category=Fondants",
    label: "Fondants",
    icon: "fondants",
    imageSrc:
      "https://images.unsplash.com/photo-1582180834946-f3d376b18376?q=80&w=688&auto=format&fit=crop",
    imageAlt: "A fondant-covered celebration cake with a smooth finish.",
  },
  {
    href: "/products?category=Cake+Boards",
    label: "Cake Boards",
    icon: "boards",
    imageSrc:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1189&auto=format&fit=crop",
    imageAlt: "A display cake styled on a finished presentation board.",
  },
  {
    href: "/products?category=Decorations",
    label: "Decorations",
    icon: "decorations",
    imageSrc: "/trending/piping-nozzle-collection.svg",
    imageAlt: "Decorating nozzles and piping accessories.",
  },
  {
    href: "/products?category=Packaging",
    label: "Packaging",
    icon: "packaging",
    imageSrc:
      "https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=1064&auto=format&fit=crop",
    imageAlt: "Bakery boxes and packaging materials arranged for pickup orders.",
  },
  {
    href: "/products?category=Edible+Colour",
    label: "Edible Colour",
    icon: "colour",
    imageSrc:
      "https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?q=80&w=1171&auto=format&fit=crop",
    imageAlt: "Edible colour bottles and decorating pigment on a work surface.",
  },
  {
    href: "/products?category=Sprinkles",
    label: "Sprinkles",
    icon: "sprinkles",
    imageSrc:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=1170&auto=format&fit=crop",
    imageAlt: "Colourful sprinkle mixes and metallic confetti toppings.",
  },
  {
    href: "/products?category=Baking+Basics",
    label: "Baking Basics",
    icon: "basics",
    imageSrc:
      "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?q=80&w=1170&auto=format&fit=crop",
    imageAlt: "Baking essentials including vanilla, liners, and pantry staples.",
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
    imageSrc:
      "https://images.unsplash.com/photo-1582180834946-f3d376b18376?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
    description:
      "Stable spin base with the everyday tools needed for cleaner icing.",
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
    description:
      "Star, petal, and round tips for crisp borders, rosettes, and florals.",
    price: "P219",
    unitPrice: 219,
    stock: 7,
    badge: "Decorator favorite",
    finish: "24-piece tin",
    imageSrc: "/trending/piping-nozzle-collection.svg",
    searchTerms: ["piping", "nozzle", "tips", "cupcakes"],
    variants: [
      {
        id: "quantity",
        label: "Set size",
        type: "quantity",
        defaultValue: "24",
        options: [
          { value: "12", label: "12-piece", priceModifier: -80 },
          { value: "24", label: "24-piece" },
          { value: "48", label: "48-piece", priceModifier: 170 },
        ],
      },
    ],
  },
  {
    id: "rolled-fondant-ivory",
    slug: "rolled-fondant-ivory",
    name: "Rolled Fondant Ivory",
    category: "Fondants",
    categorySlug: "fondants",
    description:
      "Soft stretch, smooth coverage, and a neutral tone for wedding tiers.",
    price: "P129",
    unitPrice: 129,
    stock: 18,
    badge: "Bakery staple",
    finish: "1 kg pack",
    imageSrc:
      "https://images.unsplash.com/photo-1582180834946-f3d376b18376?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    searchTerms: ["fondant", "wedding", "smooth", "covering"],
    variants: [
      {
        id: "colour",
        label: "Colour",
        type: "colour",
        defaultValue: "ivory",
        options: [
          { value: "ivory", label: "Ivory", color: "#f5edd6" },
          { value: "blush", label: "Blush", color: "#ffd0da" },
          { value: "white", label: "White", color: "#f8f8f8" },
          { value: "chocolate", label: "Chocolate", color: "#6b3a2a" },
          { value: "black", label: "Black", color: "#1a1a1a" },
        ],
      },
      {
        id: "size",
        label: "Pack size",
        type: "size",
        defaultValue: "1kg",
        options: [
          { value: "500g", label: "500 g", priceModifier: -40 },
          { value: "1kg", label: "1 kg" },
          { value: "2kg", label: "2 kg", priceModifier: 90 },
        ],
      },
    ],
  },
  {
    id: "rolled-fondant-blush",
    slug: "rolled-fondant-blush",
    name: "Rolled Fondant Blush",
    category: "Fondants",
    categorySlug: "fondants",
    description:
      "A soft pink finish for baby showers, florals, and celebration sets.",
    price: "P135",
    unitPrice: 135,
    stock: 9,
    badge: "New shade",
    finish: "1 kg pack",
    imageSrc:
      "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    searchTerms: ["fondant", "pink", "celebration", "baby shower"],
    variants: [
      {
        id: "colour",
        label: "Colour",
        type: "colour",
        defaultValue: "blush",
        options: [
          { value: "ivory", label: "Ivory", color: "#f5edd6" },
          { value: "blush", label: "Blush", color: "#ffd0da" },
          { value: "white", label: "White", color: "#f8f8f8" },
          { value: "chocolate", label: "Chocolate", color: "#6b3a2a" },
          { value: "black", label: "Black", color: "#1a1a1a" },
        ],
      },
      {
        id: "size",
        label: "Pack size",
        type: "size",
        defaultValue: "1kg",
        options: [
          { value: "500g", label: "500 g", priceModifier: -45 },
          { value: "1kg", label: "1 kg" },
          { value: "2kg", label: "2 kg", priceModifier: 95 },
        ],
      },
    ],
  },
  {
    id: "signature-cake-board-pack",
    slug: "signature-cake-board-pack",
    name: "Signature Cake Board Pack",
    category: "Cake Boards",
    categorySlug: "cake-boards",
    description:
      "Rigid boards with a satin finish for a polished handoff at pickup.",
    price: "P149",
    unitPrice: 149,
    stock: 10,
    badge: "Studio finish",
    finish: "Pack of 6",
    imageSrc: "/trending/signature-cake-board-pack.svg",
    searchTerms: ["board", "presentation", "pickup", "display"],
    variants: [
      {
        id: "size",
        label: "Board size",
        type: "size",
        defaultValue: "8in",
        options: [
          { value: "6in", label: '6"', priceModifier: -30 },
          { value: "8in", label: '8"' },
          { value: "10in", label: '10"', priceModifier: 25 },
          { value: "12in", label: '12"', priceModifier: 50 },
        ],
      },
      {
        id: "quantity",
        label: "Quantity",
        type: "quantity",
        defaultValue: "6",
        options: [
          { value: "3", label: "Pack of 3", priceModifier: -50 },
          { value: "6", label: "Pack of 6" },
          { value: "12", label: "Pack of 12", priceModifier: 110 },
        ],
      },
    ],
  },
  {
    id: "scalloped-display-board",
    slug: "scalloped-display-board",
    name: "Scalloped Display Board",
    category: "Cake Boards",
    categorySlug: "cake-boards",
    description:
      "A decorative edge for boutique cakes that need a softer presentation line.",
    price: "P99",
    unitPrice: 99,
    stock: 8,
    badge: "Display-ready",
    finish: "12 inch board",
    imageSrc:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1189&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    searchTerms: ["board", "scalloped", "cake stand", "presentation"],
    variants: [
      {
        id: "size",
        label: "Board size",
        type: "size",
        defaultValue: "12in",
        options: [
          { value: "8in", label: '8"', priceModifier: -20 },
          { value: "10in", label: '10"', priceModifier: -10 },
          { value: "12in", label: '12"' },
          { value: "14in", label: '14"', priceModifier: 30 },
        ],
      },
    ],
  },
  {
    id: "celebration-ribbon-bundle",
    slug: "celebration-ribbon-bundle",
    name: "Celebration Ribbon Bundle",
    category: "Packaging",
    categorySlug: "packaging",
    description:
      "Texture-rich trims for boxes, boards, and final wrap-up before collection.",
    price: "P109",
    unitPrice: 109,
    stock: 11,
    badge: "Gift-ready",
    finish: "Assorted widths",
    imageSrc: "/trending/celebration-ribbon-bundle.svg",
    searchTerms: ["ribbon", "packaging", "gift", "wrap"],
    variants: [
      {
        id: "colour",
        label: "Colour",
        type: "colour",
        defaultValue: "ivory",
        options: [
          { value: "ivory", label: "Ivory", color: "#f5edd6" },
          { value: "blush", label: "Blush", color: "#ffd0da" },
          { value: "sage", label: "Sage", color: "#b2c9b0" },
          { value: "gold", label: "Gold", color: "#d4af37" },
        ],
      },
    ],
  },
  {
    id: "window-cake-box-pair",
    slug: "window-cake-box-pair",
    name: "Window Cake Box Pair",
    category: "Packaging",
    categorySlug: "packaging",
    description:
      "Tall, clear-top boxes that keep finished cakes protected and visible.",
    price: "P139",
    unitPrice: 139,
    stock: 6,
    badge: "Weekend prep",
    finish: "Pair set",
    imageSrc:
      "https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    searchTerms: ["box", "cake box", "window", "transport"],
    variants: [
      {
        id: "size",
        label: "Box size",
        type: "size",
        defaultValue: "8in",
        options: [
          { value: "6in", label: '6"', priceModifier: -30 },
          { value: "8in", label: '8"' },
          { value: "10in", label: '10"', priceModifier: 40 },
        ],
      },
    ],
  },
  {
    id: "ombre-sprinkle-tin",
    slug: "ombre-sprinkle-tin",
    name: "Ombre Sprinkle Tin",
    category: "Sprinkles",
    categorySlug: "sprinkles",
    description:
      "Layered colour blends to brighten cupcakes, cookies, and dessert jars.",
    price: "P79",
    unitPrice: 79,
    stock: 16,
    badge: "Party pick",
    finish: "150 g tin",
    imageSrc: "/trending/ombre-sprinkle-tin.svg",
    searchTerms: ["sprinkles", "cupcakes", "cookies", "party"],
    variants: [
      {
        id: "colour",
        label: "Blend",
        type: "colour",
        defaultValue: "rainbow",
        options: [
          { value: "rainbow", label: "Rainbow", color: "#ff9f43" },
          { value: "pink", label: "Pink", color: "#ffd0da" },
          { value: "blue", label: "Blue", color: "#b3d4f5" },
          { value: "gold", label: "Gold", color: "#d4af37" },
          { value: "pastel", label: "Pastel", color: "#e8d5f0" },
        ],
      },
      {
        id: "size",
        label: "Weight",
        type: "size",
        defaultValue: "150g",
        options: [
          { value: "75g", label: "75 g", priceModifier: -30 },
          { value: "150g", label: "150 g" },
          { value: "300g", label: "300 g", priceModifier: 55 },
        ],
      },
    ],
  },
  {
    id: "golden-confetti-mix",
    slug: "golden-confetti-mix",
    name: "Golden Confetti Mix",
    category: "Sprinkles",
    categorySlug: "sprinkles",
    description:
      "Metallic pearls, rods, and sequins for birthdays and luxe dessert tables.",
    price: "P89",
    unitPrice: 89,
    stock: 4,
    badge: "Shiny finish",
    finish: "120 g jar",
    imageSrc:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    searchTerms: ["sprinkles", "gold", "pearls", "confetti"],
    variants: [
      {
        id: "size",
        label: "Weight",
        type: "size",
        defaultValue: "120g",
        options: [
          { value: "60g", label: "60 g", priceModifier: -35 },
          { value: "120g", label: "120 g" },
          { value: "240g", label: "240 g", priceModifier: 65 },
        ],
      },
    ],
  },
  {
    id: "edible-lustre-duo",
    slug: "edible-lustre-duo",
    name: "Edible Lustre Duo",
    category: "Edible Colour",
    categorySlug: "edible-colour",
    description:
      "Gold and pearl highlights for premium final touches on fondant and buttercream.",
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
    description:
      "Concentrated red, leaf green, and sky blue for batters, icing, and fondant.",
    price: "P119",
    unitPrice: 119,
    stock: 13,
    badge: "Colour lab",
    finish: "3 x 25 ml",
    imageSrc:
      "https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    searchTerms: ["gel colour", "icing", "batter", "fondant"],
    variants: [
      {
        id: "colour",
        label: "Colour set",
        type: "colour",
        defaultValue: "primary",
        options: [
          { value: "primary", label: "Primary", color: "#e63946" },
          { value: "warm", label: "Warm tones", color: "#f4a261" },
          { value: "cool", label: "Cool tones", color: "#3a86ff" },
          { value: "pastel", label: "Pastel", color: "#ffd0da" },
        ],
      },
    ],
  },
  {
    id: "vanilla-bean-bake-bundle",
    slug: "vanilla-bean-bake-bundle",
    name: "Vanilla Bean Bake Bundle",
    category: "Baking Basics",
    categorySlug: "baking-basics",
    description:
      "Vanilla paste, cupcake liners, and parchment rounds for steady bake days.",
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
    description:
      "Nested cups and spoons with engraved marks for repeatable prep work.",
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
