import { courseCatalog } from "../data/courseCatalog";

export const generateLearningPath = (user) => {
  if (!user?.profile) return [];

  const { department, level, lessonStyle } = user.profile;

  // Rule 1: match department
  let recommended = courseCatalog.filter(
    (course) =>
      course.department === department && course.level <= parseInt(level),
  );

  // Rule 2: preference adaptation
  if (lessonStyle === "Short & Quick") {
    recommended = recommended.filter((course) => course.difficulty !== "hard");
  }

  return recommended;
};
