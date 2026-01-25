import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { CgWebsite } from "react-icons/cg";
import { BsGithub, BsInfoCircle } from "react-icons/bs";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function ProjectCards(props) {
  const [showMore, setShowMore] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Split description into words
  const words = props.description.split(" ");
  const shouldShowToggle = words.length > 35;

  // Decide whether to show full or truncated text
  const displayedText = showMore ? props.description : words.slice(0, 35).join(" ") + (shouldShowToggle ? "..." : "");

  return (
    <Card className="project-card-view">
      <div style={{ position: "relative" }}>
        {!imageLoaded && (
          <SkeletonTheme baseColor="#1a1a2e" highlightColor="#16213e">
            <Skeleton height={200} style={{ position: "absolute", top: 0, left: 0, right: 0 }} />
          </SkeletonTheme>
        )}
        <Card.Img 
          variant="top" 
          src={props.imgPath} 
          alt="card-img"
          onLoad={() => setImageLoaded(true)}
          style={{ 
            display: imageLoaded ? 'block' : 'none',
            // height: "200px",
            objectFit: "cover"
          }}
        />
      </div>
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>

        <Card.Text style={{ textAlign: "justify" }}>
          {displayedText}
          {shouldShowToggle && (
            <span
              onClick={() => setShowMore(!showMore)}
              className="purple"
              style={{ cursor: "pointer", marginLeft: "5px", fontWeight: "500" }}
            >
              {showMore ? "Show Less" : "Show More"}
            </span>
          )}
        </Card.Text>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}>
          <Button variant="primary" href={props.ghLink} target="_blank" size="sm">
            <BsGithub /> &nbsp;
            {props.isBlog ? "Blog" : "GitHub"}
          </Button>

          {!props.isBlog && props.demoLink && (
            <Button
              variant="primary"
              href={props.demoLink}
              target="_blank"
              size="sm"
            >
              <CgWebsite /> &nbsp;
              {"Demo"}
            </Button>
          )}

          {props.aboutLink && (
            <Button
              variant="outline-primary"
              href={props.aboutLink}
              target="_blank"
              size="sm"
            >
              <BsInfoCircle /> &nbsp;
              {"How to Use"}
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

export default ProjectCards;
