import { useState } from "react";
import { addGuest } from "../services/api";
import type { GuestType, Person } from "../types/guest";

interface AddGuestProps {
  onGuestAdded: (guest: Person) => void;
}

export default function AddGuest({ onGuestAdded }: AddGuestProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<GuestType>("FAMILY");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("يرجى إدخال اسم المدعو");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const newGuest = await addGuest({
        name: trimmedName,
        type,
      });

      if (newGuest) {
        onGuestAdded(newGuest);
        setName("");
        setType("FAMILY");
        setSuccess(`تمت إضافة "${newGuest.name}" بنجاح!`);

        setTimeout(() => {
          setSuccess(null);
          setIsOpen(false);
        }, 1500);
      }
    } catch (err: any) {
      console.error("Failed to add guest:", err);
      setError(
        err?.response?.data?.message ||
          "حدث خطأ أثناء إضافة المدعو، يرجى المحاولة مرة أخرى."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-guest-wrapper">
      <button
        type="button"
        id="toggle-add-guest-btn"
        className={`add-guest-btn ${isOpen ? "active" : ""}`}
        onClick={handleToggle}
      >
        <span className="btn-icon">{isOpen ? "✕" : "+"}</span>
        <span>{isOpen ? "إغلاق النموذج" : "إضافة مدعو جديد"}</span>
      </button>

      {isOpen && (
        <form className="add-guest-form-card" onSubmit={handleSubmit}>
          <div className="form-header">
            <h3>بيانات المدعو الجديد</h3>
            <p>أدخل الاسم وحدد نوع القرابة لإضافته إلى قائمة المدعوين</p>
          </div>

          <div className="form-fields-grid">
            {/* Field 1: Name */}
            <div className="form-field">
              <label htmlFor="guest-name-input">
                اسم المدعو <span className="required-star">*</span>
              </label>
              <input
                id="guest-name-input"
                type="text"
                placeholder="أدخل اسم المدعو..."
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError(null);
                }}
                disabled={isSubmitting}
                autoFocus
                required
              />
            </div>

            {/* Field 2: Type */}
            <div className="form-field">
              <label htmlFor="guest-type-select">
                النوع / الفئة <span className="required-star">*</span>
              </label>
              <select
                id="guest-type-select"
                value={type}
                onChange={(e) => setType(e.target.value as GuestType)}
                disabled={isSubmitting}
              >
                <option value="FAMILY">عائلة (Family)</option>
                <option value="FRIEND">صديق (Friend)</option>
              </select>
            </div>
          </div>

          {error && <div className="form-alert error-alert">{error}</div>}
          {success && <div className="form-alert success-alert">{success}</div>}

          <div className="form-actions">
            <button
              type="submit"
              id="submit-guest-btn"
              className="submit-guest-btn"
              disabled={isSubmitting || !name.trim()}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  <span>جاري الإضافة...</span>
                </>
              ) : (
                "تأكيد الإضافة"
              )}
            </button>

            <button
              type="button"
              className="cancel-guest-btn"
              onClick={handleToggle}
              disabled={isSubmitting}
            >
              إلغاء
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
