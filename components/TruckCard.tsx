import { Pressable, Text, View } from "react-native";
import { OilChangeBadge } from "@/components/OilChangeBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { colorSwatch } from "@/lib/truck-meta";
import type { Truck } from "@/types";

interface TruckCardProps {
  truck: Truck;
  onPress: () => void;
}

export function TruckCard({ truck, onPress }: TruckCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="mb-3 rounded-lg border border-border bg-card p-4 active:opacity-70"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <View
            style={{ width: 14, height: 14, borderRadius: 4, backgroundColor: colorSwatch(truck.color) }}
          />
          <Text className="text-base font-semibold text-card-foreground">{truck.plateNumber}</Text>
        </View>
        <StatusBadge status={truck.status} />
      </View>
      <View className="mt-3 flex-row flex-wrap gap-x-4 gap-y-1">
        <Text className="text-sm text-muted-foreground">Couleur : {truck.color}</Text>
        <Text className="text-sm text-muted-foreground">Carburant : {truck.fuelType}</Text>
        <Text className="text-sm text-muted-foreground">{truck.mileage} km</Text>
      </View>
      <View className="mt-2">
        <OilChangeBadge truck={truck} />
      </View>
    </Pressable>
  );
}
