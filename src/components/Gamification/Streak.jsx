import React from "react";
import { useAuth } from "../../context/AuthContext";

const Streak = () => {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  return (
    <div style={{ marginBottom: "15px" }}>
      🔥 Daily Streak: {currentUser.streak || 0} days
    </div>
  );
};

export default Streak;
