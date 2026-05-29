# Coderun Development Environment Reset and Seed Script (PowerShell)
# This script sets up a clean development environment with seed data and an admin user

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Coderun Dev Environment Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
Write-Host "[1/6] Checking Docker..." -ForegroundColor Yellow
try {
    docker ps | Out-Null
    Write-Host "✓ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker is not running. Please start Docker Desktop." -ForegroundColor Red
    exit 1
}

# Start database and redis services
Write-Host ""
Write-Host "[2/6] Starting database and Redis..." -ForegroundColor Yellow
docker-compose up -d db redis
Start-Sleep -Seconds 5
Write-Host "✓ Database and Redis started" -ForegroundColor Green

# Run migrations
Write-Host ""
Write-Host "[3/6] Running database migrations..." -ForegroundColor Yellow
Push-Location backend
try {
    python -m alembic upgrade head
    Write-Host "✓ Migrations completed" -ForegroundColor Green
} catch {
    Write-Host "✗ Migration failed" -ForegroundColor Red
    Pop-Location
    exit 1
}
Pop-Location

# Seed database
Write-Host ""
Write-Host "[4/6] Seeding database with demo data..." -ForegroundColor Yellow
Push-Location backend
try {
    python -m app.core.reset_seed
    Write-Host "✓ Database seeded successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Seeding failed" -ForegroundColor Red
    Pop-Location
    exit 1
}
Pop-Location

# Create admin user
Write-Host ""
Write-Host "[5/6] Creating admin user..." -ForegroundColor Yellow
Write-Host "Admin credentials:" -ForegroundColor Cyan
Write-Host "  Email: admin@coderun.com" -ForegroundColor White
Write-Host "  Password: admin123" -ForegroundColor White
Write-Host "  Username: admin" -ForegroundColor White

Push-Location backend
try {
    python -c @"
import asyncio
from app.core.database import AsyncSessionLocal
from app.models.user import User
from app.core.security import get_password_hash
from sqlalchemy import select

async def create_admin():
    async with AsyncSessionLocal() as session:
        # Check if admin exists
        result = await session.execute(select(User).where(User.email == 'admin@coderun.com'))
        admin = result.scalar_one_or_none()
        
        if admin:
            # Update existing user to superuser
            admin.is_superuser = True
            admin.is_verified = True
            await session.commit()
            print('✓ Existing admin user promoted to superuser')
        else:
            # Create new admin user
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
            print('✓ Admin user created successfully')

asyncio.run(create_admin())
"@
    Write-Host "✓ Admin user ready" -ForegroundColor Green
} catch {
    Write-Host "✗ Admin user creation failed" -ForegroundColor Red
    Pop-Location
    exit 1
}
Pop-Location

# Summary
Write-Host ""
Write-Host "[6/6] Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Start backend:" -ForegroundColor Yellow
Write-Host "   cd backend" -ForegroundColor White
Write-Host "   uvicorn app.main:app --reload" -ForegroundColor White
Write-Host ""
Write-Host "2. Start web:" -ForegroundColor Yellow
Write-Host "   cd web/coderun-web" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "3. Start mobile:" -ForegroundColor Yellow
Write-Host "   cd mobile/coderun_mobile" -ForegroundColor White
Write-Host "   flutter run" -ForegroundColor White
Write-Host ""
Write-Host "4. Access:" -ForegroundColor Yellow
Write-Host "   Backend API: http://localhost:8000/docs" -ForegroundColor White
Write-Host "   Web App: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "5. Admin Login:" -ForegroundColor Yellow
Write-Host "   Email: admin@coderun.com" -ForegroundColor White
Write-Host "   Password: admin123" -ForegroundColor White
Write-Host ""
