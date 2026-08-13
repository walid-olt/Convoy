import { router, Stack } from "expo-router";
import { useMemo } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { OilChangeBadge } from "@/components/OilChangeBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDate, STATUS_TAB, TRUCK_STATUSES, colorSwatch } from "@/lib/truck-meta";
import type { TruckTab } from "@/lib/truck-meta";
import { useTrucksStore } from "@/store/trucks-store";

interface TruckDetailScreenProps {
  truckId: string;
  tab: TruckTab;
}

export function TruckDetailScreen({ truckId, tab }: TruckDetailScreenProps) {
  const truck = useTrucksStore((state) => state.trucks.find((t) => t.id === truckId));
  const changeStatus = useTrucksStore((state) => state.changeStatus);
  const deleteTruck = useTrucksStore((state) => state.deleteTruck);
  const statusHistory = useTrucksStore((state) => state.statusHistory);
  const truckHistory = useMemo(
    () => statusHistory.filter((entry) => entry.truckId === truckId),
    [statusHistory, truckId],
  );

  if (!truck) {
    return (
      <View className="flex-1 items-center justify-center bg-background p-6">
        <Stack.Screen options={{ title: "Détails" }} />
        <Text className="mb-4 text-center text-muted-foreground">Ce camion n'existe plus.</Text>
        <Pressable onPress={() => router.back()} className="rounded-md bg-primary px-4 py-2">
          <Text className="font-medium text-primary-foreground">Retour</Text>
        </Pressable>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert("Supprimer le camion", `${truck.plateNumber} sera définitivement supprimé.`, [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: () => {
          deleteTruck(truck.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="p-4">
      <Stack.Screen options={{ title: truck.plateNumber }} />
      <View className="flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-foreground">{truck.plateNumber}</Text>
        <StatusBadge status={truck.status} />
      </View>

      <View className="mt-4 rounded-lg border border-border bg-card p-4">
        <View className="flex-row items-center justify-between py-1.5">
          <Text className="text-sm text-muted-foreground">Couleur</Text>
          <View className="flex-row items-center gap-2">
            <View
              style={{
                width: 14,
                height: 14,
                borderRadius: 4,
                backgroundColor: colorSwatch(truck.color),
              }}
            />
            <Text className="text-sm font-medium text-card-foreground">{truck.color}</Text>
          </View>
        </View>
        <View className="flex-row items-center justify-between py-1.5">
          <Text className="text-sm text-muted-foreground">Carburant</Text>
          <Text className="text-sm font-medium text-card-foreground">{truck.fuelType}</Text>
        </View>
        <View className="flex-row items-center justify-between py-1.5">
          <Text className="text-sm text-muted-foreground">Kilométrage</Text>
          <Text className="text-sm font-medium text-card-foreground">{truck.mileage} km</Text>
        </View>
        <View className="flex-row items-center justify-between py-1.5">
          <Text className="text-sm text-muted-foreground">Prochaine vidange</Text>
          <Text className="text-sm font-medium text-card-foreground">
            {truck.nextOilChangeMileage} km
          </Text>
        </View>
        <View className="mt-2">
          <OilChangeBadge truck={truck} />
        </View>
      </View>

      <Text className="mb-2 mt-6 text-sm font-semibold text-foreground">Changer le statut</Text>
      <View className="flex-row gap-2">
        {TRUCK_STATUSES.map((status) => {
          const selected = status === truck.status;
          return (
            <Pressable
              key={status}
              onPress={() => changeStatus(truck.id, status)}
              className={`flex-1 rounded-md px-2 py-2 ${selected ? "bg-primary" : "bg-secondary"}`}
            >
              <Text
                className={`text-center text-xs font-medium ${selected ? "text-primary-foreground" : "text-secondary-foreground"}`}
              >
                {status}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View className="mt-6 flex-row gap-3">
        <Pressable
          onPress={() =>
            router.push({ pathname: `/${tab}/form`, params: { truckId: truck.id } })
          }
          className="flex-1 rounded-md bg-primary px-4 py-3"
        >
          <Text className="text-center font-medium text-primary-foreground">Modifier</Text>
        </Pressable>
        <Pressable
          onPress={handleDelete}
          className="flex-1 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3"
        >
          <Text className="text-center font-medium text-destructive">Supprimer</Text>
        </Pressable>
      </View>

      {truckHistory.length > 0 && (
        <View className="mt-6">
          <Text className="mb-2 text-sm font-semibold text-foreground">Historique des statuts</Text>
          {truckHistory.map((entry) => (
            <View
              key={entry.timestamp}
              className="mb-2 rounded-md border border-border bg-card p-3"
            >
              <Text className="text-sm text-card-foreground">
                {entry.from} → {entry.to}
              </Text>
              <Text className="mt-0.5 text-xs text-muted-foreground">
                {formatDate(entry.timestamp)}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
