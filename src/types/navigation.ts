import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Main: undefined;
  Settings: undefined;
  Saved: undefined;
};

export type MainTabParamList = {
  Mood: undefined;
  Emotions: undefined;
  MyBunny: undefined;
  Friends: undefined;
  Stats: undefined;
};

export type RootNavProp = NativeStackNavigationProp<RootStackParamList>;

export type TabNavProp = BottomTabNavigationProp<MainTabParamList>;

export type AppNavProp = CompositeNavigationProp<TabNavProp, RootNavProp>;
