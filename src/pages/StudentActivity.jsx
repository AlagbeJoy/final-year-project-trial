import React from 'react'
import { useAuth } from '../context/AuthContext'
import StudentSidebar from '../components/StudentSidebar';

function StudentActivity() {
    const {currentUser} = useAuth();

    if (!currentUser) return <div>Loading....</div>

    const activities = currentUser.activities || [];

     const sortedActivities = [...activities].sort(
       (a, b) => new Date(b.date) - new Date(a.date),
     );

       const getActivityIcon = (type) => {
         switch (type) {
           case "enrollment":
             return "📚";
           case "lesson":
             return "📖";
           case "onboarding":
             return "🎉";
           case "profile":
             return "👤";
           case "achievement":
             return "🏆";
           default:
             return "⭐";
         }
       };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar />

      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-6 text-[#5a6499]">
          Activity Feed
        </h2>

        {activities.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-500">No activity yet</p>
            <p className="text-sm text-gray-400 mt-2">
              Complete your profile or enroll in a course to get started
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedActivities.map((a, i) => (
              <div
                key={i}
                className="bg-white p-4 rounded shadow hover:shadow-md transition"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{getActivityIcon(a.type)}</span>

                  <div className="flex-1">
                    <p className="font-medium">{a.message}</p>
                    <div className="flex items-center gap-4 mt-1">
                      {a.xp > 0 && (
                        <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded">
                          +{a.xp} XP
                        </span>
                      )}
                      <p className='text-sm text-gray-400'>{new Date(a.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default StudentActivity