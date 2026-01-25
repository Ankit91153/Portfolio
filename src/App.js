import React, { useState, useEffect } from "react";
import Preloader from "../src/components/Pre";
import NavBar from "./components/Navbar";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import Projects from "./components/Projects/Projects";
import Footer from "./components/Footer";
import Resume from "./components/Resume/ResumeNew";
import Chatbot from "./components/Chatbot/Chatbot";
import ChatbotWelcomePopup from "./components/ChatbotWelcomePopup/ChatbotWelcomePopup";
import { Batch } from "./components/Batch";

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
  const [batchVisible, setBatchVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      updateLoad(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleBatchVisibility = (isVisible) => {
    setBatchVisible(isVisible);
  };

  return (
    <Router>
      <Preloader load={load} />
      <Chatbot />
      <ChatbotWelcomePopup />
      
      {/* Batch component at the very top - FIXED */}
      <Batch onVisibilityChange={handleBatchVisibility} />
     
      <div 
        className="App" 
        id={load ? "no-scroll" : "scroll"}
        style={{ 
          // Account for both fixed elements
          transition: "padding-top 0.3s ease"
        }}
      >
        {/* NavBar is also FIXED */}
        <NavBar batchVisible={batchVisible} />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/project" element={<Projects />} />
          <Route path="/about" element={<About />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
