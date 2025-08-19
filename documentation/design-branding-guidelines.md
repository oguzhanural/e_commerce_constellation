# Design & Branding Guidelines

## Project: e_commerce_constellation
### Version: 1.0
### Date: 2025-01-11
### Status: Living Document

---

## 1. Executive Summary

This document defines the visual identity, user experience patterns, and component design system for **e_commerce_constellation** - a modern Apollo Federation v2 e-commerce platform designed for learning and professional development. The guidelines balance sophisticated technical architecture with approachable user experience, supporting both Turkish and international markets.

**Target Audience**: Frontend developers, UX designers, product managers, and contributors working on the constellation platform.

---

## 2. Brand Philosophy & Identity

### 2.1 Brand Foundations

**Brand Concept**: A constellation of interconnected services working in perfect harmony, representing the federated microservices architecture while delivering a unified e-commerce experience.

**Core Values**:
- **Federation Excellence**: Multiple services, one seamless experience
- **Learning-First**: Professional development through real-world patterns
- **Turkish Excellence**: Built with Turkish market insights and global standards
- **Technical Craftsmanship**: Code quality and architecture as core differentiators
- **User Empowerment**: Making complex technology feel simple and reliable

**Brand Personality**:
- **Professional yet Approachable**: Expert-level engineering with human-centered design
- **Reliable & Trustworthy**: E-commerce requires absolute trust in transactions
- **Innovation-Driven**: Cutting-edge federation technology made accessible
- **Culturally Aware**: Understands Turkish market nuances while maintaining global appeal

### 2.2 Naming & Terminology

**Primary Name**: `e_commerce_constellation` (technical/repository contexts)
**Display Name**: **Constellation** (user-facing contexts)
**Short Name**: **Const** (internal team usage)

**Service Naming Pattern**:
- Subgraphs: `identity`, `catalog`, `pricing`, `inventory`, `cart`, `order`, `payment`, `shipping`
- Apps: `web`, `router`
- Packages: `@constellation/[package-name]`

**Repository Conventions**:
- Main repo: `e_commerce_constellation`
- Related tools: `constellation-[tool-name]`

---

## 3. Visual Identity System

### 3.1 Logo & Brand Mark

**Primary Logo**: Constellation star pattern + wordmark "Constellation"
- **Symbol**: 8 connected stars representing the 8 federated subgraphs
- **Connection Lines**: Subtle lines showing federation relationships
- **Typography**: Modern sans-serif with technical precision

**Logo Variations**:
- **Primary**: Full logo with symbol + wordmark
- **Symbol Only**: For small spaces and favicons
- **Wordmark Only**: For text-heavy contexts
- **Monochrome**: For single-color applications

**Usage Guidelines**:
- **Minimum Size**: 32px height for digital, 15mm for print
- **Clear Space**: Minimum 24px on all sides
- **Backgrounds**: Works on light, dark, and brand color backgrounds
- **DO NOT**: Rotate, distort, add effects, or modify proportions

**File Naming Convention**:
```
logo-primary.svg          # Full color on light background
logo-primary-dark.svg     # Full color on dark background  
logo-monochrome.svg       # Single color version
logo-symbol.svg           # Symbol only
wordmark.svg              # Text only
favicon.svg               # Simplified for icon use
```

### 3.2 Color System

**Philosophy**: Colors should reflect trust, professionalism, and Turkish cultural affinity while supporting complex e-commerce interfaces with clear information hierarchy.

#### Primary Palette

**Brand Primary (Turkish Blue)**:
- `--color-primary-50: #eff6ff`   # Lightest tint
- `--color-primary-100: #dbeafe`  # Light backgrounds
- `--color-primary-200: #bfdbfe`  # Subtle accents
- `--color-primary-300: #93c5fd`  # Disabled states
- `--color-primary-400: #60a5fa`  # Hover states
- `--color-primary-500: #3b82f6`  # Main brand color
- `--color-primary-600: #2563eb`  # Primary actions
- `--color-primary-700: #1d4ed8`  # Pressed states
- `--color-primary-800: #1e40af`  # Dark mode primary
- `--color-primary-900: #1e3a8a`  # Darkest shade

