
import { Container, Row, Col } from "react-bootstrap";
import myImg from "../../Assets/avatar.png";
import Tilt from "react-parallax-tilt";

import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { INTRODUCEMYSELF } from "../../constant/home";
import { SOCIALLINKS } from "../../constant/misc";

function Home2() {
  return (
    <Container fluid className="home-about-section" id="about">
      <Container>
        <Row>
          <Col md={8} className="home-about-description">
            <h1 style={{ fontSize: "2.6em" }}>
              {INTRODUCEMYSELF.title.t1}{" "}
              <span className="purple"> {INTRODUCEMYSELF.title.t2} </span>{" "}
              {INTRODUCEMYSELF.title.t3}
            </h1>
            <p className="home-about-body">
              {INTRODUCEMYSELF.description.d1} <br />
              <br />
              {INTRODUCEMYSELF.description.d2}{" "}
              <i>
                <b className="purple">{INTRODUCEMYSELF.description.d3}</b>
              </i>
              <br />
              <br />
              {INTRODUCEMYSELF.description.d4}&nbsp;
              <i>
                <b className="purple">{INTRODUCEMYSELF.description.d5}</b>
              </i>{" "}
              {INTRODUCEMYSELF.description.d6}{" "}
              <i>
                <b className="purple">{INTRODUCEMYSELF.description.d7}</b>
              </i>
              <br />
              <br />
              {INTRODUCEMYSELF.description.d8}
              <b className="purple">{INTRODUCEMYSELF.description.d9}</b>
              {INTRODUCEMYSELF.description.d10}{" "}
              <i>
                <b className="purple">{INTRODUCEMYSELF.description.d11}</b>
              </i>
            </p>
          </Col>
          <Col md={4} className="myAvtar">
            <Tilt>
              <img
                src={myImg}
                className="img-fluid"
                alt="avatar"
                style={{ borderRadius: "50%" }}
              />
            </Tilt>
          </Col>
        </Row>

        {/* Featured Service Callout Banner */}
        <Row className="mt-5 mb-4">
          <Col md={12}>
            <div
              style={{
                background:
                  "linear-gradient(135deg, rgba(38, 22, 65, 0.85), rgba(18, 12, 32, 0.95))",
                border: "1px solid rgba(199, 112, 240, 0.4)",
                borderRadius: "18px",
                padding: "26px 32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "20px",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.35)",
              }}
            >
              <div style={{ textAlign: "left", maxWidth: "680px" }}>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.6px",
                    background: "rgba(199, 112, 240, 0.18)",
                    color: "#c770f0",
                    border: "1px solid rgba(199, 112, 240, 0.35)",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    display: "inline-block",
                    marginBottom: "10px",
                  }}
                >
                  Featured Service & Tool
                </span>
                <h3
                  style={{
                    fontSize: "1.45rem",
                    fontWeight: 700,
                    color: "#ffffff",
                    margin: "0 0 6px 0",
                  }}
                >
                  AI Resume Scanner & Exporter for{" "}
                  <span className="purple">ResumeKit</span> Mobile App
                </h3>
                <p
                  style={{
                    color: "#cbd5e1",
                    margin: 0,
                    fontSize: "0.92rem",
                    lineHeight: 1.5,
                  }}
                >
                  Upload your existing resume in PDF or Photo format. Auto-extract
                  data into the exact mobile app format, edit live, and copy with 1
                  click to import into the app.
                </p>
              </div>

              <Link
                to="/services"
                className="btn btn-primary"
                style={{
                  background: "linear-gradient(135deg, #c770f0, #8a2be2)",
                  border: "none",
                  padding: "12px 26px",
                  borderRadius: "10px",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#ffffff",
                  textDecoration: "none",
                  boxShadow: "0 4px 15px rgba(199, 112, 240, 0.4)",
                }}
              >
                <span>Try Resume Scanner</span>
                <FaArrowRight />
              </Link>
            </div>
          </Col>
        </Row>

        <Row>
          <Col md={12} className="home-about-social">
            <h1>FIND ME ON</h1>
            <p>
              Feel free to <span className="purple">connect </span>with me
            </p>
            <ul className="home-about-social-links">
              {SOCIALLINKS.length>0 &&  SOCIALLINKS?.map(({ icon: Icon, url }) => {
                return (
                  <li className="social-icons">
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="icon-colour  home-social-icons"
                    >
                      <Icon />
                    </a>
                  </li>
                );
              })}
            </ul>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default Home2;
