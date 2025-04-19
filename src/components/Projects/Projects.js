import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
import { fetchProjects } from "../../apis/api";
import Button from "react-bootstrap/Button";

const LIMIT = 5;

function Projects() {
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(null);

  useEffect(() => {
    loadProjects(page);
  }, [page]);

  const loadProjects = async (currentPage) => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const data = await fetchProjects(currentPage, LIMIT);
      if (data) {
        setProjects((prev) => [...prev, ...data.projects]);
        setTotalPages(data.totalPages);
        if (currentPage >= data.totalPages) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!hasMore || loading) return;
    setPage((prev) => prev + 1);
  };

  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <h1 className="project-heading">
          My Recent <strong className="purple">Works </strong>
        </h1>
        <p style={{ color: "white" }}>
          Here are a few projects I've worked on recently.
        </p>
        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          {projects.map((project, index) => (
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
              {loading ? "Loading..." : "Load More"}
            </Button>
          </Row>
        )}
      </Container>
    </Container>
  );
}

export default Projects;
