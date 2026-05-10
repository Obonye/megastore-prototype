# Products Page Design

## Summary

Add a `View all` action to the homepage `Trending Items` section and create a server-rendered `/products` page with URL-backed search, category filtering, and pagination.

## Goals

- Give the `Trending Items` section a clear path into a fuller catalogue experience.
- Make the products page feel real and navigable without introducing backend complexity yet.
- Support shareable catalogue states through URL query parameters.
- Keep the page visually aligned with the current warm storefront direction.

## Homepage Change

- Add a `View all` control on the right side of the `Trending Items` section header row.
- The control should link to `/products`.
- It should read as a secondary browse action, not compete visually with the product cards.

## Products Page Structure

- Build `/products` as a server-rendered App Router page.
- Read `searchParams` for:
  - search query
  - category filter
  - page number
- The top area should include:
  - a search input
  - filter controls positioned next to it
- The lower area should include:
  - a paginated products grid

## Data And Behavior

- Keep the page mock-driven for now.
- Extend the storefront mock data with a larger products catalogue if needed.
- Filter and paginate the mock data on the server based on URL params.
- The page should support direct linking to filtered/paginated states through the URL.
- Avoid client-only state for the core search, filter, and pagination behavior.

## Filtering And Pagination

- Search should match product name and optionally category text.
- Category filtering can start with a single-select mock filter tied to existing category values.
- Pagination should be simple and explicit:
  - current page
  - previous/next navigation
  - predictable page size
- Invalid or missing params should fall back to safe defaults.

## Visual Direction

- Use the same warm off-white surfaces and dark product-card treatment already established on the homepage.
- Keep the search and filters compact and practical rather than ornamental.
- The products grid should feel like a natural extension of the homepage merchandising style.

## Accessibility And UX

- Preserve semantic headings and landmarks.
- Ensure search and filter controls are keyboard accessible.
- Use link-based or form-based URL updates that work without client-side assumptions.

## Verification

- Add or update tests for:
  - homepage `View all` link rendering
  - `/products` page rendering
  - search/filter/pagination behavior from URL params
- Run targeted tests, lint, and typecheck after implementation.
