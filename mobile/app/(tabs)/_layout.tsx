import { Tabs } from 'expo-router';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function TabIcon({
  name,
  label,
  focused,
}: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  focused: boolean;
}) {
  return (
    <View style={[styles.iconWrapper, focused && styles.iconWrapperFocused]}>
      <Ionicons name={name} size={22} color={focused ? '#A78BFA' : '#4B5563'} />
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
            <TabIcon name={focused ? 'home' : 'home-outline'} label="Ana Sayfa" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Öğren',
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'book' : 'book-outline'} label="Öğren" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="mentor"
        options={{
          title: 'Mentor',
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'sparkles' : 'sparkles-outline'} label="Mentor" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Sıralama',
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'trophy' : 'trophy-outline'} label="Sıralama" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'person' : 'person-outline'} label="Profil" focused={focused} />
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
    height: Platform.OS === 'ios' ? 82 : 64,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
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
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4B5563',
  },
  labelFocused: {
    color: '#A78BFA',
    fontWeight: '700',
  },
});
