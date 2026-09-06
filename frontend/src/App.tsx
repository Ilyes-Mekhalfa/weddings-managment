import { useMemo, useState, useEffect } from "react";
import { socket } from "./socket";
import StatsCards from "./components/StatsCards";
import SearchAndFilter from "./components/SearchAndFilter";
import GuestTable from "./components/GuestTable";
import { getGuests } from "./services/api";
import type { GuestStatus, Person } from "./types/guest";

function App() {
  const [search, setSearch] = useState("");
  const [guests, setGuests] = useState<Person[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, invited: 0 });
  const [status, setStatus] = useState<GuestStatus | "all">("all");

  useEffect(() => {
    socket.on("connect", async () => {
      console.log("Connected:", socket.id);
      const guestsData = await getGuests();
      setGuests(guestsData.guests);
      setStats({
        total: guestsData.countTotal,
        pending: guestsData.pending,
        invited: guestsData.invited,
      });
    });
    socket.on("disconnect", () => {
      console.log("Disconnected");
    });

    const handleGuestUpdated = (updatedGuest: Person) => {
      setGuests((prev) => {
        const nextGuests = prev.map((guest) =>
          guest.id === updatedGuest.id ? updatedGuest : guest,
        );

        setStats({
          total: nextGuests.length,
          pending: nextGuests.filter((guest) => guest.status === "PENDING").length,
          invited: nextGuests.filter((guest) => guest.status === "INVITED").length,
        });

        return nextGuests;
      });
    };

    socket.on("guest:updated", handleGuestUpdated);

    return () => {
      socket.off("guest:updated", handleGuestUpdated);
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  const filteredGuests = useMemo(() => {
    return guests?.filter((guest) => {
      const matchesSearch = guest.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus = status === "all" || guest.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [guests, search, status]);

  const handleStatusChange = (id: number, status: GuestStatus) => {
    socket.emit("guest:update", {
      id,
      status,
    });
  };

  const handleInvitedByChange = (id: number, invitedBy: string) => {
    const guest = guests.find((item) => item.id === id);

    if (!guest) return;

    socket.emit("guest:update", {
      id,
      status: guest.status,
      invitedBy,
    });
  };
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

        <GuestTable
          guests={filteredGuests}
          onStatusChange={handleStatusChange}
          onInvitedByChange={handleInvitedByChange}
        />
      </div>
    </main>
  );
}

export default App;
