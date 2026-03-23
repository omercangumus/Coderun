# Coderun backend API v1 ana router — tüm v1 endpoint'lerini bir araya toplar.

from fastapi import APIRouter

from backend.app.api.v1.endpoints import auth, lessons, modules, placement

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(modules.router)
api_router.include_router(lessons.router)
api_router.include_router(placement.router)
