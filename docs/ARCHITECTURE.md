# CuraGenie Architecture

## System Overview

CuraGenie is a full-stack AI-powered healthcare platform with three main components:

### 1. Frontend (Next.js 15)
- **Framework**: Next.js with App Router
- **UI Library**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand
- **API Communication**: Axios
- **WebSocket**: Real-time updates

### 2. Backend (FastAPI)
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL/SQLite with SQLAlchemy ORM
- **Authentication**: JWT tokens
- **Background Jobs**: Celery + Redis
- **AI/ML**: TensorFlow, OpenAI API
- **File Storage**: Local + AWS S3/Supabase

### 3. ML Models
- **Brain Tumor Detection**: CNN (TensorFlow/Keras)
- **Genomic Analysis**: Custom algorithms + Biopython
- **Healthcare Chatbot**: OpenAI GPT integration

## Data Flow

```
User → Frontend (Next.js) → API Gateway (FastAPI) → Services
                                                    ↓
                                              Database (PostgreSQL)
                                                    ↓
                                              ML Models (TensorFlow)
                                                    ↓
                                              Results → User
```

## Security
- JWT-based authentication
- Password hashing (bcrypt)
- CORS configuration
- Environment-based secrets
- Input validation (Pydantic)

## Deployment
- Frontend: Vercel
- Backend: Railway/Render
- Database: Railway PostgreSQL
- Static Assets: Vercel CDN
