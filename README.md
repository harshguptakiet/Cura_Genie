# 🧠 CuraGenie - AI-Powered Healthcare Platform

**Transform your healthcare experience with intelligent medical insights**

[![Next.js](https://img.shields.io/badge/Next.js-15.4.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-green?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.9+-blue?style=for-the-badge&logo=python)](https://python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=for-the-badge&logo=typescript)](https://typescriptlang.org/)

## 🌟 Features

### 🔬 Medical AI Analysis
- **Brain Tumor Detection** - Advanced CNN-based MRI scan analysis
- **Real-time Processing** - Instant medical image classification  
- **Multiple Tumor Types** - Detects Glioma, Meningioma, and other abnormalities
- **Confidence Scoring** - Provides accuracy metrics for each prediction

### 🧬 Genomic Analysis
- **VCF File Processing** - Comprehensive genetic variant analysis
- **PRS Calculations** - Polygenic Risk Score computation
- **Disease Prediction** - AI-powered health risk assessment
- **Personalized Reports** - Detailed genomic insights

### 💬 AI Healthcare Chatbot
- **Medical Queries** - Intelligent health-related Q&A
- **Symptom Analysis** - Preliminary health assessment
- **Treatment Suggestions** - Evidence-based recommendations
- **24/7 Availability** - Round-the-clock healthcare support

### 📊 Health Dashboard
- **Real-time Monitoring** - Live health metrics tracking
- **Interactive Visualizations** - Dynamic charts and graphs
- **Progress Tracking** - Historical health data analysis
- **Predictive Analytics** - Future health trend forecasting

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ (for frontend)
- **Python** 3.9+ (for backend)
- **PostgreSQL** (optional, SQLite by default)
- **Redis** (optional, for background tasks)

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Start development server
npm run dev
```

Frontend will be available at: **http://localhost:3000**

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# Linux/Mac:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Initialize database
python init_db.py

# Start development server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend API will be available at: **http://localhost:8000**
API Documentation: **http://localhost:8000/docs**

### Using Windows Batch Scripts

For Windows users, convenience scripts are provided:

```bash
# Start both frontend and backend
start-all.bat

# Or start individually
start-frontend.bat
start-backend.bat
```

## 🎯 Deployment

### Frontend Deployment (Vercel)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/harshguptakiet/Cura_Genie/tree/main/frontend)

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Configure Project**:
   - Root Directory: `frontend`
   - Framework Preset: Next.js
3. **Environment Variables**: Add `NEXT_PUBLIC_API_URL`
4. **Deploy**: Automatic deployment on every push to main

### Backend Deployment (Railway)

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template)

1. **Connect Repository**: Link your GitHub repository
2. **Configure Service**:
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
3. **Add Database**: Create PostgreSQL database service
4. **Environment Variables**: Configure all required env vars
5. **Deploy**: Automatic deployment on push

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# For production
docker-compose -f docker-compose.prod.yml up -d
```

See [DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) for detailed instructions.

## 📁 Project Structure

```
CuraGenie/
├── frontend/                      # Next.js 15 frontend application
│   ├── src/
│   │   ├── app/                  # Next.js App Router pages
│   │   │   ├── (auth)/          # Authentication pages
│   │   │   ├── dashboard/       # Main dashboard
│   │   │   ├── mri-analysis/    # Brain tumor detection UI
│   │   │   ├── genomic/         # Genomic analysis UI
│   │   │   └── chatbot/         # AI chatbot interface
│   │   ├── components/           # Reusable React components
│   │   │   ├── ui/              # shadcn/ui components
│   │   │   ├── dashboard/
│   │   │   ├── mri/
│   │   │   └── genomic/
│   │   ├── lib/                  # Utility functions
│   │   │   ├── api.ts           # API client
│   │   │   └── auth.ts          # Auth utilities
│   │   └── types/                # TypeScript type definitions
│   ├── public/                   # Static assets
│   ├── package.json
│   └── README.md                 # Frontend documentation
│
├── backend/                       # FastAPI backend application
│   ├── api/                      # API route handlers
│   │   ├── auth.py              # Authentication endpoints
│   │   ├── mri_analysis.py      # Brain tumor detection API
│   │   ├── genomic.py           # Genomic analysis endpoints
│   │   ├── genomic_variants.py  # Variant processing
│   │   ├── prs.py               # Polygenic Risk Score
│   │   ├── chatbot.py           # AI chatbot API
│   │   ├── profile.py           # User profiles
│   │   ├── reports.py           # Health reports
│   │   └── timeline.py          # Activity timeline
│   ├── core/                     # Core functionality
│   │   ├── config.py            # Configuration management
│   │   ├── auth.py              # Authentication logic
│   │   ├── llm_service.py       # LLM integration
│   │   ├── celery_app.py        # Celery configuration
│   │   └── websockets.py        # WebSocket handlers
│   ├── db/                       # Database layer
│   │   ├── database.py          # DB connection
│   │   ├── models.py            # SQLAlchemy models
│   │   └── auth_models.py       # User models
│   ├── schemas/                  # Pydantic schemas
│   │   ├── schemas.py           # Request/response models
│   │   └── auth_schemas.py      # Auth schemas
│   ├── services/                 # Business logic
│   │   └── report_generator.py  # Report generation
│   ├── worker/                   # Celery background workers
│   │   ├── worker.py
│   │   └── tasks.py
│   ├── main.py                   # FastAPI app entry point
│   ├── requirements.txt          # Python dependencies
│   ├── Dockerfile               # Docker configuration
│   └── README.md                # Backend documentation
│
├── Brain-Tumor-Detection/         # CNN-based MRI analysis module
│   ├── Brain Tumor Detection.ipynb  # Model training notebook
│   ├── Data Augmentation.ipynb     # Data preprocessing
│   ├── run_detection.py            # Inference script
│   ├── convnet_architecture.jpg    # Model architecture
│   ├── models/                     # Trained models (gitignored)
│   └── README.md                   # Module documentation
│
├── docs/                          # Documentation
│   ├── DEPLOYMENT_GUIDE.md       # Deployment instructions
│   ├── ARCHITECTURE.md           # System architecture
│   └── LOCAL_TESTING_GUIDE.md    # Local setup guide
│
├── .gitignore                     # Git ignore rules
├── docker-compose.yml             # Docker Compose config
├── docker-compose.prod.yml        # Production Docker config
└── README.md                      # Main documentation (this file)
```

## 🔧 Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (.env)
```env
# Database
DATABASE_URL=sqlite:///./curagenie.db
# Or PostgreSQL:
# DATABASE_URL=postgresql://user:password@localhost:5432/curagenie

# Authentication
JWT_SECRET_KEY=your-super-secret-jwt-key-change-this
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# AI Services
OPENAI_API_KEY=your-openai-api-key-here

# AWS S3 (Optional)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_BUCKET_NAME=curagenie-uploads
AWS_REGION=us-east-1

# Supabase (Optional)
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-anon-key

# Redis (Optional - for background tasks)
REDIS_URL=redis://localhost:6379/0

# App Configuration
UPLOAD_DIR=./uploads
MAX_UPLOAD_SIZE=10485760  # 10MB
```

See `.env.example` files in respective directories for complete configuration options.

## 🏥 Medical Disclaimer

⚠️ **IMPORTANT**: This platform is designed for **educational and research purposes only**. 

- **Not a substitute for professional medical advice**
- **Not intended for clinical diagnosis or treatment**
- **Always consult qualified healthcare professionals** for medical decisions
- AI predictions should be reviewed by medical experts
- Results may have false positives/negatives

## 📚 Documentation

- [Architecture Overview](docs/ARCHITECTURE.md)
- [Deployment Guide](docs/DEPLOYMENT_GUIDE.md)
- [Local Testing Guide](docs/LOCAL_TESTING_GUIDE.md)
- [Frontend Documentation](frontend/README.md)
- [Backend Documentation](backend/README.md)
- [Brain Tumor Detection Module](Brain-Tumor-Detection/README.md)

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/AmazingFeature`
3. **Commit changes**: `git commit -m 'Add some AmazingFeature'`
4. **Push to branch**: `git push origin feature/AmazingFeature`
5. **Open a Pull Request**

### Development Guidelines

- Follow existing code style and conventions
- Write clear commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 🐛 Bug Reports & Feature Requests

Please use GitHub Issues to report bugs or request features:

- **Bug Report**: Describe the issue, steps to reproduce, expected vs actual behavior
- **Feature Request**: Explain the feature and why it would be useful

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Harsh Gupta** - [GitHub](https://github.com/harshguptakiet)

## 🙏 Acknowledgments

- TensorFlow/Keras team for ML framework
- FastAPI team for the amazing backend framework
- Next.js team for the frontend framework
- shadcn/ui for beautiful UI components
- OpenAI for GPT integration
- All contributors and supporters

## 📊 Project Stats

- **Frontend**: Next.js 15.4.5, TypeScript, Tailwind CSS
- **Backend**: FastAPI 0.104.1, Python 3.9+
- **ML Models**: TensorFlow 2.15.0
- **Database**: PostgreSQL/SQLite with SQLAlchemy
- **AI**: OpenAI GPT, Custom CNN

## 🔗 Links

- **Repository**: [github.com/harshguptakiet/Cura_Genie](https://github.com/harshguptakiet/Cura_Genie)
- **Issues**: [github.com/harshguptakiet/Cura_Genie/issues](https://github.com/harshguptakiet/Cura_Genie/issues)
- **Documentation**: See [docs/](docs/) directory

## 📧 Contact

For questions or support, please open an issue or reach out through GitHub.

---

**Built with ❤️ for advancing personalized healthcare through AI, genomics, and modern web technologies.**

⭐ If you find this project useful, please consider giving it a star!
