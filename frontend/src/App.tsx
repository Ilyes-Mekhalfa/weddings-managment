import { useMemo, useState, useEffect } from "react";
import { socket } from "./socket";
import StatsCards from "./components/StatsCards";
import SearchAndFilter from "./components/SearchAndFilter";
import GuestTable from "./components/GuestTable";
import AddGuest from "./components/AddGuest";
import { getGuests } from "./services/api";
import type { GuestStatus, Person } from "./types/guest";

function App() {
  const [search, setSearch] = useState("");
  const [guests, setGuests] = useState<Person[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, invited: 0 });
  const [status, setStatus] = useState<GuestStatus | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 30;

  useEffect(() => {
    const loadGuests = async () => {
      const guestsData = await getGuests();
      if (guestsData && guestsData.guests) {
        setGuests(guestsData.guests);
        setStats({
          total: guestsData.countTotal,
          pending: guestsData.pending,
          invited: guestsData.invited,
        });
      }
    };

    loadGuests();

    const handleConnect = async () => {
      console.log("Connected:", socket.id);
      loadGuests();
    };

    const handleDisconnect = () => {
      console.log("Disconnected");
    };

    const handleGuestUpdated = (updatedGuest: Person) => {
      setGuests((prev) => {
        const nextGuests = prev.map((guest) =>
          guest.id === updatedGuest.id ? updatedGuest : guest,
        );

        setStats({
          total: nextGuests.length,
          pending: nextGuests.filter((guest) => guest.status === "PENDING")
            .length,
          invited: nextGuests.filter((guest) => guest.status === "INVITED")
            .length,
        });

        return nextGuests;
      });
    };

    const handleGuestCreated = (newGuest: Person) => {
      setGuests((prev) => {
        if (prev.some((g) => g.id === newGuest.id)) return prev;
        const nextGuests = [newGuest, ...prev];

        setStats({
          total: nextGuests.length,
          pending: nextGuests.filter((guest) => guest.status === "PENDING")
            .length,
          invited: nextGuests.filter((guest) => guest.status === "INVITED")
            .length,
        });

        return nextGuests;
      });
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("guest:updated", handleGuestUpdated);
    socket.on("guest:created", handleGuestCreated);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("guest:updated", handleGuestUpdated);
      socket.off("guest:created", handleGuestCreated);
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
  }, [guests, search, status]);

  const totalPages = Math.ceil(filteredGuests.length / ITEMS_PER_PAGE);

  const paginatedGuests = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;

    return filteredGuests.slice(start, end);
  }, [filteredGuests, currentPage]);

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

  const handleGuestAdded = (newGuest: Person) => {
    setGuests((prev) => {
      if (prev.some((g) => g.id === newGuest.id)) return prev;
      const nextGuests = [newGuest, ...prev];

      setStats({
        total: nextGuests.length,
        pending: nextGuests.filter((guest) => guest.status === "PENDING").length,
        invited: nextGuests.filter((guest) => guest.status === "INVITED").length,
      });

      return nextGuests;
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

        <AddGuest onGuestAdded={handleGuestAdded} />

        <SearchAndFilter
          search={search}
          status={status}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
        />

        <GuestTable
          guests={paginatedGuests}
          onStatusChange={handleStatusChange}
          onInvitedByChange={handleInvitedByChange}
        />
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            السابق
          </button>

          <span>
            صفحة {currentPage} من {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            التالي
          </button>
        </div>
      </div>
    </main>
  );
}

export default App;
