import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../../core/constants/storage_keys.dart';
import '../../../../core/notifications/notification_scheduler.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../providers/auth_provider.dart';
import '../../../../providers/gamification_provider.dart';
import '../../../widgets/app_error_widget.dart';
import '../../../widgets/badge_chip.dart';
import '../../../widgets/loading_widget.dart';
import '../../../widgets/stat_card.dart';
import '../../../widgets/streak_widget.dart';
import '../../../widgets/xp_progress_bar.dart';

class ProfileTab extends ConsumerStatefulWidget {
  const ProfileTab({super.key});

  @override
  ConsumerState<ProfileTab> createState() => _ProfileTabState();
}

class _ProfileTabState extends ConsumerState<ProfileTab>
    with SingleTickerProviderStateMixin {
  late AnimationController _statsController;
  late List<Animation<Offset>> _statsAnims;

  bool _notificationEnabled = false;
  int _notificationHour = 20;
  int _notificationMinute = 0;

  @override
  void initState() {
    super.initState();

    _statsController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    );

    // 4 kart için stagger animasyonları (100ms arayla)
    _statsAnims = List.generate(4, (i) {
      final start = i * 0.1;
      final end = (start + 0.6).clamp(0.0, 1.0);
      return Tween<Offset>(
        begin: const Offset(-1, 0),
        end: Offset.zero,
      ).animate(
        CurvedAnimation(
          parent: _statsController,
          curve: Interval(start, end, curve: Curves.easeOut),
        ),
      );
    });

    _statsController.forward();
    _loadNotificationSettings();
  }

  Future<void> _loadNotificationSettings() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _notificationEnabled =
          prefs.getBool(StorageKeys.notificationEnabled) ?? false;
      _notificationHour =
          prefs.getInt(StorageKeys.notificationHour) ?? 20;
      _notificationMinute =
          prefs.getInt(StorageKeys.notificationMinute) ?? 0;
    });
  }

  Future<void> _saveNotificationSettings() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(StorageKeys.notificationEnabled, _notificationEnabled);
    await prefs.setInt(StorageKeys.notificationHour, _notificationHour);
    await prefs.setInt(StorageKeys.notificationMinute, _notificationMinute);

    if (_notificationEnabled) {
      await NotificationScheduler.scheduleDailyReminder(
        hour: _notificationHour,
        minute: _notificationMinute,
      );
    } else {
      await NotificationScheduler.cancelDailyReminder();
    }
  }

  Future<void> _pickNotificationTime() async {
    final picked = await showTimePicker(
      context: context,
      initialTime: TimeOfDay(
          hour: _notificationHour, minute: _notificationMinute),
    );
    if (picked != null && mounted) {
      setState(() {
        _notificationHour = picked.hour;
        _notificationMinute = picked.minute;
      });
      await _saveNotificationSettings();
    }
  }

  Color _getAvatarColor(String username) {
    const colors = [
      Colors.blue,
      Colors.green,
      Colors.orange,
      Colors.purple,
      Colors.red,
      Colors.teal,
    ];
    return colors[username.hashCode.abs() % colors.length];
  }

  @override
  void dispose() {
    _statsController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);
    final statsAsync = ref.watch(userStatsProvider);
    final streakAsync = ref.watch(streakProvider);

    final username =
        authState.whenOrNull(authenticated: (u) => u.username) ?? '';
    final email = authState.whenOrNull(authenticated: (u) => u.email) ?? '';

    return RefreshIndicator(
      onRefresh: () async {
        ref.invalidate(userStatsProvider);
        ref.invalidate(streakProvider);
      },
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.all(16),
        child: SafeArea(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Avatar + kullanıcı bilgisi
              Center(
                child: Column(
                  children: [
                    CircleAvatar(
                      radius: 40,
                      backgroundColor: _getAvatarColor(username),
                      child: Text(
                        username.isNotEmpty ? username[0].toUpperCase() : '?',
                        style: const TextStyle(
                            fontSize: 32,
                            color: AppColors.white,
                            fontWeight: FontWeight.bold),
                      ),
                    ),
                    const SizedBox(height: 12),
                    Text(username,
                        style: const TextStyle(
                            fontSize: 20, fontWeight: FontWeight.bold)),
                    Text(email,
                        style: const TextStyle(
                            fontSize: 13, color: AppColors.grey)),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // İstatistik kartları 2x2 — AnimatedSlide ile
              statsAsync.when(
                data: (stats) => GridView.count(
                  crossAxisCount: 2,
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  crossAxisSpacing: 8,
                  mainAxisSpacing: 8,
                  childAspectRatio: 1.4,
                  children: [
                    SlideTransition(
                      position: _statsAnims[0],
                      child: StatCard(
                          title: 'Toplam XP',
                          value: '${stats.totalXp}',
                          icon: Icons.star,
                          color: AppColors.xpGold),
                    ),
                    SlideTransition(
                      position: _statsAnims[1],
                      child: StatCard(
                          title: 'Mevcut Seviye',
                          value: '${stats.level}',
                          icon: Icons.trending_up,
                          color: AppColors.info),
                    ),
                    SlideTransition(
                      position: _statsAnims[2],
                      child: StatCard(
                          title: 'Tamamlanan Ders',
                          value: '${stats.totalLessonsCompleted}',
                          icon: Icons.menu_book,
                          color: AppColors.success),
                    ),
                    SlideTransition(
                      position: _statsAnims[3],
                      child: StatCard(
                          title: 'Tamamlanan Modül',
                          value: '${stats.totalModulesCompleted}',
                          icon: Icons.layers,
                          color: AppColors.accent),
                    ),
                  ],
                ),
                loading: () => const LoadingWidget(),
                error: (e, _) => AppErrorWidget(message: e.toString()),
              ),
              const SizedBox(height: 20),

              // XP ilerleme çubuğu
              statsAsync.whenOrNull(
                    data: (stats) => Card(
                      elevation: 2,
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12)),
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: XpProgressBar(
                            levelProgress: stats.levelProgress),
                      ),
                    ),
                  ) ??
                  const SizedBox.shrink(),
              const SizedBox(height: 20),

              // Streak kartı
              streakAsync.when(
                data: (streak) => Card(
                  elevation: 2,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12)),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Row(
                      children: [
                        StreakWidget(streak: streak),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Text(
                            streak.daysToNextMilestone > 0
                                ? 'Sonraki milestone\'a ${streak.daysToNextMilestone} gün kaldı (${streak.nextMilestone} gün)'
                                : 'Milestone\'a ulaştın! 🎉',
                            style: const TextStyle(
                                fontSize: 13, color: AppColors.grey),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                loading: () => const LoadingWidget(),
                error: (e, _) => AppErrorWidget(message: e.toString()),
              ),
              const SizedBox(height: 20),

              // Haftalık aktivite grafiği
              Card(
                elevation: 2,
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12)),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Haftalık Aktivite',
                        style: TextStyle(
                            fontSize: 15, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 12),
                      SizedBox(
                        height: 80,
                        child: CustomPaint(
                          painter: WeeklyActivityPainter(
                            data: const [2, 0, 3, 1, 4, 0, 2],
                          ),
                          size: const Size(double.infinity, 80),
                        ),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']
                            .map((d) => Text(d,
                                style: const TextStyle(
                                    fontSize: 11, color: AppColors.grey)))
                            .toList(),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 20),

              // Rozetler
              statsAsync.whenOrNull(
                    data: (stats) => Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'Kazanılan Rozetler (${stats.badges.length})',
                              style: const TextStyle(
                                  fontSize: 16, fontWeight: FontWeight.bold),
                            ),
                            TextButton(
                              onPressed: () => context.go('/home/badges'),
                              child: const Text('Tümünü Gör'),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        SingleChildScrollView(
                          scrollDirection: Axis.horizontal,
                          child: Row(
                            children: stats.badges
                                .map((b) => Padding(
                                      padding:
                                          const EdgeInsets.only(right: 8),
                                      child: BadgeChip(badge: b),
                                    ))
                                .toList(),
                          ),
                        ),
                      ],
                    ),
                  ) ??
                  const SizedBox.shrink(),
              const SizedBox(height: 20),

              // Bildirim ayarları
              Card(
                elevation: 2,
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12)),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Bildirim Ayarları',
                        style: TextStyle(
                            fontSize: 15, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('Günlük Hatırlatma'),
                          Switch(
                            value: _notificationEnabled,
                            onChanged: (val) async {
                              setState(() => _notificationEnabled = val);
                              await _saveNotificationSettings();
                            },
                          ),
                        ],
                      ),
                      if (_notificationEnabled) ...[
                        const Divider(),
                        ListTile(
                          contentPadding: EdgeInsets.zero,
                          title: const Text('Hatırlatma Saati'),
                          subtitle: Text(
                            '${_notificationHour.toString().padLeft(2, '0')}:${_notificationMinute.toString().padLeft(2, '0')}',
                            style: const TextStyle(
                                color: AppColors.primary,
                                fontWeight: FontWeight.bold),
                          ),
                          trailing: const Icon(Icons.access_time),
                          onTap: _pickNotificationTime,
                        ),
                      ],
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 32),

              // Çıkış butonu
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.error,
                    foregroundColor: AppColors.white,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12)),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                  ),
                  icon: const Icon(Icons.logout),
                  label: const Text('Çıkış Yap'),
                  onPressed: _confirmLogout,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _confirmLogout() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Çıkış Yap'),
        content: const Text('Çıkış yapmak istediğinizden emin misiniz?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('İptal'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.error,
                foregroundColor: AppColors.white),
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Çıkış Yap'),
          ),
        ],
      ),
    );
    if (!mounted) return;
    if (confirmed == true) {
      ref.read(authProvider.notifier).logout();
    }
  }
}

// ─── Haftalık Aktivite Grafiği ────────────────────────────────────────────────

class WeeklyActivityPainter extends CustomPainter {
  final List<int> data;

  const WeeklyActivityPainter({required this.data});

  @override
  void paint(Canvas canvas, Size size) {
    if (data.isEmpty) return;

    final maxVal = data.reduce((a, b) => a > b ? a : b);
    if (maxVal == 0) return;

    final barWidth = size.width / (data.length * 2 - 1);
    final activePaint = Paint()
      ..color = AppColors.primary
      ..style = PaintingStyle.fill;
    final inactivePaint = Paint()
      ..color = Colors.grey[300]!
      ..style = PaintingStyle.fill;

    for (var i = 0; i < data.length; i++) {
      final barHeight = (data[i] / maxVal) * size.height;
      final x = i * barWidth * 2;
      final rect = RRect.fromRectAndRadius(
        Rect.fromLTWH(x, size.height - barHeight, barWidth, barHeight),
        const Radius.circular(4),
      );
      canvas.drawRRect(rect, data[i] > 0 ? activePaint : inactivePaint);
    }
  }

  @override
  bool shouldRepaint(WeeklyActivityPainter oldDelegate) =>
      oldDelegate.data != data;
}
