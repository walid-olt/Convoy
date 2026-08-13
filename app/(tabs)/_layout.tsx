import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import type { TruckTab } from "@/lib/truck-meta";
import { useTrucksStore } from "@/store/trucks-store";
import type { TruckStatus } from "@/types";

interface TabConfig {
  status: TruckStatus;
  name: TruckTab;
  icon: keyof typeof FontAwesome.glyphMap;
}

const TABS: TabConfig[] = [
  { status: "En service", name: "en-service", icon: "truck" },
  { status: "À l'arrêt", name: "a-l-arret", icon: "pause-circle" },
  { status: "En maintenance", name: "en-maintenance", icon: "wrench" },
];

export default function TabLayout() {
  const trucks = useTrucksStore((state) => state.trucks);
  const countFor = (status: TruckStatus) => trucks.filter((truck) => truck.status === status).length;

  return (
    <Tabs
      initialRouteName="en-service"
      screenOptions={{ tabBarActiveTintColor: "#c96442" }}
    >
      {TABS.map(({ status, name, icon }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title: status,
            tabBarLabel: `${status} (${countFor(status)})`,
            headerShown: false,
            tabBarIcon: ({ color }) => <FontAwesome size={22} name={icon} color={color} />,
          }}
        />
      ))}
      <Tabs.Screen name="index" options={{ href: null }} />
    </Tabs>
  );
}
