# SANBAE Ecommerce Platform - UI/UX Design Plan

**Last Updated:** February 25, 2026  
**Platform:** React + Vite  
**Target Devices:** Mobile, Tablet, Desktop

---

## 1. Design System Overview

### 1.1 Color Palette

| Token | HEX | Usage | Contrast |
|-------|-----|-------|----------|
| **Primary** | `#0f1723` | Text, dark backgrounds, primary elements | 18:1 (AAA) |
| **Secondary** | `#ffffff` | Background, contrast text | 18:1 (AAA) |
| **Accent** | `#ff6b35` | CTAs, highlights, hover states | 4.5:1+ (AA) |
| **Dark Accent** | `#d84315` | Hover states for secondary buttons | 7:1+ (AAA) |
| **Background** | Linear Gradient | Page background (light blue-white fade) | Accessible |
| **Card Background** | `rgba(255,255,255,0.9)` | Cards, panels, surfaces | Translucent |
| **Glass Effect** | `rgba(255,255,255,0.6)` | Glass morphism elements | Semi-transparent |
| **Border** | `rgba(15,23,35,0.06)` | Subtle dividers, borders | Minimal contrast |
| **Muted Text** | `#6b7280` | Secondary text, descriptions | 4.5:1 (AA) |

**Contrast Compliance:** WCAG AA (4.5:1) minimum, AAA (7:1) for primary text

---

## 2. Typography System

### Font Stack
- **Family:** Inter (Google Fonts)
- **Fallback:** system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial

### Font Weights & Scales

| Element | Weight | Desktop | Tablet | Mobile | Line Height |
|---------|--------|---------|--------|--------|-------------|
| **H1** (Hero) | 900 | 56px | 48px | 28px | 1.2 |
| **H2** (Section) | 800 | 36px | 32px | 24px | 1.3 |
| **H3** (Card Title) | 800 | 20px | 18px | 16px | 1.4 |
| **H4** (Subsection) | 800 | 18px | 16px | 14px | 1.4 |
| **Body** | 400 | 16px | 16px | 14px | 1.6 |
| **Small/Muted** | 400 | 14px | 14px | 12px | 1.5 |
| **Button** | 800 | 13px (uppercase) | 12px | 11px | 1.2 |
| **Label** | 600 | 14px | 14px | 12px | 1.4 |

**Mobile-First Adjustment:** Font sizes increase 1-2px on tablets, 2-4px on desktop  
**Readability:** All body text ≥ 14px on mobile, ≥ 16px on desktop

---

## 3. Spacing System

### Base Unit: 4px (Powers of 2)

| Scale | Value | Usage |
|-------|-------|-------|
| xs | 4px | Micro spacing, borders |
| sm | 8px | Tight spacing, padding within elements |
| md | 12px | Default padding, gap |
| lg | 16px | Outer padding, button padding |
| xl | 20px | Header padding, section spacing |
| 2xl | 24px | Section vertical spacing |
| 3xl | 30px | Major section gaps |
| 4xl | 40px | Hero/featured spacing |
| 5xl | 60px | Large section margins |

### Component Spacing Rules
- **Buttons:** `padding: 14px 18px`; `min-height: 48px` (desktop), 44px (mobile)
- **Inputs/Forms:** `padding: 14px 16px`; `min-height: 48px`
- **Cards:** `padding: 20px`; gap between cards: 24px
- **Header/Nav:** `padding: 16px 20px` (topbar), `padding: 20px 5%` (classic nav)
- **Sections:** `margin: 60px auto`; `padding: 40px 20px`

---

## 4. Component Library

### 4.1 Buttons

#### Primary Button (CTA)
```
Background: Linear gradient (orange #ff6b35 → dark orange #d84315)
Color: White
Padding: 14px 18px
Min-height: 48px
Border-radius: 10px
Font-weight: 800, uppercase, letter-spacing: 1px
Transition: transform 280ms, box-shadow 280ms
Hover: translateY(-4px), box-shadow elevation
Focus: outline 3px #ff6b35, outline-offset 2px
```

#### Secondary Button
```
Background: #ff6b35 (accent)
Color: White
Padding: 14px 18px
Hover: background #d84315
Focus: outline 3px #0f1723, outline-offset 2px
```

