# CuraGenie Frontend

Next.js 15 frontend for AI-powered healthcare platform.

## Features

- 🎨 **Modern UI**: Tailwind CSS + shadcn/ui components
- 📱 **Responsive**: Mobile-first design
- ⚡ **Fast**: Next.js 15 with App Router
- 🔐 **Secure**: JWT authentication
- 📊 **Interactive**: Real-time data visualization
- 🌙 **Dark Mode**: Theme support

## Tech Stack

- **Framework**: Next.js 15.4.5
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **State**: Zustand
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod

## Quick Start

### Installation

```bash
cd frontend

# Install dependencies
npm install
```

### Configuration

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Configure environment variables:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Development

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # App Router pages
│   │   ├── (auth)/            # Auth pages
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── dashboard/         # Main dashboard
│   │   ├── mri-analysis/      # Brain tumor detection
│   │   ├── genomic/           # Genomic analysis
│   │   ├── chatbot/           # AI chatbot
│   │   └── layout.tsx         # Root layout
│   ├── components/             # React components
│   │   ├── ui/                # shadcn/ui components
│   │   ├── dashboard/
│   │   ├── mri/
│   │   ├── genomic/
│   │   └── chat/
│   ├── lib/                    # Utilities
│   │   ├── api.ts             # API client
│   │   ├── auth.ts            # Auth utilities
│   │   └── utils.ts           # Helper functions
│   └── types/                  # TypeScript types
├── public/                     # Static assets
│   ├── images/
│   └── icons/
├── components.json             # shadcn/ui config
├── next.config.js             # Next.js config
├── tailwind.config.ts         # Tailwind config
├── tsconfig.json              # TypeScript config
└── package.json               # Dependencies
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript check

## Key Features

### Authentication
- User registration and login
- JWT token management
- Protected routes
- Session persistence

### MRI Analysis
- Image upload with preview
- Real-time analysis
- Result visualization
- History tracking

### Genomic Analysis
- VCF file upload
- Progress tracking
- Interactive reports
- Risk score visualization

### AI Chatbot
- Real-time messaging
- Medical query handling
- Conversation history
- Suggested questions

### Dashboard
- Health metrics overview
- Interactive charts
- Recent activities
- Quick actions

## Styling

The project uses:
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for pre-built components
- **CSS Modules** for component-specific styles
- **Custom theme** with CSS variables

## API Integration

All API calls go through the centralized `lib/api.ts`:

```typescript
import { api } from '@/lib/api';

// Example usage
const response = await api.post('/mri/analyze', formData);
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy automatically

### Docker

```bash
docker build -t curagenie-frontend .
docker run -p 3000:3000 curagenie-frontend
```

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Submit pull request

## License

MIT License - see LICENSE file for details
