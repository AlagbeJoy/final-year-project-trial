import React from 'react'
import { useAuth } from '../context/AuthContext';
import LecturerSidebar from '../components/LecturerSidebar';

function LecturerProfile() {
        const {currentUser} = useAuth();
    
        if (!currentUser) return <div>Loading..........</div>
    
     return (
       <div className="flex min-h-screen bg-gray-50">
         <LecturerSidebar />

         <main className="flex-1 p-8">
           <h2 className="text-2xl font-bold mb-6">My Profile</h2>

           <div className="bg-white p-6 rounded-xl shadow space-y-4 max-w-xl">
             <div>
               <label className="text-gray-500 text-sm">Full Name</label>
               <p className="font-medium">
                 {currentUser.firstName} {currentUser.lastName}
               </p>
             </div>

             <div>
               <label className="text-gray-500 text-sm">Email</label>
               <p className="font-medium">{currentUser.email}</p>
             </div>

             <div>
               <label className="text-gray-500 text-sm">
                 Department
               </label>
               <p className="font-medium">{currentUser.department}</p>
             </div>

             <div>
               <label className="text-gray-500 text-sm">Role</label>
               <p className="font-medium">{currentUser.role}</p>
             </div>

           </div>
         </main>
       </div>
     );
}

export default LecturerProfile