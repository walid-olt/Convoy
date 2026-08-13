import { router, Stack } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { TruckForm } from "@/components/TruckForm";
import { STATUS_TAB } from "@/lib/truck-meta";
import { useTrucksStore } from "@/store/trucks-store";
import type { TruckFormValues } from "@/types";

interface TruckFormScreenProps {
  truckId?: string;
}

export function TruckFormScreen({ truckId }: TruckFormScreenProps) {
  const truck = useTrucksStore((state) => state.trucks.find((t) => t.id === truckId));
  const addTruck = useTrucksStore((state) => state.addTruck);
  const updateTruck = useTrucksStore((state) => state.updateTruck);

  if (truckId && !truck) {
    return (
      <View className="flex-1 items-center justify-center bg-background p-6">
        <Stack.Screen options={{ title: "Camion" }} />
        <Text className="mb-4 text-center text-muted-foreground">Ce camion n'existe plus.</Text>
        <Pressable onPress={() => router.back()} className="rounded-md bg-primary px-4 py-2">
          <Text className="font-medium text-primary-foreground">Retour</Text>
        </Pressable>
      </View>
    );
  }

  const initialValues: TruckFormValues | undefined = truck
    ? {
        plateNumber: truck.plateNumber,
        color: truck.color,
        fuelType: truck.fuelType,
        mileage: truck.mileage,
        status: truck.status,
        nextOilChangeMileage: truck.nextOilChangeMileage,
      }
    : undefined;

  const handleSubmit = (values: TruckFormValues) => {
    if (truckId && truck) {
      updateTruck(truckId, values);
      router.back();
    } else {
      addTruck(values);
      router.replace(`/${STATUS_TAB[values.status]}`);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen options={{ title: truckId ? "Modifier le camion" : "Nouveau camion" }} />
      <TruckForm
        initialValues={initialValues}
        submitLabel={truckId ? "Enregistrer" : "Ajouter le camion"}
        onSubmit={handleSubmit}
      />
    </View>
  );
}
