import type { Person } from "../types/guest";

export const guests: Person[] = [
  {
    id: 1,
    name: "محمد بن علي",
    type: "family",
    status: "invited",
    invitedBy: "أحمد",
  },
  {
    id: 2,
    name: "سارة بن علي",
    type: "family",
    status: "pending",
  },
  {
    id: 3,
    name: "يوسف حداد",
    type: "friend",
    status: "invited",
    invitedBy: "محمد",
  },
  {
    id: 4,
    name: "فاطمة بوشارب",
    type: "family",
    status: "pending",
  },
  {
    id: 5,
    name: "كريم منصوري",
    type: "friend",
    status: "rejected",
  },
  {
    id: 6,
    name: "عبد الرحمن قادري",
    type: "family",
    status: "invited",
    invitedBy: "عائلة العروس",
  },
  {
    id: 7,
    name: "ليلى مراد",
    type: "friend",
    status: "pending",
  },
  {
    id: 8,
    name: "أمين بوعلام",
    type: "friend",
    status: "invited",
    invitedBy: "أحمد",
  },
];