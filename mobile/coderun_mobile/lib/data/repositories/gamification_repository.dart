import '../../core/network/api_exception.dart';
import '../datasources/gamification_remote_datasource.dart';
import '../models/api_response_model.dart';
import '../models/badge_model.dart';
import '../models/leaderboard_model.dart';
import '../models/level_progress_model.dart';
import '../models/streak_model.dart';
import '../models/user_stats_model.dart';

abstract class GamificationRepository {
  Future<ApiResponse<UserStatsModel>> getUserStats();
  Future<ApiResponse<List<BadgeModel>>> getUserBadges();
  Future<ApiResponse<LevelProgressModel>> getLevelProgress();
  Future<ApiResponse<StreakModel>> getStreak();
  Future<ApiResponse<LeaderboardModel>> getLeaderboard({int limit = 10});
}

class GamificationRepositoryImpl implements GamificationRepository {
  final GamificationRemoteDataSource _remoteDataSource;

  const GamificationRepositoryImpl({
    required GamificationRemoteDataSource remoteDataSource,
  }) : _remoteDataSource = remoteDataSource;

  @override
  Future<ApiResponse<UserStatsModel>> getUserStats() async {
    try {
      final data = await _remoteDataSource.getUserStats();
      return ApiResponse.success(data);
    } on ApiException catch (e) {
      return ApiResponse.error(e.message, statusCode: e.statusCode);
    }
  }

  @override
  Future<ApiResponse<List<BadgeModel>>> getUserBadges() async {
    try {
      final data = await _remoteDataSource.getUserBadges();
      return ApiResponse.success(data);
    } on ApiException catch (e) {
      return ApiResponse.error(e.message, statusCode: e.statusCode);
    }
  }

  @override
  Future<ApiResponse<LevelProgressModel>> getLevelProgress() async {
    try {
      final data = await _remoteDataSource.getLevelProgress();
      return ApiResponse.success(data);
    } on ApiException catch (e) {
      return ApiResponse.error(e.message, statusCode: e.statusCode);
    }
  }

  @override
  Future<ApiResponse<StreakModel>> getStreak() async {
    try {
      final data = await _remoteDataSource.getStreak();
      return ApiResponse.success(data);
    } on ApiException catch (e) {
      return ApiResponse.error(e.message, statusCode: e.statusCode);
    }
  }

  @override
  Future<ApiResponse<LeaderboardModel>> getLeaderboard({int limit = 10}) async {
    try {
      final data = await _remoteDataSource.getLeaderboard(limit: limit);
      return ApiResponse.success(data);
    } on ApiException catch (e) {
      return ApiResponse.error(e.message, statusCode: e.statusCode);
    }
  }
}
