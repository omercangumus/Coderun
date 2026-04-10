// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'leaderboard_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$LeaderboardEntryModelImpl _$$LeaderboardEntryModelImplFromJson(
        Map<String, dynamic> json) =>
    _$LeaderboardEntryModelImpl(
      rank: (json['rank'] as num).toInt(),
      userId: json['user_id'] as String,
      username: json['username'] as String,
      weeklyXp: (json['weekly_xp'] as num).toInt(),
      level: (json['level'] as num).toInt(),
      streak: (json['streak'] as num).toInt(),
    );

Map<String, dynamic> _$$LeaderboardEntryModelImplToJson(
        _$LeaderboardEntryModelImpl instance) =>
    <String, dynamic>{
      'rank': instance.rank,
      'user_id': instance.userId,
      'username': instance.username,
      'weekly_xp': instance.weeklyXp,
      'level': instance.level,
      'streak': instance.streak,
    };

_$LeaderboardModelImpl _$$LeaderboardModelImplFromJson(
        Map<String, dynamic> json) =>
    _$LeaderboardModelImpl(
      entries: (json['entries'] as List<dynamic>)
          .map((e) => LeaderboardEntryModel.fromJson(e as Map<String, dynamic>))
          .toList(),
      totalCount: (json['total_count'] as num).toInt(),
      userRank: (json['user_rank'] as num?)?.toInt(),
      weekStart: json['week_start'] as String,
      weekEnd: json['week_end'] as String,
    );

Map<String, dynamic> _$$LeaderboardModelImplToJson(
        _$LeaderboardModelImpl instance) =>
    <String, dynamic>{
      'entries': instance.entries,
      'total_count': instance.totalCount,
      'user_rank': instance.userRank,
      'week_start': instance.weekStart,
      'week_end': instance.weekEnd,
    };
