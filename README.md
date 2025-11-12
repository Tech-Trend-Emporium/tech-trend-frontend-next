# 🖥️ Tech Trend Emporium

This repository contains the **frontend application** for **Tech Trend Emporium**, built with **Next.js 14**, **React 18**, and **TailwindCSS**.  
It provides a **modern, performant, and SEO-optimized user interface** for interacting with the e-commerce backend.

## 📌 Vision

- Deliver a **fast and user-friendly** e-commerce web interface with **server-side rendering (SSR)** and **static site generation (SSG)** capabilities.
- Leverage **Next.js** for optimized performance, automatic code splitting, and modern development workflows.
- Ensure **scalability**, **reusability**, and **clean architecture** for components and state management.
- Integrate seamlessly with the **Tech Trend Emporium API** (built with .NET 8 + PostgreSQL).
- Support **role-based features** for `ADMIN`, `EMPLOYEE`, and `SHOPPER` users.

## 🏗️ Architecture Overview

The frontend follows a **modular architecture** based on the **Next.js App Router** (or Pages Router) with reusable UI components and feature-driven folder structure.

**Main principles:**
- Separation of UI, logic, and data-fetching concerns.
- Global state management through **Context API**, **Redux Toolkit**, or **Zustand**.
- REST communication with backend services via **Axios** or native **Fetch API**.
- Built-in routing handled by **Next.js file-based routing**.
- Server and client components for optimal performance.

**Structure Example:**
```plaintext
 app/                 # Next.js App Router (routes and layouts)
 │   ├── layout.tsx       # Root layout
 │   ├── page.tsx         # Home page
 │   └── (routes)/        # Feature-based routes
 src/
 |── components/          # Reusable UI components (buttons, forms, etc.)
 ├── auth/                # Authentication context and hooks
 ├── hooks/               # Custom React hooks
 ├── lib/                 # Utility functions and configurations
 ├── services/            # API service definitions (Axios clients)
 ├── utils/               # Helper functions and constants
 ├── models/              # TypeScript type definitions
 public/                  # Static assets (images, icons, etc.)
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm, yarn, or pnpm
- Docker (optional, for containerized setup)
- The backend API running locally or remotely

### 🧱 Run Locally (Development)

Clone the repository:
```bash
git clone https://github.com/Tech-Trend-Emporium/tech-trend-frontend.git
cd tech-trend-frontend
```
Install dependencies:
```bash
npm install
```
Run the development server:
```bash
npm run dev
```
The app will be available at:
👉 http://localhost:3000

Build for production:
```bash
npm run build
```
Start production server:
```bash
npm run start
```

## 🐳 Run with Docker

Build and run the container:
```bash
docker build -t techtrend-frontend .
docker run -p 3000:3000 techtrend-frontend
```
Or, if using Docker Compose (with backend + frontend):
```bash
docker-compose up --build
```
This will start:
- ⚙️ Frontend → http://localhost:3000
- 🧩 Backend → http://localhost:8080

## ⚙️ Environment Variables

Create a `.env.local` file in the project root with the following:
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
```

**Note:** 
- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.
- Server-only variables (API keys, secrets) should NOT have this prefix.

Access them in your code:
```javascript
process.env.NEXT_PUBLIC_API_BASE_URL
```

## 🧪 Testing & Quality

Recommended setup (optional but encouraged):

- **Vitest** or **Jest** for unit testing
- **React Testing Library** for component tests
- **Playwright** or **Cypress** for E2E testing
- **ESLint + Prettier** for code style consistency

Run tests:
```bash
npm run test
```
Check lint errors:
```bash
npm run lint
```
Format code:
```bash
npm run format
```

## 🎨 Key Next.js Features Used

- **App Router**: Modern routing with layouts and server components
- **Server Components**: Improved performance with server-side rendering
- **API Routes**: Built-in API endpoints for backend proxy or BFF pattern
- **Image Optimization**: Automatic image optimization with `next/image`
- **Metadata API**: SEO optimization with dynamic metadata

## 📖 Documentation

- `/docs/` → Design decisions, UI guidelines, component documentation
- `/src/services/` → API interaction layer
- `/src/components/` → Reusable UI components
- [Next.js Documentation](https://nextjs.org/docs) → Official Next.js docs

## 🤝 Contributing

We follow a **Trunk-Based Development** strategy:
- All changes go through Pull Requests
- Each PR should be **small and focused**
- Follow naming conventions: `feature/`, `fix/`, `refactor/`

Run formatter before pushing:
```bash
npm run format
```

Commit message format:
```
type(scope): subject

Examples:
feat(auth): add login page
fix(api): handle timeout errors
docs(readme): update installation steps
```

## 🗺️ Roadmap

- [ ] Add authentication flow (login/register with NextAuth.js)
- [ ] Integrate user role-based views (ADMIN, EMPLOYEE, SHOPPER)
- [ ] Implement server-side rendering for product pages
- [ ] Add API route handlers for backend proxy
- [ ] Improve API error handling with error boundaries
- [ ] Add dark mode toggle with next-themes
- [ ] Integrate analytics and performance monitoring (Vercel Analytics)
- [ ] Add comprehensive unit and E2E tests (Playwright/Cypress)
- [ ] Implement internationalization (i18n) support

## 📜 License

MIT License. See LICENSE.