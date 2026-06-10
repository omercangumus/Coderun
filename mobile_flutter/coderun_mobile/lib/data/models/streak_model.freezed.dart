// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'streak_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

StreakModel _$StreakModelFromJson(Map<String, dynamic> json) {
  return _StreakModel.fromJson(json);
}

/// @nodoc
mixin _$StreakModel {
  @JsonKey(name: 'current_streak')
  int get currentStreak => throw _privateConstructorUsedError;
  @JsonKey(name: 'last_active_date')
  String? get lastActiveDate => throw _privateConstructorUsedError;
  @JsonKey(name: 'is_alive')
  bool get isAlive => throw _privateConstructorUsedError;
  @JsonKey(name: 'next_milestone')
  int get nextMilestone => throw _privateConstructorUsedError;
  @JsonKey(name: 'days_to_next_milestone')
  int get daysToNextMilestone => throw _privateConstructorUsedError;

  /// Serializes this StreakModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of StreakModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $StreakModelCopyWith<StreakModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $StreakModelCopyWith<$Res> {
  factory $StreakModelCopyWith(
          StreakModel value, $Res Function(StreakModel) then) =
      _$StreakModelCopyWithImpl<$Res, StreakModel>;
  @useResult
  $Res call(
      {@JsonKey(name: 'current_streak') int currentStreak,
      @JsonKey(name: 'last_active_date') String? lastActiveDate,
      @JsonKey(name: 'is_alive') bool isAlive,
      @JsonKey(name: 'next_milestone') int nextMilestone,
      @JsonKey(name: 'days_to_next_milestone') int daysToNextMilestone});
}

