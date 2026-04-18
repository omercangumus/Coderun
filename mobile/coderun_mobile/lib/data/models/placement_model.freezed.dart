// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'placement_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

PlacementTestModel _$PlacementTestModelFromJson(Map<String, dynamic> json) {
  return _PlacementTestModel.fromJson(json);
}

/// @nodoc
mixin _$PlacementTestModel {
  @JsonKey(name: 'module_id')
  String get moduleId => throw _privateConstructorUsedError;
  @JsonKey(name: 'module_title')
  String get moduleTitle => throw _privateConstructorUsedError;
  List<QuestionModel> get questions => throw _privateConstructorUsedError;
  @JsonKey(name: 'total_questions')
  int get totalQuestions => throw _privateConstructorUsedError;

  /// Serializes this PlacementTestModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of PlacementTestModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $PlacementTestModelCopyWith<PlacementTestModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $PlacementTestModelCopyWith<$Res> {
  factory $PlacementTestModelCopyWith(
          PlacementTestModel value, $Res Function(PlacementTestModel) then) =
      _$PlacementTestModelCopyWithImpl<$Res, PlacementTestModel>;
  @useResult
  $Res call(
      {@JsonKey(name: 'module_id') String moduleId,
      @JsonKey(name: 'module_title') String moduleTitle,
      List<QuestionModel> questions,
      @JsonKey(name: 'total_questions') int totalQuestions});
}

