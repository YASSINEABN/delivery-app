# DeliveryHub Design System

A modern, professional SaaS application design system built with Next.js and Tailwind CSS.

## Color Palette

### Primary Colors (Blue)
- `primary-50` through `primary-950`: Main brand colors
- Used for: Primary actions, links, active states

### Accent Colors (Green)
- `accent-50` through `accent-900`: Success and positive actions
- Used for: Success states, positive metrics

### Neutral Colors
- `neutral-50` through `neutral-950`: Base colors for text and backgrounds
- Used for: Text, backgrounds, borders

## Typography

### Fonts
- **Display**: Poppins - Used for headings and titles
- **Sans**: Inter - Used for body text and UI elements

### Font Sizes
- Headings: `text-3xl` (30px) for page titles
- Subheadings: `text-xl` (20px) for section titles
- Body: `text-base` (16px) for regular text
- Small: `text-sm` (14px) for secondary text
- Extra small: `text-xs` (12px) for labels

### Font Weights
- Bold (700-800): Titles and emphasis
- Semibold (600): Subheadings
- Medium (500): Buttons and labels
- Regular (400): Body text

## Components

### Buttons
```jsx
// Primary button
<button className="btn btn-primary">Action</button>

// Secondary button
<button className="btn btn-secondary">Cancel</button>

// Success button
<button className="btn btn-success">Confirm</button>

// Danger button
<button className="btn btn-danger">Delete</button>

// Button sizes
<button className="btn btn-primary btn-sm">Small</button>
<button className="btn btn-primary btn-lg">Large</button>
```

### Cards
```jsx
// Standard card
<div className="card">Content</div>

// Hoverable card
<div className="card-hover">Interactive content</div>

// Stat card (with shine effect)
<div className="stat-card">Statistics</div>
```

### Form Elements
```jsx
// Input
<input type="text" className="input" placeholder="Enter text" />

// Label
<label className="label">Field Label</label>

// Select
<select className="input">
  <option>Option 1</option>
</select>

// Textarea
<textarea className="input" rows="3"></textarea>
```

### Status Badges
```jsx
<StatusBadge status="PENDING" type="order" />
<StatusBadge status="IN_TRANSIT" type="delivery" />
<StatusBadge status="ACTIVE" type="deliverer" />
```

### Tables
```jsx
<div className="table-container">
  <table className="table">
    <thead>
      <tr>
        <th>Column 1</th>
        <th>Column 2</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Data 1</td>
        <td>Data 2</td>
      </tr>
    </tbody>
  </table>
</div>
```

## Layout

### Page Structure
```jsx
<div className="space-y-6 animate-fade-in">
  {/* Page Header */}
  <div className="page-header">
    <h1 className="page-title">Page Title</h1>
    <p className="page-subtitle">Page description</p>
  </div>
  
  {/* Content */}
  <div className="card">
    {/* Card content */}
  </div>
</div>
```

### Grid Layouts
```jsx
// 4-column grid (responsive)
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Grid items */}
</div>

// 3-column grid
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* Grid items */}
</div>
```

## Animations

### Fade In
```jsx
<div className="animate-fade-in">Content</div>
```

### Slide Up
```jsx
<div className="animate-slide-up">Content</div>
```

### Scale In
```jsx
<div className="animate-scale-in">Content</div>
```

### Pulse (Slow)
```jsx
<span className="animate-pulse-slow">Pulsing element</span>
```

## Dark Mode

Dark mode is automatically handled via the `ThemeContext`. All components support dark mode using the `dark:` modifier in Tailwind CSS.

### Toggle Theme
```jsx
import { useTheme } from '../context/ThemeContext';

function MyComponent() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      Switch to {theme === 'light' ? 'dark' : 'light'} mode
    </button>
  );
}
```

## Icons

We use inline SVG icons from Heroicons. Common patterns:

```jsx
// Stroke icons (outline)
<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="..." />
</svg>

// Fill icons (solid)
<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
  <path d="..." />
</svg>
```

## Spacing

- `gap-2` (8px): Tight spacing
- `gap-4` (16px): Medium spacing
- `gap-6` (24px): Standard spacing
- `gap-8` (32px): Large spacing

## Shadows

- `shadow-sm`: Subtle shadow
- `shadow-md`: Medium shadow
- `shadow-lg`: Large shadow
- `shadow-soft`: Custom soft shadow
- `shadow-soft-lg`: Custom large soft shadow

## Border Radius

- `rounded-lg` (8px): Small elements (buttons, inputs)
- `rounded-xl` (12px): Medium elements (cards, inputs)
- `rounded-2xl` (16px): Large elements (cards, containers)
- `rounded-full`: Circular elements (avatars, badges)

## Transitions

All interactive elements include smooth transitions:
```css
transition-colors duration-200
transition-all duration-200
```

## Best Practices

1. **Consistency**: Use the predefined components and classes
2. **Accessibility**: Ensure proper color contrast (WCAG AA)
3. **Responsiveness**: Mobile-first approach with responsive modifiers
4. **Performance**: Use CSS animations over JavaScript when possible
5. **Whitespace**: Generous use of whitespace for clarity
6. **Typography**: Clear hierarchy with font sizes and weights
7. **Feedback**: Visual feedback for all interactions (hover, active, focus states)
8. **Loading States**: Show loading spinners for async operations
9. **Error Handling**: Display clear error messages
10. **Empty States**: Provide helpful messages and actions when no data exists

## Common Patterns

### Action Buttons with Icons
```jsx
<button className="btn btn-primary">
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="..." />
  </svg>
  Button Text
</button>
```

### Loading State
```jsx
{loading ? (
  <div className="flex justify-center items-center h-screen">
    <LoadingSpinner size="lg" />
  </div>
) : (
  // Content
)}
```

### Empty State
```jsx
<div className="card empty-state">
  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
    {/* Icon */}
  </div>
  <p className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
    No items found
  </p>
  <p className="text-neutral-500 dark:text-neutral-400 mb-6">
    Get started by creating your first item
  </p>
  <button className="btn btn-primary">Create Item</button>
</div>
```

### Search Bar
```jsx
<div className="card">
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
      <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
    <input
      type="text"
      placeholder="Search..."
      className="input pl-12"
    />
  </div>
</div>
```


