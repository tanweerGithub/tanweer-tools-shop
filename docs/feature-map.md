# ToolsShop Feature Map

This document outlines the primary feature areas of the ToolsShop application, the files associated with them, shared state management, and test-specific information.

## 1. Feature Breakdown

| Feature Area | Route(s) | Files Involved |
| :--- | :--- | :--- |
| **Product Listing** | `/` | **Pages**: `HomePage.tsx`<br>**Components**: `Navbar.tsx`<br>**Context**: `ShopContext.tsx`<br>**Constants**: `constants.ts` |
| **Product Details**| `/product/:id` | **Pages**: `ProductDetailsPage.tsx`<br>**Components**: `Navbar.tsx`<br>**Context**: `ShopContext.tsx` |
| **Cart** | `/cart` | **Pages**: `CartPage.tsx`<br>**Components**: `Navbar.tsx`<br>**Context**: `ShopContext.tsx`<br>**Constants**: `constants.ts` (for coupons) |
| **Checkout** | `/checkout` | **Pages**: `CheckoutPage.tsx`<br>**Components**: `Navbar.tsx`<br>**Context**: `ShopContext.tsx` |
| **Authentication** | `/login`<br>`/register` | **Pages**: `LoginPage.tsx`, `RegisterPage.tsx`<br>**Components**: `Navbar.tsx`<br>**Context**: `ShopContext.tsx` |
| **Order Success** | `/success` | **Pages**: `OrderSuccessPage.tsx`<br>**Components**: `Navbar.tsx`<br>**Context**: `ShopContext.tsx` |
| **Contact** | `/contact` | **Pages**: `ContactPage.tsx`<br>**Components**: `Navbar.tsx` |

---

## 2. Shared State (`ShopContext.tsx`)

The `ShopContext` is the central state management solution for the application, providing shared data and functionality across various features. State is persisted in `localStorage`.

### State Properties:
-   `products`: Holds the list of all mock products.
-   `cart`: An array of `CartItem` objects representing the user's shopping cart.
-   `user`: A `User` object holding the logged-in user's data, or `null`.
-   `cartTotal`: A derived value calculating the total cost of items in the cart.

### Actions:
-   `addToCart(product)`
-   `removeFromCart(productId)`
-   `updateQuantity(productId, quantity)`
-   `clearCart()`
-   `login(user)`
-   `logout()`

### Feature Interaction:

| Feature | Reads from Context | Writes to Context |
| :--- | :--- | :--- |
| **Product Listing** | `products`, `cart`, `user` | `addToCart` |
| **Product Details**| `products`, `cart`, `user` | `addToCart` |
| **Cart** | `cart`, `cartTotal` | `removeFromCart`, `updateQuantity` |
| **Checkout** | `cart`, `cartTotal`, `user` | `clearCart` (on successful order) |
| **Authentication** | `user` | `login`, `logout` |
| **Navbar (Component)** | `cart`, `user` | `logout` |

---

## 3. Test Hooks (`data-test` attributes)

## 3. Test Hooks (`data-test` attributes)

This section lists all `data-test` attributes found in the application's pages, which can be used as stable selectors for automated testing.

### `components/Navbar.tsx`
- `nav-home`
- `nav-home-menu`
- `nav-orders`
- `nav-contact`
- `nav-user-name`
- `nav-sign-out`
- `nav-sign-in`
- `nav-cart`
- `cart-quantity`

### `pages/CartPage.tsx`
- `page-title`
- `cart-row`
- `product-title`
- `decrease-quantity-{item.id}`
- `product-quantity`
- `increase-quantity-{item.id}`
- `product-price`
- `line-total`
- `delete-item`
- `cart-subtotal`
- `cart-discount`
- `cart-total`
- `coupon-code`
- `coupon-apply`
- `coupon-message`
- `checkout`

### `pages/CheckoutPage.tsx`
- `back-to-cart`
- `page-title`
- `payment-method`
- `gift-card-number`
- `total`
- `finish`

### `pages/ContactPage.tsx`
- `page-title`
- `contact-success`
- `first-name`
- `last-name`
- `email`
- `subject`
- `message`
- `contact-submit`

### `pages/HomePage.tsx`
- `product-card`
- `product-name-{product.id}`
- `product-price`
- `add-to-cart-{product.id}`
- `search-query`
- `sort`
- `price-slider`
- `category-{cat.toLowerCase().replace(/\s/g, '-')}`
- `page-title`

### `pages/LoginPage.tsx`
- `login-title`
- `email`
- `password`
- `login-error`
- `login-submit`
- `register-link`

### `pages/OrderSuccessPage.tsx`
- `page-title`
- `success-message`
- `continue-shopping`

### `pages/ProductDetailsPage.tsx`
- `product-name`
- `product-description`
- `unit-price`
- `add-to-cart`

### `pages/RegisterPage.tsx`
- `btn-login`
- `register-title`
- `first-name`
- `last-name`
- `dob`
- `address`
- `postcode`
- `city`
- `state`
- `country`
- `phone`
- `email`
- `password`
- `register-submit`

### `pages/OrdersPage.tsx`
- `page-title`
- `order-row`
- `order-id`
- `order-total`

### Valid Coupon Codes
As defined in `constants.ts`:
-   `TEST10`: 10% discount
-   `OFF20`: 20% discount

### Demo Credentials
As defined in `constants.ts`:
-   **Username**: `tanweer@test.com`
-   **Password**: `tanweer123`

---

## 5. Observed behavior

### Home
- **Search**: Functional.
- **Sort**: Functional.
- **Category Filter**: Functional.
- **Price Slider**: Functional.
- **Add to Cart**: Functional.

### Product details
- **Quantity selection**: Not available. Users can only add one item at a time.
- **Add to cart**: Functional.

### Cart
- **Change quantities**: Functional.
- **Remove items**: Functional.
- **Apply coupon TEST10**: Functional.
- **Apply coupon OFF20**: Functional.
- **Apply an invalid code**: Functional. The discount is removed and an error message is shown.
- **Apply "test10" in lowercase**: Not functional. Coupon codes are case-sensitive.

### Checkout
- **Coupon persistence**: The coupon discount is not applied on the checkout page. The total resets to the pre-coupon amount.
- **Discount recalculation**: When a coupon is applied and an item's quantity is changed, the discount does not automatically recalculate.
- **Payment Methods**:
    - **Bank Transfer**: Functional.
    - **Credit Card**: Functional, but the form does not need to be filled out.
    - **Gift Card**: Functional, but the form does not need to be filled out.
- **Shipping Address**: No input fields are present for the shipping address, but orders can still be placed.
- **Order Success**: The user is redirected to a success page with an order ID.

### Login/Register
- **Login**: Functional.
- **Logout**: Functional.
- **Register**: Partially functional. The registration form requires all fields to be filled, but it is not possible to submit the form without filling them.

### Contact page
- **Submit empty**: Not functional. No validation messages are shown.
- **Submit filled**: Functional. A success message is displayed.

### Console Errors
- No console errors were observed on page load.

---

## 6. Gap analysis

- **Order History**: Orders are not persisted after checkout. There is no order history page for users to view their past orders. This is a significant gap for a realistic e-commerce application.
- **Product Details**: The product details page is very limited. There is no quantity selection, no product reviews, and no related products.
- **Checkout Flow**: The checkout flow is incomplete. The lack of a shipping address form and the fact that payment details are not required make it unrealistic. The coupon discount not being applied on the checkout page is a major bug.
- **User Profile**: There is no user profile page where users can view or edit their information.
- **Input Validation**: The contact and registration pages have poor input validation.
