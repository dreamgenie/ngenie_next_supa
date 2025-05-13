"use client"

import { useState, useEffect, useRef } from "react"
import { Search, RefreshCw, UserPlus, ArrowRight, Sparkles, ChevronDown, ChevronUp } from "lucide-react"
import Image from "next/image"

// Sample user data
const userData = {
  id: 1,
  name: "Adam Smith",
  role: "Account Manager",
  company: "TechGrowth Inc.",
  interests: ["Technology", "Marketing", "Sales", "Leadership", "Networking"],
  skills: ["Account Management", "Client Relations", "Strategic Planning", "Team Leadership"],
  industry: "Technology",
}

// Sample mirror connections data
const mirrorConnections = [
  {
    id: 1,
    name: "Jennifer Parker",
    role: "Marketing Director",
    company: "InnovateTech",
    avatar: "/placeholder.svg?height=60&width=60",
    mutualConnections: 3,
    matchScore: 92,
    interests: ["Marketing", "Technology", "Digital Strategy", "Leadership"],
    skills: ["Digital Marketing", "Brand Strategy", "Team Leadership", "Market Analysis"],
    industry: "Technology",
    reason: "Similar role in tech industry with complementary skills",
  },
  {
    id: 2,
    name: "Michael Reynolds",
    role: "Sales Director",
    company: "GrowthPartners",
    avatar: "/placeholder.svg?height=60&width=60",
    mutualConnections: 2,
    matchScore: 88,
    interests: ["Sales", "Technology", "Business Development", "Networking"],
    skills: ["Sales Strategy", "Client Acquisition", "Team Leadership", "Negotiation"],
    industry: "Technology",
    reason: "Complementary role with shared interests in technology and networking",
  },
  {
    id: 3,
    name: "Sarah Chen",
    role: "Product Manager",
    company: "TechSolutions",
    avatar: "/placeholder.svg?height=60&width=60",
    mutualConnections: 4,
    matchScore: 85,
    interests: ["Product Development", "Technology", "User Experience", "Leadership"],
    skills: ["Product Strategy", "Agile Methodology", "Team Coordination", "Market Research"],
    industry: "Technology",
    reason: "Works in the same industry with complementary product knowledge",
  },
  {
    id: 4,
    name: "David Wilson",
    role: "Business Development Manager",
    company: "StrategyPlus",
    avatar: "/placeholder.svg?height=60&width=60",
    mutualConnections: 1,
    matchScore: 82,
    interests: ["Business Development", "Sales", "Strategic Partnerships", "Networking"],
    skills: ["Partnership Building", "Client Relations", "Strategic Planning", "Negotiation"],
    industry: "Consulting",
    reason: "Complementary business development skills and shared networking interest",
  },
  {
    id: 5,
    name: "Emily Rodriguez",
    role: "Customer Success Manager",
    company: "ClientFirst",
    avatar: "/placeholder.svg?height=60&width=60",
    mutualConnections: 2,
    matchScore: 80,
    interests: ["Customer Experience", "Technology", "Client Relations", "Leadership"],
    skills: ["Customer Retention", "Client Management", "Problem Solving", "Communication"],
    industry: "Technology",
    reason: "Complementary role focused on client success and retention",
  },
  {
    id: 6,
    name: "Robert Kim",
    role: "Account Executive",
    company: "TechGrowth Inc.",
    avatar: "/placeholder.svg?height=60&width=60",
    mutualConnections: 5,
    matchScore: 78,
    interests: ["Sales", "Technology", "Account Management", "Networking"],
    skills: ["Sales Strategy", "Client Relations", "Negotiation", "Product Knowledge"],
    industry: "Technology",
    reason: "Works at the same company with similar role and interests",
  },
]

