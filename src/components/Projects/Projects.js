import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
import { DESCRIPTION, PROJECTS, TITLE1, TITLE2 } from "../../constant/project";
import Button from "react-bootstrap/Button";

const LIMIT = 3;

function Projects() {
  const [visibleCount, setVisibleCount] = useState(LIMIT);

  const handleLoadMore = () => {
    console.log("HELLL");
    setVisibleCount((prev) => prev + LIMIT);
  };

  const visibleProjects = [...PROJECTS].reverse().slice(0, visibleCount);
  const hasMore = visibleCount < PROJECTS.length;

  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <h1 className="project-heading">
          {TITLE1} <strong className="purple">{TITLE2} </strong>
        </h1>
        <p style={{ color: "white" }}>
          {DESCRIPTION}
        </p>
        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          {visibleProjects.map((project, index) => (
            <Col md={4} className="project-card" key={index}>
              <ProjectCard
                imgPath={project.imgPath}
                isBlog={false}
                title={project.title}
                description={project.description}
                ghLink={project.ghLink}
                demoLink={project.demoLink}
              />
            </Col>
          ))}
        </Row>
      </Container>
      <Container>
        {hasMore && (
          <Row style={{ justifyContent: "center", position: "relative" }}>
            <Button
              variant="primary"
              onClick={handleLoadMore}
              style={{ maxWidth: "250px" }}
            >
              Load More
            </Button>
          </Row>
        )}
      </Container>
    </Container>
  );
}

export default Projects;
