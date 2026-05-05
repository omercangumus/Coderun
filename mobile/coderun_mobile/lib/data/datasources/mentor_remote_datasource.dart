// AI Mentor uzak veri kaynağı.

import 'package:dio/dio.dart';

import '../../core/constants/api_constants.dart';
import '../../core/network/api_exception.dart';
import '../models/mentor_model.dart';

abstract class MentorRemoteDataSource {
  Future<MentorResponseModel> sendMessage(MentorRequestModel request);
  Future<MentorAskResponseModel> askMentor(MentorAskRequestModel request);
}

class MentorRemoteDataSourceImpl implements MentorRemoteDataSource {
  final Dio _dio;

  const MentorRemoteDataSourceImpl({required Dio dio}) : _dio = dio;

  @override
  Future<MentorResponseModel> sendMessage(MentorRequestModel request) async {
    try {
      final response = await _dio.post(
        ApiConstants.mentorChat,
        data: {
          'message': request.message,
          'context': request.context,
          'history': request.history
              .map((m) => {'role': m.role, 'content': m.content})
              .toList(),
          if (request.lessonTitle != null) 'lesson_title': request.lessonTitle,
          if (request.moduleSlug != null) 'module_slug': request.moduleSlug,
          if (request.questionText != null)
            'question_text': request.questionText,
        },
      );
      final data = response.data;
      if (data is! Map<String, dynamic>) {
        throw const ApiException(message: 'Geçersiz yanıt formatı');
      }
      return MentorResponseModel.fromJson(data);
    } on DioException catch (e) {
      if (e.response?.statusCode == 429) {
        throw const ApiException(
          message: 'Çok fazla istek gönderdin. Biraz bekle! ⏳',
          statusCode: 429,
          errorCode: 'RATE_LIMIT',
        );
      }
      throw ApiException.fromDioError(e);
    }
  }

  @override
  Future<MentorAskResponseModel> askMentor(MentorAskRequestModel request) async {
    try {
      final response = await _dio.post(
        ApiConstants.mentorAsk,
        data: {
          'message': request.message,
          'user_level': request.userLevel,
          if (request.learningPath != null) 'learning_path': request.learningPath,
          'attempt_count': request.attemptCount,
        },
      );
      final data = response.data;
      if (data is! Map<String, dynamic>) {
        throw const ApiException(message: 'Geçersiz yanıt formatı');
      }
      return MentorAskResponseModel.fromJson(data);
    } on DioException catch (e) {
      if (e.response?.statusCode == 429) {
        throw const ApiException(
          message: 'Çok fazla istek gönderdin. Biraz bekle! ⏳',
          statusCode: 429,
          errorCode: 'RATE_LIMIT',
        );
      }
      throw ApiException.fromDioError(e);
    }
  }
}
