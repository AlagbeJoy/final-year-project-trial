import React from "react";
import { useAuth } from "../../context/AuthContext";

const XPBar = () => {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  const xp = currentUser.xp || 0;
  const level = currentUser.level || 1;

  const xpForNextLevel = level * 100;
  const previousLevelXP = (level - 1) * 100;

  const progress =
    ((xp - previousLevelXP) / (xpForNextLevel - previousLevelXP)) * 100;

  return (
    <div style={{ marginBottom: "20px" }}>
      <h3>Level {level}</h3>
      <div
        style={{
          height: "20px",
          background: "#eee",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            background: "linear-gradient(to right, #4caf50, #81c784)",
            height: "100%",
          }}
        />
      </div>
      <p>{xp} XP</p>
    </div>
  );
};

export default XPBar;
