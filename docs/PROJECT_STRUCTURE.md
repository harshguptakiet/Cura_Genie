# CuraGenie Project Structure

## Overview

CuraGenie is organized into clear, logical sections for easy navigation and maintenance.

## Directory Structure

```
CuraGenie/
│
├── .github/                          # GitHub configuration
│   ├── ISSUE_TEMPLATE/              # Issue templates
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   └── PULL_REQUEST_TEMPLATE.md     # PR template
│
├── frontend/                         # Next.js Frontend Application
│   ├── src/
│   │   ├── app/                     # Next.js 15 App Router
│   │   │   ├── (auth)/             # Authentication pages
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── dashboard/           # Main dashboard
│   │   │   ├── mri-analysis/        # MRI scan analysis
│   │   │   ├── genomic/             # Genomic analysis
│   │   │   ├── chatbot/             # AI chatbot
│   │   │   ├── profile/             # User profile
│   │   │   └── layout.tsx           # Root layout
│   │   ├── components/              # React components
│   │   │   ├── ui/                  # shadcn/ui components
│   │   │   ├── dashboard/           # Dashboard components
│   │   │   ├── mri/                 # MRI components
│   │   │   ├── genomic/             # Genomic components
│   │   │   └── chat/                # Chat components
│   │   ├── lib/                     # Utility functions
│   │   │   ├── api.ts              # API client
│   │   │   ├── auth.ts             # Auth utilities
│   │   │   └── utils.ts            # Helper functions
│   │   └── types/                   # TypeScript types
│   ├── public/                      # Static assets
│   │   ├── images/
│   │   └── icons/
│   ├── .env.example                 # Environment variables template
│   ├── package.json                 # Dependencies
│   ├── tsconfig.json                # TypeScript config
│   ├── tailwind.config.ts           # Tailwind CSS config
│   ├── next.config.js               # Next.js config
│   ├── Dockerfile                   # Docker config
│   └── README.md                    # Frontend documentation
│
├── backend/                          # FastAPI Backend Application
│   ├── api/                         # API route handlers
│   │   ├── auth.py                 # Authentication endpoints
│   │   ├── mri_analysis.py         # Brain tumor detection API
│   │   ├── enhanced_mri_analysis.py # Enhanced MRI features
│   │   ├── mri_pipeline.py         # MRI processing pipeline
│   │   ├── genomic.py              # Genomic analysis
│   │   ├── genomic_variants.py     # Variant processing
│   │   ├── prs.py                  # Polygenic Risk Score
│   │   ├── direct_prs.py           # Direct PRS calculation
│   │   ├── chatbot.py              # AI chatbot API
│   │   ├── ml.py                   # ML operations
│   │   ├── profile.py              # User profiles
│   │   ├── reports.py              # Health reports
│   │   ├── timeline.py             # Activity timeline
│   │   ├── local_upload.py         # Local file upload
│   │   └── supabase_upload.py      # Cloud upload
│   ├── core/                        # Core functionality
│   │   ├── config.py               # Configuration
│   │   ├── auth.py                 # Auth logic
│   │   ├── llm_service.py          # LLM integration
│   │   ├── celery_app.py           # Celery config
│   │   └── websockets.py           # WebSocket handlers
│   ├── db/                          # Database layer
│   │   ├── database.py             # DB connection
│   │   ├── models.py               # Data models
│   │   └── auth_models.py          # User models
│   ├── schemas/                     # Pydantic schemas
│   │   ├── schemas.py              # Request/response models
│   │   └── auth_schemas.py         # Auth schemas
│   ├── services/                    # Business logic
│   │   └── report_generator.py     # Report generation
│   ├── worker/                      # Celery workers
│   │   ├── worker.py               # Worker configuration
│   │   └── tasks.py                # Background tasks
│   ├── cg_worker/                   # Additional workers
│   │   ├── worker.py
│   │   └── tasks.py
│   ├── backend/                     # Backend utilities
│   │   ├── inspect_db.py           # DB inspection tool
│   │   └── test_data/              # Test datasets
│   │       └── realistic_genome.vcf
│   ├── docs/                        # Backend documentation
│   │   ├── FIXED_ISSUES_SUMMARY.md
│   │   ├── GENOME_BROWSER_SOLUTION.md
│   │   └── REAL_PROJECT_ANALYSIS.md
│   ├── .env.example                 # Environment template
│   ├── main.py                      # FastAPI app entry
│   ├── app.py                       # Alternative entry
│   ├── init_db.py                   # Database initialization
│   ├── genomic_utils.py             # Genomic utilities
│   ├── requirements.txt             # Python dependencies
│   ├── requirements-minimal.txt     # Minimal dependencies
│   ├── requirements-test.txt        # Test dependencies
│   ├── Dockerfile                   # Docker config
│   ├── Dockerfile.railway           # Railway-specific
│   ├── railway.json                 # Railway config
│   ├── railway.toml                 # Railway TOML config
│   └── README.md                    # Backend documentation
│
├── Brain-Tumor-Detection/            # ML Brain Tumor Detection Module
│   ├── Brain Tumor Detection.ipynb  # Training notebook
│   ├── Data Augmentation.ipynb      # Data preprocessing
│   ├── run_detection.py             # Inference script
│   ├── convnet_architecture.jpg     # Architecture diagram
│   ├── Accuracy.PNG                 # Training metrics
│   ├── Loss.PNG                     # Loss plot
│   ├── LICENSE                      # Module license
│   ├── models/                      # Trained models (gitignored)
│   ├── yes/                         # Positive samples (gitignored)
│   ├── no/                          # Negative samples (gitignored)
│   ├── augmented data/              # Augmented data (gitignored)
│   └── README.md                    # Module documentation
│
├── docs/                             # Project Documentation
│   ├── ARCHITECTURE.md              # System architecture
│   ├── DEPLOYMENT_GUIDE.md          # Deployment instructions
│   ├── LOCAL_TESTING_GUIDE.md       # Local setup guide
│   ├── RAILWAY_VERCEL_DEPLOY.md     # Cloud deployment
│   ├── TESTING_RESULTS.md           # Test results
│   ├── CLEANUP_SUMMARY.md           # Cleanup notes
│   ├── FRONTEND_ENDPOINT_ANALYSIS.md # API analysis
│   ├── SRS_CuraGenie.md             # Requirements spec
│   ├── SRS_CuraGenie_IEEE830.txt    # IEEE format spec
│   └── PROJECT_STRUCTURE.md         # This file
│
├── .gitignore                        # Git ignore rules
├── .env.prod.example                 # Production env template
├── docker-compose.yml                # Development Docker setup
├── docker-compose.prod.yml           # Production Docker setup
├── start-all.bat                     # Windows: Start all services
├── start-frontend.bat                # Windows: Start frontend
├── start-backend.bat                 # Windows: Start backend
├── README.md                         # Main project documentation
├── LICENSE                           # MIT License
└── CONTRIBUTING.md                   # Contribution guidelines

## Excluded from Git

The following are excluded via `.gitignore`:

### Large Files & Data
- `Brain-Tumor-Detection/models/` - ML model files (too large)
- `Brain-Tumor-Detection/yes/` - Positive MRI samples
- `Brain-Tumor-Detection/no/` - Negative MRI samples
- `Brain-Tumor-Detection/augmented data/` - Augmented dataset
- `uploads/` - User-uploaded files

### Dependencies
- `node_modules/` - Node.js dependencies
- `.venv/` - Python virtual environment
- `__pycache__/` - Python cache files

### Build Outputs
- `frontend/.next/` - Next.js build output
- `frontend/out/` - Next.js export output
- `backend/__pycache__/` - Python bytecode

### Environment Files
- `.env` - Environment variables (use .env.example)
- `.env.local` - Local environment
- `.env.production` - Production secrets

### IDE & OS
- `.vscode/` - VS Code settings
- `.idea/` - JetBrains settings
- `.DS_Store` - macOS files
- `Thumbs.db` - Windows thumbnails

## Key Files

### Configuration Files
- `frontend/package.json` - Node.js dependencies and scripts
- `frontend/tsconfig.json` - TypeScript configuration
- `frontend/tailwind.config.ts` - Tailwind CSS setup
- `frontend/next.config.js` - Next.js configuration
- `backend/requirements.txt` - Python dependencies
- `docker-compose.yml` - Docker services setup

### Entry Points
- `frontend/src/app/layout.tsx` - Frontend root
- `backend/main.py` - Backend API server
- `backend/init_db.py` - Database initialization

### Documentation
- `README.md` - Main project overview
- `frontend/README.md` - Frontend guide
- `backend/README.md` - Backend guide
- `Brain-Tumor-Detection/README.md` - ML module guide
- `CONTRIBUTING.md` - Contribution guidelines
- `LICENSE` - MIT license

## Technology Stack

### Frontend
- **Framework**: Next.js 15.4.5
- **Language**: TypeScript 5.0+
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **HTTP Client**: Axios

### Backend
- **Framework**: FastAPI 0.104.1
- **Language**: Python 3.9+
- **Database**: PostgreSQL/SQLite with SQLAlchemy
- **Authentication**: JWT (python-jose)
- **Background Jobs**: Celery + Redis
- **ML/AI**: TensorFlow 2.15.0

### DevOps
- **Containerization**: Docker
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Railway
- **Version Control**: Git + GitHub

## Development Workflow

1. **Clone Repository**
   ```bash
   git clone https://github.com/harshguptakiet/Cura_Genie.git
   cd Cura_Genie
   ```

2. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   cp .env.example .env.local
   npm run dev
   ```

3. **Setup Backend**
   ```bash
   cd backend
   python -m venv .venv
   .venv\Scripts\activate
   pip install -r requirements.txt
   cp .env.example .env
   python init_db.py
   uvicorn main:app --reload
   ```

4. **Make Changes**
   - Create feature branch
   - Make changes
   - Test thoroughly
   - Commit with clear messages

5. **Submit PR**
   - Push to your fork
   - Create pull request
   - Wait for review

## Maintenance

### Regular Tasks
- Update dependencies regularly
- Review and merge PRs
- Respond to issues
- Update documentation
- Run tests before releases

### Cleanup Commands
```bash
# Clean Python cache
find . -type d -name __pycache__ -exec rm -rf {} +

# Clean Node modules (to reinstall)
rm -rf frontend/node_modules

# Clean Next.js build
rm -rf frontend/.next
```

## Questions?

See [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines.
