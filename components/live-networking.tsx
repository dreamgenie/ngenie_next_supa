"use client"

import { useState } from "react"
import { Video, Mic, MicOff, VideoOff, Phone, MessageSquare, Share2, MoreVertical, Send } from "lucide-react"
import Image from "next/image"

// Sample participants data
const participants = [
  {
    id: 1,
    name: "Adam Smith",
    role: "Account Manager",
    avatar: "/placeholder.svg?height=80&width=80",
    isSpeaking: true,
    isMuted: false,
    isVideoOn: true,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    role: "Marketing Director",
    avatar: "/placeholder.svg?height=80&width=80",
    isSpeaking: false,
    isMuted: false,
    isVideoOn: true,
  },
  {
    id: 3,
    name: "Michael Chen",
    role: "Software Engineer",
    avatar: "/placeholder.svg?height=80&width=80",
    isSpeaking: false,
    isMuted: true,
    isVideoOn: false,
  },
  {
    id: 4,
    name: "Jessica Williams",
    role: "Product Manager",
    avatar: "/placeholder.svg?height=80&width=80",
    isSpeaking: false,
    isMuted: false,
    isVideoOn: true,
  },
]

export default function LiveNetworking() {
  const [isAudioMuted, setIsAudioMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [activeTab, setActiveTab] = useState("participants")
  const [hoveredButton, setHoveredButton] = useState<string | null>(null)

  // Common styles
  const darkBlueBackground = { backgroundColor: "#132144" }
  const darkerBlueBackground = { backgroundColor: "#222957" }
  const purpleBackground = { backgroundColor: "#855ad1" }
  const whiteText = { color: "white" }
  const grayText = { color: "#9ca3af" }

  return (
    <div style={{ height: "100%", width: "100%", display: "flex", ...darkBlueBackground }}>
      {/* Main Video Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "1.5rem" }}>
        {/* Active Speaker */}
        <div
          style={{
            flex: 1,
            ...darkerBlueBackground,
            borderRadius: "0.75rem",
            overflow: "hidden",
            position: "relative",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "1rem",
              left: "1rem",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              borderRadius: "0.25rem",
              padding: "0.25rem 0.5rem",
              ...whiteText,
              fontSize: "0.875rem",
            }}
          >
            Live Networking Session
          </div>
          <div
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              backgroundColor: "rgba(255, 0, 0, 0.7)",
              borderRadius: "0.25rem",
              padding: "0.25rem 0.5rem",
              color: "white",
              fontSize: "0.875rem",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            <span
              style={{ width: "0.5rem", height: "0.5rem", borderRadius: "9999px", backgroundColor: "white" }}
            ></span>
            Live
          </div>
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              src="/placeholder.svg?height=600&width=800"
              alt="Active Speaker"
              width={800}
              height={600}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "1rem",
                left: "1rem",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                borderRadius: "0.25rem",
                padding: "0.25rem 0.5rem",
                ...whiteText,
                fontSize: "0.875rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <div
                style={{
                  width: "2rem",
                  height: "2rem",
                  borderRadius: "9999px",
                  overflow: "hidden",
                }}
              >
                <Image
                  src="/placeholder.svg?height=40&width=40"
                  alt="Active Speaker"
                  width={40}
                  height={40}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div>
                <div style={{ fontWeight: "bold" }}>Adam Smith</div>
                <div style={{ fontSize: "0.75rem" }}>Account Manager</div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            padding: "1rem 0",
          }}
        >
          <button
            style={{
              width: "3rem",
              height: "3rem",
              borderRadius: "9999px",
              backgroundColor: isAudioMuted ? "#ef4444" : "rgba(255, 255, 255, 0.1)",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            onMouseEnter={() => setHoveredButton("audio")}
            onMouseLeave={() => setHoveredButton(null)}
          >
            {isAudioMuted ? (
              <MicOff style={{ color: "white", width: "1.25rem", height: "1.25rem" }} />
            ) : (
              <Mic style={{ color: "white", width: "1.25rem", height: "1.25rem" }} />
            )}
          </button>
          <button
            style={{
              width: "3rem",
              height: "3rem",
              borderRadius: "9999px",
              backgroundColor: isVideoOff ? "#ef4444" : "rgba(255, 255, 255, 0.1)",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            onClick={() => setIsVideoOff(!isVideoOff)}
            onMouseEnter={() => setHoveredButton("video")}
            onMouseLeave={() => setHoveredButton(null)}
          >
            {isVideoOff ? (
              <VideoOff style={{ color: "white", width: "1.25rem", height: "1.25rem" }} />
            ) : (
              <Video style={{ color: "white", width: "1.25rem", height: "1.25rem" }} />
            )}
          </button>
          <button
            style={{
              width: "3rem",
              height: "3rem",
              borderRadius: "9999px",
              backgroundColor: "#ef4444",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            onMouseEnter={() => setHoveredButton("end")}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <Phone style={{ color: "white", width: "1.25rem", height: "1.25rem", transform: "rotate(135deg)" }} />
          </button>
          <button
            style={{
              width: "3rem",
              height: "3rem",
              borderRadius: "9999px",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            onMouseEnter={() => setHoveredButton("chat")}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <MessageSquare style={{ color: "white", width: "1.25rem", height: "1.25rem" }} />
          </button>
          <button
            style={{
              width: "3rem",
              height: "3rem",
              borderRadius: "9999px",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            onMouseEnter={() => setHoveredButton("share")}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <Share2 style={{ color: "white", width: "1.25rem", height: "1.25rem" }} />
          </button>
          <button
            style={{
              width: "3rem",
              height: "3rem",
              borderRadius: "9999px",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            onMouseEnter={() => setHoveredButton("more")}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <MoreVertical style={{ color: "white", width: "1.25rem", height: "1.25rem" }} />
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div
        style={{
          width: "20rem",
          ...darkerBlueBackground,
          borderLeft: "1px solid rgba(255, 255, 255, 0.1)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
          <button
            style={{
              flex: 1,
              padding: "1rem",
              backgroundColor: activeTab === "participants" ? "#7755c2" : "transparent",
              border: "none",
              borderBottom: activeTab === "participants" ? "2px solid white" : "none",
              color: "white",
              fontWeight: activeTab === "participants" ? "bold" : "normal",
              cursor: "pointer",
            }}
            onClick={() => setActiveTab("participants")}
          >
            Participants
          </button>
          <button
            style={{
              flex: 1,
              padding: "1rem",
              backgroundColor: activeTab === "chat" ? "#7755c2" : "transparent",
              border: "none",
              borderBottom: activeTab === "chat" ? "2px solid white" : "none",
              color: "white",
              fontWeight: activeTab === "chat" ? "bold" : "normal",
              cursor: "pointer",
            }}
            onClick={() => setActiveTab("chat")}
          >
            Chat
          </button>
        </div>

        {/* Participants List */}
        {activeTab === "participants" && (
          <div style={{ flex: 1, padding: "1rem", overflowY: "auto" }}>
            <div style={{ ...whiteText, fontWeight: "bold", marginBottom: "1rem" }}>
              Participants ({participants.length})
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {participants.map((participant) => (
                <div
                  key={participant.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "0.75rem",
                    borderRadius: "0.5rem",
                    backgroundColor: participant.isSpeaking ? "rgba(119, 85, 194, 0.3)" : "rgba(255, 255, 255, 0.05)",
                    border: participant.isSpeaking ? "1px solid #7755c2" : "none",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "3rem",
                      height: "3rem",
                      borderRadius: "9999px",
                      overflow: "hidden",
                      marginRight: "1rem",
                    }}
                  >
                    <Image
                      src={participant.avatar || "/placeholder.svg"}
                      alt={participant.name}
                      width={80}
                      height={80}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    {participant.isSpeaking && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          width: "1rem",
                          height: "1rem",
                          borderRadius: "9999px",
                          backgroundColor: "#10b981",
                          border: "2px solid #222957",
                        }}
                      ></div>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ ...whiteText, fontWeight: "bold" }}>{participant.name}</div>
                    <div style={{ ...grayText, fontSize: "0.875rem" }}>{participant.role}</div>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    {participant.isMuted && (
                      <div
                        style={{
                          width: "2rem",
                          height: "2rem",
                          borderRadius: "9999px",
                          backgroundColor: "#ef4444",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <MicOff style={{ color: "white", width: "1rem", height: "1rem" }} />
                      </div>
                    )}
                    {!participant.isVideoOn && (
                      <div
                        style={{
                          width: "2rem",
                          height: "2rem",
                          borderRadius: "9999px",
                          backgroundColor: "#ef4444",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <VideoOff style={{ color: "white", width: "1rem", height: "1rem" }} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat */}
        {activeTab === "chat" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ flex: 1, padding: "1rem", overflowY: "auto" }}>
              <div style={{ ...whiteText, fontWeight: "bold", marginBottom: "1rem" }}>Group Chat</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ alignSelf: "flex-start", maxWidth: "80%" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "0.25rem",
                    }}
                  >
                    <div
                      style={{
                        width: "1.5rem",
                        height: "1.5rem",
                        borderRadius: "9999px",
                        overflow: "hidden",
                        marginRight: "0.5rem",
                      }}
                    >
                      <Image
                        src="/placeholder.svg?height=30&width=30"
                        alt="Sarah"
                        width={30}
                        height={30}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                    <div style={{ ...whiteText, fontSize: "0.875rem", fontWeight: "bold" }}>Sarah Johnson</div>
                  </div>
                  <div
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      borderRadius: "0 0.75rem 0.75rem 0.75rem",
                      padding: "0.75rem",
                      ...whiteText,
                      fontSize: "0.875rem",
                    }}
                  >
                    Hi everyone! Thanks for joining today's networking session.
                  </div>
                  <div style={{ ...grayText, fontSize: "0.75rem", marginTop: "0.25rem" }}>10:30 AM</div>
                </div>

                <div style={{ alignSelf: "flex-end", maxWidth: "80%" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "0.25rem",
                      justifyContent: "flex-end",
                    }}
                  >
                    <div style={{ ...whiteText, fontSize: "0.875rem", fontWeight: "bold" }}>You</div>
                  </div>
                  <div
                    style={{
                      backgroundColor: "#7755c2",
                      borderRadius: "0.75rem 0 0.75rem 0.75rem",
                      padding: "0.75rem",
                      ...whiteText,
                      fontSize: "0.875rem",
                    }}
                  >
                    Happy to be here! Looking forward to connecting with everyone.
                  </div>
                  <div style={{ ...grayText, fontSize: "0.75rem", marginTop: "0.25rem", textAlign: "right" }}>
                    10:31 AM
                  </div>
                </div>

                <div style={{ alignSelf: "flex-start", maxWidth: "80%" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "0.25rem",
                    }}
                  >
                    <div
                      style={{
                        width: "1.5rem",
                        height: "1.5rem",
                        borderRadius: "9999px",
                        overflow: "hidden",
                        marginRight: "0.5rem",
                      }}
                    >
                      <Image
                        src="/placeholder.svg?height=30&width=30"
                        alt="Michael"
                        width={30}
                        height={30}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                    <div style={{ ...whiteText, fontSize: "0.875rem", fontWeight: "bold" }}>Michael Chen</div>
                  </div>
                  <div
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      borderRadius: "0 0.75rem 0.75rem 0.75rem",
                      padding: "0.75rem",
                      ...whiteText,
                      fontSize: "0.875rem",
                    }}
                  >
                    I'd like to discuss potential collaborations in the tech space. Anyone interested?
                  </div>
                  <div style={{ ...grayText, fontSize: "0.75rem", marginTop: "0.25rem" }}>10:33 AM</div>
                </div>
              </div>
            </div>

            <div
              style={{
                padding: "1rem",
                borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "9999px",
                  padding: "0.5rem",
                }}
              >
                <input
                  type="text"
                  placeholder="Type a message..."
                  style={{
                    flex: 1,
                    backgroundColor: "transparent",
                    border: "none",
                    color: "white",
                    outline: "none",
                    padding: "0 0.5rem",
                  }}
                />
                <button
                  style={{
                    backgroundColor: "#7755c2",
                    border: "none",
                    borderRadius: "9999px",
                    width: "2rem",
                    height: "2rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <Send style={{ color: "white", width: "1rem", height: "1rem" }} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
