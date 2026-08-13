import type { FuelType, Truck, TruckStatus } from "@/types";

export type TruckTab = "en-service" | "a-l-arret" | "en-maintenance";

export const TRUCK_STATUSES: TruckStatus[] = ["En service", "À l'arrêt", "En maintenance"];

export const FUEL_TYPES: FuelType[] = ["Diesel", "Essence", "Électrique", "Hybride"];

export const STATUS_TAB: Record<TruckStatus, TruckTab> = {
  "En service": "en-service",
  "À l'arrêt": "a-l-arret",
  "En maintenance": "en-maintenance",
};

export const STATUS_COLORS: Record<TruckStatus, string> = {
  "En service": "#22c55e",
  "À l'arrêt": "#f59e0b",
  "En maintenance": "#ef4444",
};

export const STATUS_BADGE_CLASSES: Record<TruckStatus, string> = {
  "En service": "bg-emerald-100 text-emerald-800",
  "À l'arrêt": "bg-amber-100 text-amber-800",
  "En maintenance": "bg-red-100 text-red-800",
};

const COLOR_SWATCHES: Record<string, string> = {
  Blanc: "#f8fafc",
  Rouge: "#ef4444",
  Bleu: "#3b82f6",
  Vert: "#22c55e",
  Gris: "#9ca3af",
  Noir: "#1f2937",
  Jaune: "#eab308",
  Orange: "#f97316",
};

export function colorSwatch(color: string): string {
  return COLOR_SWATCHES[color] ?? "#94a3b8";
}

export function needsOilChange(truck: Pick<Truck, "mileage" | "nextOilChangeMileage">): boolean {
  return truck.mileage >= truck.nextOilChangeMileage;
}

export function formatDate(iso: string): string {
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
