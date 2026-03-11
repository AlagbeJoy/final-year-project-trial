import React, { useEffect, useState } from "react";
import study from "../assets/Images/study.jpg";
import study2 from "../assets/Images/study2.jpg"
// import study3 from "../assets/Images/study3.jpg"

import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const slides = [study, study2];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);


  return (
    <>
      <div className="px-8 py-5 ">
        <div className="flex justify-between items-center">
          Logo
          <div className="justify-end flex gap-5">
            <p
              className="hover:bg-[#5a6499] hover:text-white rounded-full py-2 px-5 font-medium border border-[#5a6499] text-[#5a6499]"
              onClick={() => navigate("/login")}
            >
              Login
            </p>
          </div>
        </div>

        <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-100 scale-110"
            style={{
              backgroundImage: `url(${slides[index]})`,
            }}
          ></div>

          <div className="text-center absolute inset-0 bg-white/70"></div>

          <div className="relative z-10 text-center">
            <p className=" font-extrabold text-3xl">
              Learn Smarter, Stay Motivated
            </p>
            <p className=" mt-4 text-xl font-medium">
              A gamified paltform that makes studying
              <br />
              engaging and rewarding
            </p>

            <div
              className=" mt-9 text-xl font-bold text-white bg-[#5a6499] inline-block px-6 py-4 rounded-full cursor-pointer"
              onClick={() => navigate("/createaccount")}
            >
              Get Started
            </div>
          </div>
        </section>

        {/* <section className="flex justify-between px-20 mt-10">
        <div className="bg-[#5a6499] px-10 py-10 rounded-sm shadow-xl text-white">
          Personalized
          <p>Make it available for use</p>
        </div>
        <div className="bg-[#5a6499] px-10 py-10 rounded-sm shadow-xl text-white">
          Gamification
        </div>
        <div className="bg-[#5a6499] px-10 py-10 rounded-sm shadow-xl text-white">
          Real-Time Ananlysis
        </div>
      </section> */}
      </div>

      <style>
        {`
@keyframes bgMove {
  0% {
    transform: scale(1.1) translateX(0px);
  }
  100% {
    transform: scale(1.2) translateX(-40px);
  }
}

.animate-bgMove {
  animation: bgMove 25s ease-in-out infinite alternate;
}
`}
      </style>
    </>
  );
}

export default Header;
