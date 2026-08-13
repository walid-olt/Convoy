import { Stack } from "expo-router";

export default function EnServiceLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#faf9f5" },
        headerTintColor: "#3d3929",
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: "En service" }} />
      <Stack.Screen name="[truckId]" options={{ title: "Détails" }} />
      <Stack.Screen name="form" options={{ title: "Camion" }} />
    </Stack>
  );
}
