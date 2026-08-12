# Convoy — Technical Spec

## Overview

**Convoy** (renamed from TruckTracker) is a React Native (Expo) mobile app for a small transport fleet owner to track truck status from their phone: which trucks are **in service**, **stopped**, or **in maintenance**, plus their specs (color, fuel type, mileage, next oil change).

**Goal:** go deep on:

- Tab Navigator
- Nested Stack Navigator (one per tab)
- Cross-screen state sharing via Context API
- In-memory CRUD

---

## ⏱️ Timeline

|                  |                                                       |
| ---------------- | ----------------------------------------------------- |
| Mode             | Individual                                            |
| Duration         | 5 days                                                |
| Start            | 10/08/2026                                            |
| **Deadline**     | **14/08/2026, 18:00 — late submissions not accepted** |
| Last GitHub push | Sunday before 23:59                                   |

---

## Stack & Constraints

| Constraint       | Rule                                                                                                     |
| ---------------- | -------------------------------------------------------------------------------------------------------- |
| Language         | TypeScript everywhere, no `.js` files, no `any`                                                          |
| UI               | Native RN components only — no external UI libs                                                          |
| Navigation       | React Navigation: Tab Navigator + nested Stack per tab                                                   |
| State            | Single `TrucksContext` — **all CRUD goes through it**, no direct array manipulation in screen components |
| Data             | In-memory only, seeded from `data/data.ts`                                                               |
| Folder structure | `components/`, `context/`, `screens/`, `types/`                                                          |

---

## Folder Structure

```
src/
├── components/
│   ├── TruckCard.tsx
│   ├── StatusBadge.tsx
│   ├── OilChangeBadge.tsx
│   └── TruckForm.tsx
├── context/
│   └── TrucksContext.tsx
├── screens/
│   ├── TruckListScreen.tsx
│   ├── TruckDetailScreen.tsx
│   └── TruckFormScreen.tsx        # shared for Add + Edit
├── navigation/
│   ├── TabNavigator.tsx
│   └── TruckStackNavigator.tsx    # instantiated per tab
├── types/
│   └── index.ts
└── App.tsx
```

---

## Data Model

```ts
// types/index.ts
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

// Bonus 3 — status change log
export interface StatusChangeEntry {
  truckId: string;
  from: TruckStatus;
  to: TruckStatus;
  timestamp: string; // ISO
}
```

> Status/fuel values kept in French to match the brief — rename if the UI should be English.

**Derived logic (feature 7):** a truck needs an oil-change alert when `mileage >= nextOilChangeMileage`. No extra field — compute this wherever a truck is rendered (helper function, not stored state).

---

## Context API — `TrucksContext`

```ts
interface TrucksContextValue {
  trucks: Truck[];
  addTruck: (truck: Omit<Truck, "id">) => void;
  updateTruck: (id: string, updatedData: Partial<Truck>) => void;
  deleteTruck: (id: string) => void;
  changeStatus: (id: string, newStatus: TruckStatus) => void;
  // Bonus 3
  statusHistory: StatusChangeEntry[];
}
```

- Single source of truth — tabs only **filter** `trucks` by status, they never own data.
- `changeStatus` should also push an entry to `statusHistory` if you're doing Bonus 3.
- No screen component should call `setTrucks` directly or mutate the array — always go through these methods.

---

## Navigation Structure

```
TabNavigator
├── "En service" tab   → Stack: List → Detail → Form (add/edit)
├── "À l'arrêt" tab    → Stack: List → Detail → Form (add/edit)
└── "En maintenance"   → Stack: List → Detail → Form (add/edit)
```

- Each tab's Stack is independent for navigation history, but all read from the same `TrucksContext`.
- Screen-to-screen navigation passes a truck **`id`** as a route param — the full object is looked up from Context, never passed directly through params (keeps Context as single source of truth and avoids stale data).

---

## Task Breakdown

### T1 — Context + Data Layer (foundation, do this first)

- [ ] Define `Truck` type and `TruckStatus`/`FuelType` unions in `types/index.ts`
- [ ] Seed `data/data.ts` with a handful of starting trucks (mix of all 3 statuses, some with mileage past their oil-change threshold)
- [ ] Build `TrucksContext` + provider exposing `trucks`, `addTruck`, `updateTruck`, `deleteTruck`, `changeStatus`
- [ ] Wrap `App.tsx` in `TrucksProvider`

**Acceptance:** any screen can read `trucks` via `useContext`/custom hook; no `any`; array never mutated in place.

---

### T2 — Tab + Nested Stack Navigation

- [ ] Install & configure React Navigation (bottom tabs + native stack)
- [ ] Build `TabNavigator` with 3 tabs: **En service / À l'arrêt / En maintenance**
- [ ] Give each tab its own `Stack.Navigator` with routes: `List`, `Detail`, `Form`
- [ ] Type your navigation params (`RootStackParamList` per stack, no `any` in navigation props)

