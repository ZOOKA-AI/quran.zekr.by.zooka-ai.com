# Layout Architecture Documentation

## 📋 Overview

This document describes the refactored Layout architecture that is **Base44-compatible** and **1:1 migration-ready for Next.js**.

## 🏗️ Architecture Principles

The restructured layout follows these key principles:

1. **Separation of Concerns** - Each component has a single responsibility
2. **Data Separation** - Navigation and configuration data are separated from components
3. **Migration-Ready** - Structure matches Next.js App Router patterns
4. **Type Safety** - TypeScript types for better maintainability
5. **Clean Code** - No inline styles, minimal state, clear dependencies

## 📁 File Structure

```
src/
├── Layout.tsx                      # Main layout wrapper (will become RootLayout in Next.js)
├── components/
│   └── layout/
│       ├── Navbar.tsx              # Top navigation with menu button
│       ├── MobileMenu.tsx          # Side sheet navigation menu
│       └── Footer.tsx              # Application footer
├── data/
│   └── navigation.ts               # Navigation configuration (types + data)
└── hooks/
    └── usePageMeta.ts              # SEO metadata hook (will become Metadata API)
```

## 🧩 Component Breakdown

### `Layout.tsx`
- **Purpose**: Main layout wrapper that composes all layout elements
- **Migration**: Will become `app/layout.tsx` (RootLayout) in Next.js
- **Dependencies**: Navbar, MobileMenu, Footer, PWA components
- **State**: Minimal - only sidebar open/close state

### `Navbar.tsx`
- **Purpose**: Floating menu button
- **Props**: `onMenuOpen` callback
- **Migration**: No changes needed for Next.js

### `MobileMenu.tsx`
- **Purpose**: Side sheet navigation with all menu items
- **Props**: `isOpen`, `onClose`, `currentPageName`
- **Data**: Imports from `navigation.ts`
- **Migration**: Replace `Link` from `react-router-dom` with `next/link`

### `Footer.tsx`
- **Purpose**: Application footer with credits and links
- **Migration**: No changes needed for Next.js

### `navigation.ts`
- **Purpose**: Centralized navigation configuration
- **Exports**: 
  - `NavItem` type
  - `QuickAction` type
  - `MAIN_NAV` array
  - `QUICK_ACTIONS` array
  - `QURAN_STATS` array
- **Migration**: No changes needed for Next.js

### `usePageMeta.ts`
- **Purpose**: Manage document title and meta tags
- **Usage**: `usePageMeta({ title, description })`
- **Migration**: Replace with Next.js Metadata API

## 🔄 Next.js Migration Path

When migrating to Next.js, follow these steps:

### 1. Layout.tsx → app/layout.tsx
```typescript
// Current (React Router)
export default function Layout({ children, currentPageName }) { ... }

// Future (Next.js)
export default function RootLayout({ children }) { ... }
```

### 2. Navigation Links
```typescript
// Current (React Router)
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

// Future (Next.js)
import Link from 'next/link';
// createPageUrl stays the same
```

### 3. SEO/Metadata
```typescript
// Current (React Router)
import { usePageMeta } from '@/hooks/usePageMeta';
usePageMeta({ title: 'Page Title', description: '...' });

// Future (Next.js)
export const metadata = {
  title: 'Page Title',
  description: '...',
};
```

### 4. Fonts
```typescript
// Current (CSS import in globals.css)
@import url('https://fonts.googleapis.com/css2?family=Cairo...');

// Future (Next.js)
import { Cairo, Amiri } from 'next/font/google';
const cairo = Cairo({ subsets: ['arabic', 'latin'] });
```

## 📊 Benefits of This Structure

### ✅ For Base44
- Fully compatible with Base44 platform
- Cleaner, more maintainable code
- Better performance (separated components)
- Easier debugging

### ✅ For Next.js Migration
- Minimal code changes required
- Same component structure
- Same data structure
- Clear migration path

### ✅ For Development
- Type-safe navigation configuration
- Single source of truth for navigation
- Easy to add/remove navigation items
- Reusable components

## 🔧 How to Add a New Navigation Item

1. Open `src/data/navigation.ts`
2. Add to the `MAIN_NAV` array:

```typescript
{
  name: 'اسم الصفحة',
  path: 'PageName',
  icon: IconComponent,
  color: 'text-color-class'
}
```

3. The item will automatically appear in the mobile menu
4. No other changes needed!

## 🎨 Styling

All styling is done using:
- **Tailwind CSS** utility classes
- **CSS Custom Properties** in `globals.css`
- **No inline styles** in components

### Key CSS Variables
```css
--emerald-50: #ecfdf5;
--emerald-600: #059669;
--emerald-700: #047857;
--emerald-800: #065f46;
--amber-300: #fcd34d;
```

## 🧪 Testing Checklist

When making changes to the layout:

- [ ] Verify navigation links work correctly
- [ ] Test mobile menu open/close functionality
- [ ] Check responsive design on different screen sizes
- [ ] Ensure no TypeScript errors
- [ ] Run build to verify compilation
- [ ] Test logout functionality
- [ ] Verify quick action links work
- [ ] Check footer links are functional

## 📝 Notes

- The current implementation uses React Router DOM
- All components are prepared for Next.js migration
- No breaking changes should occur during migration
- The architecture supports both CSR and SSR patterns

## 🔗 Related Files

- `src/App.jsx` - Routing configuration
- `src/pages.config.js` - Page registration
- `src/globals.css` - Global styles
- `src/utils/index.ts` - Utility functions