**Secondary (Turkish Red)**:
- `--color-secondary-500: #dc2626` # Turkish flag red
- `--color-secondary-600: #b91c1c` # Actions and accents
- `--color-secondary-700: #991b1b` # Pressed states

#### Semantic Colors

**Success (Turkish Green)**:
- `--color-success-500: #059669`  # Order completed, payment success
- `--color-success-600: #047857`  # Primary success actions
- `--color-success-50: #ecfdf5`   # Success backgrounds

**Warning (Turkish Gold)**:
- `--color-warning-500: #d97706`  # Low stock, pending payments
- `--color-warning-600: #b45309`  # Warning actions
- `--color-warning-50: #fffbeb`   # Warning backgrounds

**Error/Danger**:
- `--color-error-500: #dc2626`    # Payment failed, out of stock
- `--color-error-600: #b91c1c`    # Error actions
- `--color-error-50: #fef2f2`     # Error backgrounds

**Info (Federation Blue)**:
- `--color-info-500: #0ea5e9`     # System messages, federation status
- `--color-info-600: #0284c7`     # Info actions
- `--color-info-50: #f0f9ff`      # Info backgrounds

#### Neutral System

**Light Theme**:
- `--color-background: #ffffff`    # Main background
- `--color-surface: #f9fafb`       # Card backgrounds
- `--color-surface-elevated: #ffffff` # Modal, dropdown backgrounds
- `--color-border: #e5e7eb`        # Subtle borders
- `--color-border-strong: #d1d5db` # Prominent borders
- `--color-text-primary: #111827`  # Main text
- `--color-text-secondary: #6b7280` # Secondary text
- `--color-text-muted: #9ca3af`    # Placeholder, disabled text

**Dark Theme**:
- `--color-background: #0f172a`    # Main background
- `--color-surface: #1e293b`       # Card backgrounds
- `--color-surface-elevated: #334155` # Modal, dropdown backgrounds
- `--color-border: #334155`        # Subtle borders
- `--color-border-strong: #475569` # Prominent borders
- `--color-text-primary: #f8fafc`  # Main text
- `--color-text-secondary: #cbd5e1` # Secondary text
- `--color-text-muted: #64748b`    # Placeholder, disabled text

### 3.3 Typography

**Philosophy**: Typography should support complex e-commerce interfaces with clear information hierarchy while maintaining readability across all Turkish characters.

#### Font Stack

**Primary (UI Text)**:
- **Font**: Inter Variable
- **Fallback**: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif
- **Features**: Full Turkish character support, excellent number readability for prices

**Monospace (Code/Data)**:
- **Font**: JetBrains Mono
- **Fallback**: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, monospace
- **Usage**: Product IDs, order numbers, technical data

#### Type Scale & Hierarchy

**Display Text** (Marketing, Heroes):
- `--font-size-display-xl: 4.5rem` (72px) - Hero headlines
- `--font-size-display-lg: 3.75rem` (60px) - Page headlines
- `--font-size-display-md: 3rem` (48px) - Section headlines

**Headings** (Content Structure):
- `--font-size-h1: 2.25rem` (36px) - Page titles
- `--font-size-h2: 1.875rem` (30px) - Section titles
- `--font-size-h3: 1.5rem` (24px) - Subsection titles
- `--font-size-h4: 1.25rem` (20px) - Component titles

**Body Text** (Interface & Content):
- `--font-size-body-lg: 1.125rem` (18px) - Large body text
- `--font-size-body: 1rem` (16px) - Default body text
- `--font-size-body-sm: 0.875rem` (14px) - Small body text
- `--font-size-caption: 0.75rem` (12px) - Captions, metadata

**E-commerce Specific**:
- **Product Prices**: Use `body-lg` or `h4` with tabular numbers
- **Product Titles**: Use `h3` for listing, `h2` for detail pages
- **Order Numbers**: Use `monospace` with letter-spacing
- **Currency**: Always include "₺" symbol, formatted consistently

