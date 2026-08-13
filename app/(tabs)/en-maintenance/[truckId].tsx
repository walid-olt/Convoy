import { useLocalSearchParams } from "expo-router";
import type { TruckDetailParams } from "@/navigation/types";
import { TruckDetailScreen } from "@/screens/TruckDetailScreen";

export default function MaintenanceTruckDetail() {
  const { truckId } = useLocalSearchParams<TruckDetailParams>();
  return <TruckDetailScreen truckId={truckId} tab="en-maintenance" />;
}
