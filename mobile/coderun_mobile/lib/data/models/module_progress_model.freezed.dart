// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'module_progress_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

ModuleProgressModel _$ModuleProgressModelFromJson(Map<String, dynamic> json) {
  return _ModuleProgressModel.fromJson(json);
}

/// @nodoc
mixin _$ModuleProgressModel {
  ModuleModel get module => throw _privateConstructorUsedError;
  @JsonKey(name: 'completion_rate')
  double get completionRate => throw _privateConstructorUsedError;
  @JsonKey(name: 'completed_lessons')
  int get completedLessons => throw _privateConstructorUsedError;
  @JsonKey(name: 'total_lessons')
  int get totalLessons => throw _privateConstructorUsedError;

  /// Serializes this ModuleProgressModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of ModuleProgressModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ModuleProgressModelCopyWith<ModuleProgressModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ModuleProgressModelCopyWith<$Res> {
  factory $ModuleProgressModelCopyWith(
          ModuleProgressModel value, $Res Function(ModuleProgressModel) then) =
      _$ModuleProgressModelCopyWithImpl<$Res, ModuleProgressModel>;
  @useResult
  $Res call(
      {ModuleModel module,
      @JsonKey(name: 'completion_rate') double completionRate,
      @JsonKey(name: 'completed_lessons') int completedLessons,
      @JsonKey(name: 'total_lessons') int totalLessons});

  $ModuleModelCopyWith<$Res> get module;
}

/// @nodoc
class _$ModuleProgressModelCopyWithImpl<$Res, $Val extends ModuleProgressModel>
    implements $ModuleProgressModelCopyWith<$Res> {
  _$ModuleProgressModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of ModuleProgressModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? module = null,
    Object? completionRate = null,
    Object? completedLessons = null,
    Object? totalLessons = null,
  }) {
    return _then(_value.copyWith(
      module: null == module
          ? _value.module
          : module // ignore: cast_nullable_to_non_nullable
              as ModuleModel,
      completionRate: null == completionRate
          ? _value.completionRate
          : completionRate // ignore: cast_nullable_to_non_nullable
              as double,
      completedLessons: null == completedLessons
          ? _value.completedLessons
          : completedLessons // ignore: cast_nullable_to_non_nullable
              as int,
      totalLessons: null == totalLessons
          ? _value.totalLessons
          : totalLessons // ignore: cast_nullable_to_non_nullable
              as int,
    ) as $Val);
  }

  /// Create a copy of ModuleProgressModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @pragma('vm:prefer-inline')
  $ModuleModelCopyWith<$Res> get module {
    return $ModuleModelCopyWith<$Res>(_value.module, (value) {
      return _then(_value.copyWith(module: value) as $Val);
    });
  }
}

/// @nodoc
abstract class _$$ModuleProgressModelImplCopyWith<$Res>
    implements $ModuleProgressModelCopyWith<$Res> {
  factory _$$ModuleProgressModelImplCopyWith(_$ModuleProgressModelImpl value,
          $Res Function(_$ModuleProgressModelImpl) then) =
      __$$ModuleProgressModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {ModuleModel module,
      @JsonKey(name: 'completion_rate') double completionRate,
      @JsonKey(name: 'completed_lessons') int completedLessons,
      @JsonKey(name: 'total_lessons') int totalLessons});

  @override
  $ModuleModelCopyWith<$Res> get module;
}

/// @nodoc
class __$$ModuleProgressModelImplCopyWithImpl<$Res>
    extends _$ModuleProgressModelCopyWithImpl<$Res, _$ModuleProgressModelImpl>
    implements _$$ModuleProgressModelImplCopyWith<$Res> {
  __$$ModuleProgressModelImplCopyWithImpl(_$ModuleProgressModelImpl _value,
      $Res Function(_$ModuleProgressModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of ModuleProgressModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? module = null,
    Object? completionRate = null,
    Object? completedLessons = null,
    Object? totalLessons = null,
  }) {
    return _then(_$ModuleProgressModelImpl(
      module: null == module
          ? _value.module
          : module // ignore: cast_nullable_to_non_nullable
              as ModuleModel,
      completionRate: null == completionRate
          ? _value.completionRate
          : completionRate // ignore: cast_nullable_to_non_nullable
              as double,
      completedLessons: null == completedLessons
          ? _value.completedLessons
          : completedLessons // ignore: cast_nullable_to_non_nullable
              as int,
      totalLessons: null == totalLessons
          ? _value.totalLessons
          : totalLessons // ignore: cast_nullable_to_non_nullable
              as int,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$ModuleProgressModelImpl implements _ModuleProgressModel {
  const _$ModuleProgressModelImpl(
      {required this.module,
      @JsonKey(name: 'completion_rate') required this.completionRate,
      @JsonKey(name: 'completed_lessons') required this.completedLessons,
      @JsonKey(name: 'total_lessons') required this.totalLessons});

  factory _$ModuleProgressModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$ModuleProgressModelImplFromJson(json);

  @override
  final ModuleModel module;
  @override
  @JsonKey(name: 'completion_rate')
  final double completionRate;
  @override
  @JsonKey(name: 'completed_lessons')
  final int completedLessons;
  @override
  @JsonKey(name: 'total_lessons')
  final int totalLessons;

  @override
  String toString() {
    return 'ModuleProgressModel(module: $module, completionRate: $completionRate, completedLessons: $completedLessons, totalLessons: $totalLessons)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ModuleProgressModelImpl &&
            (identical(other.module, module) || other.module == module) &&
            (identical(other.completionRate, completionRate) ||
                other.completionRate == completionRate) &&
            (identical(other.completedLessons, completedLessons) ||
                other.completedLessons == completedLessons) &&
            (identical(other.totalLessons, totalLessons) ||
                other.totalLessons == totalLessons));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
      runtimeType, module, completionRate, completedLessons, totalLessons);

  /// Create a copy of ModuleProgressModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ModuleProgressModelImplCopyWith<_$ModuleProgressModelImpl> get copyWith =>
      __$$ModuleProgressModelImplCopyWithImpl<_$ModuleProgressModelImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$ModuleProgressModelImplToJson(
      this,
    );
  }
}

abstract class _ModuleProgressModel implements ModuleProgressModel {
  const factory _ModuleProgressModel(
      {required final ModuleModel module,
      @JsonKey(name: 'completion_rate') required final double completionRate,
      @JsonKey(name: 'completed_lessons') required final int completedLessons,
      @JsonKey(name: 'total_lessons')
      required final int totalLessons}) = _$ModuleProgressModelImpl;

  factory _ModuleProgressModel.fromJson(Map<String, dynamic> json) =
      _$ModuleProgressModelImpl.fromJson;

  @override
  ModuleModel get module;
  @override
  @JsonKey(name: 'completion_rate')
  double get completionRate;
  @override
  @JsonKey(name: 'completed_lessons')
  int get completedLessons;
  @override
  @JsonKey(name: 'total_lessons')
  int get totalLessons;

  /// Create a copy of ModuleProgressModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ModuleProgressModelImplCopyWith<_$ModuleProgressModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
