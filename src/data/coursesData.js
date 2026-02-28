// src/data/coursesData.js
export const coursesData = [
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
        id: "m1",
        title: "Introduction to AI",
        description: "Learn what AI is and its basic concepts",
        lessons: [
          {
            id: "l1-1",
            title: "What is Artificial Intelligence?",
            type: "video",
            videoUrl: "https://example.com/video1",
            duration: "10 min",
            content:
              "AI is the simulation of human intelligence in machines...",
            completed: false,
            xpReward: 10,
          },
          {
            id: "l1-2",
            title: "History of AI",
            type: "reading",
            content: "AI has evolved significantly since the 1950s...",
            duration: "8 min",
            completed: false,
            xpReward: 10,
          },
          {
            id: "l1-3",
            title: "AI Applications",
            type: "video",
            videoUrl: "https://example.com/video2",
            duration: "12 min",
            content: "AI is used in healthcare, finance, transportation...",
            completed: false,
            xpReward: 10,
          },
        ],
        quiz: {
          title: "Module 1 Quiz",
          questions: [
            {
              id: "q1-1",
              question: "What is Artificial Intelligence?",
              options: [
                "A type of computer hardware",
                "Simulation of human intelligence in machines",
                "A programming language",
                "A database system",
              ],
              correctAnswer: 1,
              explanation:
                "AI involves creating machines that can think and learn like humans",
            },
            {
              id: "q1-2",
              question: "Which decade saw the birth of AI as a field?",
              options: ["1940s", "1950s", "1960s", "1970s"],
              correctAnswer: 1,
              explanation:
                "The field of AI was founded at a workshop at Dartmouth College in 1956",
            },
            {
              id: "q1-3",
              question: "Which is NOT an application of AI?",
              options: [
                "Speech recognition",
                "Recommendation systems",
                "Manual data entry",
                "Autonomous vehicles",
              ],
              correctAnswer: 2,
              explanation:
                "Manual data entry is typically done by humans, not AI",
            },
          ],
          passingScore: 70,
          xpReward: 30,
        },
      },
      {
        id: "m2",
        title: "Machine Learning Basics",
        description: "Understand the fundamentals of machine learning",
        lessons: [
          {
            id: "l2-1",
            title: "What is Machine Learning?",
            type: "video",
            videoUrl: "https://example.com/video3",
            duration: "15 min",
            content:
              "Machine learning is a subset of AI that enables systems to learn...",
            completed: false,
            xpReward: 10,
          },
          {
            id: "l2-2",
            title: "Types of Machine Learning",
            type: "reading",
            content:
              "There are three main types: supervised, unsupervised, and reinforcement learning...",
            duration: "10 min",
            completed: false,
            xpReward: 10,
          },
        ],
        quiz: {
          title: "Module 2 Quiz",
          questions: [
            {
              id: "q2-1",
              question: "Which is a type of machine learning?",
              options: [
                "Supervised learning",
                "Manual learning",
                "Book learning",
                "Passive learning",
              ],
              correctAnswer: 0,
              explanation:
                "Supervised learning is one of the main categories of machine learning",
            },
          ],
          passingScore: 70,
          xpReward: 30,
        },
      },
    ],
    finalTest: {
      title: "AI Fundamentals Final Exam",
      questions: [
        {
          id: "f1",
          question: "What is the main goal of AI?",
          options: [
            "Replace all humans",
            "Create systems that think and learn",
            "Build faster computers",
            "Store more data",
          ],
          correctAnswer: 1,
          explanation:
            "AI aims to create intelligent systems that can think, learn, and solve problems",
        },
        {
          id: "f2",
          question: "Which is a subset of AI?",
          options: [
            "Database Management",
            "Web Development",
            "Machine Learning",
            "Network Security",
          ],
          correctAnswer: 2,
          explanation:
            "Machine Learning is a subset of AI focused on learning from data",
        },
      ],
      passingScore: 80,
      xpReward: 100,
    },
  },
  // Add more courses as needed
];
