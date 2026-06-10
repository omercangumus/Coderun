import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/network/api_exception.dart';
import '../data/models/leaderboard_model.dart';
import '../data/models/level_progress_model.dart';
import '../data/models/streak_model.dart';
import '../data/models/user_stats_model.dart';
import 'providers.dart';

/// Kullanıcı istatistikleri.
final userStatsProvider = FutureProvider<UserStatsModel>((ref) async {
  final repository = ref.watch(gamificationRepositoryProvider);
  final response = await repository.getUserStats();
  return response.when(
    success: (data) => data,
    error: (message, _) => throw ApiException(message: message),
    loading: () => throw const ApiException(message: 'Beklenmedik yükleme durumu'),
  );
});

/// Streak bilgisi.
final streakProvider = FutureProvider<StreakModel>((ref) async {
  final repository = ref.watch(gamificationRepositoryProvider);
  final response = await repository.getStreak();
  return response.when(
    success: (data) => data,
    error: (message, _) => throw ApiException(message: message),
    loading: () => throw const ApiException(message: 'Beklenmedik yükleme durumu'),
  );
});

/// Haftalık liderboard.
final leaderboardProvider = FutureProvider<LeaderboardModel>((ref) async {
  final repository = ref.watch(gamificationRepositoryProvider);
  final response = await repository.getLeaderboard(limit: 10);
  return response.when(
    success: (data) => data,
    error: (message, _) => throw ApiException(message: message),
    loading: () => throw const ApiException(message: 'Beklenmedik yükleme durumu'),
  );
});

/// Seviye ilerlemesi.
final levelProgressProvider = FutureProvider<LevelProgressModel>((ref) async {
  final repository = ref.watch(gamificationRepositoryProvider);
  final response = await repository.getLevelProgress();
  return response.when(
    success: (data) => data,
    error: (message, _) => throw ApiException(message: message),
    loading: () => throw const ApiException(message: 'Beklenmedik yükleme durumu'),
  );
});
