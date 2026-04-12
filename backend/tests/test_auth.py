# Coderun backend — auth endpoint entegrasyon testleri.

from __future__ import annotations

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_register_success(client: AsyncClient) -> None:
    """Geçerli bilgilerle kayıt başarılı olmalıdır."""
    payload = {
        "email": "newuser@example.com",
        "username": "new_user_1",
        "password": "StrongPass1",
    }
    response = await client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == payload["email"]
    assert data["username"] == payload["username"]
    assert "hashed_password" not in data


@pytest.mark.asyncio
async def test_register_duplicate_email(
    client: AsyncClient,
    test_user: dict[str, str],
) -> None:
    """Aynı e-posta ile ikinci kayıt 400 döndürmelidir."""
    payload = {
        "email": test_user["email"],
        "username": "another_user",
        "password": "StrongPass1",
    }
    response = await client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 400


@pytest.mark.asyncio
async def test_register_duplicate_username(
    client: AsyncClient,
    test_user: dict[str, str],
) -> None:
    """Aynı kullanıcı adı ile ikinci kayıt 400 döndürmelidir."""
    payload = {
        "email": "othermail@example.com",
        "username": test_user["username"],
        "password": "StrongPass1",
    }
    response = await client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 400


@pytest.mark.asyncio
async def test_register_weak_password(client: AsyncClient) -> None:
    """Zayıf şifre gönderildiğinde 422 dönmelidir."""
    payload = {
        "email": "weakpass@example.com",
        "username": "weak_user",
        "password": "weakpass",
    }
    response = await client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_login_success(
    client: AsyncClient,
    test_user: dict[str, str],
) -> None:
    """Doğru bilgilerle login token yanıtı döndürmelidir."""
    response = await client.post(
        "/api/v1/auth/login",
        data={"username": test_user["email"], "password": test_user["password"]},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"
    assert isinstance(data["expires_in"], int)


@pytest.mark.asyncio
async def test_login_wrong_password(
    client: AsyncClient,
    test_user: dict[str, str],
) -> None:
    """Yanlış şifre ile login 401 dönmelidir."""
    response = await client.post(
        "/api/v1/auth/login",
        data={"username": test_user["email"], "password": "WrongPass1"},
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_login_nonexistent_user(client: AsyncClient) -> None:
    """Var olmayan kullanıcı ile login 401 dönmelidir."""
    response = await client.post(
        "/api/v1/auth/login",
        data={"username": "nouser@example.com", "password": "StrongPass1"},
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_get_me_authenticated(
    client: AsyncClient,
    test_user: dict[str, str],
) -> None:
    """Geçerli access token ile /me kullanıcıyı döndürmelidir."""
    login_response = await client.post(
        "/api/v1/auth/login",
        data={"username": test_user["email"], "password": test_user["password"]},
    )
    token = login_response.json()["access_token"]
    response = await client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    assert response.json()["email"] == test_user["email"]


@pytest.mark.asyncio
async def test_get_me_no_token(client: AsyncClient) -> None:
    """Token olmadan /me isteği 401 dönmelidir."""
    response = await client.get("/api/v1/auth/me")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_get_me_invalid_token(client: AsyncClient) -> None:
    """Geçersiz token ile /me isteği 401 dönmelidir."""
    response = await client.get(
        "/api/v1/auth/me",
        headers={"Authorization": "Bearer invalid-token"},
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_refresh_token_success(
    client: AsyncClient,
    test_user: dict[str, str],
) -> None:
    """Geçerli refresh token ile access token yenilenmelidir."""
    login_response = await client.post(
        "/api/v1/auth/login",
        data={"username": test_user["email"], "password": test_user["password"]},
    )
    refresh_token = login_response.json()["refresh_token"]
    response = await client.post(
        "/api/v1/auth/refresh",
        json={"refresh_token": refresh_token},
    )
    assert response.status_code == 200
    assert "access_token" in response.json()


@pytest.mark.asyncio
async def test_refresh_token_invalid(client: AsyncClient) -> None:
    """Geçersiz refresh token gönderildiğinde 401 dönmelidir."""
    response = await client.post(
        "/api/v1/auth/refresh",
        json={"refresh_token": "invalid-refresh-token"},
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_logout_success(
    client: AsyncClient,
    test_user: dict[str, str],
) -> None:
    """Geçerli token ile logout başarılı olmalıdır."""
    login_response = await client.post(
        "/api/v1/auth/login",
        data={"username": test_user["email"], "password": test_user["password"]},
    )
    token = login_response.json()["access_token"]
    response = await client.post(
        "/api/v1/auth/logout",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    assert "message" in response.json()


@pytest.mark.asyncio
async def test_logout_unauthorized(client: AsyncClient) -> None:
    """Token olmadan logout 401 dönmelidir."""
    response = await client.post("/api/v1/auth/logout")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_register_logs_new_user(
    client: AsyncClient,
) -> None:
    """Yeni kullanıcı kaydı loglanmalıdır."""
    from unittest.mock import patch
    
    with patch("backend.app.api.v1.endpoints.auth.logger") as mock_logger:
        payload = {
            "email": "logtest@example.com",
            "username": "log_test_user",
            "password": "StrongPass1",
        }
        response = await client.post("/api/v1/auth/register", json=payload)
        assert response.status_code == 201
        
        # Verify logger was called
        mock_logger.info.assert_called_once()
        call_args = mock_logger.info.call_args[0]
        assert "registered" in call_args[0].lower()


@pytest.mark.asyncio
async def test_logout_logs_user(
    client: AsyncClient,
    test_user: dict[str, str],
) -> None:
    """Logout işlemi loglanmalıdır."""
    from unittest.mock import patch
    
    # Login first
    login_response = await client.post(
        "/api/v1/auth/login",
        data={"username": test_user["email"], "password": test_user["password"]},
    )
    token = login_response.json()["access_token"]
    
    with patch("backend.app.api.v1.endpoints.auth.logger") as mock_logger:
        response = await client.post(
            "/api/v1/auth/logout",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert response.status_code == 200
        
        # Verify logger was called
        mock_logger.info.assert_called_once()
        call_args = mock_logger.info.call_args[0]
        assert "logged out" in call_args[0].lower()
