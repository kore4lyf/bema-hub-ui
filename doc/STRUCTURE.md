# Structure

## Project Root
```
.
├── app/                      # Next.js app directory
│   ├── (auth)/               # Authentication pages
│   │   ├── reset-password/   # Reset password page
│   │   ├── signin/           # Sign in page
│   │   ├── signup/           # Sign up page
│   │   └── signup/verify/    # Sign up verification page
│   ├── api/                  # API routes
│   ├── blog/                 # Blog pages
│   ├── campaigns/            # Campaigns pages
│   ├── contact/              # Contact pages
│   ├── dashboard/            # Dashboard pages
│   ├── events/               # Events pages
│   ├── feed/                 # Feed pages
│   ├── leaderboard/          # Leaderboard pages
│   ├── profile/              # Profile pages
│   ├── favicon.ico           # Site favicon
│   ├── globals.css           # Global CSS styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── assets/                   # Static assets
├── components/               # React components
│   ├── auth/                 # Authentication components
│   ├── blog/                 # Blog components
│   ├── custom/               # Custom components
│   ├── providers/            # React providers
│   ├── ui/                   # UI components
│   ├── ApiStatus.tsx         # API status component
│   └── Dashboard.tsx         # API testing dashboard
├── contexts/                 # React contexts
├── doc/                      # Documentation
│   └── Backend Updates/
│       └── frontend-site-details-api.md  # Site details API documentation
├── hooks/                    # Custom React hooks
│   ├── useAuth.ts            # Authentication hook
│   ├── useAuthCheck.ts       # Authentication check hook
│   ├── useAuthRedirect.ts    # Authentication redirect hook
│   ├── useSessions.ts        # Sessions hook
│   └── useSiteDetails.ts     # Site details hook
├── lib/                      # Core application logic
│   ├── api/                  # API integration
│   │   ├── authApi.ts        # Authentication API
│   │   ├── bemaHubApi.ts     # Bema Hub API base
│   │   ├── blogApi.ts        # Blog API
│   │   ├── locationApi.ts    # Location API
│   │   ├── mailerliteApi.ts  # Mailerlite API
│   │   ├── siteApi.ts        # Site details API
│   │   ├── types.ts          # API types (including site types)
│   │   └── README.md         # API documentation
│   ├── features/             # Redux features
│   │   ├── auth/             # Authentication feature
│   │   ├── location/         # Location feature
│   │   └── ui/               # UI feature
│   ├── hooks/                # Custom hooks
│   ├── api.ts                # API utilities
│   ├── hooks.ts              # Hooks utilities
│   ├── password-reset.ts     # Password reset utilities
│   ├── social-auth.ts        # Social authentication utilities
│   ├── store.ts              # Redux store configuration
│   ├── token-manager.ts      # Token management utilities
│   ├── utils.ts              # General utilities
│   └── wp-auth.ts            # WordPress authentication utilities
├── public/                   # Public static files
├── types/                    # TypeScript types
│   └── site.ts               # Site types
├── utils/                    # Utility functions
├── .env.example              # Example environment variables
├── .env.local                # Local environment variables
├── .gitignore                # Git ignore file
├── components.json            # Components configuration
├── eslint.config.mjs         # ESLint configuration
├── File.txt                  # Unknown file
├── next.config.ts            # Next.js configuration
├── next-env.d.ts             # Next.js types
├── package.json              # NPM package file
├── package-lock.json         # NPM lock file
├── postcss.config.mjs        # PostCSS configuration
├── proxy.ts                  # Proxy configuration
├── README.md                 # Project README
├── tsconfig.json             # TypeScript configuration
└── tsconfig.tsbuildinfo      # TypeScript build info
```

## Key Directories and Files

### Components
- `components/auth/` - Authentication related components
- `components/blog/` - Blog related components
- `components/custom/` - Custom UI components
- `components/ui/` - Reusable UI components
- `components/ApiStatus.tsx` - Displays API status
- `components/Dashboard.tsx` - API testing interface

### API Integration
- `lib/api/siteApi.ts` - RTK Query slice for site details
- `lib/api/bemaHubApi.ts` - Base API configuration
- `lib/store.ts` - Redux store with API middleware

### Types
- `lib/api/types.ts` - All API types including SiteDetails and SiteState interfaces

### Documentation
- `doc/Backend Updates/frontend-site-details-api.md` - Site details API documentation
- `lib/api/README.md` - API documentation

## Redux Store Structure
The Redux store includes:
- Authentication feature
- UI feature
- Location feature
- Multiple API slices (auth, location, bemaHub, blog, mailerlite, site)

## Site Details Implementation
- `lib/api/siteApi.ts` - RTK Query implementation for site details endpoint
- `lib/api/types.ts` - TypeScript interfaces for site details
- `hooks/useSiteDetails.ts` - Custom hook for consuming site details
- CSS styles in `app/globals.css` for themed logo support