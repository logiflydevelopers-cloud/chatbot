import { useEffect, useState } from "react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import "./account.css";

const API = "https://chatbot-backend-project.vercel.app";

/* ================= ROW ================= */
const Row = ({ label, children, action }) => {
  return (
    <div className="acc-row">
      <div className="acc-label">{label}</div>
      <div className="acc-value">{children}</div>
      <div className="acc-action">{action}</div>
    </div>
  );
};

const Account = () => {
  const { user, setUser } = useOutletContext();
  const userId = user?._id || user?.id;

  const [editField, setEditField] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [chatbot, setChatbot] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ SUCCESS MESSAGE STATE
  const [successMsg, setSuccessMsg] = useState("");

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };


  /* ================= LOAD WEBSITE ================= */
  useEffect(() => {
    if (!userId) return;
    axios
      .get(`${API}/api/chatbot/${userId}`)
      .then((res) => setChatbot(res.data?.settings))
      .catch(() => { });
  }, [userId]);

  const startEdit = (field, value = "") => {
    setEditField(field);
    setEditValue(value || "");
  };

  const cancelEdit = () => {
    setEditField(null);
    setEditValue("");
  };

  /* ================= SAVE EDIT ================= */
  const saveEdit = async () => {
    if (!editField) return;
    setLoading(true);

    try {
      if (["name", "email", "phone"].includes(editField)) {
        const res = await axios.put(
          `${API}/api/user/update/${userId}`,
          { [editField]: editValue }
        );

        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));

        // ✅ FIELD BASED MESSAGE
        if (editField === "name") showSuccess("Changed Successfully");
        if (editField === "phone") showSuccess("Mobile number updated successfully");
        if (editField === "email") showSuccess("Email updated successfully");
      }

      if (editField === "website") {
        const res = await axios.put(`${API}/api/chatbot/${userId}`, {
          website: editValue,
        });
        setChatbot(res.data.settings);
        showSuccess("Website updated successfully");
      }

      cancelEdit();
    } catch {
      alert("❌ Update failed");
    } finally {
      setLoading(false);
    }
  };


  const removeAvatar = async () => {
    try {
      const res = await axios.delete(
        `${API}/api/user/${userId}/avatar`
      );

      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      showSuccess("Avatar removed successfully");
    } catch {
      alert("Failed to remove avatar");
    }
  };


  /* ================= AVATAR (FIXED) ================= */
  const uploadAvatar = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const form = new FormData();
  form.append("avatar", file);

  try {
    const res = await axios.post(
      `${API}/api/user/${userId}/avatar`,
      form,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    setUser(res.data);
    localStorage.setItem("user", JSON.stringify(res.data));
    showSuccess("Avatar changed successfully");
  } catch {
    alert("Avatar upload failed");
  }
};


  if (!user) return <p className="acc-loading">Loading account…</p>;

  return (
    <div className="account-page">
      <h1 className="account-title">
        Account <span>Settings</span>
      </h1>

      {/* ACCOUNT TYPE */}
      <Row label="Account Type" action={<button className="btn-upgrade">Upgrade</button>}>
        Free
      </Row>

      {/* USERNAME */}
      <Row
        label="Username"
        action={
          editField === "name" ? (
            <>
              <button className="edit-btn" onClick={saveEdit} disabled={loading}>Save</button>
              <button className="cancel-btn" onClick={cancelEdit}>Cancel</button>
            </>
          ) : (
            <span className="link" onClick={() => startEdit("name", user.name)}>
              Edit
            </span>
          )
        }
      >
        {editField === "name" ? (
          <input value={editValue} onChange={(e) => setEditValue(e.target.value)} />
        ) : (
          user.name
        )}
      </Row>

      {/* AVATAR */}
      <Row
        label="Avatar"
        action={
          <>
            <label htmlFor="avatarUpload" className="link">
              Change
            </label>

            {user?.avatar && (
              <span className="link danger" onClick={removeAvatar}>
                Remove
              </span>
            )}

            <input
              type="file"
              id="avatarUpload"
              hidden
              accept="image/*"
              onChange={uploadAvatar}
            />
          </>
        }
      >


        <div className="avatar-box">
          {user?.avatar ? (
            <img
              src={`https://chatbot-backend-project.vercel.app${user.avatar}`}
              alt="avatar"
            />
          ) : (
            <div className="avatar-initials">
              {getInitials(user?.name)}
            </div>
          )}
        </div>

      </Row>

      {/* PHONE */}
      <Row
        label="Phone"
        action={
          editField === "phone" ? (
            <>
              <button className="edit-btn" onClick={saveEdit}>Save</button>
              <button className="cancel-btn" onClick={cancelEdit}>Cancel</button>
            </>
          ) : (
            <span className="link" onClick={() => startEdit("phone", user.phone)}>
              {user.phone ? "Edit" : "Add"}
            </span>
          )
        }
      >
        {editField === "phone" ? (
          <input value={editValue} onChange={(e) => setEditValue(e.target.value)} />
        ) : (
          user.phone || "-"
        )}
      </Row>

      <Row label="Website">
        {chatbot?.website || "-"}
      </Row>

      {/* EMAIL (READ ONLY) */}
      <Row label="Email">
        {user.email}
      </Row>


      {/* ✅ SUCCESS MESSAGE AT BOTTOM (AS YOU WANTED) */}
      {successMsg && (
        <div className="success-message">
          <span>✔</span> {successMsg}
        </div>
      )}
    </div>
  );
};

export default Account;
