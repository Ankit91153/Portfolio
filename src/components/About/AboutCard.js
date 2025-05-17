import React from "react";
import Card from "react-bootstrap/Card";
import { ImPointRight } from "react-icons/im";
import { ABOUT } from "../../constant/about";

function AboutCard() {
  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p style={{ textAlign: "justify" }}>
            {ABOUT.description.d1} <span className="purple">{ABOUT.description.d2}</span>{ABOUT.description.d3}{" "}
            <span className="purple">{ABOUT.description.d4}</span>
            <br />
            <br />
            {ABOUT.description.d5} <span className="purple">{ABOUT.description.d6}</span> {ABOUT.description.d7}{" "}
            <span className="purple">{ABOUT.description.d8}</span>{ABOUT.description.d9}
            <br />
            {ABOUT.description.d10}{" "}
            <span className="purple">{ABOUT.description.d11}</span> {ABOUT.description.d12}{" "}
            <span className="purple">{ABOUT.description.d13}</span>.
            <br />
            <br />
            {ABOUT.description.d14}          </p>
          <ul>
            <li className="about-activity">
              <ImPointRight /> {ABOUT.description.d15}
            </li>
            <li className="about-activity">
              <ImPointRight /> {ABOUT.description.d16}
            </li>
          </ul>

          <p style={{ color: "rgb(155 126 172)", fontStyle: "italic" }}>
          {ABOUT.thought.title}
          </p>
          <footer className="blockquote-footer">{ABOUT.thought.writtenby}</footer>
        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default AboutCard;
