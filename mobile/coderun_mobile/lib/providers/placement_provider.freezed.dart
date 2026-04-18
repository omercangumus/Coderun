// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'placement_provider.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

/// @nodoc
mixin _$PlacementState {
  int get currentQuestionIndex => throw _privateConstructorUsedError;
  Map<String, String> get answers => throw _privateConstructorUsedError;
  bool get isSubmitting => throw _privateConstructorUsedError;
  PlacementResultModel? get result => throw _privateConstructorUsedError;
  String? get errorMessage => throw _privateConstructorUsedError;

  /// Create a copy of PlacementState
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $PlacementStateCopyWith<PlacementState> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $PlacementStateCopyWith<$Res> {
  factory $PlacementStateCopyWith(
          PlacementState value, $Res Function(PlacementState) then) =
      _$PlacementStateCopyWithImpl<$Res, PlacementState>;
  @useResult
  $Res call(
      {int currentQuestionIndex,
      Map<String, String> answers,
      bool isSubmitting,
      PlacementResultModel? result,
      String? errorMessage});

  $PlacementResultModelCopyWith<$Res>? get result;
}

/// @nodoc
class _$PlacementStateCopyWithImpl<$Res, $Val extends PlacementState>
    implements $PlacementStateCopyWith<$Res> {
  _$PlacementStateCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of PlacementState
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? currentQuestionIndex = null,
    Object? answers = null,
    Object? isSubmitting = null,
    Object? result = freezed,
    Object? errorMessage = freezed,
  }) {
    return _then(_value.copyWith(
      currentQuestionIndex: null == currentQuestionIndex
          ? _value.currentQuestionIndex
          : currentQuestionIndex // ignore: cast_nullable_to_non_nullable
              as int,
      answers: null == answers
          ? _value.answers
          : answers // ignore: cast_nullable_to_non_nullable
              as Map<String, String>,
      isSubmitting: null == isSubmitting
          ? _value.isSubmitting
          : isSubmitting // ignore: cast_nullable_to_non_nullable
              as bool,
      result: freezed == result
          ? _value.result
          : result // ignore: cast_nullable_to_non_nullable
              as PlacementResultModel?,
      errorMessage: freezed == errorMessage
          ? _value.errorMessage
          : errorMessage // ignore: cast_nullable_to_non_nullable
              as String?,
    ) as $Val);
  }

  /// Create a copy of PlacementState
  /// with the given fields replaced by the non-null parameter values.
  @override
  @pragma('vm:prefer-inline')
  $PlacementResultModelCopyWith<$Res>? get result {
    if (_value.result == null) {
      return null;
    }

    return $PlacementResultModelCopyWith<$Res>(_value.result!, (value) {
      return _then(_value.copyWith(result: value) as $Val);
    });
  }
}

/// @nodoc
abstract class _$$PlacementStateImplCopyWith<$Res>
    implements $PlacementStateCopyWith<$Res> {
  factory _$$PlacementStateImplCopyWith(_$PlacementStateImpl value,
          $Res Function(_$PlacementStateImpl) then) =
      __$$PlacementStateImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {int currentQuestionIndex,
      Map<String, String> answers,
      bool isSubmitting,
      PlacementResultModel? result,
      String? errorMessage});

  @override
  $PlacementResultModelCopyWith<$Res>? get result;
}

/// @nodoc
class __$$PlacementStateImplCopyWithImpl<$Res>
    extends _$PlacementStateCopyWithImpl<$Res, _$PlacementStateImpl>
    implements _$$PlacementStateImplCopyWith<$Res> {
  __$$PlacementStateImplCopyWithImpl(
      _$PlacementStateImpl _value, $Res Function(_$PlacementStateImpl) _then)
      : super(_value, _then);

  /// Create a copy of PlacementState
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? currentQuestionIndex = null,
    Object? answers = null,
    Object? isSubmitting = null,
    Object? result = freezed,
    Object? errorMessage = freezed,
  }) {
    return _then(_$PlacementStateImpl(
      currentQuestionIndex: null == currentQuestionIndex
          ? _value.currentQuestionIndex
          : currentQuestionIndex // ignore: cast_nullable_to_non_nullable
              as int,
      answers: null == answers
          ? _value._answers
          : answers // ignore: cast_nullable_to_non_nullable
              as Map<String, String>,
      isSubmitting: null == isSubmitting
          ? _value.isSubmitting
          : isSubmitting // ignore: cast_nullable_to_non_nullable
              as bool,
      result: freezed == result
          ? _value.result
          : result // ignore: cast_nullable_to_non_nullable
              as PlacementResultModel?,
      errorMessage: freezed == errorMessage
          ? _value.errorMessage
          : errorMessage // ignore: cast_nullable_to_non_nullable
              as String?,
    ));
  }
}

/// @nodoc

class _$PlacementStateImpl implements _PlacementState {
  const _$PlacementStateImpl(
      {this.currentQuestionIndex = 0,
      final Map<String, String> answers = const {},
      this.isSubmitting = false,
      this.result,
      this.errorMessage})
      : _answers = answers;

  @override
  @JsonKey()
  final int currentQuestionIndex;
  final Map<String, String> _answers;
  @override
  @JsonKey()
  Map<String, String> get answers {
    if (_answers is EqualUnmodifiableMapView) return _answers;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableMapView(_answers);
  }

  @override
  @JsonKey()
  final bool isSubmitting;
  @override
  final PlacementResultModel? result;
  @override
  final String? errorMessage;

  @override
  String toString() {
    return 'PlacementState(currentQuestionIndex: $currentQuestionIndex, answers: $answers, isSubmitting: $isSubmitting, result: $result, errorMessage: $errorMessage)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$PlacementStateImpl &&
            (identical(other.currentQuestionIndex, currentQuestionIndex) ||
                other.currentQuestionIndex == currentQuestionIndex) &&
            const DeepCollectionEquality().equals(other._answers, _answers) &&
            (identical(other.isSubmitting, isSubmitting) ||
                other.isSubmitting == isSubmitting) &&
            (identical(other.result, result) || other.result == result) &&
            (identical(other.errorMessage, errorMessage) ||
                other.errorMessage == errorMessage));
  }

  @override
  int get hashCode => Object.hash(
      runtimeType,
      currentQuestionIndex,
      const DeepCollectionEquality().hash(_answers),
      isSubmitting,
      result,
      errorMessage);

  /// Create a copy of PlacementState
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$PlacementStateImplCopyWith<_$PlacementStateImpl> get copyWith =>
      __$$PlacementStateImplCopyWithImpl<_$PlacementStateImpl>(
          this, _$identity);
}

abstract class _PlacementState implements PlacementState {
  const factory _PlacementState(
      {final int currentQuestionIndex,
      final Map<String, String> answers,
      final bool isSubmitting,
      final PlacementResultModel? result,
      final String? errorMessage}) = _$PlacementStateImpl;

  @override
  int get currentQuestionIndex;
  @override
  Map<String, String> get answers;
  @override
  bool get isSubmitting;
  @override
  PlacementResultModel? get result;
  @override
  String? get errorMessage;

  /// Create a copy of PlacementState
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$PlacementStateImplCopyWith<_$PlacementStateImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