#### Font Weights

- `--font-weight-thin: 100`      # Decorative only
- `--font-weight-light: 300`     # Subtle emphasis
- `--font-weight-normal: 400`    # Body text default
- `--font-weight-medium: 500`    # UI elements, buttons
- `--font-weight-semibold: 600`  # Headings, important info
- `--font-weight-bold: 700`      # Strong emphasis
- `--font-weight-extrabold: 800` # Display text only

#### Line Heights

- **Display**: 1.1 (tight for impact)
- **Headings**: 1.25 (balanced for readability)
- **Body**: 1.5 (comfortable for reading)
- **UI Elements**: 1.25 (compact for interfaces)

---

## 4. Layout & Spacing System

### 4.1 Grid System

**Base Unit**: 4px (0.25rem)
**Primary Scale**: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96px

**Responsive Breakpoints**:
```css
--breakpoint-sm: 640px   # Mobile landscape
--breakpoint-md: 768px   # Tablet portrait
--breakpoint-lg: 1024px  # Tablet landscape
--breakpoint-xl: 1280px  # Desktop
--breakpoint-2xl: 1536px # Large desktop
```

**Container Widths**:
- **Mobile**: Full width with 16px padding
- **Tablet**: 720px max-width
- **Desktop**: 1200px max-width
- **Large**: 1400px max-width

### 4.2 Spacing Scale

**Micro Spacing** (Component internals):
- `--space-1: 0.25rem` (4px) - Icon-text gaps
- `--space-2: 0.5rem` (8px) - Button padding, form gaps
- `--space-3: 0.75rem` (12px) - Card padding

**Macro Spacing** (Layout structure):
- `--space-4: 1rem` (16px) - Default component margin
- `--space-6: 1.5rem` (24px) - Section spacing
- `--space-8: 2rem` (32px) - Page section gaps
- `--space-12: 3rem` (48px) - Major section breaks
- `--space-16: 4rem` (64px) - Page margins

**E-commerce Specific Spacing**:
- **Product Grid Gap**: 24px (space-6)
- **Cart Item Spacing**: 16px (space-4)
- **Checkout Step Gap**: 32px (space-8)
- **Page Header Margin**: 48px (space-12)

### 4.3 Border Radius System

**Scale**:
- `--radius-none: 0px`      # Sharp edges for data tables
- `--radius-sm: 0.25rem`    # Form inputs, small buttons
- `--radius-md: 0.375rem`   # Default button radius
- `--radius-lg: 0.5rem`     # Cards, containers
- `--radius-xl: 0.75rem`    # Large cards, modals
- `--radius-2xl: 1rem`      # Hero sections, major components
- `--radius-full: 9999px`   # Circular elements (avatars, badges)

**E-commerce Applications**:
- **Product Images**: radius-lg
- **Add to Cart Buttons**: radius-md
- **Price Tags**: radius-sm
- **Category Badges**: radius-full

---

## 5. Component Design System

### 5.1 Button System

**Philosophy**: Buttons should clearly indicate hierarchy and action consequence, especially for e-commerce transactions.

#### Button Variants

**Primary** (Main CTAs):
```css
background: var(--color-primary-600);
color: white;
border: none;
padding: 12px 24px;
border-radius: var(--radius-md);
font-weight: var(--font-weight-medium);

&:hover { background: var(--color-primary-700); }
&:focus { outline: 2px solid var(--color-primary-400); }
&:disabled { opacity: 0.5; pointer-events: none; }
```

**Secondary** (Supporting actions):
```css
background: transparent;
color: var(--color-primary-600);
border: 1px solid var(--color-border-strong);
padding: 12px 24px;
border-radius: var(--radius-md);

&:hover { background: var(--color-primary-50); }
```

**Destructive** (Delete, cancel orders):
```css
background: var(--color-error-600);
color: white;
/* Similar styling to primary */
```

