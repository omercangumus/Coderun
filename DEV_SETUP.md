# Coderun Development Environment Setup

This guide explains how to set up and run the Coderun development environment locally.

## Prerequisites

- **Docker Desktop** (for PostgreSQL and Redis)
- **Python 3.11+** (for backend)
- **Node.js 18+** (for web)
- **Flutter 3.x** (for mobile)

## Quick Start

### Automated Setup (Recommended)

Run the automated setup script to initialize the database, run migrations, seed demo data, and create an admin user:

**Windows (PowerShell):**
```powershell
.\scripts\dev-reset-and-seed.ps1
```

**macOS/Linux (Bash):**
```bash
chmod +x scripts/dev-reset-and-seed.sh
./scripts/dev-reset-and-seed.sh
```

This script will:
1. Start PostgreSQL and Redis containers
2. Run database migrations
3. Seed demo data (modules, lessons, questions)
4. Create an admin user (admin@coderun.com / admin123)

### Manual Setup

If you prefer manual setup or need to troubleshoot:

#### 1. Start Database Services

```bash
docker-compose up -d db redis
```

#### 2. Run Migrations

```bash
cd backend
python -m alembic upgrade head
```

#### 3. Seed Database

```bash
cd backend
python -m app.core.reset_seed
```

#### 4. Create Admin User

```bash
cd backend
python -c "
import asyncio
from app.core.database import AsyncSessionLocal
from app.models.user import User
from app.core.security import get_password_hash
from sqlalchemy import select

async def create_admin():
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(User).where(User.email == 'admin@coderun.com'))
        admin = result.scalar_one_or_none()
        
        if admin:
            admin.is_superuser = True
            admin.is_verified = True
            await session.commit()
            print('Admin user promoted')
        else:
            admin = User(
                email='admin@coderun.com',
                username='admin',
                hashed_password=get_password_hash('admin123'),
                is_superuser=True,
                is_verified=True,
                is_active=True,
                xp=0,
                level=1,
                streak=0
            )
            session.add(admin)
            await session.commit()
            print('Admin user created')

asyncio.run(create_admin())
"
```

## Running the Applications

### Backend (FastAPI)

```bash
cd backend
uvicorn app.main:app --reload
```

Access at: http://localhost:8000/docs

### Web (Next.js)

```bash
cd web/coderun-web
npm install  # First time only
npm run dev
```

Access at: http://localhost:3000

### Mobile (Flutter)

```bash
cd mobile/coderun_mobile
flutter pub get  # First time only
flutter run
```

## Default Credentials

### Admin User
- **Email:** admin@coderun.com
- **Password:** admin123
- **Access:** Full admin panel access at `/admin`

### Test User (Optional)
You can register a new user through the app or create one manually.

## Database Access

### PostgreSQL
- **Host:** localhost
- **Port:** 5433 (mapped from container's 5432)
- **Database:** coderun
- **User:** coderun
- **Password:** (check `.env` file)

### Redis
- **Host:** localhost
- **Port:** 6379

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Key variables:
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `SECRET_KEY` - JWT secret key
- `OPENROUTER_API_KEY` - AI Mentor API key (optional)

## Troubleshooting

### Database Connection Issues

If you see "connection refused" errors:

1. Check Docker containers are running:
   ```bash
   docker-compose ps
   ```

2. Check database health:
   ```bash
   docker-compose logs db
   ```

3. Restart containers:
   ```bash
   docker-compose restart db redis
   ```

### Migration Issues

If migrations fail:

1. Check current migration status:
   ```bash
   cd backend
   alembic current
   ```

2. Reset to a specific revision:
   ```bash
   alembic downgrade <revision>
   alembic upgrade head
   ```

### Seed Data Issues

If seed data fails to load:

1. Check database is empty:
   ```bash
   docker-compose exec db psql -U coderun -d coderun -c "SELECT COUNT(*) FROM modules;"
   ```

2. Manually clean and re-seed:
   ```bash
   cd backend
   python -m app.core.reset_seed
   ```

### Port Conflicts

If ports are already in use:

- Backend (8000): Change in `backend/app/main.py` and `docker-compose.yml`
- Web (3000): Change in `web/coderun-web/package.json` dev script
- PostgreSQL (5433): Change in `docker-compose.yml`
- Redis (6379): Change in `docker-compose.yml`

## Development Workflow

### Making Database Changes

1. Create a new migration:
   ```bash
   cd backend
   alembic revision --autogenerate -m "description"
   ```

2. Review the generated migration in `backend/alembic/versions/`

3. Apply the migration:
   ```bash
   alembic upgrade head
   ```

### Adding Seed Data

Edit `backend/app/core/seed_data.py` and run:

```bash
cd backend
python -m app.core.reset_seed
```

### Running Tests

**Backend:**
```bash
cd backend
pytest
```

**Web:**
```bash
cd web/coderun-web
npm test
```

**Mobile:**
```bash
cd mobile/coderun_mobile
flutter test
```

## Docker Compose Services

The `docker-compose.yml` includes:

- **db** - PostgreSQL 15
- **redis** - Redis 7
- **backend** - FastAPI (optional, can run locally)
- **web** - Next.js (optional, can run locally)

For development, it's recommended to run backend and web locally (not in Docker) for faster hot-reload.

## Additional Resources

- [Backend API Documentation](http://localhost:8000/docs) - Swagger UI
- [Backend API Redoc](http://localhost:8000/redoc) - ReDoc UI
- [Project README](README.md) - Full project documentation
- [Architecture Docs](docs/) - Design and architecture documents

## Support

For issues or questions:
1. Check the [README.md](README.md)
2. Review error logs in terminal
3. Check Docker container logs: `docker-compose logs <service>`
4. Open an issue on GitHub
