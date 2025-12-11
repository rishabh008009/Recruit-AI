# Recruit AI Dashboard - Setup Instructions

## Prerequisites

You need to have Node.js installed on your system. If you don't have it:

### Install Node.js

**Option 1: Using Homebrew (Recommended for macOS)**
```bash
brew install node
```

**Option 2: Download from nodejs.org**
Visit https://nodejs.org/ and download the LTS version

## Installation Steps

Once Node.js is installed, run:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test
```

## Project Structure

```
src/
├── components/          # React components
├── data/               # Mock data
│   └── mockData.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   └── formatters.ts
├── test/               # Test setup
│   └── setup.ts
├── App.tsx             # Root component
├── main.tsx            # Application entry point
└── index.css           # Global styles with Tailwind
```

## Technology Stack

- **React 18** - UI framework
- **Vite 5** - Build tool and dev server
- **TypeScript** - Type safety
- **Tailwind CSS 3** - Styling with Linear-inspired design system
- **Lucide React** - Icon library
- **Vitest** - Unit testing
- **fast-check** - Property-based testing
- **React Testing Library** - Component testing

## Design System

The project uses a Linear-style aesthetic with:
- **Font:** Inter
- **Colors:** Slate/Gray with Indigo accents
- **Shadows:** Subtle card shadows
- **Borders:** Clean 1px borders

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run test:ui` - Run tests with UI

## Next Steps

After installing dependencies, proceed with Task 2 to create TypeScript types and mock data.
