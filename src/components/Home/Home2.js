import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import myImg from "../../Assets/avatar.png";
import Tilt from "react-parallax-tilt";
import {
  AiFillGithub,
  AiOutlineTwitter,
  AiFillInstagram,
} from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";
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
                      href="https://github.com/Ankit91153"
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
