export type GuestType = "family" | "friend";

export type GuestStatus = "pending" | "invited" | "rejected";

type inviters = [
  "إلياس",
  "محمد",
  "عبد القادر",
];
export interface Person {
  id: number;
  name: string;
  type: GuestType;
  status: GuestStatus;
  invitedBy?: inviters;
}