// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'mentor_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

ChatMessageModel _$ChatMessageModelFromJson(Map<String, dynamic> json) {
  return _ChatMessageModel.fromJson(json);
}

/// @nodoc
mixin _$ChatMessageModel {
  String get role => throw _privateConstructorUsedError;
  String get content => throw _privateConstructorUsedError;

  /// Serializes this ChatMessageModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of ChatMessageModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ChatMessageModelCopyWith<ChatMessageModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ChatMessageModelCopyWith<$Res> {
  factory $ChatMessageModelCopyWith(
          ChatMessageModel value, $Res Function(ChatMessageModel) then) =
      _$ChatMessageModelCopyWithImpl<$Res, ChatMessageModel>;
  @useResult
  $Res call({String role, String content});
}

/// @nodoc
class _$ChatMessageModelCopyWithImpl<$Res, $Val extends ChatMessageModel>
    implements $ChatMessageModelCopyWith<$Res> {
  _$ChatMessageModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of ChatMessageModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? role = null,
    Object? content = null,
  }) {
    return _then(_value.copyWith(
      role: null == role
          ? _value.role
          : role // ignore: cast_nullable_to_non_nullable
              as String,
      content: null == content
          ? _value.content
          : content // ignore: cast_nullable_to_non_nullable
              as String,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$ChatMessageModelImplCopyWith<$Res>
    implements $ChatMessageModelCopyWith<$Res> {
  factory _$$ChatMessageModelImplCopyWith(_$ChatMessageModelImpl value,
          $Res Function(_$ChatMessageModelImpl) then) =
      __$$ChatMessageModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String role, String content});
}

/// @nodoc
class __$$ChatMessageModelImplCopyWithImpl<$Res>
    extends _$ChatMessageModelCopyWithImpl<$Res, _$ChatMessageModelImpl>
    implements _$$ChatMessageModelImplCopyWith<$Res> {
  __$$ChatMessageModelImplCopyWithImpl(_$ChatMessageModelImpl _value,
      $Res Function(_$ChatMessageModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of ChatMessageModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? role = null,
    Object? content = null,
  }) {
    return _then(_$ChatMessageModelImpl(
      role: null == role
          ? _value.role
          : role // ignore: cast_nullable_to_non_nullable
              as String,
      content: null == content
          ? _value.content
          : content // ignore: cast_nullable_to_non_nullable
              as String,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$ChatMessageModelImpl implements _ChatMessageModel {
  const _$ChatMessageModelImpl({required this.role, required this.content});

  factory _$ChatMessageModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$ChatMessageModelImplFromJson(json);

  @override
  final String role;
  @override
  final String content;

  @override
  String toString() {
    return 'ChatMessageModel(role: $role, content: $content)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ChatMessageModelImpl &&
            (identical(other.role, role) || other.role == role) &&
            (identical(other.content, content) || other.content == content));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, role, content);

  /// Create a copy of ChatMessageModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ChatMessageModelImplCopyWith<_$ChatMessageModelImpl> get copyWith =>
      __$$ChatMessageModelImplCopyWithImpl<_$ChatMessageModelImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$ChatMessageModelImplToJson(
      this,
    );
  }
}

abstract class _ChatMessageModel implements ChatMessageModel {
  const factory _ChatMessageModel(
      {required final String role,
      required final String content}) = _$ChatMessageModelImpl;

  factory _ChatMessageModel.fromJson(Map<String, dynamic> json) =
      _$ChatMessageModelImpl.fromJson;

  @override
  String get role;
  @override
  String get content;

  /// Create a copy of ChatMessageModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ChatMessageModelImplCopyWith<_$ChatMessageModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

MentorRequestModel _$MentorRequestModelFromJson(Map<String, dynamic> json) {
  return _MentorRequestModel.fromJson(json);
}

/// @nodoc
mixin _$MentorRequestModel {
  String get message => throw _privateConstructorUsedError;
  String get context => throw _privateConstructorUsedError;
  List<ChatMessageModel> get history => throw _privateConstructorUsedError;
  String? get lessonTitle => throw _privateConstructorUsedError;
  String? get moduleSlug => throw _privateConstructorUsedError;
  String? get questionText => throw _privateConstructorUsedError;

  /// Serializes this MentorRequestModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of MentorRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $MentorRequestModelCopyWith<MentorRequestModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $MentorRequestModelCopyWith<$Res> {
  factory $MentorRequestModelCopyWith(
          MentorRequestModel value, $Res Function(MentorRequestModel) then) =
      _$MentorRequestModelCopyWithImpl<$Res, MentorRequestModel>;
  @useResult
  $Res call(
      {String message,
      String context,
      List<ChatMessageModel> history,
      String? lessonTitle,
      String? moduleSlug,
      String? questionText});
}

/// @nodoc
class _$MentorRequestModelCopyWithImpl<$Res, $Val extends MentorRequestModel>
    implements $MentorRequestModelCopyWith<$Res> {
  _$MentorRequestModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of MentorRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? message = null,
    Object? context = null,
    Object? history = null,
    Object? lessonTitle = freezed,
    Object? moduleSlug = freezed,
    Object? questionText = freezed,
  }) {
    return _then(_value.copyWith(
      message: null == message
          ? _value.message
          : message // ignore: cast_nullable_to_non_nullable
              as String,
      context: null == context
          ? _value.context
          : context // ignore: cast_nullable_to_non_nullable
              as String,
      history: null == history
          ? _value.history
          : history // ignore: cast_nullable_to_non_nullable
              as List<ChatMessageModel>,
      lessonTitle: freezed == lessonTitle
          ? _value.lessonTitle
          : lessonTitle // ignore: cast_nullable_to_non_nullable
              as String?,
      moduleSlug: freezed == moduleSlug
          ? _value.moduleSlug
          : moduleSlug // ignore: cast_nullable_to_non_nullable
              as String?,
      questionText: freezed == questionText
          ? _value.questionText
          : questionText // ignore: cast_nullable_to_non_nullable
              as String?,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$MentorRequestModelImplCopyWith<$Res>
    implements $MentorRequestModelCopyWith<$Res> {
  factory _$$MentorRequestModelImplCopyWith(_$MentorRequestModelImpl value,
          $Res Function(_$MentorRequestModelImpl) then) =
      __$$MentorRequestModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String message,
      String context,
      List<ChatMessageModel> history,
      String? lessonTitle,
      String? moduleSlug,
      String? questionText});
}

/// @nodoc
class __$$MentorRequestModelImplCopyWithImpl<$Res>
    extends _$MentorRequestModelCopyWithImpl<$Res, _$MentorRequestModelImpl>
    implements _$$MentorRequestModelImplCopyWith<$Res> {
  __$$MentorRequestModelImplCopyWithImpl(_$MentorRequestModelImpl _value,
      $Res Function(_$MentorRequestModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of MentorRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? message = null,
    Object? context = null,
    Object? history = null,
    Object? lessonTitle = freezed,
    Object? moduleSlug = freezed,
    Object? questionText = freezed,
  }) {
    return _then(_$MentorRequestModelImpl(
      message: null == message
          ? _value.message
          : message // ignore: cast_nullable_to_non_nullable
              as String,
      context: null == context
          ? _value.context
          : context // ignore: cast_nullable_to_non_nullable
              as String,
      history: null == history
          ? _value._history
          : history // ignore: cast_nullable_to_non_nullable
              as List<ChatMessageModel>,
      lessonTitle: freezed == lessonTitle
          ? _value.lessonTitle
          : lessonTitle // ignore: cast_nullable_to_non_nullable
              as String?,
      moduleSlug: freezed == moduleSlug
          ? _value.moduleSlug
          : moduleSlug // ignore: cast_nullable_to_non_nullable
              as String?,
      questionText: freezed == questionText
          ? _value.questionText
          : questionText // ignore: cast_nullable_to_non_nullable
              as String?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$MentorRequestModelImpl implements _MentorRequestModel {
  const _$MentorRequestModelImpl(
      {required this.message,
      this.context = 'general',
      final List<ChatMessageModel> history = const [],
      this.lessonTitle,
      this.moduleSlug,
      this.questionText})
      : _history = history;

  factory _$MentorRequestModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$MentorRequestModelImplFromJson(json);

  @override
  final String message;
  @override
  @JsonKey()
  final String context;
  final List<ChatMessageModel> _history;
  @override
  @JsonKey()
  List<ChatMessageModel> get history {
    if (_history is EqualUnmodifiableListView) return _history;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_history);
  }

  @override
  final String? lessonTitle;
  @override
  final String? moduleSlug;
  @override
  final String? questionText;

  @override
  String toString() {
    return 'MentorRequestModel(message: $message, context: $context, history: $history, lessonTitle: $lessonTitle, moduleSlug: $moduleSlug, questionText: $questionText)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$MentorRequestModelImpl &&
            (identical(other.message, message) || other.message == message) &&
            (identical(other.context, context) || other.context == context) &&
            const DeepCollectionEquality().equals(other._history, _history) &&
            (identical(other.lessonTitle, lessonTitle) ||
                other.lessonTitle == lessonTitle) &&
            (identical(other.moduleSlug, moduleSlug) ||
                other.moduleSlug == moduleSlug) &&
            (identical(other.questionText, questionText) ||
                other.questionText == questionText));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
      runtimeType,
      message,
      context,
      const DeepCollectionEquality().hash(_history),
      lessonTitle,
      moduleSlug,
      questionText);

  /// Create a copy of MentorRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$MentorRequestModelImplCopyWith<_$MentorRequestModelImpl> get copyWith =>
      __$$MentorRequestModelImplCopyWithImpl<_$MentorRequestModelImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$MentorRequestModelImplToJson(
      this,
    );
  }
}

abstract class _MentorRequestModel implements MentorRequestModel {
  const factory _MentorRequestModel(
      {required final String message,
      final String context,
      final List<ChatMessageModel> history,
      final String? lessonTitle,
      final String? moduleSlug,
      final String? questionText}) = _$MentorRequestModelImpl;

  factory _MentorRequestModel.fromJson(Map<String, dynamic> json) =
      _$MentorRequestModelImpl.fromJson;

  @override
  String get message;
  @override
  String get context;
  @override
  List<ChatMessageModel> get history;
  @override
  String? get lessonTitle;
  @override
  String? get moduleSlug;
  @override
  String? get questionText;

  /// Create a copy of MentorRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$MentorRequestModelImplCopyWith<_$MentorRequestModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

MentorResponseModel _$MentorResponseModelFromJson(Map<String, dynamic> json) {
  return _MentorResponseModel.fromJson(json);
}

/// @nodoc
mixin _$MentorResponseModel {
  String get reply => throw _privateConstructorUsedError;
  String get context => throw _privateConstructorUsedError;

  /// Serializes this MentorResponseModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of MentorResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $MentorResponseModelCopyWith<MentorResponseModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $MentorResponseModelCopyWith<$Res> {
  factory $MentorResponseModelCopyWith(
          MentorResponseModel value, $Res Function(MentorResponseModel) then) =
      _$MentorResponseModelCopyWithImpl<$Res, MentorResponseModel>;
  @useResult
  $Res call({String reply, String context});
}

/// @nodoc
class _$MentorResponseModelCopyWithImpl<$Res, $Val extends MentorResponseModel>
    implements $MentorResponseModelCopyWith<$Res> {
  _$MentorResponseModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of MentorResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? reply = null,
    Object? context = null,
  }) {
    return _then(_value.copyWith(
      reply: null == reply
          ? _value.reply
          : reply // ignore: cast_nullable_to_non_nullable
              as String,
      context: null == context
          ? _value.context
          : context // ignore: cast_nullable_to_non_nullable
              as String,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$MentorResponseModelImplCopyWith<$Res>
    implements $MentorResponseModelCopyWith<$Res> {
  factory _$$MentorResponseModelImplCopyWith(_$MentorResponseModelImpl value,
          $Res Function(_$MentorResponseModelImpl) then) =
      __$$MentorResponseModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String reply, String context});
}

/// @nodoc
class __$$MentorResponseModelImplCopyWithImpl<$Res>
    extends _$MentorResponseModelCopyWithImpl<$Res, _$MentorResponseModelImpl>
    implements _$$MentorResponseModelImplCopyWith<$Res> {
  __$$MentorResponseModelImplCopyWithImpl(_$MentorResponseModelImpl _value,
      $Res Function(_$MentorResponseModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of MentorResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? reply = null,
    Object? context = null,
  }) {
    return _then(_$MentorResponseModelImpl(
      reply: null == reply
          ? _value.reply
          : reply // ignore: cast_nullable_to_non_nullable
              as String,
      context: null == context
          ? _value.context
          : context // ignore: cast_nullable_to_non_nullable
              as String,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$MentorResponseModelImpl implements _MentorResponseModel {
  const _$MentorResponseModelImpl({required this.reply, required this.context});

  factory _$MentorResponseModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$MentorResponseModelImplFromJson(json);

  @override
  final String reply;
  @override
  final String context;

  @override
  String toString() {
    return 'MentorResponseModel(reply: $reply, context: $context)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$MentorResponseModelImpl &&
            (identical(other.reply, reply) || other.reply == reply) &&
            (identical(other.context, context) || other.context == context));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, reply, context);

  /// Create a copy of MentorResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$MentorResponseModelImplCopyWith<_$MentorResponseModelImpl> get copyWith =>
      __$$MentorResponseModelImplCopyWithImpl<_$MentorResponseModelImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$MentorResponseModelImplToJson(
      this,
    );
  }
}

abstract class _MentorResponseModel implements MentorResponseModel {
  const factory _MentorResponseModel(
      {required final String reply,
      required final String context}) = _$MentorResponseModelImpl;

  factory _MentorResponseModel.fromJson(Map<String, dynamic> json) =
      _$MentorResponseModelImpl.fromJson;

  @override
  String get reply;
  @override
  String get context;

  /// Create a copy of MentorResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$MentorResponseModelImplCopyWith<_$MentorResponseModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

MentorAskRequestModel _$MentorAskRequestModelFromJson(
    Map<String, dynamic> json) {
  return _MentorAskRequestModel.fromJson(json);
}

/// @nodoc
mixin _$MentorAskRequestModel {
  String get message => throw _privateConstructorUsedError;
  String get userLevel => throw _privateConstructorUsedError;
  String? get learningPath => throw _privateConstructorUsedError;
  int get attemptCount => throw _privateConstructorUsedError;
  String? get questionText => throw _privateConstructorUsedError;
  String? get lessonTitle => throw _privateConstructorUsedError;
  String? get questionType => throw _privateConstructorUsedError;
  String? get codeBlock => throw _privateConstructorUsedError;

  /// Serializes this MentorAskRequestModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of MentorAskRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $MentorAskRequestModelCopyWith<MentorAskRequestModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $MentorAskRequestModelCopyWith<$Res> {
  factory $MentorAskRequestModelCopyWith(MentorAskRequestModel value,
          $Res Function(MentorAskRequestModel) then) =
      _$MentorAskRequestModelCopyWithImpl<$Res, MentorAskRequestModel>;
  @useResult
  $Res call(
      {String message,
      String userLevel,
      String? learningPath,
      int attemptCount,
      String? questionText,
      String? lessonTitle,
      String? questionType,
      String? codeBlock});
}

/// @nodoc
class _$MentorAskRequestModelCopyWithImpl<$Res,
        $Val extends MentorAskRequestModel>
    implements $MentorAskRequestModelCopyWith<$Res> {
  _$MentorAskRequestModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of MentorAskRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? message = null,
    Object? userLevel = null,
    Object? learningPath = freezed,
    Object? attemptCount = null,
    Object? questionText = freezed,
    Object? lessonTitle = freezed,
    Object? questionType = freezed,
    Object? codeBlock = freezed,
  }) {
    return _then(_value.copyWith(
      message: null == message
          ? _value.message
          : message // ignore: cast_nullable_to_non_nullable
              as String,
      userLevel: null == userLevel
          ? _value.userLevel
          : userLevel // ignore: cast_nullable_to_non_nullable
              as String,
      learningPath: freezed == learningPath
          ? _value.learningPath
          : learningPath // ignore: cast_nullable_to_non_nullable
              as String?,
      attemptCount: null == attemptCount
          ? _value.attemptCount
          : attemptCount // ignore: cast_nullable_to_non_nullable
              as int,
      questionText: freezed == questionText
          ? _value.questionText
          : questionText // ignore: cast_nullable_to_non_nullable
              as String?,
      lessonTitle: freezed == lessonTitle
          ? _value.lessonTitle
          : lessonTitle // ignore: cast_nullable_to_non_nullable
              as String?,
      questionType: freezed == questionType
          ? _value.questionType
          : questionType // ignore: cast_nullable_to_non_nullable
              as String?,
      codeBlock: freezed == codeBlock
          ? _value.codeBlock
          : codeBlock // ignore: cast_nullable_to_non_nullable
              as String?,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$MentorAskRequestModelImplCopyWith<$Res>
    implements $MentorAskRequestModelCopyWith<$Res> {
  factory _$$MentorAskRequestModelImplCopyWith(
          _$MentorAskRequestModelImpl value,
          $Res Function(_$MentorAskRequestModelImpl) then) =
      __$$MentorAskRequestModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String message,
      String userLevel,
      String? learningPath,
      int attemptCount,
      String? questionText,
      String? lessonTitle,
      String? questionType,
      String? codeBlock});
}

/// @nodoc
class __$$MentorAskRequestModelImplCopyWithImpl<$Res>
    extends _$MentorAskRequestModelCopyWithImpl<$Res,
        _$MentorAskRequestModelImpl>
    implements _$$MentorAskRequestModelImplCopyWith<$Res> {
  __$$MentorAskRequestModelImplCopyWithImpl(_$MentorAskRequestModelImpl _value,
      $Res Function(_$MentorAskRequestModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of MentorAskRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? message = null,
    Object? userLevel = null,
    Object? learningPath = freezed,
    Object? attemptCount = null,
    Object? questionText = freezed,
    Object? lessonTitle = freezed,
    Object? questionType = freezed,
    Object? codeBlock = freezed,
  }) {
    return _then(_$MentorAskRequestModelImpl(
      message: null == message
          ? _value.message
          : message // ignore: cast_nullable_to_non_nullable
              as String,
      userLevel: null == userLevel
          ? _value.userLevel
          : userLevel // ignore: cast_nullable_to_non_nullable
              as String,
      learningPath: freezed == learningPath
          ? _value.learningPath
          : learningPath // ignore: cast_nullable_to_non_nullable
              as String?,
      attemptCount: null == attemptCount
          ? _value.attemptCount
          : attemptCount // ignore: cast_nullable_to_non_nullable
              as int,
      questionText: freezed == questionText
          ? _value.questionText
          : questionText // ignore: cast_nullable_to_non_nullable
              as String?,
      lessonTitle: freezed == lessonTitle
          ? _value.lessonTitle
          : lessonTitle // ignore: cast_nullable_to_non_nullable
              as String?,
      questionType: freezed == questionType
          ? _value.questionType
          : questionType // ignore: cast_nullable_to_non_nullable
              as String?,
      codeBlock: freezed == codeBlock
          ? _value.codeBlock
          : codeBlock // ignore: cast_nullable_to_non_nullable
              as String?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$MentorAskRequestModelImpl implements _MentorAskRequestModel {
  const _$MentorAskRequestModelImpl(
      {required this.message,
      this.userLevel = 'beginner',
      this.learningPath,
      this.attemptCount = 1,
      this.questionText,
      this.lessonTitle,
      this.questionType,
      this.codeBlock});

  factory _$MentorAskRequestModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$MentorAskRequestModelImplFromJson(json);

  @override
  final String message;
  @override
  @JsonKey()
  final String userLevel;
  @override
  final String? learningPath;
  @override
  @JsonKey()
  final int attemptCount;
  @override
  final String? questionText;
  @override
  final String? lessonTitle;
  @override
  final String? questionType;
  @override
  final String? codeBlock;

  @override
  String toString() {
    return 'MentorAskRequestModel(message: $message, userLevel: $userLevel, learningPath: $learningPath, attemptCount: $attemptCount, questionText: $questionText, lessonTitle: $lessonTitle, questionType: $questionType, codeBlock: $codeBlock)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$MentorAskRequestModelImpl &&
            (identical(other.message, message) || other.message == message) &&
            (identical(other.userLevel, userLevel) ||
                other.userLevel == userLevel) &&
            (identical(other.learningPath, learningPath) ||
                other.learningPath == learningPath) &&
            (identical(other.attemptCount, attemptCount) ||
                other.attemptCount == attemptCount) &&
            (identical(other.questionText, questionText) ||
                other.questionText == questionText) &&
            (identical(other.lessonTitle, lessonTitle) ||
                other.lessonTitle == lessonTitle) &&
            (identical(other.questionType, questionType) ||
                other.questionType == questionType) &&
            (identical(other.codeBlock, codeBlock) ||
                other.codeBlock == codeBlock));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, message, userLevel, learningPath,
      attemptCount, questionText, lessonTitle, questionType, codeBlock);

  /// Create a copy of MentorAskRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$MentorAskRequestModelImplCopyWith<_$MentorAskRequestModelImpl>
      get copyWith => __$$MentorAskRequestModelImplCopyWithImpl<
          _$MentorAskRequestModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$MentorAskRequestModelImplToJson(
      this,
    );
  }
}

abstract class _MentorAskRequestModel implements MentorAskRequestModel {
  const factory _MentorAskRequestModel(
      {required final String message,
      final String userLevel,
      final String? learningPath,
      final int attemptCount,
      final String? questionText,
      final String? lessonTitle,
      final String? questionType,
      final String? codeBlock}) = _$MentorAskRequestModelImpl;

  factory _MentorAskRequestModel.fromJson(Map<String, dynamic> json) =
      _$MentorAskRequestModelImpl.fromJson;

  @override
  String get message;
  @override
  String get userLevel;
  @override
  String? get learningPath;
  @override
  int get attemptCount;
  @override
  String? get questionText;
  @override
  String? get lessonTitle;
  @override
  String? get questionType;
  @override
  String? get codeBlock;

  /// Create a copy of MentorAskRequestModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$MentorAskRequestModelImplCopyWith<_$MentorAskRequestModelImpl>
      get copyWith => throw _privateConstructorUsedError;
}

MentorAskResponseModel _$MentorAskResponseModelFromJson(
    Map<String, dynamic> json) {
  return _MentorAskResponseModel.fromJson(json);
}

/// @nodoc
mixin _$MentorAskResponseModel {
  String get answer => throw _privateConstructorUsedError;
  String get model => throw _privateConstructorUsedError;

  /// Serializes this MentorAskResponseModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of MentorAskResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $MentorAskResponseModelCopyWith<MentorAskResponseModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $MentorAskResponseModelCopyWith<$Res> {
  factory $MentorAskResponseModelCopyWith(MentorAskResponseModel value,
          $Res Function(MentorAskResponseModel) then) =
      _$MentorAskResponseModelCopyWithImpl<$Res, MentorAskResponseModel>;
  @useResult
  $Res call({String answer, String model});
}

/// @nodoc
class _$MentorAskResponseModelCopyWithImpl<$Res,
        $Val extends MentorAskResponseModel>
    implements $MentorAskResponseModelCopyWith<$Res> {
  _$MentorAskResponseModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of MentorAskResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? answer = null,
    Object? model = null,
  }) {
    return _then(_value.copyWith(
      answer: null == answer
          ? _value.answer
          : answer // ignore: cast_nullable_to_non_nullable
              as String,
      model: null == model
          ? _value.model
          : model // ignore: cast_nullable_to_non_nullable
              as String,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$MentorAskResponseModelImplCopyWith<$Res>
    implements $MentorAskResponseModelCopyWith<$Res> {
  factory _$$MentorAskResponseModelImplCopyWith(
          _$MentorAskResponseModelImpl value,
          $Res Function(_$MentorAskResponseModelImpl) then) =
      __$$MentorAskResponseModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String answer, String model});
}

/// @nodoc
class __$$MentorAskResponseModelImplCopyWithImpl<$Res>
    extends _$MentorAskResponseModelCopyWithImpl<$Res,
        _$MentorAskResponseModelImpl>
    implements _$$MentorAskResponseModelImplCopyWith<$Res> {
  __$$MentorAskResponseModelImplCopyWithImpl(
      _$MentorAskResponseModelImpl _value,
      $Res Function(_$MentorAskResponseModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of MentorAskResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? answer = null,
    Object? model = null,
  }) {
    return _then(_$MentorAskResponseModelImpl(
      answer: null == answer
          ? _value.answer
          : answer // ignore: cast_nullable_to_non_nullable
              as String,
      model: null == model
          ? _value.model
          : model // ignore: cast_nullable_to_non_nullable
              as String,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$MentorAskResponseModelImpl implements _MentorAskResponseModel {
  const _$MentorAskResponseModelImpl({required this.answer, this.model = ''});

  factory _$MentorAskResponseModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$MentorAskResponseModelImplFromJson(json);

  @override
  final String answer;
  @override
  @JsonKey()
  final String model;

  @override
  String toString() {
    return 'MentorAskResponseModel(answer: $answer, model: $model)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$MentorAskResponseModelImpl &&
            (identical(other.answer, answer) || other.answer == answer) &&
            (identical(other.model, model) || other.model == model));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, answer, model);

  /// Create a copy of MentorAskResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$MentorAskResponseModelImplCopyWith<_$MentorAskResponseModelImpl>
      get copyWith => __$$MentorAskResponseModelImplCopyWithImpl<
          _$MentorAskResponseModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$MentorAskResponseModelImplToJson(
      this,
    );
  }
}

abstract class _MentorAskResponseModel implements MentorAskResponseModel {
  const factory _MentorAskResponseModel(
      {required final String answer,
      final String model}) = _$MentorAskResponseModelImpl;

  factory _MentorAskResponseModel.fromJson(Map<String, dynamic> json) =
      _$MentorAskResponseModelImpl.fromJson;

  @override
  String get answer;
  @override
  String get model;

  /// Create a copy of MentorAskResponseModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$MentorAskResponseModelImplCopyWith<_$MentorAskResponseModelImpl>
      get copyWith => throw _privateConstructorUsedError;
}