**Ghost** (Subtle actions):
```css
background: transparent;
color: var(--color-text-secondary);
border: none;
padding: 12px 24px;

&:hover { background: var(--color-surface); }
```

#### E-commerce Button Usage

- **Add to Cart**: Primary variant, with shopping cart icon
- **Buy Now**: Primary variant, distinct color (secondary-600)
- **Remove from Cart**: Destructive variant, small size
- **Continue Shopping**: Secondary variant
- **Proceed to Checkout**: Primary variant, larger size

### 5.2 Form Components

**Input Fields**:
```css
.input {
  height: 44px;
  padding: 0 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-body);
  background: var(--color-background);
  
  &:focus {
    outline: none;
    border-color: var(--color-primary-500);
    box-shadow: 0 0 0 3px var(--color-primary-100);
  }
  
  &:error {
    border-color: var(--color-error-500);
  }
  
  &::placeholder {
    color: var(--color-text-muted);
  }
}
```

**Turkish E-commerce Specific Inputs**:
- **Phone Number**: Format mask for Turkish mobile (+90 5XX XXX XX XX)
- **Address**: Support for Turkish address format (Mahalle, Sokak, etc.)
- **TC Kimlik No**: Validation for Turkish national ID
- **Price Display**: Always show ₺ symbol, support thousands separator

### 5.3 Card Components

**Product Card**:
```css
.product-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  transition: all 0.2s ease;
  
  &:hover {
    border-color: var(--color-primary-300);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
}
```

**Cart Item Card**:
```css
.cart-item {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  
  display: grid;
  grid-template-columns: 80px 1fr auto auto;
  gap: var(--space-4);
  align-items: center;
}
```

### 5.4 Navigation Components

**Header Navigation**:
- **Height**: 72px on desktop, 64px on mobile
- **Logo Position**: Left-aligned
- **Search Bar**: Center (desktop), hidden on mobile
- **User Actions**: Right-aligned (cart, account, language)
- **Background**: Semi-transparent with backdrop blur

**Breadcrumb Navigation**:
```css
.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-text-secondary);
  font-size: var(--font-size-body-sm);
  
  .separator {
    color: var(--color-text-muted);
  }
  
  .current {
    color: var(--color-text-primary);
    font-weight: var(--font-weight-medium);
  }
}
```

---

## 6. E-commerce UX Patterns

### 6.1 Product Display Patterns

**Product Grid**:
- **Desktop**: 4 columns with 24px gaps
- **Tablet**: 3 columns with 20px gaps  
- **Mobile**: 2 columns with 16px gaps
- **Infinite Scroll**: Load 20 items per batch
- **Loading States**: Skeleton cards matching final layout

**Product Detail Layout**:
```
┌─────────────────┬─────────────────┐
│                 │  Product Title  │
│   Image Gallery │  Price          │
│   (Primary)     │  Stock Status   │
│                 │  Add to Cart    │
│                 │  Variations     │
├─────────────────┼─────────────────┤
│   Thumbnails    │  Description    │
│   (Secondary)   │  Specifications │
└─────────────────┴─────────────────┘
```

**Price Display Standards**:
- **Format**: ₺XX,XX (thousands separator, two decimals)
- **Original Price**: Strikethrough when discounted
- **Discount**: Show percentage and "İndirimli" badge
- **Currency**: Always Turkish Lira (₺) for MVP
- **Tax**: "KDV Dahil" indication required

### 6.2 Shopping Cart Patterns

**Cart Summary Structure**:
```
Cart Items
├── Item 1 (Image, Title, Price, Quantity Controls, Remove)
├── Item 2 (...)
└── Item N (...)

Summary
├── Subtotal: ₺XXX,XX
├── KDV (18%): ₺XX,XX
├── Shipping: ₺XX,XX (or "Ücretsiz")
└── Total: ₺XXX,XX

Actions
├── Continue Shopping (Secondary)
└── Proceed to Checkout (Primary)
```

