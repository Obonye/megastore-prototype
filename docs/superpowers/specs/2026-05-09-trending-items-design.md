# Trending Items Design

## Summary

Add the next homepage section directly below the hero as a brighter merchandising block titled `Trending Items`.

## Goals

- Create a clear visual transition from the dark hero into a lighter storefront shelf.
- Show 8 actual product cards on desktop in a 4-by-2 grid.
- Make each card feel purchasable with product name, descriptor, price, and `Add to cart` action.
- Reuse existing project styling and mock storefront data patterns.

## Visual Direction

- Use a soft cream merchandising surface with warm borders and subtle shadow.
- Keep the section brighter and more retail-focused than the hero.
- Use consistent product-media panels so the grid feels cohesive even before final photography is added.

## Layout

- Section intro with eyebrow, heading, and short supporting copy.
- Responsive grid:
  - Desktop: 4 columns
  - Tablet: 2 columns
  - Mobile: 1 column
- Each product card includes category, name, descriptor, price, and primary button.

## Data And Implementation

- Store trending item mock data in the existing storefront mock data module.
- Render the section from the homepage without adding unnecessary abstractions.
- Reuse the shared `Button` component for the primary action.

## Verification

- Add a homepage test that verifies the trending section heading renders.
- Verify that 8 product cards render with `Add to cart` actions.
- Run targeted tests, lint, and typecheck after implementation.
