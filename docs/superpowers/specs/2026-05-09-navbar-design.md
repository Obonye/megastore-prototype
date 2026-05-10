# Floating Navbar Design

## Summary

Build a shared responsive navbar for the baking supply ecommerce application. The navbar should appear across the application, float away from the screen edges, and establish a warm, charming, boutique visual tone through a dark translucent surface and warm off-white typography.

This first iteration is UI-first. It will include a brand/logo area, top-level navigation links, a search field, and a cart action. Search and cart interactions do not need backend behavior yet.

## Goals

- Create a shared navbar component rendered from the app shell.
- Make the navbar responsive across mobile, tablet, and desktop.
- Give the navbar a floating appearance with visible offset from the viewport edges.
- Establish a boutique bakery feel using an off-black translucent shell with warm text and restrained accent styling.
- Use shadcn primitives where they provide value and keep the component easy to extend later.

## Non-Goals

- Implement real search behavior.
- Implement cart state, item count, or checkout flows.
- Implement account/authentication entry points in this first pass.
- Finalize broader site layout, hero content, or category navigation beyond the primary top-level links.

## Users And Context

The application serves customers shopping for baking supplies such as tools, fondants, cake boards, and decorations. The navbar should feel welcoming and crafted, while still supporting quick product discovery. It should read more like a boutique baking brand than a generic marketplace header.

## Visual Direction

### Tone

Warm and charming, with a more refined boutique expression than a pastel bakery aesthetic.

### Surface

The navbar shell uses a smoked off-black translucent background. It should feel light enough to float over the page rather than read as a heavy black slab.

### Typography And Color

- Primary text: warm off-white.
- Secondary text and placeholders: soft cream-muted tones.
- Accent: restrained use of the existing warm primary token for emphasis and interactive states.

### Depth

The floating effect comes from:

- Top and side spacing that keeps the navbar off the viewport edges.
- Large rounded corners.
- A subtle warm-tinted border.
- A soft, diffused shadow instead of hard contrast or aggressive blur.

### Interaction Styling

- Hover states should use faint cream-tinted fills or softened contrast shifts.
- Search should live inside a slightly lighter translucent pocket within the shell.
- The cart control should stand out slightly more than standard links without dominating the composition.

## Information Architecture

### Desktop

- Left: logo / brand mark and store name.
- Center: primary navigation links.
- Right: search field and cart action.

### Mobile

- Keep the floating shell language.
- Show logo, cart action, and a menu trigger in the primary row.
- Collapse navigation links into a mobile overlay/panel triggered from the menu control.
- Preserve search access on mobile using a compact treatment inside the shell or mobile panel, depending on available width.

## Component Structure

### Shared Component

Create `components/site-navbar.tsx` as the shared navbar component.

### App Integration

Render the navbar from `app/layout.tsx` so it is inherited by all pages.

### Supporting UI

Use shadcn primitives where appropriate:

- Existing `Button` for cart and menu actions.
- Minimal overlay/navigation primitives as needed for the mobile menu.

Do not introduce unnecessary custom abstractions in the first pass.

## Responsive Behavior

### Layout Rules

- The navbar should use a centered max-width container.
- It must never touch the viewport edges; preserve horizontal inset on all breakpoints.
- The shell should remain visually balanced as content compresses.

### Breakpoint Intent

- Desktop: full nav links and inline search.
- Tablet: retain inline search if space allows, while tightening gaps and paddings.
- Mobile: collapse links behind a menu trigger; keep the header readable and uncluttered.

### Sticky Behavior

The navbar should remain sticky near the top of the viewport while preserving its floating offset.

## Accessibility

- All interactive controls must have visible focus states.
- Mobile navigation trigger must have an accessible label.
- Search input must have an accessible name or label.
- Color contrast must remain legible against the dark translucent shell.
- Hover-only affordances must also be understandable via focus states.

## Technical Approach

### Files Expected To Change

- `components/site-navbar.tsx`
- `app/layout.tsx`
- `app/globals.css`
- Potentially one or more added shadcn UI primitives for the mobile navigation pattern

### Styling Strategy

- Use existing semantic tokens from `app/globals.css` where possible.
- Add only the minimal global token adjustments needed to support the dark translucent boutique navbar look.
- Keep component-level layout and state styling in the navbar component.

### State

The first version will use only local UI state required for the mobile navigation pattern. No remote data or shared store is needed.

## Testing And Verification

- Verify the navbar renders in the shared layout.
- Check responsive behavior at mobile, tablet, and desktop widths.
- Confirm the navbar stays offset from screen edges on all tested widths.
- Confirm the sticky/floating behavior during scroll.
- Run lint and typecheck after implementation.

## Risks And Controls

- Risk: the translucent dark shell may reduce legibility over varied page backgrounds.
  Control: use sufficient contrast, warm-tinted opaque layering where needed, and a defined border/shadow edge.

- Risk: inline search may crowd the layout on medium screens.
  Control: allow search width to compress and move to a compact/mobile treatment at smaller widths.

- Risk: the navbar could look too generic if the brand treatment is too plain.
  Control: give the logo area a crafted badge/wordmark treatment and keep spacing, contrast, and shape decisions intentional.

## Implementation Recommendation

Build the navbar as a single shared shell component with a responsive internal layout. Keep the first version focused on:

1. Strong floating composition.
2. Clean responsive navigation behavior.
3. Search and cart UI presence.
4. Warm boutique styling through dark translucency and cream-toned typography.

This keeps the initial shared navigation simple, reusable, and ready for later product/search/cart wiring.
