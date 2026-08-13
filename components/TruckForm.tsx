import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { FUEL_TYPES, TRUCK_STATUSES } from "@/lib/truck-meta";
import type { FuelType, TruckFormValues, TruckStatus } from "@/types";

interface TruckFormProps {
  initialValues?: TruckFormValues;
  submitLabel: string;
  onSubmit: (values: TruckFormValues) => void;
}

interface FormState {
  plateNumber: string;
  color: string;
  fuelType: FuelType;
  mileage: string;
  status: TruckStatus;
  nextOilChangeMileage: string;
}

type FieldErrors = Partial<Record<keyof TruckFormValues, string>>;

const EMPTY_FORM: FormState = {
  plateNumber: "",
  color: "",
  fuelType: "Diesel",
  mileage: "",
  status: "En service",
  nextOilChangeMileage: "",
};

function toFormState(values: TruckFormValues): FormState {
  return {
    plateNumber: values.plateNumber,
    color: values.color,
    fuelType: values.fuelType,
    mileage: String(values.mileage),
    status: values.status,
    nextOilChangeMileage: String(values.nextOilChangeMileage),
  };
}

function parseMileage(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed === "") return null;
  if (!/^\d+$/.test(trimmed)) return null;
  return Number(trimmed);
}

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {};
  if (form.plateNumber.trim() === "") errors.plateNumber = "La plaque d'immatriculation est requise.";
  if (form.color.trim() === "") errors.color = "La couleur est requise.";
  if (parseMileage(form.mileage) === null) errors.mileage = "Kilométrage invalide (nombre ≥ 0).";
  if (parseMileage(form.nextOilChangeMileage) === null)
    errors.nextOilChangeMileage = "Kilométrage invalide (nombre ≥ 0).";
  return errors;
}

function ErrorText({ message }: { message?: string }) {
  if (!message) return null;
  return <Text className="mt-1 text-xs text-red-600">{message}</Text>;
}

interface TextFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  placeholder?: string;
  keyboardType?: "default" | "numeric";
}

function TextField({ label, value, onChangeText, error, placeholder, keyboardType }: TextFieldProps) {
  return (
    <View>
      <Text className="mb-1 mt-3 text-sm font-medium text-foreground">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#83827d"
        keyboardType={keyboardType}
        className={`rounded-md border bg-background px-3 py-2 text-foreground ${error ? "border-red-500" : "border-input"}`}
      />
      <ErrorText message={error} />
    </View>
  );
}

interface ChoiceGroupProps<T extends string> {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
}

function ChoiceGroup<T extends string>({ label, value, options, onChange }: ChoiceGroupProps<T>) {
  return (
    <View>
      <Text className="mb-1 mt-3 text-sm font-medium text-foreground">{label}</Text>
      <View className="flex-row gap-2">
        {options.map((option) => {
          const selected = option === value;
          return (
            <Pressable
              key={option}
              onPress={() => onChange(option)}
              className={`flex-1 rounded-md px-2 py-2 ${selected ? "bg-primary" : "bg-secondary"}`}
            >
              <Text
                className={`text-center text-sm font-medium ${selected ? "text-primary-foreground" : "text-secondary-foreground"}`}
              >
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function TruckForm({ initialValues, submitLabel, onSubmit }: TruckFormProps) {
  const [form, setForm] = useState<FormState>(() =>
    initialValues ? toFormState(initialValues) : EMPTY_FORM,
  );
  const [errors, setErrors] = useState<FieldErrors>({});

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const handleSubmit = () => {
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    const mileage = parseMileage(form.mileage);
    const nextOilChangeMileage = parseMileage(form.nextOilChangeMileage);
    if (mileage === null || nextOilChangeMileage === null) return;
    onSubmit({
      plateNumber: form.plateNumber.trim(),
      color: form.color.trim(),
      fuelType: form.fuelType,
      mileage,
      status: form.status,
      nextOilChangeMileage,
    });
  };

  return (
    <ScrollView className="flex-1" contentContainerClassName="p-4">
      <TextField
        label="Plaque d'immatriculation"
        value={form.plateNumber}
        onChangeText={(text) => setField("plateNumber", text)}
        error={errors.plateNumber}
        placeholder="Ex : AB-123-CD"
      />
      <TextField
        label="Couleur"
        value={form.color}
        onChangeText={(text) => setField("color", text)}
        error={errors.color}
        placeholder="Ex : Rouge"
      />
      <ChoiceGroup
        label="Carburant"
        value={form.fuelType}
        options={FUEL_TYPES}
        onChange={(value) => setField("fuelType", value)}
      />
      <TextField
        label="Kilométrage (km)"
        value={form.mileage}
        onChangeText={(text) => setField("mileage", text)}
        error={errors.mileage}
        keyboardType="numeric"
      />
      <ChoiceGroup
        label="Statut"
        value={form.status}
        options={TRUCK_STATUSES}
        onChange={(value) => setField("status", value)}
      />
      <TextField
        label="Prochaine vidange (km)"
        value={form.nextOilChangeMileage}
        onChangeText={(text) => setField("nextOilChangeMileage", text)}
        error={errors.nextOilChangeMileage}
        keyboardType="numeric"
      />
      <Pressable onPress={handleSubmit} className="mt-6 rounded-md bg-primary py-3">
        <Text className="text-center font-semibold text-primary-foreground">{submitLabel}</Text>
      </Pressable>
    </ScrollView>
  );
}
