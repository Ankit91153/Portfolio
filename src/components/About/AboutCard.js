import React from "react";
import Card from "react-bootstrap/Card";
import { ImPointRight } from "react-icons/im";

function AboutCard() {
  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p style={{ textAlign: "justify" }}>
            Hey there! I'm <span className="purple">Ankit Kumar Pandey</span>, a passionate coder and lifelong learner from{" "}
            <span className="purple">Phagwara, Punjab, India</span>.
            <br />
            <br />
            I hold a degree in <span className="purple">Bachelor of Computer Applications (BCA)</span> from{" "}
            <span className="purple">R.I.E.T Campus, Phagwara</span>, where my journey into the tech world truly began.
            <br />
            Currently, I'm sharpening my skills and building cool stuff as a{" "}
            <span className="purple">Software Developer</span> at{" "}
            <span className="purple">Examroom.ai, Bengaluru</span>.
            <br />
            <br />
            When I'm not deep in code or debugging like a detective, you'll find me enjoying a few other passions in life:
          </p>
          <ul>
            <li className="about-activity">
              <ImPointRight /> 🎮 Gaming – because strategy and reflexes are fun outside the terminal too!
            </li>
            <li className="about-activity">
              <ImPointRight /> ✈️ Traveling – exploring new places refreshes the soul and fuels creativity.
            </li>
          </ul>

          <p style={{ color: "rgb(155 126 172)", fontStyle: "italic" }}>
            "Make it work, make it right, make it fast."
          </p>
          <footer className="blockquote-footer">Ankit Kumar Pandey</footer>
        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default AboutCard;
