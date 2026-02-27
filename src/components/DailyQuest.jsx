const generateDailyQuest = () => {
  const today = new Date().toDateString();

  if (currentUser?.dailyQuest?.date === today) return;

  const quest = {
    date: today,
    target: 2,
    completed: 0,
    reward: 20,
  };

  updateUser({
    ...currentUser,
    dailyQuest: quest,
  });
};
