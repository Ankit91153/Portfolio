import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
import { DESCRIPTION, PROJECTS, TITLE1, TITLE2, CATEGORIES } from "../../constant/project";
import "./Projects.css";

function Projects() {
  const [activeCategory, setActiveCategory] = useState("All");

  // Filter projects based on selected category
  const filteredProjects = activeCategory === "All" 
    ? PROJECTS 
    : PROJECTS.filter(project => {
        // Handle both single category (string) and multiple categories (array)
        if (Array.isArray(project.category)) {
          return project.category.includes(activeCategory);
        } else {
          return project.category === activeCategory;
        }
      });

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

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

        {/* Category Tabs */}
        <div className="category-tabs-container">
          <div className="category-tabs">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                className={`category-tab ${activeCategory === category ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="projects-grid" key={activeCategory}>
          <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
            {filteredProjects.map((project, index) => (
              <Col md={4} className="project-card" key={project.id}>
                <div 
                  className="project-card-wrapper"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProjectCard
                    imgPath={project.imgPath}
                    isBlog={false}
                    title={project.title}
                    description={project.description}
                    ghLink={project.ghLink}
                    demoLink={project.demoLink}
                    aboutLink={project.aboutLink}
                  />
                </div>
              </Col>
            ))}
          </Row>
        </div>

        {filteredProjects.length === 0 && (
          <div style={{ textAlign: "center", color: "white", padding: "50px 0" }}>
            <h4>No projects found in this category</h4>
            <p>Try selecting a different category</p>
          </div>
        )}
      </Container>
    </Container>
  );
}

export default Projects;
