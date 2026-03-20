import { useState } from "react";
import login1 from "../assets/Images/login1.jpg";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

function Loginpage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Use formData.email and formData.password here
      const result = await login(formData.email, formData.password);

      if (result.success) {
        console.log("✅ Login successful, redirecting...");

        // Redirect based on user role
        if (result.user.role === "student") {
          navigate("/studentdashboard");
        } else if (result.user.role === "lecturer") {
          navigate("/lecturerdashboard");
        } else if (result.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        setError(result.message || "Login failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen">
      <section className="w-[55%] items-center justify-center">
        <p className="text-[#5a6499] text-2xl font-semibold mb-15 text-center mt-15">
          Welcome Back
        </p>

        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
          <div className="">
            <input
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              className="w-full px-4 py-2 rounded-lg outline-none border border-[#5a6499] text-left placeholder:text-gray-400"
              required
            />
          </div>

          <div className="mt-4">
            <div className="relative">
              <input
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                value={formData.password}
                className="w-full px-4 py-2 rounded-lg outline-none border border-[#5a6499] text-left placeholder:text-gray-400"
              />
              <span
                className="absolute right-3 top-3 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
              </span>
            </div>

            <div
              className="flex justify-end mt-2 text-[#5a6499] font-light cursor-pointer"
              onClick={() => navigate("/forgotpassword")}
            >
              Forgot Password?
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
          )}

          <div className="mt-10 flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="mt-5 text-white bg-[#5a6499] font-bold cursor-pointer w-full py-3 rounded-sm disabled:opacity-50"
            >
              {loading ? "SIGNING IN..." : "SIGN IN"}
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-black font-light text-xl">
              New Here?{" "}
              <span
                className="font-bold cursor-pointer"
                onClick={() => navigate("/createaccount")}
              >
                Create Account
              </span>
            </p>
          </div>
        </form>
      </section>

      <section className="w-[45%] flex items-center justify-center">
        <p>
          <img
            src={login1}
            alt="login"
            className="max-w-[80%] h-auto mx-10 animate-bounce"
          />
        </p>
      </section>
    </div>
  );
}

export default Loginpage;
