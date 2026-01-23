import { useNavigate } from "react-router-dom";
import "./account.css"; // ✅ SAME CSS

const Row = ({ label, children, action }) => {
  return (
    <div className="acc-row">
      <div className="acc-label">{label}</div>
      <div className="acc-value">{children}</div>
      <div className="acc-action">{action}</div>
    </div>
  );
};

const Security = () => {
  const navigate = useNavigate();

  return (
    <div className="account-page">
      <h1 className="account-title">
        Security <span>Settings</span>
      </h1>

      {/* RESET PASSWORD */}
      <Row
        label="Password"
        action={
          <span
            className="link"
            onClick={() => navigate("/forgot-password")}
          >
            Reset
          </span>
        }
      >
        ********
      </Row>

    </div>
  );
};

export default Security;
