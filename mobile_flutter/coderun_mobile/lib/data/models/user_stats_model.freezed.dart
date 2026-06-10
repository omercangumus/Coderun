// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'user_stats_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

UserStatsModel _$UserStatsModelFromJson(Map<String, dynamic> json) {
  return _UserStatsModel.fromJson(json);
}

/// @nodoc
mixin _$UserStatsModel {
  @JsonKey(name: 'total_xp')
  int get totalXp => throw _privateConstructorUsedError;
  int get level => throw _privateConstructorUsedError;
  int get streak => throw _privateConstructorUsedError;
  @JsonKey(name: 'total_lessons_completed')
  int get totalLessonsCompleted => throw _privateConstructorUsedError;
  @JsonKey(name: 'total_modules_completed')
  int get totalModulesCompleted => throw _privateConstructorUsedError;
  List<BadgeModel> get badges => throw _privateConstructorUsedError;
  @JsonKey(name: 'level_progress')
  LevelProgressModel get levelProgress => throw _privateConstructorUsedError;
  @JsonKey(name: 'streak_info')
  StreakModel get streakInfo => throw _privateConstructorUsedError;

  /// Serializes this UserStatsModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of UserStatsModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $UserStatsModelCopyWith<UserStatsModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $UserStatsModelCopyWith<$Res> {
  factory $UserStatsModelCopyWith(
          UserStatsModel value, $Res Function(UserStatsModel) then) =
      _$UserStatsModelCopyWithImpl<$Res, UserStatsModel>;
  @useResult
  $Res call(
      {@JsonKey(name: 'total_xp') int totalXp,
      int level,
      int streak,
      @JsonKey(name: 'total_lessons_completed') int totalLessonsCompleted,
      @JsonKey(name: 'total_modules_completed') int totalModulesCompleted,
      List<BadgeModel> badges,
      @JsonKey(name: 'level_progress') LevelProgressModel levelProgress,
      @JsonKey(name: 'streak_info') StreakModel streakInfo});

  $LevelProgressModelCopyWith<$Res> get levelProgress;
  $StreakModelCopyWith<$Res> get streakInfo;
}

/// @nodoc
class _$UserStatsModelCopyWithImpl<$Res, $Val extends UserStatsModel>
    implements $UserStatsModelCopyWith<$Res> {
  _$UserStatsModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of UserStatsModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? totalXp = null,
    Object? level = null,
    Object? streak = null,
    Object? totalLessonsCompleted = null,
    Object? totalModulesCompleted = null,
    Object? badges = null,
    Object? levelProgress = null,
    Object? streakInfo = null,
  }) {
    return _then(_value.copyWith(
      totalXp: null == totalXp
          ? _value.totalXp
          : totalXp // ignore: cast_nullable_to_non_nullable
              as int,
      level: null == level
          ? _value.level
          : level // ignore: cast_nullable_to_non_nullable
              as int,
      streak: null == streak
          ? _value.streak
          : streak // ignore: cast_nullable_to_non_nullable
              as int,
      totalLessonsCompleted: null == totalLessonsCompleted
          ? _value.totalLessonsCompleted
          : totalLessonsCompleted // ignore: cast_nullable_to_non_nullable
              as int,
      totalModulesCompleted: null == totalModulesCompleted
          ? _value.totalModulesCompleted
          : totalModulesCompleted // ignore: cast_nullable_to_non_nullable
              as int,
      badges: null == badges
          ? _value.badges
          : badges // ignore: cast_nullable_to_non_nullable
              as List<BadgeModel>,
      levelProgress: null == levelProgress
          ? _value.levelProgress
          : levelProgress // ignore: cast_nullable_to_non_nullable
              as LevelProgressModel,
      streakInfo: null == streakInfo
          ? _value.streakInfo
          : streakInfo // ignore: cast_nullable_to_non_nullable
              as StreakModel,
    ) as $Val);
  }

  /// Create a copy of UserStatsModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @pragma('vm:prefer-inline')
  $LevelProgressModelCopyWith<$Res> get levelProgress {
    return $LevelProgressModelCopyWith<$Res>(_value.levelProgress, (value) {
      return _then(_value.copyWith(levelProgress: value) as $Val);
    });
  }

  /// Create a copy of UserStatsModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @pragma('vm:prefer-inline')
  $StreakModelCopyWith<$Res> get streakInfo {
    return $StreakModelCopyWith<$Res>(_value.streakInfo, (value) {
      return _then(_value.copyWith(streakInfo: value) as $Val);
    });
  }
}

