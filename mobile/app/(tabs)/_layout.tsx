// Alt tab navigatörü — iPhone 11 safe area optimized

import { Tabs } from 'expo-router';
import { Platform, StyleSheet, Text, View } from 'react-native';

function TabIcon({
  emoji,
  label,
  focused,
}: {
  emoji: string;
  label: string;
  focused: boolean;
}) {
  return (
    <View style={[styles.iconWrapper, focused && styles.iconWrapperFocused]}>
      <Text style={[styles.emoji, focused && styles.emojiFocused]}>{emoji}</Text>
      <Text style={[styles.label, focused && styles.labelFocused]}>{label}</Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Ana Sayfa',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🏠" label="Ana Sayfa" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Öğren',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="📚" label="Öğren" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="mentor"
        options={{
          title: 'AI Mentor',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="👻" label="Mentor" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Sıralama',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🏆" label="Sıralama" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="👤" label="Profil" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#0F0F1A',
    borderTopColor: '#1E1E30',
    borderTopWidth: 1,
    // iPhone 11 home indicator safe area (34pt) is handled by expo-router
    height: Platform.OS === 'ios' ? 82 : 64,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 20,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 52,
  },
  iconWrapperFocused: {
    backgroundColor: 'rgba(124,58,237,0.12)',
  },
  emoji: {
    fontSize: 20,
    opacity: 0.6,
  },
  emojiFocused: {
    opacity: 1,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
  },
  labelFocused: {
    color: '#A78BFA',
    fontWeight: '700',
  },
});
