# Trending Cards Redesign

## Summary

Redesign the homepage `Trending Items` section so it sits on a soft warm off-white background and uses image-led product cards with bottom-weighted gradient overlays.

## Goals

- Replace the current brighter cream merchandising treatment with a quieter warm off-white section background.
- Make each trending card feel product-first by using the product image as the full card background.
- Keep the cards moderately tall so the grid still feels compact in a 4-column desktop layout.
- Preserve fast product scanning with a clear content order and a visible `Add to cart` action.

## Visual Direction

- The section background should read as warm off-white, not stark white and not peach-heavy.
- Each card should use a full-bleed mock product image with rounded corners and hidden overflow.
- Apply a vertical overlay gradient that stays lighter near the top and deepens toward the bottom to protect text contrast.
- Avoid decorative badges, swatch panels, or nested inner cards inside the product card.

## Card Layout

- Keep the existing responsive grid pattern:
  - Desktop: 4 columns
  - Tablet: 2 columns
  - Mobile: 1 column
- Use a moderate card height that feels editorial but not poster-like.
- Bottom-align the card content inside the image frame in this order:
  - Item name
  - Category
  - Item description
  - Footer row with bold price on the left and `Add to cart` button on the right
- The button should remain compact so the footer does not overpower the card.

## Data And Implementation

- Extend `TrendingStorefrontItem` with an `imageSrc` field for mock photography.
- Update the homepage section in `app/page.tsx` rather than introducing new abstractions.
- Continue using the shared `Button` component for the action.
- Use remote mock image URLs or stable placeholder imagery that works in Next.js without adding unnecessary complexity.

## Accessibility And Behavior

- Preserve the section landmark and heading structure.
- Ensure the gradient is dark enough for readable text over varied product images.
- Keep hover motion subtle and avoid aggressive animation.

## Verification

- Update the homepage test to keep verifying the `Trending Items` section heading renders.
- Keep the assertion that 8 `Add to cart` buttons render inside the section.
- Run targeted tests, lint, and typecheck after implementation.
