import React, { useState } from "react";

// Predefined avatars/bitmojis
const avatars = [
  { id: 1, emoji: "😊", color: "bg-yellow-400", label: "Happy" },
  { id: 2, emoji: "🤓", color: "bg-blue-400", label: "Nerdy" },
  { id: 3, emoji: "🦸", color: "bg-red-400", label: "Hero" },
  { id: 4, emoji: "🧠", color: "bg-purple-400", label: "Smart" },
  { id: 5, emoji: "🎓", color: "bg-green-400", label: "Graduate" },
  { id: 6, emoji: "👨‍🔬", color: "bg-indigo-400", label: "Scientist" },
  { id: 7, emoji: "👩‍🏫", color: "bg-pink-400", label: "Teacher" },
  { id: 8, emoji: "🧘", color: "bg-teal-400", label: "Zen" },
  { id: 9, emoji: "🏃", color: "bg-orange-400", label: "Athlete" },
  { id: 10, emoji: "🎨", color: "bg-cyan-400", label: "Artist" },
  { id: 11, emoji: "👨‍💻", color: "bg-gray-700", label: "Coder" },
  { id: 12, emoji: "📚", color: "bg-amber-400", label: "Bookworm" },
  { id: 13, emoji: "🔬", color: "bg-lime-400", label: "Researcher" },
  { id: 14, emoji: "🌍", color: "bg-emerald-400", label: "Explorer" },
  { id: 15, emoji: "🎵", color: "bg-fuchsia-400", label: "Musician" },
  { id: 16, emoji: "📝", color: "bg-rose-400", label: "Writer" },
];

function AvatarSelector({ selectedAvatar, onSelect }) {
  const [showAll, setShowAll] = useState(false);

  const displayedAvatars = showAll ? avatars : avatars.slice(0, 8);

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Choose Your Avatar/Bitmoji
      </label>

      <div className="grid grid-cols-4 gap-3">
        {displayedAvatars.map((avatar) => (
          <button
            key={avatar.id}
            type="button"
            onClick={() => onSelect(avatar)}
            className={`
              ${avatar.color} 
              ${selectedAvatar?.id === avatar.id ? "ring-4 ring-[#5a6499] scale-105" : "hover:scale-105"}
              w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-all duration-200
              shadow-md hover:shadow-lg
            `}
          >
            {avatar.emoji}
          </button>
        ))}
      </div>

      {!showAll && avatars.length > 8 && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="text-[#5a6499] text-sm hover:underline mt-2"
        >
          + Show {avatars.length - 8} more avatars
        </button>
      )}
    </div>
  );
}

export { AvatarSelector, avatars };
