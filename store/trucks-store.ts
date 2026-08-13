import { create } from "zustand";
import { seedTrucks } from "@/data/data";
import type { StatusChangeEntry, Truck, TruckStatus } from "@/types";

interface TrucksStore {
  trucks: Truck[];
  statusHistory: StatusChangeEntry[];
  addTruck: (truck: Omit<Truck, "id">) => void;
  updateTruck: (id: string, updatedData: Partial<Truck>) => void;
  deleteTruck: (id: string) => void;
  changeStatus: (id: string, newStatus: TruckStatus) => void;
}

const nextId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const useTrucksStore = create<TrucksStore>((set) => ({
  trucks: seedTrucks,
  statusHistory: [],

  addTruck: (truck) =>
    set((state) => ({
      trucks: [...state.trucks, { ...truck, id: nextId() }],
    })),

  updateTruck: (id, updatedData) =>
    set((state) => {
      const existing = state.trucks.find((truck) => truck.id === id);
      if (!existing) return state;
      const updated = { ...existing, ...updatedData };
      const historyEntry =
        existing.status === updated.status
          ? []
          : [
              {
                truckId: id,
                from: existing.status,
                to: updated.status,
                timestamp: new Date().toISOString(),
              },
            ];
      return {
        trucks: state.trucks.map((truck) => (truck.id === id ? updated : truck)),
        statusHistory: [...state.statusHistory, ...historyEntry],
      };
    }),

  deleteTruck: (id) =>
    set((state) => ({
      trucks: state.trucks.filter((truck) => truck.id !== id),
    })),

  changeStatus: (id, newStatus) =>
    set((state) => {
      const existing = state.trucks.find((truck) => truck.id === id);
      if (!existing || existing.status === newStatus) return state;
      return {
        trucks: state.trucks.map((truck) =>
          truck.id === id ? { ...truck, status: newStatus } : truck,
        ),
        statusHistory: [
          ...state.statusHistory,
          {
            truckId: id,
            from: existing.status,
            to: newStatus,
            timestamp: new Date().toISOString(),
          },
        ],
      };
    }),
}));
