import React, { useEffect, useState } from "react";

const AchievementPopup = ({ message }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        background: "#4caf50",
        color: "white",
        padding: "15px",
        borderRadius: "10px",
        boxShadow: "0px 5px 15px rgba(0,0,0,0.2)",
      }}
    >
      🎉 {message}
    </div>
  );
};

export default AchievementPopup;
