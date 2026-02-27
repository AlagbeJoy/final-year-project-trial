import React from 'react'
import { IoMedalOutline } from "react-icons/io5";
import { FaFireAlt } from "react-icons/fa";
import { CiLock } from "react-icons/ci";
import { GiMiddleArrow } from "react-icons/gi";


function BadgesGrid({xp}) {
const badges = [
  { name: "Starter", required: 0 },
  { name: "Focused Learner", required: 200 },
  { name: "Academic Warrior", required: 500 },
]

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="font-bold text-lg mb-4">
        Your Badges 🏆
      </h2>

      <div className="grid grid-cols-3 gap-4">
        {badges.map((badge, index) => (
          <div
            key={index}
            className={`p-3 text-center rounded-xl ${
              xp >= badge.required ? "bg-yellow-200" : "bg-gray-200 opacity-50"
            }`}
          >
            {badge.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default BadgesGrid