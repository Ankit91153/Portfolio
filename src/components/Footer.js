import { Container, Row, Col } from "react-bootstrap";

import { SOCIALLINKS } from "../constant/misc";



function Footer() {
  const year = new Date().getFullYear();

  return (
    <Container fluid className="footer">
      <Row>
        <Col md="4" className="footer-copywright">
          <h3>Designed and Developed by Ankit Kumar Pandey</h3>
        </Col>
        <Col md="4" className="footer-copywright">
          <h3>Copyright © {year} AKay</h3>
        </Col>
        <Col md="4" className="footer-body">
          <ul className="footer-icons">
            {SOCIALLINKS.length>0 &&  SOCIALLINKS.map(({ icon: Icon, url }, idx) => (
              <li className="social-icons" key={idx}>
                <a
                  href={url}
                  style={{ color: "white" }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon />
                </a>
              </li>
            ))}
          </ul>
        </Col>
      </Row>
    </Container>
  );
}

export default Footer;
