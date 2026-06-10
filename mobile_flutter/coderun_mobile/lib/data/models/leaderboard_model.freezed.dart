// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'leaderboard_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

LeaderboardEntryModel _$LeaderboardEntryModelFromJson(
    Map<String, dynamic> json) {
  return _LeaderboardEntryModel.fromJson(json);
}

/// @nodoc
mixin _$LeaderboardEntryModel {
  int get rank => throw _privateConstructorUsedError;
  @JsonKey(name: 'user_id')
  String get userId => throw _privateConstructorUsedError;
  String get username => throw _privateConstructorUsedError;
  @JsonKey(name: 'weekly_xp')
  int get weeklyXp => throw _privateConstructorUsedError;
  int get level => throw _privateConstructorUsedError;
  int get streak => throw _privateConstructorUsedError;

  /// Serializes this LeaderboardEntryModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of LeaderboardEntryModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $LeaderboardEntryModelCopyWith<LeaderboardEntryModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $LeaderboardEntryModelCopyWith<$Res> {
  factory $LeaderboardEntryModelCopyWith(LeaderboardEntryModel value,
          $Res Function(LeaderboardEntryModel) then) =
      _$LeaderboardEntryModelCopyWithImpl<$Res, LeaderboardEntryModel>;
  @useResult
  $Res call(
      {int rank,
      @JsonKey(name: 'user_id') String userId,
      String username,
      @JsonKey(name: 'weekly_xp') int weeklyXp,
      int level,
      int streak});
}

