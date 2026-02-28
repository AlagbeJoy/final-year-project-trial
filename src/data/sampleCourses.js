// src/data/sampleCourses.js
export const sampleCourses = [
  {
    id: 1,
    title: "AI Fundamentals",
    level: "Beginner",
    duration: "6 weeks",
    description: "Introduction to Artificial Intelligence concepts.",
    instructor: "Dr. Smith",
    thumbnail: "https://via.placeholder.com/300x200",
    modules: [
      {
        id: 101,
        title: "Introduction to AI",
        description: "Learn what AI is and its basic concepts",
        lessons: [
          {
            id: 1001,
            title: "What is Artificial Intelligence?",
            type: "video",
            content:
              "AI is the simulation of human intelligence in machines...",
            duration: "10 min",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            completed: false,
            xpReward: 10,
          },
          {
            id: 1002,
            title: "History of AI",
            type: "reading",
            content: "AI has evolved significantly since the 1950s...",
            duration: "8 min",
            completed: false,
            xpReward: 10,
          },
        ],
        quiz: {
          id: 10001,
          title: "Module 1 Quiz",
          questions: [
            {
              id: 100001,
              question: "What is Artificial Intelligence?",
              options: [
                "A type of computer hardware",
                "Simulation of human intelligence in machines",
                "A programming language",
                "A database system",
              ],
              correctAnswer: 1,
              explanation:
                "AI involves creating machines that can think and learn",
            },
          ],
          passingScore: 70,
          xpReward: 30,
        },
      },
    ],
  },
  {
    id: 2,
    title: "Web Development",
    level: "Beginner",
    duration: "8 weeks",
    description: "Learn HTML, CSS, and JavaScript",
    instructor: "Prof. Johnson",
    thumbnail: "https://via.placeholder.com/300x200",
    modules: [
      {
        id: 201,
        title: "HTML Basics",
        description: "Learn the structure of web pages",
        lessons: [
          {
            id: 2001,
            title: "Introduction to HTML",
            type: "video",
            content: "HTML is the standard markup language for web pages...",
            duration: "12 min",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            completed: false,
            xpReward: 10,
          },
        ],
        quiz: {
          id: 20001,
          title: "HTML Quiz",
          questions: [
            {
              id: 200001,
              question: "What does HTML stand for?",
              options: [
                "Hyper Text Markup Language",
                "High Tech Modern Language",
                "Hyper Transfer Markup Language",
                "Home Tool Markup Language",
              ],
              correctAnswer: 0,
              explanation: "HTML stands for Hyper Text Markup Language",
            },
          ],
          passingScore: 70,
          xpReward: 30,
        },
      },
    ],
  },
];
