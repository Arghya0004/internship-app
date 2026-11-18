import { useEffect } from "react";
import { LogOut } from "lucide-react";
import "./LogoutDialog.css";

export default function LogoutDialog({
  isOpen,
  onConfirm,
  onCancel,
  title = "Confirm Logout",
  message = "Are you sure you want to log out of your account?",
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="logout-dialog-overlay" onClick={onCancel}>
      <div className="logout-dialog-box" onClick={(e) => e.stopPropagation()}>
        <div className="logout-dialog-icon">
          <LogOut size={20} />
        </div>

        <h3 className="logout-dialog-title">{title}</h3>
        <p className="logout-dialog-message">{message}</p>

        <div className="logout-dialog-actions">
          <button
            type="button"
            className="logout-dialog-btn cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="logout-dialog-btn confirm"
            onClick={onConfirm}
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
