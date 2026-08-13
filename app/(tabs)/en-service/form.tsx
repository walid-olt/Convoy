import { useLocalSearchParams } from "expo-router";
import type { TruckFormParams } from "@/navigation/types";
import { TruckFormScreen } from "@/screens/TruckFormScreen";

export default function EnServiceForm() {
  const { truckId } = useLocalSearchParams<TruckFormParams>();
  return <TruckFormScreen truckId={truckId} />;
}