**Quantity Controls**:
- **Stepper**: - / input field / + buttons
- **Min Quantity**: 1 (enforce in UI)
- **Max Quantity**: Based on stock level
- **Immediate Update**: Quantity changes update totals instantly
- **Remove Item**: Trash icon with confirmation

### 6.3 Checkout Flow Patterns

**Multi-Step Checkout**:
1. **Shipping Information** (Address, delivery options)
2. **Payment Information** (Mock payment form)
3. **Order Review** (Final confirmation)
4. **Order Confirmation** (Success state with order number)

**Form Validation**:
- **Real-time**: Validate on field blur
- **Turkish Address**: Support mahalle, sokak, bina format
- **Phone**: Turkish mobile format (+90 5XX XXX XX XX)
- **Error States**: Red border + error message below field
- **Success States**: Green checkmark for completed sections

### 6.4 Order Management Patterns

**Order Status Hierarchy**:
1. **Sipariş Alındı** (Order Received) - Primary color
2. **Hazırlanıyor** (Preparing) - Warning color  
3. **Kargoya Verildi** (Shipped) - Info color
4. **Teslim Edildi** (Delivered) - Success color
5. **İptal Edildi** (Cancelled) - Error color

**Order History List**:
- **Chronological**: Most recent first
- **Status Badge**: Color-coded status indicator
- **Quick Actions**: View details, reorder, track shipment
- **Pagination**: 10 orders per page

---

## 7. Responsive Design Strategy

### 7.1 Mobile-First Approach

**Design Principles**:
- **Touch-First**: Minimum 44px touch targets
- **Thumb Navigation**: Important actions in thumb-reach zones
- **Progressive Enhancement**: Add features for larger screens
- **Performance**: Optimize images and interactions for mobile

**Mobile Layout Patterns**:
- **Stack Everything**: Single column layout
- **Sticky Header**: Navigation always accessible
- **Bottom Sheet**: For filters, cart summary
- **Swipe Gestures**: Product image galleries, category switching

### 7.2 Cross-Device Consistency

**Shared Elements**:
- **Color System**: Identical across all devices
- **Typography**: Scale proportionally
- **Spacing**: Maintain relative relationships
- **Interactions**: Consistent feedback patterns

**Device-Specific Optimizations**:
- **Desktop**: Hover states, larger click targets, multi-column layouts
- **Tablet**: Touch-optimized with desktop-like information density
- **Mobile**: Essential information only, gesture-driven navigation

---

## 8. International & Accessibility

### 8.1 Turkish Market Considerations

**Language Support**:
- **Primary**: Turkish (tr-TR)
- **Secondary**: English (en-US) for technical documentation
- **Character Set**: Full Turkish alphabet support (ç, ğ, ı, ö, ş, ü)
- **RTL**: Not required for Turkish, but architecture should support future Arabic

**Cultural Adaptations**:
- **Payment**: Turkish payment methods prominent
- **Address**: Turkish address format standard
- **Phone**: Turkish mobile number format
- **Holidays**: Turkish national holidays in date pickers
- **Business Hours**: Turkish timezone (TRT, GMT+3)

**Legal Compliance**:
- **KVKK**: Turkish personal data protection law
- **Consumer Rights**: 14-day return policy notice
- **VAT**: 18% KDV display required
- **E-Commerce Law**: Distance selling contract requirements

### 8.2 Accessibility (WCAG 2.1 AA)

**Color & Contrast**:
- **Text**: 4.5:1 contrast ratio minimum
- **Large Text**: 3:1 contrast ratio minimum  
- **UI Components**: 3:1 contrast for buttons, form controls
- **Color Independence**: Never rely on color alone for meaning

**Keyboard Navigation**:
- **Tab Order**: Logical flow through interactive elements
- **Focus Indicators**: 2px outline with high contrast
- **Skip Links**: "Skip to main content" for screen readers
- **Keyboard Shortcuts**: Common e-commerce actions (/, esc, enter)

