# Coderun backend — common schema testleri.

from backend.app.schemas.common import PaginatedResponse


class TestPaginatedResponse:
    """PaginatedResponse şeması için testler."""

    def test_paginated_response_creation(self) -> None:
        """PaginatedResponse oluşturulabilir."""
        response = PaginatedResponse[str](
            items=["item1", "item2"],
            total=10,
            skip=0,
            limit=2,
        )
        assert response.items == ["item1", "item2"]
        assert response.total == 10
        assert response.skip == 0
        assert response.limit == 2

    def test_paginated_response_empty_items(self) -> None:
        """PaginatedResponse boş liste ile oluşturulabilir."""
        response = PaginatedResponse[int](
            items=[],
            total=0,
            skip=0,
            limit=10,
        )
        assert response.items == []
        assert response.total == 0

    def test_paginated_response_with_dict(self) -> None:
        """PaginatedResponse dict ile oluşturulabilir."""
        response = PaginatedResponse[dict](
            items=[{"id": 1}, {"id": 2}],
            total=2,
            skip=0,
            limit=10,
        )
        assert len(response.items) == 2
        assert response.items[0]["id"] == 1
