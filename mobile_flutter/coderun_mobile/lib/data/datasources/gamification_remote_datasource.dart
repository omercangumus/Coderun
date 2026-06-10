import 'package:dio/dio.dart';
import '../../core/constants/api_constants.dart';
import '../../core/network/api_exception.dart';
import '../models/badge_model.dart';
import '../models/leaderboard_model.dart';
import '../models/level_progress_model.dart';
import '../models/streak_model.dart';
import '../models/user_stats_model.dart';

abstract class GamificationRemoteDataSource {
  Future<UserStatsModel> getUserStats();
  Future<List<BadgeModel>> getUserBadges();
  Future<LevelProgressModel> getLevelProgress();
  Future<StreakModel> getStreak();
  Future<LeaderboardModel> getLeaderboard({int limit = 10});
}

class GamificationRemoteDataSourceImpl implements GamificationRemoteDataSource {
  final Dio _dio;

  const GamificationRemoteDataSourceImpl({required Dio dio}) : _dio = dio;

  @override
  Future<UserStatsModel> getUserStats() async {
    try {
      final response = await _dio.get(ApiConstants.stats);
      return UserStatsModel.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw ApiException.fromDioError(e);
    }
  }

  @override
  Future<List<BadgeModel>> getUserBadges() async {
    try {
      final response = await _dio.get(ApiConstants.badges);
      return (response.data as List)
          .map((json) => BadgeModel.fromJson(json as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw ApiException.fromDioError(e);
    }
  }

  @override
  Future<LevelProgressModel> getLevelProgress() async {
    try {
      final response = await _dio.get(ApiConstants.levelProgress);
      return LevelProgressModel.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw ApiException.fromDioError(e);
    }
  }

  @override
  Future<StreakModel> getStreak() async {
    try {
      final response = await _dio.get(ApiConstants.streak);
      return StreakModel.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw ApiException.fromDioError(e);
    }
  }

  @override
  Future<LeaderboardModel> getLeaderboard({int limit = 10}) async {
    try {
      final response = await _dio.get(
        ApiConstants.leaderboard,
        queryParameters: {'limit': limit},
      );
      return LeaderboardModel.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw ApiException.fromDioError(e);
    }
  }
}