/// @nodoc
class _$StreakModelCopyWithImpl<$Res, $Val extends StreakModel>
    implements $StreakModelCopyWith<$Res> {
  _$StreakModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of StreakModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? currentStreak = null,
    Object? lastActiveDate = freezed,
    Object? isAlive = null,
    Object? nextMilestone = null,
    Object? daysToNextMilestone = null,
  }) {
    return _then(_value.copyWith(
      currentStreak: null == currentStreak
          ? _value.currentStreak
          : currentStreak // ignore: cast_nullable_to_non_nullable
              as int,
      lastActiveDate: freezed == lastActiveDate
          ? _value.lastActiveDate
          : lastActiveDate // ignore: cast_nullable_to_non_nullable
              as String?,
      isAlive: null == isAlive
          ? _value.isAlive
          : isAlive // ignore: cast_nullable_to_non_nullable
              as bool,
      nextMilestone: null == nextMilestone
          ? _value.nextMilestone
          : nextMilestone // ignore: cast_nullable_to_non_nullable
              as int,
      daysToNextMilestone: null == daysToNextMilestone
          ? _value.daysToNextMilestone
          : daysToNextMilestone // ignore: cast_nullable_to_non_nullable
              as int,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$StreakModelImplCopyWith<$Res>
    implements $StreakModelCopyWith<$Res> {
  factory _$$StreakModelImplCopyWith(
          _$StreakModelImpl value, $Res Function(_$StreakModelImpl) then) =
      __$$StreakModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {@JsonKey(name: 'current_streak') int currentStreak,
      @JsonKey(name: 'last_active_date') String? lastActiveDate,
      @JsonKey(name: 'is_alive') bool isAlive,
      @JsonKey(name: 'next_milestone') int nextMilestone,
      @JsonKey(name: 'days_to_next_milestone') int daysToNextMilestone});
}

/// @nodoc
class __$$StreakModelImplCopyWithImpl<$Res>
    extends _$StreakModelCopyWithImpl<$Res, _$StreakModelImpl>
    implements _$$StreakModelImplCopyWith<$Res> {
  __$$StreakModelImplCopyWithImpl(
      _$StreakModelImpl _value, $Res Function(_$StreakModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of StreakModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? currentStreak = null,
    Object? lastActiveDate = freezed,
    Object? isAlive = null,
    Object? nextMilestone = null,
    Object? daysToNextMilestone = null,
  }) {
    return _then(_$StreakModelImpl(
      currentStreak: null == currentStreak
          ? _value.currentStreak
          : currentStreak // ignore: cast_nullable_to_non_nullable
              as int,
      lastActiveDate: freezed == lastActiveDate
          ? _value.lastActiveDate
          : lastActiveDate // ignore: cast_nullable_to_non_nullable
              as String?,
      isAlive: null == isAlive
          ? _value.isAlive
          : isAlive // ignore: cast_nullable_to_non_nullable
              as bool,
      nextMilestone: null == nextMilestone
          ? _value.nextMilestone
          : nextMilestone // ignore: cast_nullable_to_non_nullable
              as int,
      daysToNextMilestone: null == daysToNextMilestone
          ? _value.daysToNextMilestone
          : daysToNextMilestone // ignore: cast_nullable_to_non_nullable
              as int,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$StreakModelImpl implements _StreakModel {
  const _$StreakModelImpl(
      {@JsonKey(name: 'current_streak') required this.currentStreak,
      @JsonKey(name: 'last_active_date') this.lastActiveDate,
      @JsonKey(name: 'is_alive') required this.isAlive,
      @JsonKey(name: 'next_milestone') required this.nextMilestone,
      @JsonKey(name: 'days_to_next_milestone')
      required this.daysToNextMilestone});

  factory _$StreakModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$StreakModelImplFromJson(json);

  @override
  @JsonKey(name: 'current_streak')
  final int currentStreak;
  @override
  @JsonKey(name: 'last_active_date')
  final String? lastActiveDate;
  @override
  @JsonKey(name: 'is_alive')
  final bool isAlive;
  @override
  @JsonKey(name: 'next_milestone')
  final int nextMilestone;
  @override
  @JsonKey(name: 'days_to_next_milestone')
  final int daysToNextMilestone;

  @override
  String toString() {
    return 'StreakModel(currentStreak: $currentStreak, lastActiveDate: $lastActiveDate, isAlive: $isAlive, nextMilestone: $nextMilestone, daysToNextMilestone: $daysToNextMilestone)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$StreakModelImpl &&
            (identical(other.currentStreak, currentStreak) ||
                other.currentStreak == currentStreak) &&
            (identical(other.lastActiveDate, lastActiveDate) ||
                other.lastActiveDate == lastActiveDate) &&
            (identical(other.isAlive, isAlive) || other.isAlive == isAlive) &&
            (identical(other.nextMilestone, nextMilestone) ||
                other.nextMilestone == nextMilestone) &&
            (identical(other.daysToNextMilestone, daysToNextMilestone) ||
                other.daysToNextMilestone == daysToNextMilestone));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, currentStreak, lastActiveDate,
      isAlive, nextMilestone, daysToNextMilestone);

  /// Create a copy of StreakModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$StreakModelImplCopyWith<_$StreakModelImpl> get copyWith =>
      __$$StreakModelImplCopyWithImpl<_$StreakModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$StreakModelImplToJson(
      this,
    );
  }
}

abstract class _StreakModel implements StreakModel {
  const factory _StreakModel(
      {@JsonKey(name: 'current_streak') required final int currentStreak,
      @JsonKey(name: 'last_active_date') final String? lastActiveDate,
      @JsonKey(name: 'is_alive') required final bool isAlive,
      @JsonKey(name: 'next_milestone') required final int nextMilestone,
      @JsonKey(name: 'days_to_next_milestone')
      required final int daysToNextMilestone}) = _$StreakModelImpl;

  factory _StreakModel.fromJson(Map<String, dynamic> json) =
      _$StreakModelImpl.fromJson;

  @override
  @JsonKey(name: 'current_streak')
  int get currentStreak;
  @override
  @JsonKey(name: 'last_active_date')
  String? get lastActiveDate;
  @override
  @JsonKey(name: 'is_alive')
  bool get isAlive;
  @override
  @JsonKey(name: 'next_milestone')
  int get nextMilestone;
  @override
  @JsonKey(name: 'days_to_next_milestone')
  int get daysToNextMilestone;

  /// Create a copy of StreakModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$StreakModelImplCopyWith<_$StreakModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
