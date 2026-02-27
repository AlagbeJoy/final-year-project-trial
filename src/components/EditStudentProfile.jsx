import React, { useState } from 'react'
import { useAuth } from "../context/AuthContext";
import StudentSidebar from "../components/StudentSidebar";

const avatars = [
  "https://api.dicebear.com/7.x/adventurer/svg?seed=1",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=2",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=3",
];

function EditStudentProfile() {
      const {currentUser, updatedProfile} = useAuth();
    const [form, setForm] = useState(currentUser?.profile || {});
    const [imagePreview, setImagePreview] = useState (
        currentUser?.profile?.image || ""
    );

    if (!currentUser) return <div>Loading..........</div>;

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    const handleImageUpload = (e) => {
           const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
            setForm({...form, image: reader.result});
        };
        reader.readAsDataURL(file);
    };
     
    const chooseAvatar = (url) => {
        setImagePreview(url);
        setForm({...form, image: url});
    };

     const save = () => {
        updatedProfile(form);
     } 
  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar />

      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-6 text-[#5a6499]">My Profile</h2>

        <div className="bg-white p-6 rounded-xl shadow space-y-4 max-w-xl">
          <div className="flex flex-col items-center gap-3">
            <img
              src={imagePreview || avatars[0]}
              className="w-24 h-24 rounded-full object-cover border"
              alt=""
            />

            <input type="file" accept="image/*" onChange={handleImageUpload} />

            <div className="flex gap-2">
              {avatars.map((a, i) => (
                <img
                  key={i}
                  src={a}
                  className="w-12 h-12 rounded-full cursor-pointer border"
                  onClick={() => chooseAvatar(a)}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="text-gray-500 text-sm">Full Name</label>
            <input
              name="fullName"
              value={form.fullName || ""}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="text-gray-500 text-sm">Department</label>
            <input
              name="department"
              value={form.department || ""}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="text-gray-500 text-sm">Level</label>
            <input
              name="level"
              value={form.level || ""}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          <button
            onClick={save}
            className="bg-[#5a6499] text-white px-4 py-2 rounded"
          >
            Save Profile
          </button>
        </div>
      </main>
    </div>
  );
}

export default EditStudentProfile