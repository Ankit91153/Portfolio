import React from "react";
import { Col, Row } from "react-bootstrap";
import { CgCPlusPlus } from "react-icons/cg";
import {
  DiJavascript1,
  DiReact,
  DiNodejs,
  DiMongodb,
  DiGit,
} from "react-icons/di";
import { SiFirebase } from "react-icons/si";
import { IoLogoAndroid } from "react-icons/io";

const icons = [
  CgCPlusPlus,
  DiJavascript1,
  DiNodejs,
  DiReact,
  DiMongodb,
  IoLogoAndroid,
  DiGit,
  SiFirebase,
];

function Techstack() {
  return (
    <Row style={{ justifyContent: "center", paddingBottom: "50px" }}>
      {icons.map((IconComponent, idx) => (
        <Col xs={4} md={2} className="tech-icons" key={idx}>
          <IconComponent />
        </Col>
      ))}
    </Row>
  );
}

export default Techstack;
