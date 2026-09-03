import type { GuestStatus } from "../types/guest";

interface SearchAndFilterProps {
  search: string;
  status: GuestStatus | "all";
  onSearchChange: (value: string) => void;
  onStatusChange: (value: GuestStatus | "all") => void;
}

export default function SearchAndFilter({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: SearchAndFilterProps) {
  return (
    <section className="toolbar">
      <div className="search-wrapper">
        <span className="search-icon">⌕</span>

        <input
          type="text"
          placeholder="ابحث عن شخص بالاسم..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="filter-wrapper">
        <span>تصفية حسب الحالة</span>

        <select
          value={status}
          onChange={(e) =>
            onStatusChange(e.target.value as GuestStatus | "all")
          }
        >
          <option value="all">الكل</option>
          <option value="pending">في الانتظار</option>
          <option value="invited">تمت الدعوة</option>
          <option value="rejected">مرفوض</option>
        </select>
      </div>
    </section>
  );
}