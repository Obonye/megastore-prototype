# Mega Store — Implementation Tasks

## Product Cards

- [ ] Replace the icon on the "Add to cart" button with a standard cart icon and set button text to **"Add to cart"**

---

## Navigation

- [ ] Add a **"Back to top"** button that scrolls the user to the top of the page
- [ ] Rename the **Tools** nav link to **Decor**
- [ ] Add a **Packaging** nav link
- [ ] Add a **Contact Us** nav link
- [ ] Add a **Loyalty Program** nav link (mark as TBD / coming soon)
- [ ] Increase font size of the **Login** and **Cart** buttons
- [ ] Increase overall navbar text size
- [ ] Increase font size of the **"Shop by Category"** section header

---

## Authentication & Pricing

- [ ] Hide product prices for unauthenticated users; show a **"Log in to view price"** prompt in place of the price
- [ ] Build a login form with fields: **Email**, **Phone number**, **Password**
- [ ] Implement **OTP verification** to confirm the user's phone number after registration/login

---

## Layout & Homepage

- [ ] Move the **Trending Items** section to appear directly below the hero image carousel
- [ ] Add **social media links** (icons/links) to the website — decide placement (navbar, footer, or both)

---

## Footer

- [ ] Remove the **Trending** and **Best Sellers** links from the footer
- [ ] Add a **Google Maps link** to the physical store location
- [ ] Rename **Tools** → **Ingredients** in the footer links

---

## Product Variants

- [ ] Add a variant system to products supporting **colour**, **size**, and **quantity** (variant types may differ per product)
- [ ] Update the product image to reflect the **currently selected variant**
- [ ] Ensure each product has a **default variant** pre-selected
- [ ] Update `mock-storefront.ts` product data to include variant definitions per product

---

## Shipping & Checkout

- [ ] Add a **collection method selector** at checkout: **In-store collection** or **Delivery**
- [ ] Implement a **flat-rate delivery fee** applied when delivery is selected
- [ ] Restrict delivery option to **Gaborone only** (show a notice or disable for other areas)
- [ ] Add a note/disclaimer that delivery is handled by a **third-party courier**

---

## Mobile

- [ ] When the user is **not logged in**, show the **Login** button in the top bar instead of the Cart button on mobile
- [ ] Make **category cards** smaller with **rounded corners** on mobile
- [ ] On the **product search/listing page**, add a toggle button to **show/hide filters** (filters hidden by default on mobile)
