import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../data/models/leaderboard_model.dart';

class LeaderboardCard extends StatelessWidget {
  final LeaderboardEntryModel entry;
  final bool isCurrentUser;

  const LeaderboardCard({
    super.key,
    required this.entry,
    required this.isCurrentUser,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      decoration: BoxDecoration(
        color: isCurrentUser
            ? AppColors.primary.withValues(alpha: 0.1)
            : Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: isCurrentUser
            ? Border.all(color: AppColors.primary, width: 1.5)
            : Border.all(color: Colors.grey[200]!),
        boxShadow: isCurrentUser
            ? [
                BoxShadow(
                  color: AppColors.primary.withValues(alpha: 0.15),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                )
              ]
            : null,
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        child: Row(
          children: [
            // Sıra numarası
            SizedBox(
              width: 36,
              child: Text(
                '#${entry.rank}',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                  color: isCurrentUser ? AppColors.primary : AppColors.grey,
                ),
              ),
            ),
            const SizedBox(width: 8),
            // Avatar
            CircleAvatar(
              radius: 20,
              backgroundColor: _getAvatarColor(entry.username),
              child: Text(
                entry.username.isNotEmpty
                    ? entry.username[0].toUpperCase()
                    : '?',
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),
            ),
            const SizedBox(width: 12),
            // Kullanıcı adı
            Expanded(
              child: Text(
                entry.username,
                style: TextStyle(
                  fontWeight:
                      isCurrentUser ? FontWeight.bold : FontWeight.normal,
                  fontSize: 15,
                ),
                overflow: TextOverflow.ellipsis,
              ),
            ),
            // Streak
            Text(
              '🔥 ${entry.streak}',
              style: const TextStyle(fontSize: 13),
            ),
            const SizedBox(width: 12),
            // Haftalık XP
            Text(
              '${entry.weeklyXp} XP',
              style: const TextStyle(
                color: AppColors.xpGold,
                fontWeight: FontWeight.bold,
                fontSize: 14,
              ),
            ),
          ],
        ),
      ),
    );
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
}
