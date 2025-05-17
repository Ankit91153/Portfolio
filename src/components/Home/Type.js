import React from "react";
import Typewriter from "typewriter-effect";
import { TYPEWRITERHEADING } from "../../constant/home";

function Type() {
  return (
    <Typewriter
      options={{
        strings: TYPEWRITERHEADING,
        autoStart: true,
        loop: true,
        deleteSpeed: 50,
      }}
    />
  );
}

export default Type;
