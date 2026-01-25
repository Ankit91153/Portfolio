import React, { useState, useRef, useEffect } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import "./Chatbot.css";
import { CHAT_BOT_API, TITLE } from "../../constant/chat";
import chatbotGif from "../../Assets/chatbot.gif";

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Hi! I'm **Ankit's AI assistant**. I can help you learn about his projects, skills, experience, and more. What would you like to know?",
      timestamp: new Date(),
    },
    {
      type: "bot",
      text: "⚠️ Note: The backend is hosted on a free server, so the first API response may take a little longer. Thank you for your patience.",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputMessage.trim() === "" || isProcessing) return;

    setIsProcessing(true);

    // Add user message
    const userMessage = {
      type: "user",
      text: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Clear input immediately
    const currentMessage = inputMessage;
    setInputMessage("");

    // Add typing indicator
    const typingMessage = {
      type: "bot",
      text: "Typing...",
      timestamp: new Date(),
      isTyping: true,
    };

    setMessages((prev) => [...prev, typingMessage]);

    try {
      // Call your API
      const response = await fetch(CHAT_BOT_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: currentMessage,
        }),
      });

      const data = await response.json();

      // Remove typing indicator and add actual response
      setMessages((prev) => {
        const withoutTyping = prev.filter((msg) => !msg.isTyping);
        const botMessage = {
          type: "bot",
          text: data.success
            ? data.answer
            : "Sorry, I couldn't process your question right now. Please try again later.",
          timestamp: new Date(),
          metadata: data.metadata || null,
        };
        return [...withoutTyping, botMessage];
      });
    } catch (error) {
      console.error("Error calling chatbot API:", error);

      // Remove typing indicator and add error message
      setMessages((prev) => {
        const withoutTyping = prev.filter((msg) => !msg.isTyping);
        const errorMessage = {
          type: "bot",
          text: "Sorry, I'm having trouble connecting right now. Please try again in a moment!",
          timestamp: new Date(),
        };
        return [...withoutTyping, errorMessage];
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Chatbot Widget Container */}
      <div className="chatbot-widget">
        {/* Chat Window */}
        <div className={`chat-window ${isOpen ? 'open' : 'closed'}`}>
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="bot-avatar">
                <img src={chatbotGif} alt="AI Assistant" />
              </div>
              <div className="bot-info">
                <h4>{TITLE}</h4>
                <span className="status">Online</span>
              </div>
            </div>
            <button className="minimize-btn" onClick={toggleChat}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${message.type === "user" ? "user-message" : "bot-message"} ${message.isTyping ? "typing-message" : ""}`}
              >
                {message.type === "bot" && !message.isTyping && (
                  <div className="message-avatar">
                    <img src={chatbotGif} alt="Bot" />
                  </div>
                )}
                <div className="message-content">
                  {message.isTyping ? (
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  ) : (
                    <div
                      className="message-text"
                      dangerouslySetInnerHTML={{
                        __html: message.text.replace(
                          /\*\*(.*?)\*\*/g,
                          "<strong>$1</strong>"
                        ),
                      }}
                    />
                  )}
                  {!message.isTyping && (
                    <div className="message-time">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <Form onSubmit={handleSendMessage} className="chat-input-form">
            <div className="input-container">
              <input
                type="text"
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="message-input"
                disabled={isProcessing}
              />
              <button
                type="submit"
                className="send-button"
                disabled={inputMessage.trim() === "" || isProcessing}
              >
                {isProcessing ? (
                  <div className="loading-spinner"></div>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </div>
          </Form>
        </div>

        {/* Chat Trigger Button */}
        <button className="chat-trigger" onClick={toggleChat}>
          <div className={`trigger-content ${isOpen ? 'hidden' : 'visible'}`}>
            <img src={chatbotGif} alt="Chat with me" />
          </div>
          <div className={`close-icon ${isOpen ? 'visible' : 'hidden'}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        </button>

        {/* Notification Badge */}
        {!isOpen && (
          <div className="notification-badge">
            <span>1</span>
          </div>
        )}
      </div>
    </>
  );
}

export default Chatbot;
