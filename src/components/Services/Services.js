import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Particle from "../Particle";
import { CgWebsite } from "react-icons/cg";
import resumeImg from "../../Assets/Projects/ai-content-genim.png";
import "../Projects/Projects.css";

function Services() {
  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <h1 className="project-heading">
          My <strong className="purple">Services</strong>
        </h1>
        <p style={{ color: "white" }}>
          Here are the services and developer utilities I provide.
        </p>

        <Row style={{ justifyContent: "center", paddingBottom: "50px" }}>
          <Col md={4} className="project-card">
            <Card className="project-card-view">
              <Card.Img
                variant="top"
                src={resumeImg}
                alt="AI Resume Parser"
                style={{ height: "200px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title>AI Resume Parser</Card.Title>
                <Card.Text style={{ textAlign: "justify" }}>
                  Upload your resume in PDF/Image or take a live photo using your camera.
                  Automatically extracts candidate details into the ResumeKit mobile format with
                  editable JSON and 1-click copy.
                </Card.Text>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    variant="primary"
                    as={Link}
                    to="/services/resume-scanner"
                    size="sm"
                  >
                    <CgWebsite /> &nbsp; Open Tool
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default Services;