/// @nodoc
abstract class _$$UserStatsModelImplCopyWith<$Res>
    implements $UserStatsModelCopyWith<$Res> {
  factory _$$UserStatsModelImplCopyWith(_$UserStatsModelImpl value,
          $Res Function(_$UserStatsModelImpl) then) =
      __$$UserStatsModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {@JsonKey(name: 'total_xp') int totalXp,
      int level,
      int streak,
      @JsonKey(name: 'total_lessons_completed') int totalLessonsCompleted,
      @JsonKey(name: 'total_modules_completed') int totalModulesCompleted,
      List<BadgeModel> badges,
      @JsonKey(name: 'level_progress') LevelProgressModel levelProgress,
      @JsonKey(name: 'streak_info') StreakModel streakInfo});

  @override
  $LevelProgressModelCopyWith<$Res> get levelProgress;
  @override
  $StreakModelCopyWith<$Res> get streakInfo;
}

/// @nodoc
class __$$UserStatsModelImplCopyWithImpl<$Res>
    extends _$UserStatsModelCopyWithImpl<$Res, _$UserStatsModelImpl>
    implements _$$UserStatsModelImplCopyWith<$Res> {
  __$$UserStatsModelImplCopyWithImpl(
      _$UserStatsModelImpl _value, $Res Function(_$UserStatsModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of UserStatsModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? totalXp = null,
    Object? level = null,
    Object? streak = null,
    Object? totalLessonsCompleted = null,
    Object? totalModulesCompleted = null,
    Object? badges = null,
    Object? levelProgress = null,
    Object? streakInfo = null,
  }) {
    return _then(_$UserStatsModelImpl(
      totalXp: null == totalXp
          ? _value.totalXp
          : totalXp // ignore: cast_nullable_to_non_nullable
              as int,
      level: null == level
          ? _value.level
          : level // ignore: cast_nullable_to_non_nullable
              as int,
      streak: null == streak
          ? _value.streak
          : streak // ignore: cast_nullable_to_non_nullable
              as int,
      totalLessonsCompleted: null == totalLessonsCompleted
          ? _value.totalLessonsCompleted
          : totalLessonsCompleted // ignore: cast_nullable_to_non_nullable
              as int,
      totalModulesCompleted: null == totalModulesCompleted
          ? _value.totalModulesCompleted
          : totalModulesCompleted // ignore: cast_nullable_to_non_nullable
              as int,
      badges: null == badges
          ? _value._badges
          : badges // ignore: cast_nullable_to_non_nullable
              as List<BadgeModel>,
      levelProgress: null == levelProgress
          ? _value.levelProgress
          : levelProgress // ignore: cast_nullable_to_non_nullable
              as LevelProgressModel,
      streakInfo: null == streakInfo
          ? _value.streakInfo
          : streakInfo // ignore: cast_nullable_to_non_nullable
              as StreakModel,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$UserStatsModelImpl implements _UserStatsModel {
  const _$UserStatsModelImpl(
      {@JsonKey(name: 'total_xp') required this.totalXp,
      required this.level,
      required this.streak,
      @JsonKey(name: 'total_lessons_completed')
      required this.totalLessonsCompleted,
      @JsonKey(name: 'total_modules_completed')
      required this.totalModulesCompleted,
      required final List<BadgeModel> badges,
      @JsonKey(name: 'level_progress') required this.levelProgress,
      @JsonKey(name: 'streak_info') required this.streakInfo})
      : _badges = badges;

  factory _$UserStatsModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$UserStatsModelImplFromJson(json);

  @override
  @JsonKey(name: 'total_xp')
  final int totalXp;
  @override
  final int level;
  @override
  final int streak;
  @override
  @JsonKey(name: 'total_lessons_completed')
  final int totalLessonsCompleted;
  @override
  @JsonKey(name: 'total_modules_completed')
  final int totalModulesCompleted;
  final List<BadgeModel> _badges;
  @override
  List<BadgeModel> get badges {
    if (_badges is EqualUnmodifiableListView) return _badges;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_badges);
  }

  @override
  @JsonKey(name: 'level_progress')
  final LevelProgressModel levelProgress;
  @override
  @JsonKey(name: 'streak_info')
  final StreakModel streakInfo;

  @override
  String toString() {
    return 'UserStatsModel(totalXp: $totalXp, level: $level, streak: $streak, totalLessonsCompleted: $totalLessonsCompleted, totalModulesCompleted: $totalModulesCompleted, badges: $badges, levelProgress: $levelProgress, streakInfo: $streakInfo)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$UserStatsModelImpl &&
            (identical(other.totalXp, totalXp) || other.totalXp == totalXp) &&
            (identical(other.level, level) || other.level == level) &&
            (identical(other.streak, streak) || other.streak == streak) &&
            (identical(other.totalLessonsCompleted, totalLessonsCompleted) ||
                other.totalLessonsCompleted == totalLessonsCompleted) &&
            (identical(other.totalModulesCompleted, totalModulesCompleted) ||
                other.totalModulesCompleted == totalModulesCompleted) &&
            const DeepCollectionEquality().equals(other._badges, _badges) &&
            (identical(other.levelProgress, levelProgress) ||
                other.levelProgress == levelProgress) &&
            (identical(other.streakInfo, streakInfo) ||
                other.streakInfo == streakInfo));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
      runtimeType,
      totalXp,
      level,
      streak,
      totalLessonsCompleted,
      totalModulesCompleted,
      const DeepCollectionEquality().hash(_badges),
      levelProgress,
      streakInfo);

  /// Create a copy of UserStatsModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$UserStatsModelImplCopyWith<_$UserStatsModelImpl> get copyWith =>
      __$$UserStatsModelImplCopyWithImpl<_$UserStatsModelImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$UserStatsModelImplToJson(
      this,
    );
  }
}

abstract class _UserStatsModel implements UserStatsModel {
  const factory _UserStatsModel(
      {@JsonKey(name: 'total_xp') required final int totalXp,
      required final int level,
      required final int streak,
      @JsonKey(name: 'total_lessons_completed')
      required final int totalLessonsCompleted,
      @JsonKey(name: 'total_modules_completed')
      required final int totalModulesCompleted,
      required final List<BadgeModel> badges,
      @JsonKey(name: 'level_progress')
      required final LevelProgressModel levelProgress,
      @JsonKey(name: 'streak_info')
      required final StreakModel streakInfo}) = _$UserStatsModelImpl;

  factory _UserStatsModel.fromJson(Map<String, dynamic> json) =
      _$UserStatsModelImpl.fromJson;

  @override
  @JsonKey(name: 'total_xp')
  int get totalXp;
  @override
  int get level;
  @override
  int get streak;
  @override
  @JsonKey(name: 'total_lessons_completed')
  int get totalLessonsCompleted;
  @override
  @JsonKey(name: 'total_modules_completed')
  int get totalModulesCompleted;
  @override
  List<BadgeModel> get badges;
  @override
  @JsonKey(name: 'level_progress')
  LevelProgressModel get levelProgress;
  @override
  @JsonKey(name: 'streak_info')
  StreakModel get streakInfo;

  /// Create a copy of UserStatsModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$UserStatsModelImplCopyWith<_$UserStatsModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
