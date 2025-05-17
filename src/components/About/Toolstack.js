import React from "react";
import { Col, Row } from "react-bootstrap";
import {
  SiVisualstudiocode,
  SiPostman,
  SiVercel,
} from "react-icons/si";
import { AiFillWindows } from "react-icons/ai";

const tools = [
  AiFillWindows,
  SiVisualstudiocode,
  SiPostman,
  SiVercel,
];

function Toolstack() {
  return (
    <Row style={{ justifyContent: "center", paddingBottom: "50px" }}>
      {tools.map((ToolIcon, idx) => (
        <Col xs={4} md={2} className="tech-icons" key={idx}>
          <ToolIcon />
        </Col>
      ))}
    </Row>
  );
}

export default Toolstack;
