#!/bin/bash
# Coderun Development Environment Reset and Seed Script (Bash)
# This script sets up a clean development environment with seed data and an admin user

set -e

echo "========================================"
echo "Coderun Dev Environment Setup"
echo "========================================"
echo ""

# Check if Docker is running
echo "[1/6] Checking Docker..."
if ! docker ps > /dev/null 2>&1; then
    echo "✗ Docker is not running. Please start Docker."
    exit 1
fi
echo "✓ Docker is running"

# Start database and redis services
echo ""
echo "[2/6] Starting database and Redis..."
docker-compose up -d db redis
sleep 5
echo "✓ Database and Redis started"

# Run migrations
echo ""
echo "[3/6] Running database migrations..."
cd backend
python -m alembic upgrade head
echo "✓ Migrations completed"
cd ..

# Seed database
echo ""
echo "[4/6] Seeding database with demo data..."
cd backend
python -m app.core.reset_seed
echo "✓ Database seeded successfully"
cd ..

# Create admin user
echo ""
echo "[5/6] Creating admin user..."
echo "Admin credentials:"
echo "  Email: admin@coderun.com"
echo "  Password: admin123"
echo "  Username: admin"

cd backend
python -c "
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
"
echo "✓ Admin user ready"
cd ..

# Summary
echo ""
echo "[6/6] Setup complete!"
echo ""
echo "========================================"
echo "Next Steps:"
echo "========================================"
echo ""
echo "1. Start backend:"
echo "   cd backend"
echo "   uvicorn app.main:app --reload"
echo ""
echo "2. Start web:"
echo "   cd web/coderun-web"
echo "   npm run dev"
echo ""
echo "3. Start mobile:"
echo "   cd mobile/coderun_mobile"
echo "   flutter run"
echo ""
echo "4. Access:"
echo "   Backend API: http://localhost:8000/docs"
echo "   Web App: http://localhost:3000"
echo ""
echo "5. Admin Login:"
echo "   Email: admin@coderun.com"
echo "   Password: admin123"
echo ""