/// @nodoc
class _$PlacementTestModelCopyWithImpl<$Res, $Val extends PlacementTestModel>
    implements $PlacementTestModelCopyWith<$Res> {
  _$PlacementTestModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of PlacementTestModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? moduleId = null,
    Object? moduleTitle = null,
    Object? questions = null,
    Object? totalQuestions = null,
  }) {
    return _then(_value.copyWith(
      moduleId: null == moduleId
          ? _value.moduleId
          : moduleId // ignore: cast_nullable_to_non_nullable
              as String,
      moduleTitle: null == moduleTitle
          ? _value.moduleTitle
          : moduleTitle // ignore: cast_nullable_to_non_nullable
              as String,
      questions: null == questions
          ? _value.questions
          : questions // ignore: cast_nullable_to_non_nullable
              as List<QuestionModel>,
      totalQuestions: null == totalQuestions
          ? _value.totalQuestions
          : totalQuestions // ignore: cast_nullable_to_non_nullable
              as int,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$PlacementTestModelImplCopyWith<$Res>
    implements $PlacementTestModelCopyWith<$Res> {
  factory _$$PlacementTestModelImplCopyWith(_$PlacementTestModelImpl value,
          $Res Function(_$PlacementTestModelImpl) then) =
      __$$PlacementTestModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {@JsonKey(name: 'module_id') String moduleId,
      @JsonKey(name: 'module_title') String moduleTitle,
      List<QuestionModel> questions,
      @JsonKey(name: 'total_questions') int totalQuestions});
}

/// @nodoc
class __$$PlacementTestModelImplCopyWithImpl<$Res>
    extends _$PlacementTestModelCopyWithImpl<$Res, _$PlacementTestModelImpl>
    implements _$$PlacementTestModelImplCopyWith<$Res> {
  __$$PlacementTestModelImplCopyWithImpl(_$PlacementTestModelImpl _value,
      $Res Function(_$PlacementTestModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of PlacementTestModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? moduleId = null,
    Object? moduleTitle = null,
    Object? questions = null,
    Object? totalQuestions = null,
  }) {
    return _then(_$PlacementTestModelImpl(
      moduleId: null == moduleId
          ? _value.moduleId
          : moduleId // ignore: cast_nullable_to_non_nullable
              as String,
      moduleTitle: null == moduleTitle
          ? _value.moduleTitle
          : moduleTitle // ignore: cast_nullable_to_non_nullable
              as String,
      questions: null == questions
          ? _value._questions
          : questions // ignore: cast_nullable_to_non_nullable
              as List<QuestionModel>,
      totalQuestions: null == totalQuestions
          ? _value.totalQuestions
          : totalQuestions // ignore: cast_nullable_to_non_nullable
              as int,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$PlacementTestModelImpl implements _PlacementTestModel {
  const _$PlacementTestModelImpl(
      {@JsonKey(name: 'module_id') required this.moduleId,
      @JsonKey(name: 'module_title') required this.moduleTitle,
      required final List<QuestionModel> questions,
      @JsonKey(name: 'total_questions') required this.totalQuestions})
      : _questions = questions;

  factory _$PlacementTestModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$PlacementTestModelImplFromJson(json);

  @override
  @JsonKey(name: 'module_id')
  final String moduleId;
  @override
  @JsonKey(name: 'module_title')
  final String moduleTitle;
  final List<QuestionModel> _questions;
  @override
  List<QuestionModel> get questions {
    if (_questions is EqualUnmodifiableListView) return _questions;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_questions);
  }

  @override
  @JsonKey(name: 'total_questions')
  final int totalQuestions;

  @override
  String toString() {
    return 'PlacementTestModel(moduleId: $moduleId, moduleTitle: $moduleTitle, questions: $questions, totalQuestions: $totalQuestions)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$PlacementTestModelImpl &&
            (identical(other.moduleId, moduleId) ||
                other.moduleId == moduleId) &&
            (identical(other.moduleTitle, moduleTitle) ||
                other.moduleTitle == moduleTitle) &&
            const DeepCollectionEquality()
                .equals(other._questions, _questions) &&
            (identical(other.totalQuestions, totalQuestions) ||
                other.totalQuestions == totalQuestions));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, moduleId, moduleTitle,
      const DeepCollectionEquality().hash(_questions), totalQuestions);

  /// Create a copy of PlacementTestModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$PlacementTestModelImplCopyWith<_$PlacementTestModelImpl> get copyWith =>
      __$$PlacementTestModelImplCopyWithImpl<_$PlacementTestModelImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$PlacementTestModelImplToJson(
      this,
    );
  }
}

abstract class _PlacementTestModel implements PlacementTestModel {
  const factory _PlacementTestModel(
      {@JsonKey(name: 'module_id') required final String moduleId,
      @JsonKey(name: 'module_title') required final String moduleTitle,
      required final List<QuestionModel> questions,
      @JsonKey(name: 'total_questions')
      required final int totalQuestions}) = _$PlacementTestModelImpl;

  factory _PlacementTestModel.fromJson(Map<String, dynamic> json) =
      _$PlacementTestModelImpl.fromJson;

  @override
  @JsonKey(name: 'module_id')
  String get moduleId;
  @override
  @JsonKey(name: 'module_title')
  String get moduleTitle;
  @override
  List<QuestionModel> get questions;
  @override
  @JsonKey(name: 'total_questions')
  int get totalQuestions;

  /// Create a copy of PlacementTestModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$PlacementTestModelImplCopyWith<_$PlacementTestModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

PlacementResultModel _$PlacementResultModelFromJson(Map<String, dynamic> json) {
  return _PlacementResultModel.fromJson(json);
}

/// @nodoc
mixin _$PlacementResultModel {
  @JsonKey(name: 'correct_count')
  int get correctCount => throw _privateConstructorUsedError;
  @JsonKey(name: 'total_count')
  int get totalCount => throw _privateConstructorUsedError;
  double get percentage => throw _privateConstructorUsedError;
  @JsonKey(name: 'starting_lesson_order')
  int get startingLessonOrder => throw _privateConstructorUsedError;
  @JsonKey(name: 'skipped_lessons')
  int get skippedLessons => throw _privateConstructorUsedError;
  String get message => throw _privateConstructorUsedError;

  /// Serializes this PlacementResultModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of PlacementResultModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $PlacementResultModelCopyWith<PlacementResultModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $PlacementResultModelCopyWith<$Res> {
  factory $PlacementResultModelCopyWith(PlacementResultModel value,
          $Res Function(PlacementResultModel) then) =
      _$PlacementResultModelCopyWithImpl<$Res, PlacementResultModel>;
  @useResult
  $Res call(
      {@JsonKey(name: 'correct_count') int correctCount,
      @JsonKey(name: 'total_count') int totalCount,
      double percentage,
      @JsonKey(name: 'starting_lesson_order') int startingLessonOrder,
      @JsonKey(name: 'skipped_lessons') int skippedLessons,
      String message});
}

/// @nodoc
class _$PlacementResultModelCopyWithImpl<$Res,
        $Val extends PlacementResultModel>
    implements $PlacementResultModelCopyWith<$Res> {
  _$PlacementResultModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of PlacementResultModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? correctCount = null,
    Object? totalCount = null,
    Object? percentage = null,
    Object? startingLessonOrder = null,
    Object? skippedLessons = null,
    Object? message = null,
  }) {
    return _then(_value.copyWith(
      correctCount: null == correctCount
          ? _value.correctCount
          : correctCount // ignore: cast_nullable_to_non_nullable
              as int,
      totalCount: null == totalCount
          ? _value.totalCount
          : totalCount // ignore: cast_nullable_to_non_nullable
              as int,
      percentage: null == percentage
          ? _value.percentage
          : percentage // ignore: cast_nullable_to_non_nullable
              as double,
      startingLessonOrder: null == startingLessonOrder
          ? _value.startingLessonOrder
          : startingLessonOrder // ignore: cast_nullable_to_non_nullable
              as int,
      skippedLessons: null == skippedLessons
          ? _value.skippedLessons
          : skippedLessons // ignore: cast_nullable_to_non_nullable
              as int,
      message: null == message
          ? _value.message
          : message // ignore: cast_nullable_to_non_nullable
              as String,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$PlacementResultModelImplCopyWith<$Res>
    implements $PlacementResultModelCopyWith<$Res> {
  factory _$$PlacementResultModelImplCopyWith(_$PlacementResultModelImpl value,
          $Res Function(_$PlacementResultModelImpl) then) =
      __$$PlacementResultModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {@JsonKey(name: 'correct_count') int correctCount,
      @JsonKey(name: 'total_count') int totalCount,
      double percentage,
      @JsonKey(name: 'starting_lesson_order') int startingLessonOrder,
      @JsonKey(name: 'skipped_lessons') int skippedLessons,
      String message});
}

/// @nodoc
class __$$PlacementResultModelImplCopyWithImpl<$Res>
    extends _$PlacementResultModelCopyWithImpl<$Res, _$PlacementResultModelImpl>
    implements _$$PlacementResultModelImplCopyWith<$Res> {
  __$$PlacementResultModelImplCopyWithImpl(_$PlacementResultModelImpl _value,
      $Res Function(_$PlacementResultModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of PlacementResultModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? correctCount = null,
    Object? totalCount = null,
    Object? percentage = null,
    Object? startingLessonOrder = null,
    Object? skippedLessons = null,
    Object? message = null,
  }) {
    return _then(_$PlacementResultModelImpl(
      correctCount: null == correctCount
          ? _value.correctCount
          : correctCount // ignore: cast_nullable_to_non_nullable
              as int,
      totalCount: null == totalCount
          ? _value.totalCount
          : totalCount // ignore: cast_nullable_to_non_nullable
              as int,
      percentage: null == percentage
          ? _value.percentage
          : percentage // ignore: cast_nullable_to_non_nullable
              as double,
      startingLessonOrder: null == startingLessonOrder
          ? _value.startingLessonOrder
          : startingLessonOrder // ignore: cast_nullable_to_non_nullable
              as int,
      skippedLessons: null == skippedLessons
          ? _value.skippedLessons
          : skippedLessons // ignore: cast_nullable_to_non_nullable
              as int,
      message: null == message
          ? _value.message
          : message // ignore: cast_nullable_to_non_nullable
              as String,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$PlacementResultModelImpl implements _PlacementResultModel {
  const _$PlacementResultModelImpl(
      {@JsonKey(name: 'correct_count') required this.correctCount,
      @JsonKey(name: 'total_count') required this.totalCount,
      required this.percentage,
      @JsonKey(name: 'starting_lesson_order') required this.startingLessonOrder,
      @JsonKey(name: 'skipped_lessons') required this.skippedLessons,
      required this.message});

  factory _$PlacementResultModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$PlacementResultModelImplFromJson(json);

  @override
  @JsonKey(name: 'correct_count')
  final int correctCount;
  @override
  @JsonKey(name: 'total_count')
  final int totalCount;
  @override
  final double percentage;
  @override
  @JsonKey(name: 'starting_lesson_order')
  final int startingLessonOrder;
  @override
  @JsonKey(name: 'skipped_lessons')
  final int skippedLessons;
  @override
  final String message;

  @override
  String toString() {
    return 'PlacementResultModel(correctCount: $correctCount, totalCount: $totalCount, percentage: $percentage, startingLessonOrder: $startingLessonOrder, skippedLessons: $skippedLessons, message: $message)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$PlacementResultModelImpl &&
            (identical(other.correctCount, correctCount) ||
                other.correctCount == correctCount) &&
            (identical(other.totalCount, totalCount) ||
                other.totalCount == totalCount) &&
            (identical(other.percentage, percentage) ||
                other.percentage == percentage) &&
            (identical(other.startingLessonOrder, startingLessonOrder) ||
                other.startingLessonOrder == startingLessonOrder) &&
            (identical(other.skippedLessons, skippedLessons) ||
                other.skippedLessons == skippedLessons) &&
            (identical(other.message, message) || other.message == message));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, correctCount, totalCount,
      percentage, startingLessonOrder, skippedLessons, message);

  /// Create a copy of PlacementResultModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$PlacementResultModelImplCopyWith<_$PlacementResultModelImpl>
      get copyWith =>
          __$$PlacementResultModelImplCopyWithImpl<_$PlacementResultModelImpl>(
              this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$PlacementResultModelImplToJson(
      this,
    );
  }
}

abstract class _PlacementResultModel implements PlacementResultModel {
  const factory _PlacementResultModel(
      {@JsonKey(name: 'correct_count') required final int correctCount,
      @JsonKey(name: 'total_count') required final int totalCount,
      required final double percentage,
      @JsonKey(name: 'starting_lesson_order')
      required final int startingLessonOrder,
      @JsonKey(name: 'skipped_lessons') required final int skippedLessons,
      required final String message}) = _$PlacementResultModelImpl;

  factory _PlacementResultModel.fromJson(Map<String, dynamic> json) =
      _$PlacementResultModelImpl.fromJson;

  @override
  @JsonKey(name: 'correct_count')
  int get correctCount;
  @override
  @JsonKey(name: 'total_count')
  int get totalCount;
  @override
  double get percentage;
  @override
  @JsonKey(name: 'starting_lesson_order')
  int get startingLessonOrder;
  @override
  @JsonKey(name: 'skipped_lessons')
  int get skippedLessons;
  @override
  String get message;

  /// Create a copy of PlacementResultModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$PlacementResultModelImplCopyWith<_$PlacementResultModelImpl>
      get copyWith => throw _privateConstructorUsedError;
}