/// @nodoc
class _$LeaderboardEntryModelCopyWithImpl<$Res,
        $Val extends LeaderboardEntryModel>
    implements $LeaderboardEntryModelCopyWith<$Res> {
  _$LeaderboardEntryModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of LeaderboardEntryModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? rank = null,
    Object? userId = null,
    Object? username = null,
    Object? weeklyXp = null,
    Object? level = null,
    Object? streak = null,
  }) {
    return _then(_value.copyWith(
      rank: null == rank
          ? _value.rank
          : rank // ignore: cast_nullable_to_non_nullable
              as int,
      userId: null == userId
          ? _value.userId
          : userId // ignore: cast_nullable_to_non_nullable
              as String,
      username: null == username
          ? _value.username
          : username // ignore: cast_nullable_to_non_nullable
              as String,
      weeklyXp: null == weeklyXp
          ? _value.weeklyXp
          : weeklyXp // ignore: cast_nullable_to_non_nullable
              as int,
      level: null == level
          ? _value.level
          : level // ignore: cast_nullable_to_non_nullable
              as int,
      streak: null == streak
          ? _value.streak
          : streak // ignore: cast_nullable_to_non_nullable
              as int,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$LeaderboardEntryModelImplCopyWith<$Res>
    implements $LeaderboardEntryModelCopyWith<$Res> {
  factory _$$LeaderboardEntryModelImplCopyWith(
          _$LeaderboardEntryModelImpl value,
          $Res Function(_$LeaderboardEntryModelImpl) then) =
      __$$LeaderboardEntryModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {int rank,
      @JsonKey(name: 'user_id') String userId,
      String username,
      @JsonKey(name: 'weekly_xp') int weeklyXp,
      int level,
      int streak});
}

/// @nodoc
class __$$LeaderboardEntryModelImplCopyWithImpl<$Res>
    extends _$LeaderboardEntryModelCopyWithImpl<$Res,
        _$LeaderboardEntryModelImpl>
    implements _$$LeaderboardEntryModelImplCopyWith<$Res> {
  __$$LeaderboardEntryModelImplCopyWithImpl(_$LeaderboardEntryModelImpl _value,
      $Res Function(_$LeaderboardEntryModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of LeaderboardEntryModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? rank = null,
    Object? userId = null,
    Object? username = null,
    Object? weeklyXp = null,
    Object? level = null,
    Object? streak = null,
  }) {
    return _then(_$LeaderboardEntryModelImpl(
      rank: null == rank
          ? _value.rank
          : rank // ignore: cast_nullable_to_non_nullable
              as int,
      userId: null == userId
          ? _value.userId
          : userId // ignore: cast_nullable_to_non_nullable
              as String,
      username: null == username
          ? _value.username
          : username // ignore: cast_nullable_to_non_nullable
              as String,
      weeklyXp: null == weeklyXp
          ? _value.weeklyXp
          : weeklyXp // ignore: cast_nullable_to_non_nullable
              as int,
      level: null == level
          ? _value.level
          : level // ignore: cast_nullable_to_non_nullable
              as int,
      streak: null == streak
          ? _value.streak
          : streak // ignore: cast_nullable_to_non_nullable
              as int,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$LeaderboardEntryModelImpl implements _LeaderboardEntryModel {
  const _$LeaderboardEntryModelImpl(
      {required this.rank,
      @JsonKey(name: 'user_id') required this.userId,
      required this.username,
      @JsonKey(name: 'weekly_xp') required this.weeklyXp,
      required this.level,
      required this.streak});

  factory _$LeaderboardEntryModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$LeaderboardEntryModelImplFromJson(json);

  @override
  final int rank;
  @override
  @JsonKey(name: 'user_id')
  final String userId;
  @override
  final String username;
  @override
  @JsonKey(name: 'weekly_xp')
  final int weeklyXp;
  @override
  final int level;
  @override
  final int streak;

  @override
  String toString() {
    return 'LeaderboardEntryModel(rank: $rank, userId: $userId, username: $username, weeklyXp: $weeklyXp, level: $level, streak: $streak)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$LeaderboardEntryModelImpl &&
            (identical(other.rank, rank) || other.rank == rank) &&
            (identical(other.userId, userId) || other.userId == userId) &&
            (identical(other.username, username) ||
                other.username == username) &&
            (identical(other.weeklyXp, weeklyXp) ||
                other.weeklyXp == weeklyXp) &&
            (identical(other.level, level) || other.level == level) &&
            (identical(other.streak, streak) || other.streak == streak));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode =>
      Object.hash(runtimeType, rank, userId, username, weeklyXp, level, streak);

  /// Create a copy of LeaderboardEntryModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$LeaderboardEntryModelImplCopyWith<_$LeaderboardEntryModelImpl>
      get copyWith => __$$LeaderboardEntryModelImplCopyWithImpl<
          _$LeaderboardEntryModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$LeaderboardEntryModelImplToJson(
      this,
    );
  }
}

abstract class _LeaderboardEntryModel implements LeaderboardEntryModel {
  const factory _LeaderboardEntryModel(
      {required final int rank,
      @JsonKey(name: 'user_id') required final String userId,
      required final String username,
      @JsonKey(name: 'weekly_xp') required final int weeklyXp,
      required final int level,
      required final int streak}) = _$LeaderboardEntryModelImpl;

  factory _LeaderboardEntryModel.fromJson(Map<String, dynamic> json) =
      _$LeaderboardEntryModelImpl.fromJson;

  @override
  int get rank;
  @override
  @JsonKey(name: 'user_id')
  String get userId;
  @override
  String get username;
  @override
  @JsonKey(name: 'weekly_xp')
  int get weeklyXp;
  @override
  int get level;
  @override
  int get streak;

  /// Create a copy of LeaderboardEntryModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$LeaderboardEntryModelImplCopyWith<_$LeaderboardEntryModelImpl>
      get copyWith => throw _privateConstructorUsedError;
}

LeaderboardModel _$LeaderboardModelFromJson(Map<String, dynamic> json) {
  return _LeaderboardModel.fromJson(json);
}

/// @nodoc
mixin _$LeaderboardModel {
  List<LeaderboardEntryModel> get entries => throw _privateConstructorUsedError;
  @JsonKey(name: 'total_count')
  int get totalCount => throw _privateConstructorUsedError;
  @JsonKey(name: 'user_rank')
  int? get userRank => throw _privateConstructorUsedError;
  @JsonKey(name: 'week_start')
  String get weekStart => throw _privateConstructorUsedError;
  @JsonKey(name: 'week_end')
  String get weekEnd => throw _privateConstructorUsedError;

  /// Serializes this LeaderboardModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of LeaderboardModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $LeaderboardModelCopyWith<LeaderboardModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $LeaderboardModelCopyWith<$Res> {
  factory $LeaderboardModelCopyWith(
          LeaderboardModel value, $Res Function(LeaderboardModel) then) =
      _$LeaderboardModelCopyWithImpl<$Res, LeaderboardModel>;
  @useResult
  $Res call(
      {List<LeaderboardEntryModel> entries,
      @JsonKey(name: 'total_count') int totalCount,
      @JsonKey(name: 'user_rank') int? userRank,
      @JsonKey(name: 'week_start') String weekStart,
      @JsonKey(name: 'week_end') String weekEnd});
}

/// @nodoc
class _$LeaderboardModelCopyWithImpl<$Res, $Val extends LeaderboardModel>
    implements $LeaderboardModelCopyWith<$Res> {
  _$LeaderboardModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of LeaderboardModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? entries = null,
    Object? totalCount = null,
    Object? userRank = freezed,
    Object? weekStart = null,
    Object? weekEnd = null,
  }) {
    return _then(_value.copyWith(
      entries: null == entries
          ? _value.entries
          : entries // ignore: cast_nullable_to_non_nullable
              as List<LeaderboardEntryModel>,
      totalCount: null == totalCount
          ? _value.totalCount
          : totalCount // ignore: cast_nullable_to_non_nullable
              as int,
      userRank: freezed == userRank
          ? _value.userRank
          : userRank // ignore: cast_nullable_to_non_nullable
              as int?,
      weekStart: null == weekStart
          ? _value.weekStart
          : weekStart // ignore: cast_nullable_to_non_nullable
              as String,
      weekEnd: null == weekEnd
          ? _value.weekEnd
          : weekEnd // ignore: cast_nullable_to_non_nullable
              as String,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$LeaderboardModelImplCopyWith<$Res>
    implements $LeaderboardModelCopyWith<$Res> {
  factory _$$LeaderboardModelImplCopyWith(_$LeaderboardModelImpl value,
          $Res Function(_$LeaderboardModelImpl) then) =
      __$$LeaderboardModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {List<LeaderboardEntryModel> entries,
      @JsonKey(name: 'total_count') int totalCount,
      @JsonKey(name: 'user_rank') int? userRank,
      @JsonKey(name: 'week_start') String weekStart,
      @JsonKey(name: 'week_end') String weekEnd});
}

/// @nodoc
class __$$LeaderboardModelImplCopyWithImpl<$Res>
    extends _$LeaderboardModelCopyWithImpl<$Res, _$LeaderboardModelImpl>
    implements _$$LeaderboardModelImplCopyWith<$Res> {
  __$$LeaderboardModelImplCopyWithImpl(_$LeaderboardModelImpl _value,
      $Res Function(_$LeaderboardModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of LeaderboardModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? entries = null,
    Object? totalCount = null,
    Object? userRank = freezed,
    Object? weekStart = null,
    Object? weekEnd = null,
  }) {
    return _then(_$LeaderboardModelImpl(
      entries: null == entries
          ? _value._entries
          : entries // ignore: cast_nullable_to_non_nullable
              as List<LeaderboardEntryModel>,
      totalCount: null == totalCount
          ? _value.totalCount
          : totalCount // ignore: cast_nullable_to_non_nullable
              as int,
      userRank: freezed == userRank
          ? _value.userRank
          : userRank // ignore: cast_nullable_to_non_nullable
              as int?,
      weekStart: null == weekStart
          ? _value.weekStart
          : weekStart // ignore: cast_nullable_to_non_nullable
              as String,
      weekEnd: null == weekEnd
          ? _value.weekEnd
          : weekEnd // ignore: cast_nullable_to_non_nullable
              as String,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$LeaderboardModelImpl implements _LeaderboardModel {
  const _$LeaderboardModelImpl(
      {required final List<LeaderboardEntryModel> entries,
      @JsonKey(name: 'total_count') required this.totalCount,
      @JsonKey(name: 'user_rank') this.userRank,
      @JsonKey(name: 'week_start') required this.weekStart,
      @JsonKey(name: 'week_end') required this.weekEnd})
      : _entries = entries;

  factory _$LeaderboardModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$LeaderboardModelImplFromJson(json);

  final List<LeaderboardEntryModel> _entries;
  @override
  List<LeaderboardEntryModel> get entries {
    if (_entries is EqualUnmodifiableListView) return _entries;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_entries);
  }

  @override
  @JsonKey(name: 'total_count')
  final int totalCount;
  @override
  @JsonKey(name: 'user_rank')
  final int? userRank;
  @override
  @JsonKey(name: 'week_start')
  final String weekStart;
  @override
  @JsonKey(name: 'week_end')
  final String weekEnd;

  @override
  String toString() {
    return 'LeaderboardModel(entries: $entries, totalCount: $totalCount, userRank: $userRank, weekStart: $weekStart, weekEnd: $weekEnd)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$LeaderboardModelImpl &&
            const DeepCollectionEquality().equals(other._entries, _entries) &&
            (identical(other.totalCount, totalCount) ||
                other.totalCount == totalCount) &&
            (identical(other.userRank, userRank) ||
                other.userRank == userRank) &&
            (identical(other.weekStart, weekStart) ||
                other.weekStart == weekStart) &&
            (identical(other.weekEnd, weekEnd) || other.weekEnd == weekEnd));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
      runtimeType,
      const DeepCollectionEquality().hash(_entries),
      totalCount,
      userRank,
      weekStart,
      weekEnd);

  /// Create a copy of LeaderboardModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$LeaderboardModelImplCopyWith<_$LeaderboardModelImpl> get copyWith =>
      __$$LeaderboardModelImplCopyWithImpl<_$LeaderboardModelImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$LeaderboardModelImplToJson(
      this,
    );
  }
}

abstract class _LeaderboardModel implements LeaderboardModel {
  const factory _LeaderboardModel(
          {required final List<LeaderboardEntryModel> entries,
          @JsonKey(name: 'total_count') required final int totalCount,
          @JsonKey(name: 'user_rank') final int? userRank,
          @JsonKey(name: 'week_start') required final String weekStart,
          @JsonKey(name: 'week_end') required final String weekEnd}) =
      _$LeaderboardModelImpl;

  factory _LeaderboardModel.fromJson(Map<String, dynamic> json) =
      _$LeaderboardModelImpl.fromJson;

  @override
  List<LeaderboardEntryModel> get entries;
  @override
  @JsonKey(name: 'total_count')
  int get totalCount;
  @override
  @JsonKey(name: 'user_rank')
  int? get userRank;
  @override
  @JsonKey(name: 'week_start')
  String get weekStart;
  @override
  @JsonKey(name: 'week_end')
  String get weekEnd;

  /// Create a copy of LeaderboardModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$LeaderboardModelImplCopyWith<_$LeaderboardModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
