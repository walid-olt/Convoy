export type TruckStatus = "En service" | "À l'arrêt" | "En maintenance";
export type FuelType = "Diesel" | "Essence" | "Électrique" | "Hybride";

export interface Truck {
  id: string;
  plateNumber: string;
  color: string;
  fuelType: FuelType;
  mileage: number;
  status: TruckStatus;
  nextOilChangeMileage: number;
}

export type TruckFormValues = Omit<Truck, "id">;

export interface StatusChangeEntry {
  truckId: string;
  from: TruckStatus;
  to: TruckStatus;
  timestamp: string;
}
