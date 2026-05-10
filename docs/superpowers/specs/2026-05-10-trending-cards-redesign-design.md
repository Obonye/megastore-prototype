# Trending Cards Redesign

## Summary

Redesign the homepage `Trending Items` section so it sits on a soft warm off-white background and uses consistent split-layout product cards with an image panel on top and a warm dark content panel below.

## Goals

- Replace the current brighter cream merchandising treatment with a quieter warm off-white section background.
- Make each trending card feel structured and product-focused through a fixed split layout instead of overlaying text on imagery.
- Keep the cards moderately tall so the grid still feels compact in a 4-column desktop layout.
- Preserve fast product scanning with a clear content order and a visible `Add to cart` action.

## Visual Direction

- The section background should read as warm off-white, not stark white and not peach-heavy.
- Each card should use the same split structure:
  - a clean image panel on top
  - a solid warm dark-brown or charcoal content panel below
- The outer card should keep a rounded, sturdy shell inspired by the shared reference.
- Avoid text overlays on the image area.
- Avoid decorative badges, swatch panels, or nested inner cards inside the product card.

## Card Layout

- Keep the existing responsive grid pattern:
  - Desktop: 4 columns
  - Tablet: 2 columns
  - Mobile: 1 column
- Use a moderate card height with a fixed-feeling image area on top and a separate lower content block.
- The image area should stay free of labels and copy.
- The lower content block should contain:
  - Item name
  - Item description
  - Footer row with bold price on the left and `Add to cart` button on the right
- Category can be removed from the visible card if it makes the lower panel too crowded.
- The button should remain compact and rounded, with a muted rust-red tone rather than a bright primary red.

## Data And Implementation

- Continue using `TrendingStorefrontItem.imageSrc` for product imagery.
- Update the homepage section in `app/page.tsx` rather than introducing new abstractions.
- Continue using the shared `Button` component for the action.
- Support remote mock image URLs through Next.js image configuration, since client-facing imagery may come from external sources.

## Accessibility And Behavior

- Preserve the section landmark and heading structure.
- Keep the image panel visually separate from the content panel so readability does not depend on image brightness.
- Keep hover motion subtle and avoid aggressive animation.

## Verification

- Update the homepage test to keep verifying the `Trending Items` section heading renders.
- Keep the assertion that 8 `Add to cart` buttons render inside the section.
- Run targeted tests, lint, and typecheck after implementation.
