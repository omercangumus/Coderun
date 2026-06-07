import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../providers/gamification_provider.dart';
import '../../../../providers/module_provider.dart';
import 'tabs/home_tab.dart';
import 'tabs/learn_tab.dart';
import 'tabs/leaderboard_tab.dart';
import 'tabs/profile_tab.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen>
    with WidgetsBindingObserver {
  int _currentIndex = 0;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    // Web'de yapılan değişiklikler aynı backend'e gider — uygulama öne gelince veriyi yenile.
    if (state == AppLifecycleState.resumed) {
      _refreshSyncedData();
    }
  }

  void _refreshSyncedData() {
    ref.invalidate(modulesProvider);
    ref.invalidate(userStatsProvider);
    ref.invalidate(leaderboardProvider);
    ref.invalidate(streakProvider);
  }

  void _onTabChange(int index) {
    setState(() => _currentIndex = index);
    if (index == 0 || index == 1) {
      _refreshSyncedData();
    }
  }

  @override
  Widget build(BuildContext context) {
    final tabs = [
      HomeTab(onTabChange: _onTabChange),
      const LearnTab(),
      const LeaderboardTab(),
      const ProfileTab(),
    ];

    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: tabs,
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: _onTabChange,
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.home_outlined),
            selectedIcon: Icon(Icons.home),
            label: 'Ana Sayfa',
          ),
          NavigationDestination(
            icon: Icon(Icons.school_outlined),
            selectedIcon: Icon(Icons.school),
            label: 'Öğren',
          ),
          NavigationDestination(
            icon: Icon(Icons.leaderboard_outlined),
            selectedIcon: Icon(Icons.leaderboard),
            label: 'Sıralama',
          ),
          NavigationDestination(
            icon: Icon(Icons.person_outline),
            selectedIcon: Icon(Icons.person),
            label: 'Profil',
          ),
        ],
      ),
    );
  }
}
