import { Tabs } from 'expo-router';
import { Bus, MapPin } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Buses',
          tabBarIcon: ({ size, color }) => (
            <Bus size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="stops"
        options={{
          title: 'Stops',
          tabBarIcon: ({ size, color }) => (
            <MapPin size={size} color={color} />
          ),
        }}
      />
       {/* Hides dynamic bus/[id] from appearing in the tab bar */}
       <Tabs.Screen name="bus/[id]" options={{ href: null }} />
       <Tabs.Screen name="stops/[id]" options={{ href: null }} />
    </Tabs>
  );
}