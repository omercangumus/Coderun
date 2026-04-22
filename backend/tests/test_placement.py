# Coderun backend — seviye testi endpoint testleri.

from __future__ import annotations

import uuid


from app.schemas.progress import PlacementResultResponse, PlacementTestResponse
from app.schemas.question import QuestionResponse
from app.services.placement_service import calculate_placement


# ---------------------------------------------------------------------------
# calculate_placement pure function testleri
# ---------------------------------------------------------------------------


class TestCalculatePlacement:
    """calculate_placement pure function testleri."""

    def test_beginner_zero_correct(self) -> None:
        """0 doğru cevap → 1. dersten başla."""
        starting_order, skipped = calculate_placement(0, 15, 5)
        assert starting_order == 1
        assert skipped == 0

    def test_beginner_30_percent(self) -> None:
        """%30 doğru → 1. dersten başla."""
        # 4/15 ≈ %26.7 → beginner
        starting_order, skipped = calculate_placement(4, 15, 5)
        assert starting_order == 1
        assert skipped == 0

    def test_intermediate_50_percent(self) -> None:
        """%50 doğru → modülün ortasından başla."""
        # 8/15 ≈ %53.3 → intermediate
        starting_order, skipped = calculate_placement(8, 15, 5)
        assert starting_order == 2  # 5 // 2 = 2
        assert skipped == 1

    def test_advanced_75_percent(self) -> None:
        """%75 doğru → son çeyrekten başla."""
        # 11/15 ≈ %73.3 → advanced
        starting_order, skipped = calculate_placement(11, 15, 5)
        assert starting_order == 3  # (5 * 3) // 4 = 3
        assert skipped == 2

    def test_expert_100_percent(self) -> None:
        """%100 doğru → tüm modül tamamlandı."""
        starting_order, skipped = calculate_placement(15, 15, 5)
        assert starting_order == 6  # total_lessons + 1
        assert skipped == 5

    def test_expert_85_percent(self) -> None:
        """%85 doğru → tüm modül tamamlandı."""
        # 13/15 ≈ %86.7 → expert
        starting_order, skipped = calculate_placement(13, 15, 5)
        assert starting_order == 6
        assert skipped == 5

    def test_zero_total_count(self) -> None:
        """Toplam soru 0 ise 1. dersten başla."""
        starting_order, skipped = calculate_placement(0, 0, 5)
        assert starting_order == 1
        assert skipped == 0


# ---------------------------------------------------------------------------
# PlacementTestResponse şema testleri
# ---------------------------------------------------------------------------


class TestPlacementTestResponse:
    """PlacementTestResponse şema testleri."""

    def _make_question(self, lesson_id: uuid.UUID, order: int = 1) -> QuestionResponse:
        """Test için örnek QuestionResponse oluşturur."""
        return QuestionResponse(
            id=uuid.uuid4(),
            lesson_id=lesson_id,
            question_type="multiple_choice",
            question_text="Test sorusu?",
            options={"choices": ["A", "B", "C", "D"]},
            order=order,
        )

    def test_placement_test_has_15_questions(self) -> None:
        """Seviye testinin 15 soru içerdiğini doğrular."""
        module_id = uuid.uuid4()
        lesson_id = uuid.uuid4()
        questions = [self._make_question(lesson_id, i) for i in range(1, 16)]

        response = PlacementTestResponse(
            module_id=module_id,
            module_title="Python",
            questions=questions,
            total_questions=len(questions),
        )
        assert response.total_questions == 15
        assert len(response.questions) == 15

    def test_placement_questions_no_correct_answer(self) -> None:
        """Seviye testi sorularında correct_answer olmadığını doğrular."""
        lesson_id = uuid.uuid4()
        question = self._make_question(lesson_id)
        assert not hasattr(question, "correct_answer")

    def test_placement_test_response_fields(self) -> None:
        """PlacementTestResponse'un beklenen alanları içerdiğini doğrular."""
        module_id = uuid.uuid4()
        response = PlacementTestResponse(
            module_id=module_id,
            module_title="Python",
            questions=[],
            total_questions=0,
        )
        assert hasattr(response, "module_id")
        assert hasattr(response, "module_title")
        assert hasattr(response, "questions")
        assert hasattr(response, "total_questions")


# ---------------------------------------------------------------------------
# PlacementResultResponse şema testleri
# ---------------------------------------------------------------------------


class TestPlacementResultResponse:
    """PlacementResultResponse şema testleri."""

    def test_placement_submit_beginner_result(self) -> None:
        """%0–30 sonucu için 1. dersten başlandığını doğrular."""
        starting_order, skipped = calculate_placement(3, 15, 5)
        result = PlacementResultResponse(
            correct_count=3,
            total_count=15,
            percentage=round(3 / 15 * 100, 2),
            starting_lesson_order=starting_order,
            skipped_lessons=skipped,
            message="1. dersten başlıyorsunuz.",
        )
        assert result.starting_lesson_order == 1
        assert result.skipped_lessons == 0

    def test_placement_submit_intermediate_result(self) -> None:
        """%31–60 sonucu için ortadan başlandığını doğrular."""
        starting_order, skipped = calculate_placement(8, 15, 5)
        result = PlacementResultResponse(
            correct_count=8,
            total_count=15,
            percentage=round(8 / 15 * 100, 2),
            starting_lesson_order=starting_order,
            skipped_lessons=skipped,
            message=f"{starting_order}. dersten başlıyorsunuz.",
        )
        assert result.starting_lesson_order >= 2
        assert result.skipped_lessons >= 1

    def test_placement_submit_advanced_result(self) -> None:
        """%81–100 sonucu için modülün tamamlandığını doğrular."""
        starting_order, skipped = calculate_placement(13, 15, 5)
        result = PlacementResultResponse(
            correct_count=13,
            total_count=15,
            percentage=round(13 / 15 * 100, 2),
            starting_lesson_order=min(starting_order, 5),
            skipped_lessons=skipped,
            message="Tüm modülü tamamladınız sayılırsınız.",
        )
        assert result.skipped_lessons == 5

    def test_placement_percentage_calculation(self) -> None:
        """Yüzde hesabının doğru olduğunu doğrular."""
        correct = 9
        total = 15
        percentage = round(correct / total * 100, 2)
        assert percentage == 60.0

    def test_placement_result_response_fields(self) -> None:
        """PlacementResultResponse'un beklenen alanları içerdiğini doğrular."""
        result = PlacementResultResponse(
            correct_count=10,
            total_count=15,
            percentage=66.67,
            starting_lesson_order=3,
            skipped_lessons=2,
            message="3. dersten başlıyorsunuz.",
        )
        assert hasattr(result, "correct_count")
        assert hasattr(result, "total_count")
        assert hasattr(result, "percentage")
        assert hasattr(result, "starting_lesson_order")
        assert hasattr(result, "skipped_lessons")
        assert hasattr(result, "message")
