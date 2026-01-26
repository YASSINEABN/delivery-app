# DeliveryHub - Modern SaaS Frontend

A sleek, modern, and professional SaaS application for managing delivery operations. Built with Next.js 14 (Pages Router), React 18, and Tailwind CSS.

## ✨ Features

### 🎨 Modern Design System
- **Minimalist UI**: Clean, uncluttered interface with generous whitespace
- **Professional Color Palette**: Soft blues, whites, and dark grays with vibrant accents
- **Modern Typography**: Inter for body text, Poppins for headings
- **Smooth Animations**: Fade-in, slide-up, scale transitions throughout
- **Status Indicators**: Color-coded badges with icons and animations

### 🌓 Dark Mode
- Fully integrated dark/light theme toggle
- System preference detection
- Persistent theme selection
- Smooth theme transitions

### 📱 Responsive Design
- Mobile-first approach
- Collapsible navigation menu
- Touch-friendly controls
- Adaptive layouts for all screen sizes

### 📊 Dashboard Features
- Real-time statistics cards with trend indicators
- Interactive data visualizations (line charts, pie charts)
- Recent orders list
- Quick action buttons
- Weekly activity graphs

### 🔧 Management Features
- **Customer Management**: Create, view, edit, and manage customers
- **Order Management**: Create orders with multiple items, track status, view history
- **Delivery Management**: Create deliveries, assign deliverers, track real-time
- **Deliverer Management**: Register deliverers, view performance, track locations

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Backend services running (API Gateway on port 8000)

### Installation

```bash
cd frontend
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 🎨 Design System

See [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for comprehensive design guidelines, component usage, and best practices.

### Key Design Elements

#### Color Scheme
- **Primary**: Blue palette (50-950) for main actions
- **Accent**: Green palette for success states
- **Neutral**: Gray palette for text and backgrounds
- Optimized for both light and dark modes

#### Typography
- **Display Font**: Poppins (500-800 weights)
- **Body Font**: Inter (300-800 weights)
- Clear hierarchy with varying sizes and weights

#### Components
- Buttons with hover effects and active states
- Cards with soft shadows and hover animations
- Form inputs with focus states
- Status badges with icons and animations
- Tables with hover effects
- Loading spinners
- Alert messages

#### Animations
- `animate-fade-in`: Smooth fade-in effect
- `animate-slide-up`: Slide up from bottom
- `animate-scale-in`: Scale in effect
- `animate-pulse-slow`: Slow pulsing animation

## 📦 Tech Stack

- **Framework**: Next.js 14 (Pages Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS 3.4
- **Charts**: Recharts
- **Icons**: Heroicons (inline SVG)
- **HTTP Client**: Fetch API

## 🗂️ Project Structure

```
frontend/
├── components/          # Reusable React components
│   ├── Layout.js        # Main layout with navigation
│   ├── ThemeToggle.js   # Dark mode toggle
│   ├── StatusBadge.js   # Status indicators
│   ├── LoadingSpinner.js
│   ├── ErrorAlert.js
│   └── SuccessAlert.js
├── context/
│   └── ThemeContext.js  # Theme management
├── lib/
│   └── api.js           # API client utilities
├── pages/               # Next.js pages
│   ├── index.js         # Dashboard with visualizations
│   ├── _app.js          # App wrapper with providers
│   ├── customers/       # Customer pages
│   ├── orders/          # Order pages
│   ├── deliveries/      # Delivery pages
│   └── deliverers/      # Deliverer pages
├── styles/
│   └── globals.css      # Global styles with Tailwind
├── DESIGN_SYSTEM.md     # Design system documentation
└── package.json
```

## 🔌 API Integration

The frontend connects to the API Gateway (port 8000) to communicate with backend services:

- **Order Service** (`/api/orders`, `/api/customers`)
- **Delivery Service** (`/api/deliveries`)
- **Deliverer Service** (`/api/deliverers`)

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🎯 Key Features by Section

### Dashboard
- 4 stat cards with trend indicators and animations
- Weekly activity line chart (orders vs deliveries)
- Order status pie chart
- Recent orders list with quick view
- Quick action buttons for common tasks

### Customers
- Grid view with customer cards
- Search functionality
- Avatar generation from initials
- Contact information display
- Order history per customer
- CRUD operations

### Orders
- List view with filtering (status, customer)
- Multi-item order creation
- Status tracking with history
- Order details with items breakdown
- Status update workflow
- Visual status badges

### Deliveries
- Delivery list with status indicators
- Create deliveries linked to orders
- Assign deliverers
- Track delivery progress
- Pickup and delivery address management
- Priority levels

### Deliverers
- Card grid view with avatars
- Status filtering
- Performance metrics
- Location tracking
- Vehicle information
- Rating system
- Delivery history

## 🎨 Design Highlights

### Navigation
- Sticky top navigation bar
- Frosted glass effect (backdrop blur)
- Icon-based navigation items
- Mobile hamburger menu
- Theme toggle
- User profile section

### Cards & Hover Effects
- Subtle box shadows
- Smooth hover transitions
- Scale animations on interaction
- Gradient shine effect on stat cards
- Border hover effects

### Status System
- Color-coded status badges
- Animated status dots
- Status-specific icons
- Smooth color transitions
- Support for order, delivery, and deliverer statuses

### Forms
- Clean input fields with focus states
- Proper label hierarchy
- Validation feedback
- Loading states on submission
- Success/error messages

### Empty States
- Helpful icons
- Clear messaging
- Call-to-action buttons
- Consistent styling

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## ♿ Accessibility

- WCAG AA color contrast compliance
- Keyboard navigation support
- Focus indicators on interactive elements
- Semantic HTML structure
- ARIA labels where appropriate
- Screen reader friendly

## 📱 Mobile Experience

- Fully responsive design
- Touch-friendly controls (minimum 44x44px touch targets)
- Collapsible mobile menu
- Optimized layouts for small screens
- Fast loading times
- Progressive enhancement

## 🔄 State Management

- React hooks (useState, useEffect)
- Theme context for dark mode
- Local state management
- API data caching in component state

## 🚧 Future Enhancements

- [ ] Real-time updates with WebSockets
- [ ] Advanced filtering and sorting
- [ ] Export functionality (PDF, CSV)
- [ ] Notification system
- [ ] User preferences
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Offline mode

## 📝 Notes

### CORS Configuration
The API Gateway has been configured with CORS support for `http://localhost:3000`. If you encounter CORS errors, ensure the API Gateway is running with the updated configuration.

### Customer API Routes
Customer endpoints are routed through the order-service via the API Gateway at `/api/customers`.

## 🤝 Contributing

When contributing to the frontend:

1. Follow the design system guidelines in `DESIGN_SYSTEM.md`
2. Maintain consistent styling with Tailwind CSS
3. Ensure dark mode compatibility
4. Test responsiveness on multiple screen sizes
5. Add appropriate animations and transitions
6. Handle loading and error states
7. Maintain accessibility standards

## 📄 License

Project Académique - 2026

---

Built with ❤️ using Next.js and Tailwind CSS