**Screen Reader Support**:
- **Semantic HTML**: Proper heading hierarchy (h1-h6)
- **ARIA Labels**: For complex interactions and status updates
- **Live Regions**: For cart updates, form validation
- **Alt Text**: Descriptive product image descriptions

**Motion & Animation**:
- **Reduced Motion**: Respect `prefers-reduced-motion` setting
- **Essential Motion**: Only for loading states and feedback
- **Duration**: Maximum 300ms for UI transitions
- **Easing**: Natural, not mechanical motion curves

---

## 9. Component Library Integration

### 9.1 Tailwind CSS Configuration

**Custom Tailwind Config**:
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        secondary: {
          500: '#dc2626',
          600: '#b91c1c',
        },
      },
      fontFamily: {
        sans: ['Inter Variable', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
```

### 9.2 shadcn/ui Component Adaptations

**Button Component**:
```tsx
// components/ui/button.tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary-600 text-white hover:bg-primary-700",
        destructive: "bg-error-600 text-white hover:bg-error-700",
        secondary: "border border-border bg-background hover:bg-surface",
        ghost: "hover:bg-surface hover:text-primary-600",
      },
      size: {
        default: "h-11 py-2 px-6",
        sm: "h-9 px-4 rounded-md",
        lg: "h-12 px-8 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

**Input Component**:
```tsx
// components/ui/input.tsx
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-sm border border-border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
```

### 9.3 Radix UI Integration

**Dialog Component** (for cart, checkout flows):
```tsx
// components/ui/dialog.tsx
export const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-surface p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full",
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPortal>
))
```

---

## 10. Motion & Interaction Design

### 10.1 Animation Principles

**Purpose-Driven Motion**:
- **Feedback**: Confirm user actions (button clicks, form submissions)
- **Guidance**: Direct attention to important elements
- **Spatial Awareness**: Show relationships between interface elements
- **Personality**: Reinforce brand character without distraction

**Timing & Easing**:
```css
/* Standard Transitions */
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-normal: 200ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1);

/* E-commerce Specific */
--transition-cart: 250ms cubic-bezier(0.2, 0, 0.2, 1); /* Add to cart */
--transition-checkout: 400ms cubic-bezier(0.4, 0, 0.2, 1); /* Step transitions */
```

### 10.2 E-commerce Specific Animations

**Add to Cart Animation**:
```css
@keyframes addToCart {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.add-to-cart-success {
  animation: addToCart 0.3s ease-out;
}
```

**Price Update Animation**:
```css
@keyframes priceChange {
  0% { color: var(--color-text-primary); }
  50% { color: var(--color-primary-600); font-weight: 600; }
  100% { color: var(--color-text-primary); }
}
```

**Loading States**:
- **Skeleton**: Use shimmer animation for content loading
- **Spinner**: For action feedback (searching, submitting)
- **Progress**: For multi-step processes (checkout, file upload)

### 10.3 Micro-interactions

**Button States**:
- **Hover**: Subtle background color shift (100ms)
- **Active**: Scale down 98% + darker background (100ms)
- **Loading**: Spinner animation with disabled state
- **Success**: Checkmark animation with color change

**Form Feedback**:
- **Validation**: Red border animation on error (200ms)
- **Success**: Green checkmark fade-in (300ms)
- **Focus**: Outline animation with color transition (150ms)

---

## 11. Performance & Optimization

### 11.1 Design Performance Considerations

**Image Strategy**:
- **Format**: WebP with JPEG fallback
- **Responsive**: Multiple sizes for different viewports
- **Lazy Loading**: Below-the-fold product images
- **Optimization**: Maximum 85% quality for e-commerce images
- **Alt Text**: SEO and accessibility optimized descriptions

**Font Loading**:
```css
/* Preload critical fonts */
<link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>

/* Font display strategy */
@font-face {
  font-family: 'Inter Variable';
  src: url('/fonts/inter-var.woff2') format('woff2');
  font-display: swap; /* Show fallback immediately */
}
```

**CSS Optimization**:
- **Critical CSS**: Inline above-the-fold styles
- **Purge**: Remove unused Tailwind classes in production
- **Compression**: Gzip/Brotli compression for CSS files
- **Caching**: Long-term caching with versioned filenames

### 11.2 Perceived Performance

**Loading Sequences**:
1. **Skeleton UI**: Show layout structure immediately
2. **Progressive Enhancement**: Load content in priority order
3. **Chunked Loading**: Load visible content first
4. **Preemptive Loading**: Anticipate user actions

**Interactive Feedback**:
- **Immediate**: Visual feedback within 16ms
- **Contextual**: Show what's happening during waits
- **Informative**: Provide progress indicators for long operations

---

## 12. Development Guidelines

### 12.1 Component Development Standards

**File Organization**:
```
components/
├── ui/                    # Base shadcn/ui components
│   ├── button.tsx
│   ├── input.tsx
│   └── dialog.tsx
├── commerce/              # E-commerce specific
│   ├── product-card.tsx
│   ├── cart-item.tsx
│   └── checkout-form.tsx
├── layout/                # Layout components
│   ├── header.tsx
│   ├── footer.tsx
│   └── sidebar.tsx
└── federation/            # Federation-aware components
    ├── subgraph-status.tsx
    └── error-boundary.tsx
```

**Component Props Patterns**:
```tsx
// E-commerce component example
interface ProductCardProps {
  product: {
    id: string;
    title: string;
    slug: string;
    images: string[];
  };
  pricing?: {
    currentPrice: Money;
    originalPrice?: Money;
  };
  inventory?: {
    inStock: boolean;
    stockLevel: number;
  };
  onAddToCart?: (productId: string) => void;
  variant?: 'default' | 'compact' | 'featured';
  className?: string;
}
```

### 12.2 Design Token Implementation

**CSS Custom Properties**:
```css
/* tokens.css */
:root {
  /* Colors */
  --color-primary-600: #2563eb;
  --color-success-600: #047857;
  
  /* Typography */
  --font-size-body: 1rem;
  --font-weight-medium: 500;
  
  /* Spacing */
  --space-4: 1rem;
  --space-6: 1.5rem;
  
  /* Borders */
  --radius-md: 0.375rem;
  --border-width: 1px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}
```

**TypeScript Token Types**:
```typescript
// types/design-tokens.ts
export type ColorToken = 
  | 'primary-600' 
  | 'success-600' 
  | 'error-600'
  | 'warning-600';

export type SpacingToken = 
  | 'space-1' 
  | 'space-2' 
  | 'space-4' 
  | 'space-6';

export type FontSizeToken = 
  | 'body-sm' 
  | 'body' 
  | 'body-lg' 
  | 'h3' 
  | 'h2';
```

---

## 13. Quality Assurance & Testing

### 13.1 Design QA Checklist

**Visual Consistency**:
- [ ] Colors match design tokens exactly
- [ ] Typography follows scale and hierarchy
- [ ] Spacing uses 4px grid system
- [ ] Border radius follows system values
- [ ] Icons are consistent size and style

**Responsive Design**:
- [ ] Layout works on mobile (320px+)
- [ ] Tablet view is optimized (768px-1024px)
- [ ] Desktop takes advantage of space (1024px+)
- [ ] Touch targets are minimum 44px
- [ ] Text remains readable at all sizes

**Accessibility**:
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Focus states are visible and consistent
- [ ] Keyboard navigation works completely
- [ ] Screen reader markup is semantic
- [ ] Alt text is descriptive and useful

**E-commerce Specific**:
- [ ] Prices display correctly with ₺ symbol
- [ ] Cart updates provide clear feedback
- [ ] Checkout flow is logical and secure
- [ ] Error states are helpful and actionable
- [ ] Loading states prevent user confusion

### 13.2 Cross-Browser Testing

**Supported Browsers**:
- **Desktop**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+, Samsung Internet 14+

**Testing Priorities**:
1. **Critical Flows**: Product browsing, cart, checkout
2. **Interactive Elements**: Forms, buttons, modals
3. **Performance**: Page load times, animation smoothness
4. **Accessibility**: Screen reader compatibility, keyboard navigation

---

## 14. Maintenance & Evolution

### 14.1 Design System Versioning

**Semantic Versioning**:
- **Major** (1.0.0): Breaking changes to component APIs
- **Minor** (1.1.0): New components or significant enhancements
- **Patch** (1.1.1): Bug fixes and small improvements

**Change Management**:
- **RFC Process**: Major changes require design proposal
- **Deprecation**: 6-month notice for component removals
- **Migration Guides**: Clear upgrade paths for breaking changes
- **Changelog**: Detailed release notes for all versions

### 14.2 Feedback & Iteration

**Data Collection**:
- **User Testing**: Regular usability sessions with Turkish users
- **Analytics**: Heat maps, click tracking, conversion funnels
- **Performance**: Core Web Vitals monitoring
- **Accessibility**: Regular audits and user feedback

**Continuous Improvement**:
- **Quarterly Reviews**: Assess component usage and effectiveness
- **A/B Testing**: Test design variations for key flows
- **Community Input**: Developer feedback on component APIs
- **Market Research**: Stay current with e-commerce design trends

---

## 15. Resources & References

### 15.1 Design Tools & Assets

**Design Files**:
- **Figma Library**: Constellation Design System Components
- **Icon Library**: Lucide React icons with custom Turkish e-commerce additions
- **Brand Assets**: Logos, wordmarks, and brand guidelines package

**Development Resources**:
- **Storybook**: Component documentation and playground
- **Design Tokens**: JSON/CSS exports for development teams
- **Code Snippets**: Ready-to-use component implementations

### 15.2 External References

**Accessibility**:
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Turkish Accessibility Standards](https://www.btk.gov.tr/erisilebilirlik)

**E-commerce UX**:
- [Baymard Institute UX Research](https://baymard.com/)
- [Turkish E-commerce Best Practices](https://www.eticaret.gov.tr/)

**Technical Integration**:
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Radix UI Documentation](https://www.radix-ui.com/)
- [shadcn/ui Component Library](https://ui.shadcn.com/)

---

## 16. Appendix

### 16.1 Turkish Localization Patterns

**Common UI Text**:
- "Sepete Ekle" (Add to Cart)
- "Satın Al" (Buy Now)
- "Ücretsiz Kargo" (Free Shipping)
- "Stokta Var" / "Stokta Yok" (In Stock / Out of Stock)
- "Toplam Tutar" (Total Amount)
- "KDV Dahil" (VAT Included)
- "Sipariş Ver" (Place Order)
- "Ödeme Yap" (Make Payment)

**Date & Number Formats**:
- **Date**: DD.MM.YYYY (Turkish standard)
- **Currency**: ₺X.XXX,XX (Turkish Lira with thousands separator)
- **Phone**: +90 5XX XXX XX XX (Turkish mobile format)
- **Postal Code**: XXXXX (5-digit Turkish postal codes)

### 16.2 Component Code Examples

**Turkish Price Component**:
```tsx
// components/ui/price.tsx
interface PriceProps {
  amount: number; // in cents
  currency: string;
  originalAmount?: number;
  showVAT?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Price({ 
  amount, 
  currency = 'TRY', 
  originalAmount, 
  showVAT = true, 
  size = 'md' 
}: PriceProps) {
  const formatted = new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount / 100);

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg font-semibold',
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        {originalAmount && originalAmount > amount && (
          <span className="text-muted-foreground line-through text-sm">
            {new Intl.NumberFormat('tr-TR', {
              style: 'currency',
              currency: currency,
            }).format(originalAmount / 100)}
          </span>
        )}
        <span className={cn('text-foreground', sizeClasses[size])}>
          {formatted}
        </span>
      </div>
      {showVAT && (
        <span className="text-xs text-muted-foreground">KDV Dahil</span>
      )}
    </div>
  );
}
```

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-11  
**Next Review**: 2025-04-11  
**Maintained By**: e_commerce_constellation Design Team
