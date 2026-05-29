# Coderun backend API v1 ana router — tüm v1 endpoint'lerini bir araya toplar.

from fastapi import APIRouter

from app.api.v1.endpoints import admin, ai, auth, gamification, lessons, mentor, modules, placement, code_runner

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(modules.router)
api_router.include_router(lessons.router)
api_router.include_router(placement.router)
api_router.include_router(gamification.router)
api_router.include_router(ai.router)
api_router.include_router(mentor.router)
api_router.include_router(admin.router)
api_router.include_router(code_runner.router)
