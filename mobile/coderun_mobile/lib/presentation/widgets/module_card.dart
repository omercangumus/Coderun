import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../data/models/module_model.dart';

class ModuleCard extends StatelessWidget {
  final ModuleModel module;
  final double? completionRate;
  final VoidCallback onTap;

  const ModuleCard({
    super.key,
    required this.module,
    required this.onTap,
    this.completionRate,
  });

  String get _moduleIcon {
    if (module.slug.contains('python')) return '🐍';
    if (module.slug.contains('devops')) return '⚙️';
    if (module.slug.contains('cloud')) return '☁️';
    return '📚';
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Text(_moduleIcon, style: const TextStyle(fontSize: 28)),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      module.title,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                module.description,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(fontSize: 13, color: AppColors.grey),
              ),
              if (completionRate != null) ...[
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'İlerleme',
                      style: TextStyle(fontSize: 12, color: AppColors.grey),
                    ),
                    Text(
                      '%${(completionRate! * 100).toStringAsFixed(0)}',
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: AppColors.primary,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                ClipRRect(
                  borderRadius: BorderRadius.circular(4),
                  child: LinearProgressIndicator(
                    value: completionRate,
                    minHeight: 6,
                    backgroundColor: AppColors.greyLight,
                    valueColor: const AlwaysStoppedAnimation<Color>(
                        AppColors.success),
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
