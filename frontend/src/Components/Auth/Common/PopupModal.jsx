import "./PopupModal.css";

const PopupModal = ({ show, title, message, onClose, onConfirm }) => {
  if (!show) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-box" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{message}</p>

        <div className="popup-actions">
          {onConfirm && (
            <button className="popup-btn primary" onClick={onConfirm}>
              OK
            </button>
          )}
          <button className="popup-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupModal;
