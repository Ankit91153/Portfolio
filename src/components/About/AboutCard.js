import React from "react";
import Card from "react-bootstrap/Card";
import { ImPointRight } from "react-icons/im";

function AboutCard() {
  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p style={{ textAlign: "justify" }}>
            Hi Everyone, I am <span className="purple">Ankit Kumar Pandey </span>
            from <span className="purple"> Phagwara Punjab, India.</span>
            <br />I am done My BCA <span className="purple">Bachelor of Computer Application</span> from <span className="purple">R.I.E.T Campus ,Phagwara</span>.
            <br />
            Additionally, I am currently Training as a <span className="purple">software developer</span> at
            <span className="purple"> O7 Services, Jalandhar</span>.
            <br />
            <br />
            Apart from coding, some other activities that I love to do!
          </p>
          <ul>
            <li className="about-activity">
              <ImPointRight /> Playing Games
            </li>
           
            <li className="about-activity">
              <ImPointRight /> Travelling
            </li>
          </ul>

          <p style={{ color: "rgb(155 126 172)" }}>
            "Make it work, make it right, make it fast!"{" "}
          </p>
          <footer className="blockquote-footer">AnkitKumarPandey</footer>
        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default AboutCard;
