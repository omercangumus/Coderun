// Choose Your Path — Onboarding Screen
// Stitch design reference: docs/design/stitch/mobile/mobilestich/coderun_choose_your_path/

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';

class PathOption {
  final String slug;
  final String title;
  final String subtitle;
  final String icon;
  final String levelBadge;
  final String lessonCount;
  final Color color;
  final Color bgColor;

  const PathOption({
    required this.slug,
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.levelBadge,
    required this.lessonCount,
    required this.color,
    required this.bgColor,
  });
}

const _paths = [
  PathOption(
    slug: 'python',
    title: 'Python Mastery',
    subtitle: 'Temellerden ileri seviyeye Python öğren',
    icon: '🐍',
    levelBadge: 'Başlangıç',
    lessonCount: '45 ders',
    color: AppColors.primary,
    bgColor: AppColors.primaryFixed,
  ),
  PathOption(
    slug: 'devops',
    title: 'DevOps Journey',
    subtitle: 'CI/CD, Docker, Kubernetes ve daha fazlası',
    icon: '⚙️',
    levelBadge: 'Orta',
    lessonCount: '38 ders',
    color: AppColors.secondary,
    bgColor: Color(0xFFE8F5E9),
  ),
  PathOption(
    slug: 'cloud',
    title: 'Cloud Computing',
    subtitle: 'AWS, GCP ve Azure ile bulut mimarisi',
    icon: '☁️',
    levelBadge: 'Orta',
    lessonCount: '42 ders',
    color: Color(0xFF0288D1),
    bgColor: Color(0xFFE1F5FE),
  ),
  PathOption(
    slug: 'iac',
    title: 'Infrastructure as Code',
    subtitle: 'Terraform, Ansible ve altyapı otomasyonu',
    icon: '🏗️',
    levelBadge: 'İleri',
    lessonCount: '30 ders',
    color: AppColors.tertiary,
    bgColor: AppColors.tertiaryFixed,
  ),
];

class ChoosePathScreen extends StatelessWidget {
  const ChoosePathScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.background,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded, color: AppColors.onSurface),
          onPressed: () => context.go('/'),
        ),
        title: const Text(
          'Yolunu Seç',
          style: TextStyle(
            fontFamily: 'PlusJakartaSans',
            fontSize: 20,
            fontWeight: FontWeight.w700,
            color: AppColors.onSurface,
          ),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(
                AppSpacing.xxl, AppSpacing.md, AppSpacing.xxl, AppSpacing.xl,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: const [
                  Text(
                    'Hangi yolda\nilerlemek istiyorsun?',
                    style: TextStyle(
                      fontFamily: 'PlusJakartaSans',
                      fontSize: 28,
                      fontWeight: FontWeight.w800,
                      color: AppColors.onSurface,
                      height: 1.2,
                    ),
                  ),
                  SizedBox(height: AppSpacing.sm),
                  Text(
                    'İstediğin zaman değiştirebilirsin.',
                    style: TextStyle(
                      fontFamily: 'Lexend',
                      fontSize: 14,
                      color: AppColors.onSurfaceVariant,
                    ),
                  ),
                ],
              ),
            ),
            Expanded(
              child: ListView.separated(
                padding: const EdgeInsets.symmetric(
                  horizontal: AppSpacing.xl,
                  vertical: AppSpacing.sm,
                ),
                itemCount: _paths.length,
                separatorBuilder: (_, __) => const SizedBox(height: AppSpacing.md),
                itemBuilder: (context, i) => _PathCard(
                  path: _paths[i],
                  onTap: () => context.go('/home/learn/${_paths[i].slug}'),
                ),
              ),
            ),
            const SizedBox(height: AppSpacing.xl),
          ],
        ),
      ),
    );
  }
}

class _PathCard extends StatelessWidget {
  final PathOption path;
  final VoidCallback onTap;

  const _PathCard({required this.path, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(AppSpacing.cardPadding),
        decoration: BoxDecoration(
          color: AppColors.surfaceContainerLowest,
          borderRadius: BorderRadius.circular(AppSpacing.radiusXl),
          border: Border.all(color: AppColors.outlineVariant),
          boxShadow: [
            BoxShadow(
              color: AppColors.onSurface.withOpacity(0.04),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Row(
          children: [
            // Icon
            Container(
              width: 56,
              height: 56,
              decoration: BoxDecoration(
                color: path.bgColor,
                borderRadius: BorderRadius.circular(AppSpacing.radiusLg),
              ),
              child: Center(
                child: Text(path.icon, style: const TextStyle(fontSize: 28)),
              ),
            ),
            const SizedBox(width: AppSpacing.md),

            // Content
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          path.title,
                          style: const TextStyle(
                            fontFamily: 'PlusJakartaSans',
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                            color: AppColors.onSurface,
                          ),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      const SizedBox(width: 8),
                      _LevelBadge(label: path.levelBadge, color: path.color),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    path.subtitle,
                    style: const TextStyle(
                      fontFamily: 'Lexend',
                      fontSize: 13,
                      color: AppColors.onSurfaceVariant,
                      height: 1.4,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Icon(Icons.menu_book_outlined,
                          size: 14, color: path.color),
                      const SizedBox(width: 4),
                      Text(
                        path.lessonCount,
                        style: TextStyle(
                          fontFamily: 'Lexend',
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: path.color,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(width: AppSpacing.sm),
            Icon(Icons.arrow_forward_ios_rounded,
                size: 16, color: AppColors.outline),
          ],
        ),
      ),
    );
  }
}

class _LevelBadge extends StatelessWidget {
  final String label;
  final Color color;

  const _LevelBadge({required this.label, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(AppSpacing.radiusFull),
      ),
      child: Text(
        label,
        style: TextStyle(
          fontFamily: 'SpaceGrotesk',
          fontSize: 11,
          fontWeight: FontWeight.w600,
          color: color,
          letterSpacing: 0.3,
        ),
      ),
    );
  }
}
