# Coderun backend API v1 ana router — tüm v1 endpoint'lerini bir araya toplar.

from fastapi import APIRouter

from backend.app.api.v1.endpoints import auth

api_router = APIRouter()
api_router.include_router(auth.router)
