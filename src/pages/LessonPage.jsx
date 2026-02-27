import React from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext';

function LessonPage() {
    const {courseId, lessonIndex} = useParams();
    const {currentUser, completeLesson} = useAuth();

    const course = currentUser.profile.enrolledCourses.find(
        (c) => c.id === Number(courseId)
    );

    const lesson = course?.lessons?.[lessonIndex] || {
        title: `Lesson ${lessonIndex}`,
        content: "Lesson content placeholder",
    };

  return (
    <div className='p-8'>
        <h2 className='text-xl font-bold mb-4'>
            {lesson.title}
        </h2>
        <p className='mb-6'>{lesson.content}</p>

        <button 
        onClick={() => completeLesson(course.id, Number(lessonIndex))}
        className='bg-[#5a6499] text-white px-6 py-2 rounded'>
            Complete Lesson (+5 XP)
        </button>

    </div>
  )
}

export default LessonPage