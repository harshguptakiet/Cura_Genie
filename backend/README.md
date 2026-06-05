# CuraGenie Backend

FastAPI-based backend for AI-powered healthcare platform.

## Features

- 🔐 **Authentication**: JWT-based user authentication
- 🧠 **Brain Tumor Detection**: CNN model integration
- 🧬 **Genomic Analysis**: VCF file processing and PRS calculations
- 💬 **AI Chatbot**: OpenAI GPT integration
- 📊 **Data Management**: SQLAlchemy ORM with PostgreSQL
- ⚡ **Real-time Updates**: WebSocket support
- 🔄 **Background Tasks**: Celery + Redis

## Tech Stack

- **Framework**: FastAPI 0.104.1
- **Database**: PostgreSQL/SQLite + SQLAlchemy
- **ML/AI**: TensorFlow, OpenCV, Biopython
- **Authentication**: JWT (python-jose)
- **Task Queue**: Celery + Redis
- **Cloud**: AWS S3, Supabase

## Quick Start

### Installation

```bash
cd backend

# Create virtual environment
python -m venv .venv
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt
```

### Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Required environment variables:
```env
DATABASE_URL=sqlite:///./curagenie.db
JWT_SECRET_KEY=your-secret-key-here
OPENAI_API_KEY=your-openai-key
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
```

### Database Setup

```bash
python init_db.py
```

### Run Development Server

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API will be available at: http://localhost:8000
API Docs: http://localhost:8000/docs

## Project Structure

```
backend/
├── api/                    # API route handlers
│   ├── auth.py            # Authentication endpoints
│   ├── mri_analysis.py    # Brain tumor detection
│   ├── genomic.py         # Genomic analysis
│   ├── chatbot.py         # AI chatbot
│   └── ...
├── core/                   # Core functionality
│   ├── config.py          # Configuration
│   ├── auth.py            # Auth utilities
│   ├── llm_service.py     # LLM integration
│   └── websockets.py      # WebSocket handlers
├── db/                     # Database layer
│   ├── database.py        # DB connection
│   ├── models.py          # SQLAlchemy models
│   └── auth_models.py     # Auth models
├── schemas/                # Pydantic schemas
│   ├── schemas.py         # Request/response models
│   └── auth_schemas.py    # Auth schemas
├── services/               # Business logic
│   └── report_generator.py
├── worker/                 # Celery workers
│   ├── worker.py
│   └── tasks.py
├── main.py                 # FastAPI application
├── app.py                  # Alternative entry point
├── requirements.txt        # Python dependencies
└── Dockerfile             # Docker configuration
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### MRI Analysis
- `POST /api/mri/upload` - Upload MRI scan
- `POST /api/mri/analyze` - Analyze MRI image
- `GET /api/mri/results/{id}` - Get analysis results

### Genomic Analysis
- `POST /api/genomic/upload` - Upload VCF file
- `POST /api/genomic/analyze` - Analyze genomic data
- `GET /api/genomic/prs` - Get PRS calculations

### Chatbot
- `POST /api/chatbot/message` - Send message
- `GET /api/chatbot/history` - Get conversation history

### Reports
- `GET /api/reports/generate/{user_id}` - Generate health report
- `GET /api/reports/{report_id}` - Get report by ID

## Development

### Running Tests

```bash
pytest
```

### Code Style

```bash
black .
flake8 .
```

## Deployment

### Docker

```bash
docker build -t curagenie-backend .
docker run -p 8000:8000 curagenie-backend
```

### Railway/Render

1. Connect your GitHub repository
2. Set environment variables
3. Deploy using provided Dockerfile

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Submit pull request

## License

MIT License - see LICENSE file for details
