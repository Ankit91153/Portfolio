import React from "react";
import { Container } from "react-bootstrap";
import Particle from "../Particle";
import ResumeScanner from "./ResumeScanner";
import "./Services.css";

export default function ResumeScannerPage() {
  return (
    <Container fluid className="services-section">
      <Particle />
      <Container>
        <div className="services-header text-center mb-4">
          <h1 className="services-title">
            ResumeKit <strong className="purple">Web Scanner & Exporter</strong>
          </h1>
          <p className="services-subtitle">
            Scan your resume (PDF or Photo) → Auto-extract into ResumeKit Expo schema → Edit & Copy JSON directly to your mobile app.
          </p>
        </div>
        <ResumeScanner standalone={true} />
      </Container>
    </Container>
  );
}
