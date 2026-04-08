# Product School Design System Style Guide

**Version:** 1.0
**Last Updated:** April 8, 2026
**Reference App:** PS Campaign Manager

---

## 📋 Table of Contents

1. [Introduction](#introduction)
2. [Design Tokens](#design-tokens)
3. [Color System](#color-system)
4. [Typography](#typography)
5. [Spacing & Layout](#spacing--layout)
6. [Component Library](#component-library)
7. [Best Practices](#best-practices)

---

## Introduction

This style guide documents the Product School design system as implemented in the Campaign Manager and Assessments Portal applications. Use this as a reference when building new Product School applications to ensure visual consistency across the platform.

**Design Philosophy:**
- **Minimal & Clean:** Light shadows, ample whitespace, subtle borders
- **Professional:** Blue color scheme, structured layouts, consistent typography
- **Accessible:** High contrast text, clear focus states, readable font sizes
- **Modern:** Contemporary spacing, rounded corners, smooth transitions

---

## Design Tokens

### Quick Setup

**1. Install Dependencies:**
```bash
npm install tailwindcss tailwindcss-animate
```

**2. Import Google Fonts (in `globals.css` or `<head>`):**
```css
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap');
```

**3. Configure Tailwind (`tailwind.config.ts`):**

See the full configuration in this repository's `tailwind.config.ts` file, or copy the template below:

```typescript
import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'ps-blue': '#3B82F6',
        'ps-blue-50': '#EFF6FF',
        'ps-navy': '#1E3A8A',
        // ... (see full config)
      },
      fontFamily: {
        sans: ['Lato', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        heading: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica Neue', 'sans-serif'],
      },
      borderRadius: {
        lg: "0.75rem", // 12px
        md: "calc(0.75rem - 4px)", // 8px
        sm: "calc(0.75rem - 8px)", // 4px
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

**4. Base Styles (`globals.css`):**

```css
@layer base {
  body {
    @apply bg-gray-50 text-gray-900;
    font-family: 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }
}
```

---

## Color System

### Primary Colors

**Use for:** CTAs, primary actions, interactive elements, links

| Token | Hex | Usage |
|-------|-----|-------|
| `ps-blue` | `#3B82F6` | Primary buttons, active states, brand elements |
| `ps-navy` | `#1E3A8A` | Hover states for primary buttons |
| `ps-blue-50` | `#EFF6FF` | Light backgrounds for info badges, highlights |

```jsx
// ✅ Correct Usage
<button className="bg-ps-blue hover:bg-ps-navy text-white">
  Primary Action
</button>

<div className="bg-ps-blue-50 text-ps-blue">
  Info Badge
</div>
```

### Neutral Colors (Grays)

**Use for:** Backgrounds, text, borders, cards

| Color | Hex | Usage |
|-------|-----|-------|
| `gray-50` | `#F9FAFB` | Page backgrounds |
| `gray-100` | `#F3F4F6` | Secondary backgrounds, hover states |
| `gray-200` | `#E5E7EB` | Borders, dividers |
| `gray-300` | `#D1D5DB` | Input borders |
| `gray-400` | `#9CA3AF` | Placeholder text |
| `gray-500` | `#6B7280` | Secondary text, metadata |
| `gray-600` | `#4B5563` | Secondary button text |
| `gray-700` | `#374151` | Labels, captions |
| `gray-900` | `#111827` | Primary text, headings |

```jsx
// ✅ Page Layout
<div className="min-h-screen bg-gray-50">
  <div className="bg-white border border-gray-200">
    <h1 className="text-gray-900">Heading</h1>
    <p className="text-gray-600">Body text</p>
  </div>
</div>
```

### Semantic Colors

**Use for:** Status indicators, alerts, feedback

| Purpose | Background | Text | Usage |
|---------|-----------|------|-------|
| Success | `green-100` | `green-700` | Success badges, confirmations |
| Destructive | `red-100` | `red-700` | Error badges |
| Warning | `yellow-100` | `yellow-700` | Warning states |
| Info | `ps-blue-50` | `ps-blue` | Information badges |

```jsx
// ✅ Status Badges
<span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-md text-xs font-medium">
  Active
</span>

<span className="bg-red-100 text-red-700 px-2.5 py-1 rounded-md text-xs font-medium">
  Error
</span>
```

---

## Typography

### Font Families

**Body Text:** `Lato` (Google Font)
- Weights: 300 (Light), 400 (Regular), 700 (Bold), 900 (Black)
- Use for: Paragraphs, buttons, labels, UI text

**Headings:** System font stack
- `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif`
- Use for: h1, h2, h3, page titles

### Type Scale

| Element | Class | Size | Line Height | Weight | Usage |
|---------|-------|------|-------------|--------|-------|
| H1 | `text-5xl font-black` | 48px | 1.1 | 900 | Page titles |
| H2 | `text-3xl font-bold` | 32px | 1.2 | 700 | Section headings |
| H3 | `text-2xl font-semibold` | 24px | 1.3 | 600 | Card headings |
| Body | `text-base` | 16px | 1.6 | 400 | Main text |
| Small | `text-sm` | 14px | 1.5 | 400 | Metadata, captions |
| Tiny | `text-xs` | 12px | 1.4 | 400 | Labels, badges |

### Custom Typography Utilities

```css
.text-meta {
  font-size: 14px;
  font-weight: 400;
  color: var(--color-text-secondary); /* gray-500 */
}

.text-label {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
```

### Usage Examples

```jsx
// ✅ Page Heading
<h1 className="text-3xl font-bold text-gray-900 tracking-tight">
  Dashboard
</h1>

// ✅ Section Heading
<h2 className="text-2xl font-semibold text-gray-900">
  Active Assessments
</h2>

// ✅ Body Text
<p className="text-base text-gray-600 leading-relaxed">
  Manage client assessment access and configurations
</p>

// ✅ Metadata
<span className="text-sm text-gray-500">
  Last updated: April 8, 2026
</span>

// ✅ Table Headers (uppercase labels)
<th className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
  Client Name
</th>
```

---

## Spacing & Layout

### Container Widths

```jsx
// ✅ Standard Page Container
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* Content */}
</div>

// ✅ Form Container (narrower)
<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* Form */}
</div>
```

### Padding Scale

Use Tailwind's default spacing scale (based on 4px units):

| Class | Size | Usage |
|-------|------|-------|
| `p-2` | 8px | Compact badges |
| `p-3` | 12px | Small buttons |
| `p-4` | 16px | Regular buttons, inputs |
| `p-6` | 24px | Card padding (standard) |
| `p-8` | 32px | Large cards, modals |
| `p-10` | 40px | Authentication cards |

### Gap & Spacing

```jsx
// ✅ Card Content Spacing
<div className="space-y-6"> {/* 24px vertical gap */}
  <div>Field 1</div>
  <div>Field 2</div>
</div>

// ✅ Horizontal Button Groups
<div className="flex items-center gap-2"> {/* 8px horizontal gap */}
  <button>Cancel</button>
  <button>Save</button>
</div>
```

### Border Radius

| Class | Size | Usage |
|-------|------|-------|
| `rounded-md` | 8px | Buttons, inputs, badges |
| `rounded-lg` | 12px | Cards, modals (legacy) |
| `rounded-xl` | 12px | Cards (preferred) |
| `rounded-full` | 9999px | Icon containers, pills |

---

## Component Library

### Buttons

#### Primary Button (CTA)

```jsx
<button className="inline-flex items-center gap-2 px-5 py-2.5 bg-ps-blue text-white text-sm font-semibold rounded-md hover:bg-ps-navy transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
  <Plus className="h-5 w-5" />
  New Assessment
</button>
```

**Variants:**

```jsx
// Secondary Button
<button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
  Cancel
</button>

// Ghost Button
<button className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-md transition-colors">
  Edit
</button>

// Destructive Button
<button className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors">
  Delete
</button>

// Link Button
<button className="text-ps-blue hover:text-ps-navy underline-offset-4 hover:underline transition-colors">
  Learn More
</button>
```

**Size Variants:**

```jsx
// Small
<button className="h-8 px-3 py-1.5 text-xs">Small</button>

// Default
<button className="h-10 px-5 py-2">Default</button>

// Large
<button className="h-11 px-6 py-2.5">Large</button>
```

---

### Inputs & Forms

#### Text Input

```jsx
<div>
  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
    Client Name <span className="text-red-500">*</span>
  </label>
  <input
    type="text"
    id="name"
    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-ps-blue focus:border-transparent placeholder:text-gray-400"
    placeholder="Enter client name"
  />
</div>
```

#### Textarea

```jsx
<textarea
  rows={3}
  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-ps-blue focus:border-transparent placeholder:text-gray-400"
  placeholder="Description"
/>
```

#### Select Dropdown

```jsx
<select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-ps-blue focus:border-transparent">
  <option>Active</option>
  <option>Inactive</option>
</select>
```

#### Checkbox

```jsx
<div className="flex items-center">
  <input
    type="checkbox"
    id="remember"
    className="h-4 w-4 text-ps-blue focus:ring-ps-blue border-gray-300 rounded"
  />
  <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
    Remember me
  </label>
</div>
```

---

### Cards

#### Standard Card

```jsx
<div className="bg-white rounded-xl border border-gray-200 shadow-sm">
  <div className="p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      Card Title
    </h3>
    <p className="text-sm text-gray-500">
      Card description goes here
    </p>
  </div>
</div>
```

#### Card with Header/Footer

```jsx
<div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
  {/* Header */}
  <div className="px-6 py-4 border-b border-gray-200">
    <h3 className="text-lg font-semibold text-gray-900">Header</h3>
  </div>

  {/* Content */}
  <div className="p-6">
    <p className="text-sm text-gray-600">Content</p>
  </div>

  {/* Footer */}
  <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
    <button className="text-ps-blue text-sm font-medium">Action</button>
  </div>
</div>
```

---

### Badges

```jsx
// Success Badge
<span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium transition-colors bg-green-100 text-green-700">
  Active
</span>

// Info Badge
<span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium transition-colors bg-ps-blue-50 text-ps-blue">
  New
</span>

// Warning Badge
<span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium transition-colors bg-yellow-100 text-yellow-700">
  Pending
</span>

// Destructive Badge
<span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium transition-colors bg-red-100 text-red-700">
  Error
</span>

// Default Badge
<span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium transition-colors bg-gray-100 text-gray-700">
  Draft
</span>
```

---

### Tables

```jsx
<div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50/50">
      <tr>
        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
          Name
        </th>
        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
          Status
        </th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-100">
      <tr className="hover:bg-gray-50/50 transition-colors">
        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
          Client Name
        </td>
        <td className="px-6 py-4">
          <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-md text-xs font-medium">
            Active
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

---

### Header/Navigation

#### Sticky Header

```jsx
<header className="bg-white border-b border-gray-200 sticky top-0 z-10">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
    {/* Logo */}
    <div className="flex items-center gap-4">
      <Link href="/" className="flex items-center gap-3">
        <ProductSchoolLogo />
        <span className="text-gray-300">|</span>
        <span className="text-sm font-bold tracking-widest text-gray-700 uppercase">
          App Name
        </span>
      </Link>
    </div>

    {/* Actions */}
    <div className="flex items-center gap-2">
      <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors border border-gray-200 px-3 py-1.5 rounded-md hover:border-gray-300">
        <User className="w-3.5 h-3.5" />
        Profile
      </button>
    </div>
  </div>
</header>
```

---

### Modal/Dialog

```jsx
{showModal && (
  <div className="fixed inset-0 z-50 overflow-y-auto">
    <div className="flex min-h-screen items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Modal Title
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Modal content goes here
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button className="flex-1 px-4 py-2 text-sm font-medium text-white bg-ps-blue rounded-md hover:bg-ps-navy transition-colors">
            Confirm
          </button>
        </div>
      </div>
    </div>
  </div>
)}
```

---

### Empty States

```jsx
<div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
  {/* Icon */}
  <div className="mx-auto h-16 w-16 bg-ps-blue-50 rounded-full flex items-center justify-center mb-6">
    <FileText className="h-8 w-8 text-ps-blue" />
  </div>

  {/* Content */}
  <h3 className="text-xl font-semibold text-gray-900 mb-2">
    No items yet
  </h3>
  <p className="text-gray-600 mb-8 max-w-sm mx-auto">
    Get started by creating your first item.
  </p>

  {/* CTA */}
  <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-ps-blue text-white text-sm font-semibold rounded-md hover:bg-ps-navy transition-colors">
    <Plus className="h-5 w-5" />
    Create Item
  </button>
</div>
```

---

## Best Practices

### 1. Focus States

**Always** include focus states on interactive elements:

```jsx
// ✅ Good
<button className="... focus:outline-none focus:ring-2 focus:ring-ps-blue">
  Click me
</button>

// ❌ Bad
<button className="...">
  Click me
</button>
```

### 2. Disabled States

Use `opacity-40` for disabled elements (not 50%):

```jsx
// ✅ Good
<button disabled className="... disabled:opacity-40 disabled:cursor-not-allowed">
  Submit
</button>

// ❌ Bad
<button disabled className="... disabled:opacity-50">
  Submit
</button>
```

### 3. Transitions

Add smooth transitions to all interactive elements:

```jsx
// ✅ Good
<button className="... transition-colors">
  Hover me
</button>

<div className="... transition-all">
  Animated
</div>

// ❌ Bad
<button className="...">
  No transition
</button>
```

### 4. Shadows

Use shadows **sparingly**. Prefer `shadow-sm` over heavy shadows:

```jsx
// ✅ Good - Subtle shadow
<div className="shadow-sm">Card</div>

// ⚠️ Use with caution - Heavy shadow
<div className="shadow-lg">Card</div>

// ❌ Avoid - No shadow needed for most cards
<div className="shadow-2xl">Card</div>
```

### 5. Border Radius Consistency

Use consistent border radius across the app:

- **Cards, modals:** `rounded-xl` (12px)
- **Buttons, inputs, badges:** `rounded-md` (8px)
- **Icon containers:** `rounded-full`

```jsx
// ✅ Good
<div className="rounded-xl">Card</div>
<button className="rounded-md">Button</button>

// ❌ Bad - Random radius
<div className="rounded-3xl">Card</div>
```

### 6. Color Usage

**Primary (ps-blue/ps-navy):**
- Use for CTAs, primary actions, links
- Use sparingly to maintain visual hierarchy

**Gray Scale:**
- Use for majority of UI (backgrounds, text, borders)
- Maintains professional, clean aesthetic

**Semantic Colors:**
- Use consistently (green=success, red=error, yellow=warning)
- Apply to badges and status indicators

```jsx
// ✅ Good - Clear hierarchy
<div className="bg-gray-50">
  <button className="bg-ps-blue text-white">Primary Action</button>
  <button className="bg-white border border-gray-300">Secondary</button>
</div>

// ❌ Bad - Too much color
<div className="bg-blue-50">
  <button className="bg-blue-500">Action 1</button>
  <button className="bg-green-500">Action 2</button>
  <button className="bg-purple-500">Action 3</button>
</div>
```

### 7. Typography Hierarchy

Maintain clear visual hierarchy with size and weight:

```jsx
// ✅ Good
<h1 className="text-3xl font-bold text-gray-900">Page Title</h1>
<h2 className="text-2xl font-semibold text-gray-900">Section</h2>
<p className="text-base text-gray-600">Body text</p>
<span className="text-sm text-gray-500">Metadata</span>

// ❌ Bad - Inconsistent hierarchy
<h1 className="text-xl font-normal">Title</h1>
<p className="text-2xl font-bold">Body</p>
```

### 8. Responsive Design

Use Tailwind's responsive prefixes:

```jsx
// ✅ Good - Mobile-first responsive
<div className="px-4 sm:px-6 lg:px-8">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {/* Content */}
  </div>
</div>
```

### 9. Loading States

Show clear loading indicators:

```jsx
// ✅ Good
<button disabled={loading} className="...">
  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
  Submit
</button>
```

### 10. Error Handling

Display errors clearly:

```jsx
// ✅ Good
{error && (
  <div className="rounded-md bg-red-50 border border-red-200 p-3">
    <p className="text-sm text-red-800">{error}</p>
  </div>
)}
```

---

## Common Patterns

### Form Layout

```jsx
<form className="space-y-6">
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Field Name <span className="text-red-500">*</span>
    </label>
    <input
      type="text"
      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-ps-blue focus:border-transparent"
    />
  </div>

  {/* Actions */}
  <div className="flex items-center justify-end gap-3 pt-4 border-t">
    <button type="button" className="...">Cancel</button>
    <button type="submit" className="...">Save</button>
  </div>
</form>
```

### Icon + Text Button

```jsx
<button className="inline-flex items-center gap-2 ...">
  <Plus className="h-5 w-5" />
  Add Item
</button>
```

### Copy Button Pattern

```jsx
<div className="flex items-center gap-1">
  <span className="text-sm text-gray-600">••••••••</span>
  <button
    onClick={handleCopy}
    className="inline-flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
  >
    {copied ? (
      <Check className="h-3.5 w-3.5 text-green-600" />
    ) : (
      <Copy className="h-3.5 w-3.5" />
    )}
  </button>
</div>
```

---

## Quick Reference Cheat Sheet

### Colors
- **Primary:** `ps-blue` `ps-navy`
- **Page BG:** `bg-gray-50`
- **Card BG:** `bg-white`
- **Text:** `text-gray-900` (primary), `text-gray-600` (secondary), `text-gray-500` (meta)
- **Borders:** `border-gray-200`

### Spacing
- **Card padding:** `p-6`
- **Button padding:** `px-5 py-2.5` (default), `px-3 py-1.5` (small)
- **Form spacing:** `space-y-6`
- **Button gaps:** `gap-2`

### Border Radius
- **Cards:** `rounded-xl`
- **Buttons/Inputs:** `rounded-md`
- **Badges:** `rounded-md`

### Shadows
- **Default:** `shadow-sm`
- **Modals:** `shadow-xl`

### Typography
- **Page Title:** `text-3xl font-bold text-gray-900`
- **Section:** `text-2xl font-semibold text-gray-900`
- **Body:** `text-base text-gray-600`
- **Meta:** `text-sm text-gray-500`
- **Badge:** `text-xs font-medium`

---

## Additional Resources

- **Tailwind CSS Docs:** https://tailwindcss.com/docs
- **Lato Font:** https://fonts.google.com/specimen/Lato
- **Lucide Icons:** https://lucide.dev

---

**Questions or Suggestions?**
Update this guide as the design system evolves. Consistency is key!

© 2026 Product School. All rights reserved.
