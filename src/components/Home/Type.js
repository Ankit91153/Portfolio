import React from "react";
import Typewriter from "typewriter-effect";

function Type() {
  return (
    <Typewriter
      options={{
        strings: [
          "Passionate Full Stack Developer 💻",
          "Creative Front-end Engineer 🎨",
          "MERN Stack Enthusiast 🚀",
          "Mobile App Creator 📱",
          "Tech Problem Solver 🧠",
          "Open Source Contributor 🌐"
          
        ],
        autoStart: true,
        loop: true,
        deleteSpeed: 50,
      }}
    />
  );
}

export default Type;
