# Homepage Categories Strip Design

## Summary

Add a lightweight categories strip between the homepage hero and the `Trending Items` section using a horizontally scrollable row of static mock category chips with small neutral line icons.

## Goals

- Introduce a browse-oriented transition between the hero and the trending product cards.
- Keep the section visually lighter than the trending cards so it does not compete with the main merchandising content.
- Provide simple mock category links without implying filtering or selection behavior.
- Improve scanability with lightweight category icons that do not overpower the labels.

## Visual Direction

- Use the same warm off-white family as the merchandising section so the strip feels integrated into the homepage.
- Keep the section restrained and calm, with the chips carrying most of the visual definition.
- Chips should have:
  - a soft warm background
  - a subtle border
  - rounded-full shape
  - a clear but lightweight hover treatment
- Each chip should include:
  - a small neutral line icon on the left
  - consistent icon sizing and stroke weight across the full row
  - icon color aligned with the chip text tone

## Layout

- Place the categories strip directly before the `Trending Items` section.
- The primary element is a single horizontal row of chips.
- Keep the row nowrap so it reads as a browse strip rather than a multi-line tag list.
- On smaller screens, allow horizontal scrolling.
- On larger screens, preserve the single-row look without turning it into a grid.

## Behavior

- Chips are static mock links only.
- No active state, selected state, filtering behavior, or chip counts.
- Icons are presentational cues only and should not introduce extra interaction states.

## Data And Implementation

- Add a small mock categories data list in the storefront mock data module, including icon identifiers or icon components for each category.
- Render the strip directly from `app/page.tsx` without unnecessary abstraction.
- Use simple anchor-style mock links or button-like link styling, depending on what best fits the existing page structure.
- Reuse the existing icon library already installed in the project for consistent line icons.

## Verification

- Add a homepage test assertion that the categories strip heading or label renders if one is added.
- Verify that the expected set or count of mock category links renders.
- Verify that the chips still render as links after the icon content is introduced.
- Run targeted tests, lint, and typecheck after implementation.
