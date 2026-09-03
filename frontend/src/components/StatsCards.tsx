interface StatsCardsProps {
  total: number;
  pending: number;
  invited: number;
}

export default function StatsCards({
  total,
  pending,
  invited,
}: StatsCardsProps) {
  return (
    <section className="stats-grid">
      <div className="stat-card">
        <div className="stat-card__icon stat-card__icon--total">
          <span>👥</span>
        </div>

        <div>
          <p className="stat-card__label">إجمالي المدعوين</p>
          <h2>{total}</h2>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-card__icon stat-card__icon--pending">
          <span>⏳</span>
        </div>

        <div>
          <p className="stat-card__label">في انتظار الدعوة</p>
          <h2>{pending}</h2>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-card__icon stat-card__icon--invited">
          <span>✓</span>
        </div>

        <div>
          <p className="stat-card__label">تمت دعوتهم</p>
          <h2>{invited}</h2>
        </div>
      </div>
    </section>
  );
}