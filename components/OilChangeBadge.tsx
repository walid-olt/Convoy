import { Text, View } from "react-native";
import { needsOilChange } from "@/lib/truck-meta";
import type { Truck } from "@/types";

export function OilChangeBadge({
  truck,
}: {
  truck: Pick<Truck, "mileage" | "nextOilChangeMileage">;
}) {
  if (!needsOilChange(truck)) return null;
  return (
    <View className="self-start rounded-md bg-red-500/10 px-2 py-0.5">
      <Text className="text-xs font-semibold text-red-700">Vidange due</Text>
    </View>
  );
}
