import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, StyleSheet, View, Platform, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MoodDiaryScreen } from '../screens/MoodDiaryScreen';
import { EmotionsScreen } from '../screens/EmotionsScreen';
import { MyBunnyScreen } from '../screens/MyBunnyScreen';
import { FriendsScreen } from '../screens/FriendsScreen';
import { StatisticsScreen } from '../screens/StatisticsScreen';
import { usePalette } from '../theme/ThemeContext';
import { MainTabParamList, RootNavProp } from '../types/navigation';
import { fs, ms, pick } from '../utils/responsive';
import { FontWeight } from '../theme/spacing';

const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_META: Record<keyof MainTabParamList, { icon: string; label: string }> = {
  Mood: { icon: '📔', label: 'Mood' },
  Emotions: { icon: '🎯', label: 'Emotions' },
  MyBunny: { icon: '🐰', label: 'Bunny' },
  Friends: { icon: '👥', label: 'Friends' },
  Stats: { icon: '📊', label: 'Stats' },
};

function HeaderRight() {
  const navigation = useNavigation<RootNavProp>();
  const palette = usePalette();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Settings')}
      style={[
        styles.headerBtn,
        { backgroundColor: palette.card, borderColor: palette.cardBorder },
      ]}
      activeOpacity={0.75}
    >
      <Text style={{ fontSize: fs(16) }}>⚙️</Text>
    </TouchableOpacity>
  );
}

export function MainTabNavigator() {
  const palette = usePalette();
  const tabHeight = pick({ xs: 64, sm: 68, md: 74, lg: 78 }, 72);
  const bottomOffset = Platform.OS === 'ios' ? 16 : 14;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: palette.tabActive,
        tabBarInactiveTintColor: palette.tabInactive,
        tabBarStyle: [
          styles.tabBar,
          {
            height: tabHeight,
            bottom: bottomOffset,
            backgroundColor: palette.tabBackground,
            borderColor: palette.tabBorder,
            shadowColor: palette.shadow,
          },
        ],
        tabBarLabelStyle: {
          fontSize: fs(10),
          fontWeight: FontWeight.semibold as any,
          marginTop: 2,
        },
        tabBarIcon: ({ focused }) => {
          const meta = TAB_META[route.name as keyof MainTabParamList];
          return (
            <View
              style={[
                styles.iconWrap,
                focused && { backgroundColor: palette.pinkSoft },
              ]}
            >
              <Text style={{ fontSize: fs(focused ? 20 : 18) }}>{meta.icon}</Text>
            </View>
          );
        },
        tabBarLabel: TAB_META[route.name as keyof MainTabParamList].label,
      })}
    >
      <Tab.Screen name="Mood" component={MoodDiaryScreen} />
      <Tab.Screen name="Emotions" component={EmotionsScreen} />
      <Tab.Screen name="MyBunny" component={MyBunnyScreen} />
      <Tab.Screen name="Friends" component={FriendsScreen} />
      <Tab.Screen name="Stats" component={StatisticsScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    borderTopWidth: 0,
    borderWidth: 1,
    borderRadius: 22,
    paddingTop: 8,
    paddingBottom: 8,
    elevation: 10,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  iconWrap: {
    width: 36,
    height: 30,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});
