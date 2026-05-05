// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'mentor_provider.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

/// @nodoc
mixin _$MentorChatState {
  List<ChatMessageModel> get messages => throw _privateConstructorUsedError;
  bool get isLoading => throw _privateConstructorUsedError;
  String? get error => throw _privateConstructorUsedError;

  @JsonKey(ignore: true)
  $MentorChatStateCopyWith<MentorChatState> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $MentorChatStateCopyWith<$Res> {
  factory $MentorChatStateCopyWith(
          MentorChatState value, $Res Function(MentorChatState) then) =
      _$MentorChatStateCopyWithImpl<$Res, MentorChatState>;
  @useResult
  $Res call(
      {List<ChatMessageModel> messages, bool isLoading, String? error});
}

/// @nodoc
class _$MentorChatStateCopyWithImpl<$Res, $Val extends MentorChatState>
    implements $MentorChatStateCopyWith<$Res> {
  _$MentorChatStateCopyWithImpl(this._value, this._then);

  final $Val _value;
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? messages = null,
    Object? isLoading = null,
    Object? error = freezed,
  }) {
    return _then(_value.copyWith(
      messages: null == messages
          ? _value.messages
          : messages as List<ChatMessageModel>,
      isLoading: null == isLoading ? _value.isLoading : isLoading as bool,
      error: freezed == error ? _value.error : error as String?,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$MentorChatStateImplCopyWith<$Res>
    implements $MentorChatStateCopyWith<$Res> {
  factory _$$MentorChatStateImplCopyWith(_$MentorChatStateImpl value,
          $Res Function(_$MentorChatStateImpl) then) =
      __$$MentorChatStateImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {List<ChatMessageModel> messages, bool isLoading, String? error});
}

/// @nodoc
class __$$MentorChatStateImplCopyWithImpl<$Res>
    extends _$MentorChatStateCopyWithImpl<$Res, _$MentorChatStateImpl>
    implements _$$MentorChatStateImplCopyWith<$Res> {
  __$$MentorChatStateImplCopyWithImpl(
      _$MentorChatStateImpl _value, $Res Function(_$MentorChatStateImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? messages = null,
    Object? isLoading = null,
    Object? error = freezed,
  }) {
    return _then(_$MentorChatStateImpl(
      messages: null == messages
          ? _value._messages
          : messages as List<ChatMessageModel>,
      isLoading: null == isLoading ? _value.isLoading : isLoading as bool,
      error: freezed == error ? _value.error : error as String?,
    ));
  }
}

/// @nodoc

class _$MentorChatStateImpl implements _MentorChatState {
  const _$MentorChatStateImpl(
      {final List<ChatMessageModel> messages = const [],
      this.isLoading = false,
      this.error})
      : _messages = messages;

  final List<ChatMessageModel> _messages;
  @override
  @JsonKey()
  List<ChatMessageModel> get messages {
    if (_messages is EqualUnmodifiableListView) return _messages;
    return EqualUnmodifiableListView(_messages);
  }

  @override
  @JsonKey()
  final bool isLoading;
  @override
  final String? error;

  @override
  String toString() {
    return 'MentorChatState(messages: $messages, isLoading: $isLoading, error: $error)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$MentorChatStateImpl &&
            const DeepCollectionEquality()
                .equals(other._messages, _messages) &&
            (identical(other.isLoading, isLoading) ||
                other.isLoading == isLoading) &&
            (identical(other.error, error) || other.error == error));
  }

  @override
  int get hashCode => Object.hash(runtimeType,
      const DeepCollectionEquality().hash(_messages), isLoading, error);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$MentorChatStateImplCopyWith<_$MentorChatStateImpl> get copyWith =>
      __$$MentorChatStateImplCopyWithImpl<_$MentorChatStateImpl>(
          this, _$identity);
}

abstract class _MentorChatState implements MentorChatState {
  const factory _MentorChatState(
      {final List<ChatMessageModel> messages,
      final bool isLoading,
      final String? error}) = _$MentorChatStateImpl;

  @override
  List<ChatMessageModel> get messages;
  @override
  bool get isLoading;
  @override
  String? get error;
  @override
  @JsonKey(ignore: true)
  _$$MentorChatStateImplCopyWith<_$MentorChatStateImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
