"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Paperclip, Mic, ImageIcon } from "lucide-react"
import Image from "next/image"

// Sample chat messages
const initialMessages = [
  {
    id: 1,
    sender: "genie",
    content: "Hello! I'm your Network Genie. How can I assist you with your networking today?",
    timestamp: "10:30 AM",
  },
  {
    id: 2,
    sender: "user",
    content: "I need to find contacts in the tech industry in San Francisco.",
    timestamp: "10:31 AM",
  },
  {
    id: 3,
    sender: "genie",
    content:
      "I've found 15 contacts in your network who work in the tech industry in San Francisco. Would you like me to list them or filter them further?",
    timestamp: "10:31 AM",
  },
  {
    id: 4,
    sender: "user",
    content: "Can you filter for software engineering roles specifically?",
    timestamp: "10:32 AM",
  },
  {
    id: 5,
    sender: "genie",
    content:
      "I've narrowed it down to 7 contacts in software engineering roles in San Francisco. Here are the top 3 based on your interaction history:\n\n1. Michael Chen - Senior Software Engineer at CodeWorks\n2. Jennifer Liu - Engineering Manager at TechGrowth\n3. David Park - Full Stack Developer at InnovateTech",
    timestamp: "10:32 AM",
  },
]

export default function GenieChat() {
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Common styles
  const darkBlueBackground = { backgroundColor: "#132144" }
  const darkerBlueBackground = { backgroundColor: "#222957" }
  const purpleBackground = { backgroundColor: "#855ad1" }
  const whiteText = { color: "white" }
  const grayText = { color: "#9ca3af" }

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Handle sending a new message
  const handleSendMessage = () => {
    if (newMessage.trim() === "") return

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      sender: "user",
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
    setMessages([...messages, userMessage])
    setNewMessage("")

    // Simulate Genie typing
    setIsTyping(true)
    setTimeout(() => {
      // Add Genie response
      const genieResponse = {
        id: messages.length + 2,
        sender: "genie",
        content: "I'm analyzing your request and will get back to you shortly with the information you need.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prevMessages) => [...prevMessages, genieResponse])
      setIsTyping(false)
    }, 2000)
  }

  return (
    <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", ...darkBlueBackground }}>
      {/* Chat Messages */}
      <div
        style={{
          flex: 1,
          padding: "1.5rem",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              display: "flex",
              flexDirection: message.sender === "user" ? "row-reverse" : "row",
              alignItems: "flex-start",
              gap: "1rem",
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: "2.5rem",
                height: "2.5rem",
                borderRadius: "9999px",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              {message.sender === "genie" ? (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    ...purpleBackground,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  G
                </div>
              ) : (
                <Image
                  src="/placeholder.svg?height=40&width=40"
                  alt="User"
                  width={40}
                  height={40}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              )}
            </div>

            {/* Message Content */}
            <div
              style={{
                maxWidth: "70%",
                backgroundColor: message.sender === "user" ? "#7755c2" : "#222957",
                borderRadius: "0.75rem",
                padding: "1rem",
                position: "relative",
              }}
            >
              <p style={{ ...whiteText, whiteSpace: "pre-wrap" }}>{message.content}</p>
              <span
                style={{
                  ...grayText,
                  fontSize: "0.75rem",
                  position: "absolute",
                  bottom: "0.25rem",
                  [message.sender === "user" ? "left" : "right"]: "0.5rem",
                }}
              >
                {message.timestamp}
              </span>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
            <div
              style={{
                width: "2.5rem",
                height: "2.5rem",
                borderRadius: "9999px",
                overflow: "hidden",
                flexShrink: 0,
                ...purpleBackground,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.25rem",
                fontWeight: "bold",
                color: "white",
              }}
            >
              G
            </div>
            <div
              style={{
                backgroundColor: "#222957",
                borderRadius: "0.75rem",
                padding: "1rem",
                ...whiteText,
              }}
            >
              <div style={{ display: "flex", gap: "0.25rem" }}>
                <div
                  style={{
                    width: "0.5rem",
                    height: "0.5rem",
                    borderRadius: "9999px",
                    backgroundColor: "white",
                    animation: "bounce 1s infinite",
                  }}
                ></div>
                <div
                  style={{
                    width: "0.5rem",
                    height: "0.5rem",
                    borderRadius: "9999px",
                    backgroundColor: "white",
                    animation: "bounce 1s infinite 0.2s",
                  }}
                ></div>
                <div
                  style={{
                    width: "0.5rem",
                    height: "0.5rem",
                    borderRadius: "9999px",
                    backgroundColor: "white",
                    animation: "bounce 1s infinite 0.4s",
                  }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div
        style={{
          padding: "1rem",
          borderTop: "1px solid #222957",
          ...darkerBlueBackground,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: "9999px",
            padding: "0.5rem 1rem",
          }}
        >
          <button
            style={{
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Paperclip style={{ color: "white", width: "1.25rem", height: "1.25rem" }} />
          </button>
          <button
            style={{
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ImageIcon style={{ color: "white", width: "1.25rem", height: "1.25rem" }} />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage()
            }}
            placeholder="Type your message..."
            style={{
              flex: 1,
              backgroundColor: "transparent",
              border: "none",
              color: "white",
              outline: "none",
              padding: "0.5rem 0",
            }}
          />
          <button
            style={{
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Mic style={{ color: "white", width: "1.25rem", height: "1.25rem" }} />
          </button>
          <button
            onClick={handleSendMessage}
            style={{
              backgroundColor: "#7755c2",
              border: "none",
              borderRadius: "9999px",
              width: "2.5rem",
              height: "2.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <Send style={{ color: "white", width: "1.25rem", height: "1.25rem" }} />
          </button>
        </div>
      </div>
    </div>
  )
}
