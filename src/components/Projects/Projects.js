import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
import addToCart from "../../Assets/Projects/e-comm.png";
import weather from "../../Assets/Projects/weather.png";
import youtube from "../../Assets/Projects/youtube.png";
import random from "../../Assets/Projects/number-guess.png";
import netflix from "../../Assets/Projects/netflix.png";
import addnote from "../../Assets/Projects/mininotes.png";
import studynotion from "../../Assets/Projects/study-notion.png";
import blogs from "../../Assets/Projects/blogs.png";
import aigenim from "../../Assets/Projects/ai-content-genim.png";

function Projects() {
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
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={blogs}
              isBlog={false}
              title="AnkitVerse – Dev Blogs"
              description="AnkitVerse is a developer-focused blogging platform where users can explore real-world coding issues and common challenges faced when starting out with programming. Each blog provides step-by-step explanations to help readers understand and solve problems efficiently. Users can create personalized profiles, add comments to posts, and engage with the community. The platform also highlights the latest blog updates to keep content fresh and relevant. Built using the powerful MERN stack, AnkitVerse offers a seamless experience for both readers and writers. It's an ideal space to learn, share knowledge, and grow as a developer."
              ghLink="https://github.com/Ankit91153/blog-frontend"
              demoLink="https://ankit-verse.vercel.app/"
            />
          </Col>
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={aigenim}
              isBlog={false}
              title="AI Content Generator Pro"
              description="Experience our cutting-edge AI-powered content generator that crafts compelling content across diverse niches—whether it's YouTube keyword ideas, coding snippets, engaging blog posts, or precise blog niche content. Enjoy a free track of up to 10,000 words with full history tracking, and continue generating content beyond that for only $9/₹9 via Razorpay. Dive into a practical learning journey: understand how AI engines generate creative content and explore the seamless integration of payment gateways within a robust MERN stack architecture."
              ghLink="https://github.com/Ankit91153/ai-generator-content"
              demoLink="https://ai-generator-content-rbtq.vercel.app/"
            />
          </Col>
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={studynotion}
              isBlog={false}
              title="StudyNotion"
              description="Introducing our versatile project with admin, instructor, and student panels. Admin manages categories, instructors handle courses with React pie charts, and students enjoy Razorpay-integrated course purchases. Powered by MERN Stack."
              ghLink="https://github.com/Ankit91153/studynotion"
              demoLink="https://studynotion-lemon.vercel.app/"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={addnote}
              isBlog={false}
              title="AddNote"
              description="Crafted a sleek note-taking app using MERN stack. Implemented features like user authentication and real-time updates. Demonstrated proficiency in JavaScript, React, Node.js, Express, and MongoDB."
              ghLink="https://github.com/Ankit91153/mininotesforntend"
              demoLink="https://mininotesapp.netlify.app/"
            />
          </Col>
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={youtube}
              isBlog={false}
              title="Youtube"
              description="2023 YouTube clone || This project is a front-end clone of the popular video-sharing platform, YouTube. It aims to recreate the familiar and user-friendly interface of YouTube, allowing users to browse, search, and watch videos seamlessly."
              ghLink="https://github.com/Ankit91153/youTube-Lite"
              demoLink="https://you-tube-lite.netlify.app"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={netflix}
              isBlog={false}
              title="Netflix"
              description="A Netflix clone project is a web application or mobile app that replicates the functionality and features of the original Netflix platform. The project involves creating a user-friendly interface ."
              ghLink="https://github.com/Ankit91153/netflixClone"
              demoLink="https://ankit91153.github.io/netflixClone/"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={weather}
              isBlog={false}
              title="Weather Website"
              description="I was tired of going out and seeing what the weather was like outside. Tired of using the google weather application. This simple weather application will only display the current weather for a given area."
              ghLink="https://github.com/Ankit91153/weatherApp"
              demoLink="https://weather-app-by-ankit.onrender.com/"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={addToCart}
              isBlog={false}
              title="Add-To-Cart"
              description="Shopping cart app built with React and React-Toolkit. This app is a clone of react javascript ecommerce  shopping-cart ...."
              ghLink="https://github.com/Ankit91153/e-commerce-website"
              demoLink="https://e-commerce-website-react-nine.vercel.app/"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={random}
              isBlog={false}
              title="Guess Number"
              description="The game is to guess a random number generated by a computer in the range 1 – 100 in a minimum number of Guesses."
              ghLink="https://github.com/Ankit91153/Number-Guesses-Game"
              demoLink="https://ankit91153.github.io/Number-Guesses-Game/"
            />
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default Projects;
