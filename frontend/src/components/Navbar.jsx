import React, { useState, useRef, useEffect } from "react";

function Navbar() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const token = localStorage.getItem("token");
  let user = null;

  if (token) {
    user = JSON.parse(atob(token.split(".")[1]));
  }

  function logout() {
    localStorage.removeItem("token");
    window.location.reload();
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div style={styles.nav}>
      <h2>WAVrater</h2>

      <div>
        {!user ? (
          <button onClick={() => (window.location.href = "/login")}>
            Sign In
          </button>
        ) : (
          <div style={styles.profileWrapper} ref={dropdownRef}>
            <div
              style={styles.profile}
              onClick={() => setOpen(!open)}
            >
              <img src={user.img} alt="profile" style={styles.avatar} />
              <span>{user.name}</span>
            </div>

            {open && (
              <div style={styles.dropdown}>
                <div style={styles.dropdownItem} onClick={logout}>
                  Logout
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem",
  },
  profileWrapper: {
    position: "relative",
  },
  profile: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    cursor: "pointer",
  },
  avatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
  },
  dropdown: {
    position: "absolute",
    top: "45px",
    right: 0,
    border: "1px solid #ddd",
    borderRadius: "6px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    minWidth: "120px",
  },
  dropdownItem: {
    padding: "10px",
    cursor: "pointer",
  },
};

export default Navbar;
