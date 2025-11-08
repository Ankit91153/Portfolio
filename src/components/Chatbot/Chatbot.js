import { useState, useRef, useEffect } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import "./Chatbot.css";
import { CHAT_BOT_API, TITLE } from "../../constant/chat";
import chatbotGif from "../../Assets/chatbot.gif";

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Hi! I'm **Ankit's AI assistant**. I can help you learn about his projects, skills, experience, and more. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Ensure component is fully loaded before showing
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100); // Small delay to ensure DOM is ready
    return () => clearTimeout(timer);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputMessage.trim() === "") return;

    // Add user message
    const userMessage = {
      type: "user",
      text: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

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
          question: inputMessage,
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
    }

    setInputMessage("");
  };

  const handleClickOutside = (e) => {
    if (
      chatContainerRef.current &&
      !chatContainerRef.current.contains(e.target)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Don't render until component is loaded
  if (!isLoaded) {
    return null;
  }

  return (
    <>
      {/* Chatbot Trigger */}
      <div 
        className="chatbot-trigger" 
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          cursor: 'pointer',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #c770f0, #be50f4)',
          boxShadow: '0 4px 15px rgba(199, 112, 240, 0.4)',
          border: '2px solid #c770f0',
          transition: 'transform 0.3s ease'
        }}
        onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
      >
        <img
          src={chatbotGif}
          alt="Chat with me"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%'
          }}
          onError={(e) => {
            // Fallback to emoji if GIF fails
            e.target.style.display = 'none';
            e.target.parentElement.innerHTML = '💬';
            e.target.parentElement.style.fontSize = '24px';
            e.target.parentElement.style.color = 'white';
          }}
        />
      </div>

      {/* Chat Modal */}
      {isOpen && (
        <div className="chatbot-overlay">
          <div className="chatbot-container" ref={chatContainerRef}>
            <div className="chatbot-header">
              <h5>{TITLE}</h5>
              <button className="close-btn" onClick={() => setIsOpen(false)}>
                ×
              </button>
            </div>

            <div className="chatbot-messages">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`message ${
                    message.type === "user" ? "user-message" : "bot-message"
                  } ${message.isTyping ? "typing-message" : ""}`}
                >
                  <div className="message-content">
                    {message.isTyping ? (
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    ) : (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: message.text.replace(
                            /\*\*(.*?)\*\*/g,
                            "<strong>$1</strong>"
                          ),
                        }}
                      />
                    )}
                  </div>
                  {!message.isTyping && (
                    <div className="message-time">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {message.metadata && (
                        <span className="message-metadata">
                          • {message.metadata.relevance} relevance
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <Form onSubmit={handleSendMessage} className="chatbot-input-form">
              <Row className="align-items-center">
                <Col xs={9}>
                  <Form.Control
                    type="text"
                    placeholder="Type your message..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    className="message-input"
                  />
                </Col>
                <Col xs={3}>
                  <Button
                    type="submit"
                    className="send-btn"
                    disabled={inputMessage.trim() === ""}
                  >
                    Send
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;