export default function ConnectionMirror() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedConnection, setSelectedConnection] = useState<number | null>(null)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isDetailExpanded, setIsDetailExpanded] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Check for mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener("resize", handleResize)
    handleResize() // Initial check

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Common styles
  const darkBlueBackground = { backgroundColor: "#132144" }
  const darkerBlueBackground = { backgroundColor: "#222957" }
  const purpleBackground = { backgroundColor: "#855ad1" }
  const whiteText = { color: "white" }
  const grayText = { color: "#9ca3af" }

  // Filter connections based on search term
  const filteredConnections = mirrorConnections.filter(
    (connection) =>
      connection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      connection.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      connection.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      connection.interests.some((interest) => interest.toLowerCase().includes(searchTerm.toLowerCase())) ||
      connection.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // Handle refresh/analyze button click
  const handleAnalyze = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
    }, 2000)
  }

  // Draw connection visualization
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      const parent = canvas.parentElement
      if (parent) {
        canvas.width = parent.clientWidth
        canvas.height = parent.clientHeight
      }
      drawVisualization()
    }

    // Initial resize
    resizeCanvas()

    // Listen for window resize
    window.addEventListener("resize", resizeCanvas)

    // Draw visualization
    function drawVisualization() {
      if (!ctx || !canvas) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Get selected connection
      const connection = selectedConnection ? mirrorConnections.find((conn) => conn.id === selectedConnection) : null

      if (!connection) {
        // Draw placeholder text
        ctx.font = isMobile ? "14px Arial" : "16px Arial"
        ctx.fillStyle = "#9ca3af"
        ctx.textAlign = "center"
        ctx.fillText("Select a connection to view mirror analysis", canvas.width / 2, canvas.height / 2)
        return
      }

      // Adjust positions based on canvas size
      const userX = isMobile ? canvas.width * 0.35 : canvas.width * 0.3
      const userY = canvas.height / 2
      const connectionX = isMobile ? canvas.width * 0.65 : canvas.width * 0.7
      const connectionY = canvas.height / 2
      const nodeRadius = isMobile ? 30 : 40

      // Draw connection line
      ctx.beginPath()
      ctx.moveTo(userX + nodeRadius, userY)
      ctx.lineTo(connectionX - nodeRadius, connectionY)
      ctx.strokeStyle = "#855ad1"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw user node
      ctx.beginPath()
      ctx.arc(userX, userY, nodeRadius, 0, Math.PI * 2)
      ctx.fillStyle = "#855ad1"
      ctx.fill()

      // Draw connection node
      ctx.beginPath()
      ctx.arc(connectionX, connectionY, nodeRadius, 0, Math.PI * 2)
      ctx.fillStyle = "#ff5757"
      ctx.fill()

      // Draw user label
      ctx.font = isMobile ? "bold 12px Arial" : "bold 14px Arial"
      ctx.fillStyle = "white"
      ctx.textAlign = "center"
      ctx.fillText(userData.name, userX, userY - (isMobile ? 45 : 60))
      ctx.font = isMobile ? "10px Arial" : "12px Arial"
      ctx.fillText(userData.role, userX, userY - (isMobile ? 30 : 40))

      // Draw connection label
      ctx.font = isMobile ? "bold 12px Arial" : "bold 14px Arial"
      ctx.fillText(connection.name, connectionX, connectionY - (isMobile ? 45 : 60))
      ctx.font = isMobile ? "10px Arial" : "12px Arial"
      ctx.fillText(connection.role, connectionX, connectionY - (isMobile ? 30 : 40))

      // Draw match score
      const scoreRadius = isMobile ? 20 : 25
      ctx.beginPath()
      ctx.arc(canvas.width / 2, canvas.height / 2 - (isMobile ? 20 : 30), scoreRadius, 0, Math.PI * 2)
      ctx.fillStyle = "#10b981"
      ctx.fill()
      ctx.font = isMobile ? "bold 12px Arial" : "bold 14px Arial"
      ctx.fillStyle = "white"
      ctx.textAlign = "center"
      ctx.fillText(`${connection.matchScore}%`, canvas.width / 2, canvas.height / 2 - (isMobile ? 16 : 25))

      // Draw shared interests
      const sharedInterests = connection.interests.filter((interest) => userData.interests.includes(interest))
      ctx.font = isMobile ? "10px Arial" : "12px Arial"
      ctx.fillStyle = "#9ca3af"
      ctx.textAlign = "center"
      ctx.fillText(
        `${sharedInterests.length} Shared Interests`,
        canvas.width / 2,
        canvas.height / 2 + (isMobile ? 5 : 10),
      )

      // Draw shared skills
      const sharedSkills = connection.skills.filter((skill) => userData.skills.includes(skill))
      ctx.fillText(
        `${sharedSkills.length} Complementary Skills`,
        canvas.width / 2,
        canvas.height / 2 + (isMobile ? 20 : 30),
      )

      // Draw mutual connections
      ctx.fillText(
        `${connection.mutualConnections} Mutual Connections`,
        canvas.width / 2,
        canvas.height / 2 + (isMobile ? 35 : 50),
      )

      // Draw sparkle effects
      const time = Date.now() / 1000
      for (let i = 0; i < 5; i++) {
        const angle = (time + i) % (Math.PI * 2)
        const x = canvas.width / 2 + Math.cos(angle) * (isMobile ? 30 : 40)
        const y = canvas.height / 2 + Math.sin(angle) * (isMobile ? 30 : 40)
        const size = 3 + Math.sin(time * 3 + i) * 2

        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
        ctx.fill()
      }
    }

    // Initial draw
    drawVisualization()

    // Animation loop for sparkles
    let animationId: number
    const animate = () => {
      drawVisualization()
      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [selectedConnection, isMobile])

  // Toggle detail panel on mobile
  const toggleDetailPanel = () => {
    setIsDetailExpanded(!isDetailExpanded)
  }

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        ...darkBlueBackground,
      }}
    >
      {/* Left Panel - Connection List */}
      <div
        style={{
          width: isMobile ? "100%" : "25rem",
          height: isMobile ? (selectedConnection && !isDetailExpanded ? "40%" : "auto") : "100%",
          borderRight: isMobile ? "none" : "1px solid rgba(255, 255, 255, 0.1)",
          borderBottom: isMobile ? "1px solid rgba(255, 255, 255, 0.1)" : "none",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: isMobile ? "1rem" : "1.5rem",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <h2 style={{ ...whiteText, fontSize: "1.25rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
            Connection Mirror
          </h2>
          <p style={{ ...grayText, fontSize: "0.875rem" }}>
            Discover connections that complement your skills and interests
          </p>

          {/* Search and Filter */}
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: "0.5rem",
              marginTop: "1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "0.5rem",
                padding: "0.5rem",
                flex: 1,
              }}
            >
              <Search style={{ color: "white", width: "1.25rem", height: "1.25rem", marginRight: "0.5rem" }} />
              <input
                type="text"
                placeholder="Search connections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  color: "white",
                  width: "100%",
                  outline: "none",
                }}
              />
            </div>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: isMobile ? "center" : "flex-start",
                gap: "0.5rem",
                backgroundColor: isAnalyzing ? "#7755c2" : "rgba(255, 255, 255, 0.1)",
                border: "none",
                borderRadius: "0.5rem",
                padding: "0.5rem 1rem",
                color: "white",
                cursor: "pointer",
                width: isMobile ? "100%" : "auto",
              }}
              onClick={handleAnalyze}
              disabled={isAnalyzing}
            >
              <RefreshCw
                style={{
                  width: "1.25rem",
                  height: "1.25rem",
                  animation: isAnalyzing ? "spin 1s linear infinite" : "none",
                }}
              />
              <span>{isAnalyzing ? "Analyzing..." : "Refresh"}</span>
            </button>
          </div>
        </div>

        {/* Connection List */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {filteredConnections.map((connection) => (
              <div
                key={connection.id}
                style={{
                  backgroundColor:
                    selectedConnection === connection.id
                      ? "rgba(119, 85, 194, 0.3)"
                      : hoveredCard === connection.id
                        ? "rgba(255, 255, 255, 0.05)"
                        : "rgba(255, 255, 255, 0.1)",
                  borderRadius: "0.5rem",
                  padding: "1rem",
                  cursor: "pointer",
                  border: selectedConnection === connection.id ? "1px solid #7755c2" : "none",
                  transition: "all 0.2s ease",
                }}
                onClick={() => {
                  setSelectedConnection(connection.id)
                  if (isMobile) setIsDetailExpanded(true)
                }}
                onMouseEnter={() => setHoveredCard(connection.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div style={{ display: "flex", alignItems: "center", marginBottom: "0.75rem" }}>
                  <div
                    style={{
                      width: "3rem",
                      height: "3rem",
                      borderRadius: "9999px",
                      overflow: "hidden",
                      marginRight: "1rem",
                    }}
                  >
                    <Image
                      src={connection.avatar || "/placeholder.svg"}
                      alt={connection.name}
                      width={60}
                      height={60}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ ...whiteText, fontSize: "1rem", fontWeight: "bold", marginBottom: "0.25rem" }}>
                      {connection.name}
                    </h3>
                    <p style={{ ...grayText, fontSize: "0.875rem", marginBottom: "0.25rem" }}>
                      {connection.role} at {connection.company}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <div
                        style={{
                          backgroundColor: "#10b981",
                          color: "white",
                          fontSize: "0.75rem",
                          fontWeight: "bold",
                          padding: "0.125rem 0.375rem",
                          borderRadius: "9999px",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                        }}
                      >
                        <Sparkles style={{ width: "0.75rem", height: "0.75rem" }} />
                        {connection.matchScore}% Match
                      </div>
                      <span style={{ ...grayText, fontSize: "0.75rem" }}>{connection.mutualConnections} mutual</span>
                    </div>
                  </div>
                </div>
                <p style={{ ...grayText, fontSize: "0.875rem" }}>{connection.reason}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Toggle for Detail Panel */}
      {isMobile && selectedConnection && (
        <button
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            backgroundColor: "#222957",
            border: "none",
            borderRadius: "0",
            padding: "0.5rem",
            color: "white",
            width: "100%",
            cursor: "pointer",
          }}
          onClick={toggleDetailPanel}
        >
          <span>{isDetailExpanded ? "Hide Details" : "Show Details"}</span>
          {isDetailExpanded ? (
            <ChevronUp style={{ width: "1rem", height: "1rem" }} />
          ) : (
            <ChevronDown style={{ width: "1rem", height: "1rem" }} />
          )}
        </button>
      )}

      {/* Right Panel - Connection Mirror Visualization */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: isMobile ? "1rem" : "1.5rem",
          overflow: "hidden",
          height: isMobile ? (selectedConnection && isDetailExpanded ? "60%" : "auto") : "100%",
          display: isMobile && selectedConnection && !isDetailExpanded ? "none" : "flex",
        }}
      >
        {/* Visualization Canvas */}
        <div
          style={{
            flex: 1,
            position: "relative",
            marginBottom: isMobile ? "1rem" : "1.5rem",
            minHeight: isMobile ? "200px" : "300px",
          }}
        >
          <canvas
            ref={canvasRef}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "0.5rem",
              backgroundColor: "rgba(255, 255, 255, 0.03)",
            }}
          />
        </div>

        {/* Connection Details */}
        {selectedConnection &&
          (() => {
            const connection = mirrorConnections.find((conn) => conn.id === selectedConnection)
            if (!connection) return null

            return (
              <div
                style={{
                  ...darkerBlueBackground,
                  borderRadius: "0.5rem",
                  padding: isMobile ? "1rem" : "1.5rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    justifyContent: "space-between",
                    alignItems: isMobile ? "flex-start" : "center",
                    marginBottom: "1.5rem",
                    gap: isMobile ? "0.5rem" : "0",
                  }}
                >
                  <h3 style={{ ...whiteText, fontSize: "1.25rem", fontWeight: "bold" }}>Connection Analysis</h3>
                  <div
                    style={{
                      backgroundColor: "#10b981",
                      color: "white",
                      fontSize: "0.875rem",
                      fontWeight: "bold",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "9999px",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                    }}
                  >
                    <Sparkles style={{ width: "1rem", height: "1rem" }} />
                    {connection.matchScore}% Match
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                    gap: "1.5rem",
                  }}
                >
                  {/* Shared Interests */}
                  <div>
                    <h4 style={{ ...whiteText, fontSize: "1rem", fontWeight: "bold", marginBottom: "0.75rem" }}>
                      Shared Interests
                    </h4>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                      {connection.interests
                        .filter((interest) => userData.interests.includes(interest))
                        .map((interest, index) => (
                          <span
                            key={index}
                            style={{
                              backgroundColor: "#7755c2",
                              color: "white",
                              fontSize: "0.75rem",
                              padding: "0.375rem 0.75rem",
                              borderRadius: "9999px",
                            }}
                          >
                            {interest}
                          </span>
                        ))}
                    </div>
                  </div>

                  {/* Complementary Skills */}
                  <div>
                    <h4 style={{ ...whiteText, fontSize: "1rem", fontWeight: "bold", marginBottom: "0.75rem" }}>
                      Complementary Skills
                    </h4>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                      {connection.skills
                        .filter((skill) => !userData.skills.includes(skill))
                        .map((skill, index) => (
                          <span
                            key={index}
                            style={{
                              backgroundColor: "#ff5757",
                              color: "white",
                              fontSize: "0.75rem",
                              padding: "0.375rem 0.75rem",
                              borderRadius: "9999px",
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: "1.5rem" }}>
                  <h4 style={{ ...whiteText, fontSize: "1rem", fontWeight: "bold", marginBottom: "0.75rem" }}>
                    Why You Should Connect
                  </h4>
                  <p style={{ ...grayText, fontSize: "0.875rem", marginBottom: "1rem" }}>{connection.reason}</p>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                      justifyContent: "space-between",
                      gap: isMobile ? "0.75rem" : "0",
                    }}
                  >
                    <button
                      style={{
                        backgroundColor: "#7755c2",
                        color: "white",
                        border: "none",
                        borderRadius: "0.5rem",
                        padding: "0.75rem 1.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                        cursor: "pointer",
                        width: isMobile ? "100%" : "auto",
                      }}
                    >
                      <UserPlus style={{ width: "1.25rem", height: "1.25rem" }} />
                      <span>Connect Now</span>
                    </button>
                    <button
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        color: "white",
                        border: "none",
                        borderRadius: "0.5rem",
                        padding: "0.75rem 1.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                        cursor: "pointer",
                        width: isMobile ? "100%" : "auto",
                      }}
                    >
                      <span>View Full Profile</span>
                      <ArrowRight style={{ width: "1.25rem", height: "1.25rem" }} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })()}

        {!selectedConnection && (
          <div
            style={{
              ...darkerBlueBackground,
              borderRadius: "0.5rem",
              padding: isMobile ? "1rem" : "1.5rem",
              textAlign: "center",
            }}
          >
            <Sparkles style={{ width: "3rem", height: "3rem", color: "#7755c2", margin: "0 auto 1rem" }} />
            <h3 style={{ ...whiteText, fontSize: "1.25rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
              Select a Connection
            </h3>
            <p style={{ ...grayText, fontSize: "0.875rem" }}>
              Choose a connection from the list to view detailed mirror analysis and compatibility insights
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