#### Ripple Effect
- Applied on click
- Radius-based origin from click position
- Duration: 600ms
- Color: rgba(255,255,255,0.6)
- Scale animation: 0 → 4x

### 4.2 Input Elements

#### Text Input / Textarea
```
Background: Transparent / White
Border: 2px solid #rgba(15,23,35,0.06)
Border-radius: 8px
Padding: 14px 16px
Font-size: 16px (mobile), 14px (desktop)
Min-height: 48px (desktop), 44px (mobile)
Focus: border-color #ff6b35, outline 3px #ff6b35
```

#### Form Label
```
Font-weight: 600
Font-size: 14px
Color: #0f1723 (primary)
Display: block
Margin-bottom: 8px
Indicates required with: <span aria-label="required">*</span>
```

### 4.3 Cards

#### Product Card
```
Background: rgba(255,255,255,0.9)
Border-radius: 12px
Padding: 0 (image), 20px (body)
Box-shadow: 0 8px 24px rgba(0,0,0,0.12)
Hover: transform scale(1.05), shadow elevation
Transform: translateZ(0) for 3D effect
Image-height: 280px (mobile), 320px (tablet), 360px (desktop)
```

#### Order/Admin Card
```
Background: rgba(255,255,255,0.9)
Border-radius: 8px
Padding: 20px
Box-shadow: 0 4px 12px rgba(0,0,0,0.08)
List display: flex, gap: 12px, align-items: center
```

### 4.4 Header/Navigation

#### Topbar (Modern)
```
Display: flex (wraps on mobile to column)
Padding: 16px 20px (mobile), 20px 5% (desktop)
Sticky positioning
Background: rgba(255,255,255,0.9)
Border-bottom: 2px solid var(--border)
Z-index: 100
Box-shadow: 0 2px 8px rgba(0,0,0,0.05)
```

**Topbar Elements:**
- **Brand Button:** Font 20px (mobile), 26px (desktop), font-weight 900, letter-spacing 4px
- **Search Input:** Flex 1, border-radius 25px, padding 12px 20px
- **Actions Nav:** Display flex, gap 8px, flex-wrap wrap
- **Customer ID:** Font-size 12px, muted color, background rgba(107,114,128,0.1)

### 4.5 Hero Banner

```
Height: 400px (mobile), 520px (desktop)
Display: flex, align-items center, justify-content center
Background: Dark gradient (linear + radial)
Color: White
Text-align: center
Overflow: hidden (for floating elements)
Pseudo-elements: ::before, ::after (animated floats)
Animation timing: 8s, 12s (infinite)
```

---

## 5. Layout & Grid System

### Container Widths
| Breakpoint | Width | Padding | Max-width |
|-----------|-------|---------|-----------|
| Mobile (< 640px) | 100% | 20px left/right | 100% |
| Tablet (641-1024px) | 94% | 3% left/right | 1024px |
| Desktop (1025-1399px) | 90% | 5% left/right | 1200px |
| Large (1400px+) | 1400px | auto (centered) | 1400px |

### Grid Layouts
| Section | Columns (Mobile) | Columns (Tablet) | Columns (Desktop) |
|---------|------------------|------------------|-------------------|
| Product Grid | 1 | 2 | 3-4 |
| Admin Items | 1 | 1 | 1 |
| Hero Section | 1 column (stacked) | 1 column (stacked) | 2 columns (left text, right image) |

**Gap:** 20px (mobile), 24px (tablet), 30px (desktop)

---

## 6. Responsive Design Breakpoints

### Breakpoint Strategy (Mobile-First)

```css
/* Base: Mobile < 640px */
@media (max-width: 640px) {
  /* Mobile-specific rules */
  font-sizes: smaller
  padding: reduced
  grid: 1 column
  topbar: column flex
}

/* Tablet 641px - 1024px */
@media (max-width: 768px) {
  /* Tablet adjustments */
  grid: 2 columns
  hero: height 420px
  padding: medium
}

/* Desktop > 1024px */
@media (min-width: 1024px) {
  /* Desktop full features */
  grid: 3-4 columns
  hero: height 520px
  padding: full side padding
}

/* Large screens 1400px+ */
@media (min-width: 1400px) {
  max-width: 1400px
  h1: 56px
  container: centered
}
```

