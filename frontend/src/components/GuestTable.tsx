import type { Person, GuestStatus } from "../types/guest";
import { inviters } from "../data/inviters";

interface GuestTableProps {
  guests: Person[];
  onStatusChange: (id: number, status: GuestStatus) => void;
  onInvitedByChange: (id: number, invitedBy: string) => void;
}

const statusLabels: Record<GuestStatus, string> = {
  PENDING: "في الانتظار",
  INVITED: "تمت الدعوة",
  REJECTED: "مرفوض",
};

const typeLabels = {
  FAMILY: "عائلة",
  FRIEND: "صديق",
};

export default function GuestTable({
  guests,
  onStatusChange,
  onInvitedByChange,
}: GuestTableProps) {
  return (
    <div className="table-card">
      <div className="table-header">
        <div>
          <h2>قائمة المدعوين</h2>
          <p>{guests.length} شخص</p>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>الاسم</th>
              <th>النوع</th>
              <th>الحالة</th>
              <th>دُعي بواسطة</th>
            </tr>
          </thead>

          <tbody>
            {guests.length > 0 ? (
              guests.map((guest) => (
                <tr key={guest.id}>
                  {/* ID */}
                  <td className="id-cell">
                    #{guest.id}
                  </td>

                  {/* Name */}
                  <td className="name-cell">
                    {guest.name}
                  </td>

                  {/* Type */}
                  <td>
                    <span
                      className={`type-badge type-${guest.type}`}
                    >
                      {typeLabels[guest.type]}
                    </span>
                  </td>

                  {/* Status */}
                  <td>
                    <select
                      className={`status-select status-${guest.status.toLowerCase()}`}
                      value={guest.status}
                      onChange={(e) =>
                        onStatusChange(
                          guest.id,
                          e.target.value as GuestStatus
                        )
                      }
                    >
                      {Object.entries(statusLabels).map(
                        ([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        )
                      )}
                    </select>
                  </td>

                  {/* Invited By */}
                  <td>
                    {guest.status === "INVITED" ? (
                      <select
                        className="invited-by-select"
                        value={guest.invitedBy ?? ""}
                        onChange={(e) =>
                          onInvitedByChange(
                            guest.id,
                            e.target.value
                          )
                        }
                      >
                        <option value="" disabled>
                          اختر الشخص
                        </option>

                        {inviters.map((inviter) => (
                          <option
                            key={inviter}
                            value={inviter}
                          >
                            {inviter}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="not-applicable">
                        —
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="empty-state">
                  لا توجد نتائج
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}