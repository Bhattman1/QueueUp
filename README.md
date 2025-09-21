# Queue Up - Digital Restaurant Waitlist

A web-first restaurant waitlist management system that lets diners join digital queues and restaurants manage them in real-time.

## Features

### For Diners
- **Browse restaurants** with current wait times
- **Join waitlists** remotely or via QR code
- **Real-time status tracking** with position and ETA
- **Live updates** without page refresh
- **Share status** with friends/family

### For Restaurants
- **Queue management** with real-time updates
- **Page guests** when tables are ready
- **Track analytics** and performance metrics
- **Customizable settings** for buffer times and notifications
- **Multiple restaurant** support per organization

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Convex (Database + Realtime functions)
- **Authentication**: Clerk (with organizations)
- **Charts**: Recharts
- **Notifications**: Email (dev) + SMS (Twilio ready)
- **Testing**: Vitest + Playwright
- **Deployment**: Vercel + Convex Cloud

## Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd QueueUp
npm install
```

### 2. Set up Convex

```bash
cd convex
npx convex dev --configure
# Follow the prompts to create a new Convex project
```

### 3. Set up Clerk

1. Create a [Clerk](https://clerk.com) account
2. Create a new application
3. Copy your publishable and secret keys

### 4. Environment Variables

Create `.env.local` in the `apps/web` directory:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here

# Convex Database
CONVEX_DEPLOYMENT=your_convex_deployment_url
NEXT_PUBLIC_CONVEX_URL=https://your_deployment.convex.cloud

# Twilio SMS (optional)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_MESSAGING_SERVICE_SID=your_twilio_messaging_service_sid
```

### 5. Seed the Database

```bash
cd convex
npx convex run scripts/seed:all
```

This creates:
- Demo organization and user
- 10+ Melbourne restaurants
- Sample waitlists with entries

### 6. Run the Application

```bash
# Terminal 1: Convex dev server
cd convex
npx convex dev

# Terminal 2: Next.js dev server
cd apps/web
npm run dev
```

Visit `http://localhost:3000` to see the app!

## Demo Data

The seed script creates:

- **Demo Organization**: "Demo Restaurant Group"
- **Demo User**: demo@queueup.com
- **Restaurants**: 10+ Melbourne venues (Chin Chin, Cumulus Inc, Pellegrini's, etc.)
- **Sample Queues**: Active waitlists with realistic entries

## Project Structure

```
QueueUp/
├── apps/
│   └── web/                 # Next.js application
│       ├── src/
│       │   ├── app/         # App Router pages
│       │   ├── components/  # React components
│       │   └── lib/         # Utilities
│       └── convex/          # Symlink to ../convex/convex
├── convex/                 # Convex backend
│   ├── convex/             # Database schema & functions
│   └── scripts/            # Seed scripts
├── packages/               # Shared packages (future)
└── e2e/                   # Playwright tests (future)
```

## Key Pages

### Public Pages
- `/` - Restaurant discovery with trending venues
- `/r/[slug]` - Restaurant detail with join form
- `/q/[shareToken]` - Live queue status tracking

### Restaurant Console
- `/console` - Restaurant dashboard
- `/console/[restaurantId]/queue` - Queue management
- `/console/[restaurantId]/analytics` - Performance analytics
- `/console/[restaurantId]/settings` - Restaurant settings

## Database Schema

### Core Tables
- `users` - Mirrored from Clerk
- `orgs` - Restaurant organizations
- `restaurants` - Venue information
- `waitlists` - Active queues per restaurant
- `waitlistEntries` - Individual queue positions
- `events` - Analytics and audit trail

## Notifications

### Email (Development)
- Logs to console in development
- Ready for production email service integration

### SMS (Twilio)
- Requires Twilio environment variables
- Falls back to logging if not configured
- Supports messaging service for consistent branding

## Development

### Available Scripts

```bash
# Root level
npm run dev          # Start all services
npm run build        # Build all packages
npm run lint         # Lint all packages
npm run test         # Run all tests

# Web app
cd apps/web
npm run dev          # Start Next.js dev server
npm run build        # Build for production
npm run type-check   # TypeScript check

# Convex
cd convex
npm run dev          # Start Convex dev server
npm run deploy       # Deploy to production
npm run seed         # Run seed script
```

### Adding New Features

1. **Database**: Add schema changes in `convex/convex/schema.ts`
2. **Functions**: Create Convex functions in `convex/convex/`
3. **Frontend**: Add pages/components in `apps/web/src/`
4. **Types**: Convex generates TypeScript types automatically

## Deployment

### Vercel (Frontend)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically on push

### Convex (Backend)
1. Run `npx convex deploy` from the `convex` directory
2. Update `NEXT_PUBLIC_CONVEX_URL` in Vercel

## Testing

### Unit Tests (Vitest)
```bash
npm run test
```

### E2E Tests (Playwright)
```bash
npm run test:e2e
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For questions or issues:
- Create a GitHub issue
- Check the documentation
- Review the demo data for examples

---

**Queue Up** - Skip the wait, join the queue! 🍽️
