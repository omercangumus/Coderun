// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'module_progress_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$ModuleProgressModelImpl _$$ModuleProgressModelImplFromJson(
        Map<String, dynamic> json) =>
    _$ModuleProgressModelImpl(
      module: ModuleModel.fromJson(json['module'] as Map<String, dynamic>),
      completionRate: (json['completion_rate'] as num).toDouble(),
      completedLessons: (json['completed_lessons'] as num).toInt(),
      totalLessons: (json['total_lessons'] as num).toInt(),
    );

Map<String, dynamic> _$$ModuleProgressModelImplToJson(
        _$ModuleProgressModelImpl instance) =>
    <String, dynamic>{
      'module': instance.module,
      'completion_rate': instance.completionRate,
      'completed_lessons': instance.completedLessons,
      'total_lessons': instance.totalLessons,
    };
