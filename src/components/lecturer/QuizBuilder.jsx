import React, { useState } from "react";

function QuizBuilder({ quiz, moduleId, updateModule }) {
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    explanation: "",
  });

  const updateQuiz = (updates) => {
    updateModule(moduleId, { quiz: { ...quiz, ...updates } });
  };

  const addQuestion = () => {
    if (!newQuestion.question) {
      alert("Please enter a question");
      return;
    }

    const questionWithId = {
      ...newQuestion,
      id: Date.now(),
    };

    updateQuiz({
      questions: [...(quiz.questions || []), questionWithId],
    });

    // Reset form
    setNewQuestion({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
    });
  };

  const deleteQuestion = (questionId) => {
    if (window.confirm("Delete this question?")) {
      updateQuiz({
        questions: quiz.questions.filter((q) => q.id !== questionId),
      });
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...newQuestion.options];
    newOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: newOptions });
  };

  return (
    <div className="space-y-4">
      {/* Quiz Settings */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quiz Title
          </label>
          <input
            type="text"
            value={quiz.title || ""}
            onChange={(e) => updateQuiz({ title: e.target.value })}
            placeholder="e.g., Module 1 Quiz"
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Passing Score (%)
          </label>
          <input
            type="number"
            value={quiz.passingScore || 70}
            onChange={(e) =>
              updateQuiz({ passingScore: parseInt(e.target.value) })
            }
            min="50"
            max="100"
            className="w-full border p-2 rounded"
          />
        </div>
      </div>

      {/* Existing Questions */}
      {quiz.questions && quiz.questions.length > 0 && (
        <div className="space-y-3">
          <h5 className="font-medium">Questions ({quiz.questions.length})</h5>
          {quiz.questions.map((q, qIdx) => (
            <div key={q.id} className="border rounded p-3 bg-gray-50">
              <div className="flex justify-between items-start">
                <p className="font-medium">
                  Q{qIdx + 1}: {q.question}
                </p>
                <button
                  onClick={() => deleteQuestion(q.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
              <div className="mt-2 space-y-1">
                {q.options.map((opt, oIdx) => (
                  <div key={oIdx} className="flex items-center gap-2">
                    <span
                      className={`text-sm ${q.correctAnswer === oIdx ? "text-green-600 font-medium" : ""}`}
                    >
                      {String.fromCharCode(65 + oIdx)}.
                    </span>
                    <span className="text-sm">{opt}</span>
                    {q.correctAnswer === oIdx && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        Correct
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add New Question Form */}
      <div className="border-t pt-4">
        <h5 className="font-medium mb-3">Add New Question</h5>

        <input
          type="text"
          placeholder="Enter your question"
          value={newQuestion.question}
          onChange={(e) =>
            setNewQuestion({ ...newQuestion, question: e.target.value })
          }
          className="w-full border p-2 rounded mb-3"
        />

        <div className="space-y-2 mb-3">
          {newQuestion.options.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="radio"
                name="correctAnswer"
                checked={newQuestion.correctAnswer === index}
                onChange={() =>
                  setNewQuestion({ ...newQuestion, correctAnswer: index })
                }
              />
              <input
                type="text"
                placeholder={`Option ${String.fromCharCode(65 + index)}`}
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                className="flex-1 border p-2 rounded"
              />
            </div>
          ))}
        </div>

        <textarea
          placeholder="Explanation (optional)"
          value={newQuestion.explanation}
          onChange={(e) =>
            setNewQuestion({ ...newQuestion, explanation: e.target.value })
          }
          rows="2"
          className="w-full border p-2 rounded mb-3"
        />

        <button
          onClick={addQuestion}
          className="bg-[#5a6499] text-white px-4 py-2 rounded hover:bg-[#4a5499] transition"
        >
          Add Question
        </button>
      </div>
    </div>
  );
}

export default QuizBuilder;