**Acceptance:** tapping between tabs works; each tab keeps its own stack history independently.

---

### T3 — Truck List per Tab (feature 1)

- [ ] Build `TruckCard` component: plate number, color (swatch or text), fuel type, mileage, oil-change alert badge
- [ ] Build `StatusBadge`/color-coding helper: 🟢 En service · 🟠 À l'arrêt · 🔴 En maintenance
- [ ] Build `OilChangeBadge` — renders only when `mileage >= nextOilChangeMileage`
- [ ] Each `List` screen filters `trucks` from Context by its own tab's status and renders a list of `TruckCard`

**Acceptance:** each tab shows only its trucks; oil-change badge appears correctly; cards visually differ by status color.

---

### T4 — Truck Detail Screen (feature 2)

- [ ] Tapping a `TruckCard` navigates to `Detail` with `{ truckId: id }` as param
- [ ] `Detail` screen looks up the truck from Context by `id` (handle "truck not found" — see Error Handling below)
- [ ] Display all fields: plate, color, fuel type, mileage, status, next oil-change mileage
- [ ] Add **Modifier** and **Supprimer** buttons

**Acceptance:** detail always reflects current Context state (e.g. edited elsewhere → detail updates); missing-id case handled gracefully.

---

### T5 — Add Truck (feature 3)

- [ ] Build reusable `TruckForm` component (used for both add and edit)
- [ ] Add a **"+"** button on each list screen navigating to `Form` in "create" mode
- [ ] Fields: plate number, color, fuel type, initial mileage, initial status, next-oil-change mileage
- [ ] Validate before submit:
  - Required fields non-empty
  - Mileage fields are valid numbers (and probably ≥ 0)
- [ ] On submit → `addTruck(...)` → navigate to the list matching the chosen status

**Acceptance:** invalid form blocks submission with visible field-level errors; valid submission redirects to the correct tab's list.

---

### T6 — Edit Truck (feature 4)

- [ ] From `Detail`, **Modifier** navigates to `Form` in "edit" mode, pre-filled with the truck's current data
- [ ] Reuse the same validation as T5
- [ ] On submit → `updateTruck(id, ...)` → navigate back to the updated `Detail` screen

**Acceptance:** form pre-fills correctly; saved changes are immediately visible on Detail.

---

### T7 — Change Status + Sync Across Tabs (feature 5)

- [ ] On `Detail`, add a status selector/button group to change the truck's status
- [ ] On change → call `changeStatus(id, newStatus)`
- [ ] Confirm that because all tabs read from the same Context array, the truck **automatically disappears from its old tab's list and appears in the new one** — no manual refresh/reload logic needed

**Acceptance:** changing status on Detail instantly moves the truck to the correct tab, verified by switching tabs without any pull-to-refresh or remount.

---

### T8 — Delete Truck (feature 6)

- [ ] On `Detail`, **Supprimer** button triggers a confirmation (e.g. `Alert.alert` with Cancel/Confirm)
- [ ] On confirm → `deleteTruck(id)` → navigate back to that tab's list

**Acceptance:** truck is removed from Context and list; confirmation prevents accidental deletion; no crash if user cancels.

---

## Bonus Tasks (optional, in priority order)

- [ ] **Bonus 1 — Sort by mileage:** add ascending/descending sort control on each list screen (local UI state, doesn't touch Context)
- [ ] **Bonus 2 — Tab counters:** show truck count per status on tab labels, e.g. `"En service (4)"` — derive from `trucks.filter(...)`, don't store separately
- [ ] **Bonus 3 — Status change history:** extend Context with `statusHistory: StatusChangeEntry[]`, append an entry inside `changeStatus`, and render a simple log list on the Detail screen

---

## Error Handling Checklist

- [ ] Form validation errors are shown per-field, not just a generic alert
- [ ] Detail/Form screens handle a truck `id` that no longer exists in Context (e.g. deleted from another screen) — show a fallback message or navigate back, don't crash
- [ ] Numeric fields reject non-numeric input before allowing submit

---

## Definition of Done

- [ ] Tab Navigator + nested Stack Navigator working correctly in all 3 tabs
- [ ] Full CRUD functional (add / edit / delete) exclusively through `TrucksContext`
- [ ] Status change syncs instantly across tabs via Context (no manual reload)
- [ ] Form validation in place with visible errors
- [ ] No `any`, no `.js` files, no external UI libraries
- [ ] Folder structure: `components/`, `context/`, `screens/`, `types/` (+ `navigation/`)
- [ ] Runs cleanly via `expo start`, no TypeScript errors

---

## Deliverables

- [ ] Figma link
- [ ] Trello (planning) link
- [ ] GitHub repo link — final push by **Sunday 23:59**, submission by **14/08 18:00**
