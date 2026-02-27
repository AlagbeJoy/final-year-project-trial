import React, { useState } from "react";
import createaccount from "../assets/Images/createaccount.jpg";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";


function CreateAccountpage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const validate = () => {
    let newErrors = {};

     const nameRegex = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (!nameRegex.test(formData.name)) {
      newErrors.name = "Name must contain letters only"
    } 

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*\d)[a-z\d]{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        newErrors.password = "Password must be 8 characters and include lowercase letters and at least one number";
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Confirm your password"
      } 
      else if (
        passwordRegex.test (formData.password) &&
        formData.password !== formData.confirmPassword){
        newErrors.confirmPassword=" Passwords do not match"
      }
            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;

      };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    const result = register(
      formData.name,
      formData.email,
      formData.password,
      formData.role
    );

    if (!result.success) {
      setErrors({email: result.message});
      return;
    }

    navigate("/redirect");
  };

  return (
    <div className="flex h-screen w-screen">
      <section className="w-[40%] flex items-center justify-center">
        <img
          src={createaccount}
          alt="Create account"
          className="max-w-[80%] h-auto mx-10 animate-bounce"
        />
      </section>

      <section className="w-[60%]">
        <p className="text-[#5a6499] text-2xl font-semibold mb-10 text-center mt-15">
          Create Account
        </p>

        <form className="w-full max-w-md mx-auto" onSubmit={handleSubmit}>
          <div className="mb-1">
            <input
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              type="text"
              placeholder="Full Name"
              className={`w-full border p-2 rounded pr-10 ${errors.name ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div className="mb-1">
            <input
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              type="email"
              placeholder="Email"
              className={`w-full border p-2 rounded pr-10 ${errors.email ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="mb-1 relative">
            <input
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={`w-full border p-2 rounded pr-10 ${errors.password ? "border-red-500" : "border-gray-300"}`}
            />
            <span
              className="absolute right-3 top-3 cursor-pointer text-gray-500
            "
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
            </span>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div className="relative mb-1">
            <input
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className={`w-full border p-2 rounded pr-10 ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
            />
            <span
              className="absolute right-3 top-3 cursor-pointer text-gray-500
            "
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
            </span>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="mb-4 mt-2">
            <select
              className="w-full border border-[#5a6499] p-2 rounded-lg"
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            >
              <option value="student">Student</option>
              <option value="lecturer">Lecturer</option>
            </select>
          </div>

          <div className="mt-5">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" required />I agree to the terms &
              conditions
            </label>
          </div>

          <button
            type="submit"
            className="mt-6 text-white bg-[#5a6499] font-bold cursor-pointer w-full py-3 rounded-sm"
          >
            CREATE ACCOUNT
          </button>

          <p className="mt-5 text-center">
            Already have account?{" "}
            <span
              className="font-bold cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </form>
      </section>
    </div>
  );
}

export default CreateAccountpage;
