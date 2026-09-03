import { useMemo, useState, useEffect } from "react";
import { socket } from "./socket";
import StatsCards from "./components/StatsCards";
import SearchAndFilter from "./components/SearchAndFilter";
import GuestTable from "./components/GuestTable";

import { guests } from "./data/guests";

import type { GuestStatus } from "./types/guest";

function App() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<GuestStatus | "all">("all");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);
  const stats = useMemo(() => {
    return {
      total: guests.length,
      pending: guests.filter((guest) => guest.status === "pending").length,
      invited: guests.filter((guest) => guest.status === "invited").length,
    };
  }, []);

  const filteredGuests = useMemo(() => {
    return guests.filter((guest) => {
      const matchesSearch = guest.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus = status === "all" || guest.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  return (
    <main className="app" dir="rtl">
      <div className="container">
        <header className="page-header">
          <div>
            <p className="eyebrow">إدارة حفل الزفاف</p>
            <h1>قائمة المدعوين</h1>
            <p className="subtitle">
              إدارة الأشخاص المدعوين ومتابعة حالة الدعوات
            </p>
          </div>
        </header>

        <StatsCards
          total={stats.total}
          pending={stats.pending}
          invited={stats.invited}
        />

        <SearchAndFilter
          search={search}
          status={status}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
        />

        <GuestTable guests={filteredGuests} />
      </div>
    </main>
  );
}

export default App;