---

## 7. Animation & Interactions

### Animation Library

| Animation | Duration | Easing | Usage |
|-----------|----------|--------|-------|
| **slideInLeft** | 600ms | ease-out | Logo entrance |
| **slideInRight** | 400ms | ease-out | Notifications |
| **slideInUp** | 600-800ms | ease-out | Cards, panels |
| **float** | 8s, 12s | ease-in-out | Hero pseudo-elements |
| **ripple** | 600ms | linear | Button click effect |
| **cart-bump** | 520ms | cubic-bezier(.16,.7,.55,1) | Cart badge update |
| **buy-animate** | 280ms | cubic-bezier(.2,.9,.3,1) | Buy button hover |

### Hover/Focus States
- **Buttons:** Transform translateY(-4px), shadow elevation, opacity transitions
- **Links:** Color change to accent, underline appear
- **Inputs/Selects:** Border color to accent, box-shadow glow (3px #ff6b35)
- **Cards:** Scale 1.05, shadow elevation
- **Navigation items:** Background accent, color white, scale 1.05

### Transition Timing
- **Quick:** 280ms (button hover, ripple)
- **Medium:** 400ms (notifications)
- **Smooth:** 600-800ms (page transitions, card entrance)
- **Slow:** 8-12s (infinite animations)

---

## 8. Accessibility Standards

### 8.1 ARIA & Semantic HTML

**Header & Navigation:**
- `<header role="banner">` with `aria-label="..."` for logo button
- `<nav aria-label="Main navigation">` for action buttons
- `aria-label="{product name}, ₹{price}"` on product cards

**Forms:**
- `<label htmlFor="input-id">` for all form fields
- `aria-required="true"` on required inputs
- `aria-label` on file inputs

**Dynamic Content:**
- `aria-live="polite"` on toast notifications
- `role="list"` / `role="listitem"` on dynamic lists
- `role="status"` on status badges
- `aria-atomic="true"` on atomic updates

**Navigation & Tabs:**
- `role="tab"`, `aria-selected="{boolean}"` on payment tabs
- `role="region"` on major sections
- `role="contentinfo"` on footer

### 8.2 Keyboard Navigation
- **Tab order:** Header → Search → Nav buttons → Main content → Footer
- **Focus indicators:** 3px outline (#ff6b35), 2px offset
- **Skip link:** Appears on first :focus, links to main content
- **All interactive:** Buttons, inputs, tabs fully keyboard accessible

### 8.3 Screen Reader Support
- **Alt text:** All images have descriptive alt text or role="img" aria-label
- **Form labels:** Every input has associated label or aria-label
- **Status updates:** Notifications use aria-live
- **Dynamic lists:** Announced with role and aria-label

### 8.4 Touch Target Sizes
- **Minimum:** 44x44px (WCAG AAA for mobile)
- **Buttons:** min-height 48px (desktop), 44px (mobile)
- **Inputs:** min-height 48px
- **Spacing:** 8px gap between interactive elements

### 8.5 Color Contrast
- **AAA Compliant:**
  - Primary text on white: 18:1
  - Accent on white: 4.5:1+ (AA minimum)
  - All body text: 4.5:1+ ratio

---

## 9. User Flows

### 9.1 Shopping Flow
```
Home (Product Grid)
  ↓ [Browse/Search]
Product Card (View)
  ↓ [Click Buy OR Add to Cart]
  ├─→ Direct Checkout (Buy)
  │   ↓
  │   Payment (Razorpay or Manual UPI)
  │   ↓
  │   Confirmation
  │
  └─→ Cart (Add)
      ↓ [Continue Shopping OR Checkout]
      Checkout
      ↓
      Payment
      ↓
      Confirmation → My Orders
```

### 9.2 Payment Flow

**Razorpay Path:**
- Select product → Checkout page
- Click "Pay ₹{amount}" (instant)
- Razorpay modal opens
- Complete payment → Order confirmed immediately

**Manual UPI Path:**
- Select product → Checkout page
- Fill form: Name, Phone, UPI ID, Receipt image
- Submit → Order status: "Payment Submitted"
- Admin verification required

### 9.3 Admin Flow
```
Admin Login (password: admin123)
  ↓
Admin Dashboard
  ├─→ Add Product (Name, Price, Image URL, Description)
  ├─→ Product List (View/Remove)
  ├─→ Orders to Verify (Verify payment for manual UPI)
  └─→ All Orders (Change status: Confirmed → Dispatched → Delivered)
```

### 9.4 Customer Order Tracking Flow
```
My Orders Page
  ├─→ View all orders (Customer ID filtered)
  ├─→ See status: [Payment Submitted | Confirmed | Dispatched | Delivered]
  └─→ Real-time updates (aria-live announcements)
```

---

## 10. State Management & Data Persistence

### localStorage Keys
| Key | Data | Persistence |
|-----|------|-------------|
| `sb:products` | Product catalog | On admin add/remove |
| `sb:cart` | Current cart items | Auto-sync |
| `sb:orders` | All orders (with history) | Auto-sync |
| `sb:tests` | Testimonials (future) | Auto-sync |

### Component State
- `view`: Current page (home, cart, checkout, orders, admin-login, admin)
- `selected`: Currently selected product for checkout
- `cart`: Array of cart items
- `orders`: Array of orders with status history
- `notif`: Toast notification message
- `isAdmin`: Admin authentication state
- `customerId`: Unique customer ID (generated per session)

---

## 11. API & Payment Integration

### 11.1 Razorpay Integration
- **Test Key:** `rzp_test_1DP5mmOlF23Z58`
- **Flow:** Product → Checkout → Razorpay modal → Confirmation
- **Immediate:** Order status set to "Confirmed" upon payment
- **Order format:**
  ```json
  {
    "id": "SAN-{timestamp}",
    "product": "Product name",
    "amount": 2999,
    "status": "Confirmed",
    "customerId": "CUST-xxxxx",
    "history": [{ "ts": timestamp, "status": "Paid (Razorpay)" }]
  }
  ```

### 11.2 Manual UPI Integration
- **File upload:** Screenshot via Object URL (client-side)
- **Flow:** Form submit → Admin verification → Confirmation
- **Order format:**
  ```json
  {
    "id": "SAN-{timestamp}",
    "product": "Product name",
    "amount": 2999,
    "status": "Payment Submitted",
    "customerId": "CUST-xxxxx",
    "customerName": "User name",
    "customerPhone": "Phone",
    "upi": "UPI ID",
    "screenshot": "Object URL",
    "history": [{ "ts": timestamp, "status": "Payment Submitted" }]
  }
  ```

---

## 12. View Specifications

### 12.1 Home View
- **Hero Banner:** Brand story, CTA buttons (Shop Now, My Orders)
- **Product Grid:** 1 col (mobile) → 2 col (tablet) → 3-4 col (desktop)
- **Product Cards:**
  - Image (280px mobile, 320px tablet, 360px desktop)
  - Title, description
  - Price (₹ notation)
  - Two buttons: Buy, Add to Cart

### 12.2 Cart View
- **Title:** "Your Cart"
- **Cart Items:** List of items with image, name, price
- **Empty State:** "Your cart is empty"
- **CTA:** Checkout button

### 12.3 Checkout View
- **Order Summary:** Product image, name, description, price
- **Payment Options:**
  - Tab 1: Razorpay (instant button)
  - Tab 2: Manual UPI (form)
- **Form (Manual):**
  - Name (required)
  - Phone (required)
  - UPI ID (optional)
  - Receipt image (required, image/* only)
  - Buttons: Submit, Cancel

### 12.4 My Orders View
- **Title:** "My Orders"
- **Order List:** Filtered by customerId
- **Order Card Components:**
  - Order ID
  - Product name
  - Price
  - Status badge (color-coded: pending yellow, confirmed green, dispatched blue, delivered gray)
- **Empty State:** "No orders yet"

### 12.5 Admin Login View
- **Form:**
  - Password input (type="password")
  - Login button
- **Styling:** Centered card, padding 30px+

### 12.6 Admin Dashboard
- **Section 1: Add Product**
  - Form: Name, Price, Image URL, Description
  - Button: Add
  
- **Section 2: Product List**
  - Cards: Product name, price, Remove button
  
- **Section 3: Orders to Verify**
  - Filter: status === "Payment Submitted"
  - Cards: Product name, customer name, phone, UPI, Verify button
  
- **Section 4: All Orders**
  - All orders list
  - Dropdown: Status selector (Confirmed, Dispatched, Delivered)

---

## 13. Performance Metrics

### Target Metrics
- **FCP (First Contentful Paint):** < 1.5s
- **LCP (Largest Contentful Paint):** < 2.5s
- **CLS (Cumulative Layout Shift):** < 0.1
- **Page size:** ~160 KB JS (gzipped 50 KB), ~25 KB CSS (gzipped 5 KB)
- **Build time:** < 2s

### Optimization Techniques
- localStorage for data persistence (no network calls)
- Lazy font loading (Inter from Google Fonts)
- CSS animations use GPU acceleration (transform, opacity)
- Minimal JS bundle (React + Vite esbuild)
- Image optimization (Unsplash URLs with w=900&q=80 params)

---

## 14. Future Enhancements (Roadmap)

### Phase 2
- [ ] User authentication & account management
- [ ] Product search & filtering (category, price range)
- [ ] Favorites/wishlist feature
- [ ] Reviews & ratings system
- [ ] Multiple payment gateways (PayPal, Apple Pay)
- [ ] Email notifications
- [ ] Order tracking notifications

### Phase 3
- [ ] Product recommendations (ML-based)
- [ ] Coupon codes & discount system
- [ ] Inventory management
- [ ] Shipping options & cost calculation
- [ ] Return/refund management
- [ ] Analytics dashboard

### Phase 4
- [ ] Mobile app (React Native)
- [ ] Backend API (Node.js/Express or similar)
- [ ] Database (MongoDB/PostgreSQL)
- [ ] Real payment processing (production keys)
- [ ] CDN for image delivery
- [ ] Multi-language support (i18n)

---

## 15. Browser & Device Support

### Supported Browsers
- **Chrome:** 90+
- **Firefox:** 88+
- **Safari:** 14+
- **Edge:** 90+

### Device Support
- **Mobile:** 320px - 767px width
- **Tablet:** 768px - 1024px width
- **Desktop:** 1025px+ width

### Tested Devices (Responsive)
- iPhone SE / 12 / 14 Pro Max (mobile)
- iPad Air / Pro (tablet)
- MacBook Air / Pro (desktop)
- External displays (1400px+)

---

## 16. Accessibility Checklist

- [x] WCAG AA compliance (4.5:1 contrast minimum)
- [x] Keyboard navigation (Tab, Enter, Arrow keys)
- [x] Screen reader support (ARIA labels, roles, live regions)
- [x] Focus indicators (visible on all interactive elements)
- [x] Touch targets (44-48px minimum)
- [x] Form labels (associated with inputs)
- [x] Image alt text (all images labeled)
- [x] Color not sole indicator (icons, text, badges)
- [x] Animations can be disabled (prefers-reduced-motion ready)
- [x] Skip links (keyboard navigation shortcut)
- [x] Mobile font sizes (≥16px prevents auto-zoom)

---

## 17. Design Tokens Summary

### Quick Reference
```css
/* Colors */
--primary: #0f1723
--secondary: #ffffff
--accent: #ff6b35
--dark-accent: #d84315
--muted: #6b7280

/* Spacing */
--gap-sm: 8px
--gap-md: 12px
--gap-lg: 16px
--gap-xl: 20px
--gap-2xl: 24px

/* Typography */
--font-family: 'Inter', system-ui
--font-weight-normal: 400
--font-weight-bold: 600
--font-weight-black: 800/900

/* Shadows */
--shadow-sm: 0 2px 8px rgba(0,0,0,0.05)
--shadow-md: 0 8px 24px rgba(0,0,0,0.12)
--shadow-lg: 0 18px 40px rgba(17,24,39,0.12)

/* Radius */
--radius-sm: 4px
--radius-md: 8px
--radius-lg: 10px
--radius-full: 25px

/* Transitions */
--transition-fast: 280ms ease
--transition-normal: 400ms ease-out
--transition-slow: 600ms ease-out
```

---

**End of UI/UX Design Plan**  
*This document represents the current design system and should be used as reference for maintaining design consistency across the platform.*
