export type GuestType = "FAMILY" | "FRIEND";

export type GuestStatus = "PENDING" | "INVITED" | "REJECTED";

export interface Person {
  id: number;
  name: string;
  type: GuestType;
  status: GuestStatus;
  invitedBy?: string | null;
}