import React, { useState, useEffect } from "react";
import Preloader from "../src/components/Pre";
import NavBar from "./components/Navbar";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import Projects from "./components/Projects/Projects";
import Footer from "./components/Footer";
import Resume from "./components/Resume/ResumeNew";
import Chatbot from "./components/Chatbot/Chatbot";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import "./style.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [load, updateLoad] = useState(true);
  const [appReady, setAppReady] = useState(false);

  // PWA install prompt states
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      updateLoad(false);
      setAppReady(true); // Add this line
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;
    console.log("User choice:", outcome);

    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  return (
    <Router>
      <Preloader load={load} />
      <div className="App" id={load ? "no-scroll" : "scroll"}>
        <NavBar />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/project" element={<Projects />} />
          <Route path="/about" element={<About />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Footer />
        {appReady && <Chatbot />} {/* Changed this line */}

        {showInstallButton && (
          <button
            onClick={handleInstallClick}
            style={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
              padding: "10px 20px",
              fontSize: "16px",
              zIndex: 1000,
              cursor: "pointer",
              borderRadius: "5px",
              backgroundColor: "#c770f0",
              color: "white",
              border: "none",
              boxShadow: "0 2px 5px rgba(0,0,0,0.3)"
            }}
          >
            Install App
          </button>
        )}
      </div>
    </Router>
  );
}

export default App;
