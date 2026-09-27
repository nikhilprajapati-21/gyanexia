// src/components/AIAssistant.js

import React, { useState } from "react";
import "./AIAssistant.css";
import { API_BASE_URL } from "../services/api";

const API_URL = `${API_BASE_URL}/ai/chat`;

const initialMessage = {
  id: 1,
  type: "bot",
  text: "Hi! 👋 I'm Gyanexia AI. How can I help you today?",
};

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState([
    initialMessage,
  ]);

  /*
   * ==========================================
   * OPEN AI
   * ==========================================
   */

  const handleOpen = () => {
    setIsOpen(true);
  };


  /*
   * ==========================================
   * CLOSE AI
   * ==========================================
   */

  const handleClose = () => {
    setIsOpen(false);

    // Start a fresh conversation next time
    setMessages([initialMessage]);

    setMessage("");

    setIsLoading(false);
  };


  /*
   * ==========================================
   * SEND MESSAGE
   * ==========================================
   */

  const handleSend = async (event) => {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage || isLoading) {
      return;
    }

    /*
     * Add user message immediately
     */

    const userMessage = {
      id: Date.now(),
      type: "user",
      text: trimmedMessage,
    };

    setMessages((previousMessages) => [
      ...previousMessages,
      userMessage,
    ]);

    setMessage("");
    setIsLoading(true);


    try {
      const response = await fetch(API_URL, {
        method: "POST",

        /*
         * Important:
         * Send authentication cookie.
         */

        credentials: "include",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          message: trimmedMessage,
        }),
      });

      const data = await response.json();


      /*
       * ==========================================
       * AUTHENTICATION ERROR
       * ==========================================
       */

      if (response.status === 401) {
        throw new Error(
          "Please log in to use Gyanexia AI."
        );
      }


      /*
       * ==========================================
       * OTHER API ERRORS
       * ==========================================
       */

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to get a response from Gyanexia AI."
        );
      }


      /*
       * ==========================================
       * AI RESPONSE
       * ==========================================
       */

      const botMessage = {
        id: Date.now() + 1,
        type: "bot",
        text:
          data?.reply ||
          "Sorry, I couldn't generate a response.",
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        botMessage,
      ]);

    } catch (error) {
      console.error(
        "Gyanexia AI error:",
        error
      );

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          id: Date.now() + 1,
          type: "bot",
          text:
            error?.message ||
            "Sorry, I'm having trouble connecting right now. Please try again in a moment. 🤖",
        },
      ]);

    } finally {
      setIsLoading(false);
    }
  };


  return (
    <>
      {/* ==========================================
          FLOATING AI BUTTON
      ========================================== */}

      {!isOpen && (
        <button
          type="button"
          className="ai-assistant-button"
          onClick={handleOpen}
          aria-label="Open Gyanexia AI Assistant"
        >
          <span className="ai-sparkle">
            ✦
          </span>

          <span className="ai-button-text">
            Need help?
          </span>
        </button>
      )}


      {/* ==========================================
          CHAT WINDOW
      ========================================== */}

      {isOpen && (
        <div className="ai-chat-window">

          {/* ======================================
              HEADER
          ====================================== */}

          <div className="ai-chat-header">

            <div className="ai-header-info">

              <div className="ai-avatar">
                ✦
              </div>

              <div>
                <h3>
                  Gyanexia AI
                </h3>

                <span>
                  AI Learning Assistant
                </span>
              </div>

            </div>


            {/* Close */}

            <button
              type="button"
              className="ai-close-button"
              onClick={handleClose}
              aria-label="Close Gyanexia AI"
            >
              ×
            </button>

          </div>


          {/* ======================================
              MESSAGES
          ====================================== */}

          <div className="ai-chat-messages">

            {messages.map((item) => (
              <div
                key={item.id}
                className={`ai-message-row ${
                  item.type === "user"
                    ? "ai-user-row"
                    : "ai-bot-row"
                }`}
              >

                <div
                  className={`ai-message ${
                    item.type === "user"
                      ? "ai-user-message"
                      : "ai-bot-message"
                  }`}
                >
                  {item.text}
                </div>

              </div>
            ))}


            {/* ====================================
                THINKING INDICATOR
            ==================================== */}

            {isLoading && (
              <div className="ai-message-row ai-bot-row">

                <div className="ai-message ai-bot-message ai-thinking">

                  <span></span>
                  <span></span>
                  <span></span>

                </div>

              </div>
            )}

          </div>


          {/* ======================================
              INPUT
          ====================================== */}

          <form
            className="ai-chat-input-area"
            onSubmit={handleSend}
          >

            <input
              type="text"
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              placeholder="Ask Gyanexia AI..."
              aria-label="Ask Gyanexia AI"
              disabled={isLoading}
              autoComplete="off"
            />

            <button
              type="submit"
              className="ai-send-button"
              disabled={
                !message.trim() ||
                isLoading
              }
              aria-label="Send message"
            >
              {isLoading ? "…" : "➤"}
            </button>

          </form>

        </div>
      )}
    </>
  );
};

export default AIAssistant;
