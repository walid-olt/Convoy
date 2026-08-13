import { Text, View } from "react-native";
import { STATUS_BADGE_CLASSES, STATUS_COLORS } from "@/lib/truck-meta";
import type { TruckStatus } from "@/types";

export function StatusBadge({ status }: { status: TruckStatus }) {
  return (
    <View className={`flex-row items-center gap-1.5 rounded-full px-2.5 py-1 ${STATUS_BADGE_CLASSES[status]}`}>
      <View
        style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: STATUS_COLORS[status] }}
      />
      <Text className="text-xs font-medium">{status}</Text>
    </View>
  );
}
