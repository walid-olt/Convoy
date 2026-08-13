import { router } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { TruckCard } from "@/components/TruckCard";
import { STATUS_TAB } from "@/lib/truck-meta";
import { useTrucksStore } from "@/store/trucks-store";
import type { TruckStatus } from "@/types";

type SortOrder = "asc" | "desc";

interface TruckListScreenProps {
  status: TruckStatus;
}

export function TruckListScreen({ status }: TruckListScreenProps) {
  const trucks = useTrucksStore((state) => state.trucks);
  const [order, setOrder] = useState<SortOrder>("asc");
  const tab = STATUS_TAB[status];

  const visibleTrucks = useMemo(() => {
    const filtered = trucks.filter((truck) => truck.status === status);
    return [...filtered].sort((a, b) =>
      order === "asc" ? a.mileage - b.mileage : b.mileage - a.mileage,
    );
  }, [trucks, status, order]);

  return (
    <View className="flex-1 bg-background">
      <View className="flex-row items-center justify-between px-4 pb-2 pt-3">
        <Text className="text-sm text-muted-foreground">
          {visibleTrucks.length} camion{visibleTrucks.length > 1 ? "s" : ""}
        </Text>
        <Pressable
          onPress={() => setOrder((current) => (current === "asc" ? "desc" : "asc"))}
          className="rounded-md border border-border bg-secondary px-3 py-1.5"
        >
          <Text className="text-xs font-medium text-secondary-foreground">
            Kilométrage {order === "asc" ? "↑" : "↓"}
          </Text>
        </Pressable>
      </View>
      <FlatList
        data={visibleTrucks}
        keyExtractor={(truck) => truck.id}
        contentContainerClassName="px-4 pb-24"
        ListEmptyComponent={
          <Text className="mt-10 text-center text-muted-foreground">
            Aucun camion dans cette catégorie.
          </Text>
        }
        renderItem={({ item }) => (
          <TruckCard
            truck={item}
            onPress={() =>
              router.push({
                pathname: `/${tab}/[truckId]`,
                params: { truckId: item.id },
              })
            }
          />
        )}
      />
      <Pressable
        onPress={() => router.push(`/${tab}/form`)}
        className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg"
      >
        <Text className="text-2xl font-bold text-primary-foreground">+</Text>
      </Pressable>
    </View>
  );
}
