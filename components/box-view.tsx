"use client"

import { useState, useEffect } from "react"
import { Search, Filter, MoreHorizontal } from "lucide-react"
import Image from "next/image"

// Sample network connections data
const connections = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Marketing Director",
    company: "TechGrowth Inc.",
    location: "New York",
    lastContact: "2 days ago",
    tags: ["Marketing", "Tech"],
    avatar: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Software Engineer",
    company: "CodeWorks",
    location: "San Francisco",
    lastContact: "1 week ago",
    tags: ["Engineering", "Development"],
    avatar: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 3,
    name: "Jessica Williams",
    role: "Product Manager",
    company: "InnovateTech",
    location: "Chicago",
    lastContact: "3 days ago",
    tags: ["Product", "Management"],
    avatar: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 4,
    name: "David Rodriguez",
    role: "Sales Director",
    company: "GrowthPartners",
    location: "Miami",
    lastContact: "Yesterday",
    tags: ["Sales", "Business"],
    avatar: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 5,
    name: "Emily Thompson",
    role: "UX Designer",
    company: "DesignHub",
    location: "Toronto",
    lastContact: "5 days ago",
    tags: ["Design", "UX"],
    avatar: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 6,
    name: "Robert Kim",
    role: "CTO",
    company: "TechInnovate",
    location: "Seattle",
    lastContact: "2 weeks ago",
    tags: ["Technology", "Executive"],
    avatar: "/placeholder.svg?height=50&width=50",
  },
]

export default function BoxView() {
  const [searchTerm, setSearchTerm] = useState("")
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)

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
  const semitransparentWhiteBackground = { backgroundColor: "rgba(255, 255, 255, 0.1)" }

  // Filter connections based on search term
  const filteredConnections = connections.filter(
    (connection) =>
      connection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      connection.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      connection.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      connection.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        padding: isMobile ? "1rem" : "1.5rem",
        overflow: "auto",
        ...darkBlueBackground,
      }}
    >
      {/* Search and Filter Bar */}
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          marginBottom: "1.5rem",
          gap: "1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            ...semitransparentWhiteBackground,
            borderRadius: "0.5rem",
            padding: "0.5rem 1rem",
            flex: 1,
            width: isMobile ? "100%" : undefined,
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
            ...semitransparentWhiteBackground,
            borderRadius: "0.5rem",
            padding: "0.5rem 1rem",
            border: "none",
            cursor: "pointer",
            width: isMobile ? "100%" : "auto",
            justifyContent: isMobile ? "center" : "flex-start",
          }}
        >
          <Filter style={{ color: "white", width: "1.25rem", height: "1.25rem", marginRight: "0.5rem" }} />
          <span style={{ color: "white" }}>Filter</span>
        </button>
      </div>

      {/* Connection Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {filteredConnections.map((connection) => (
          <div
            key={connection.id}
            style={{
              ...darkerBlueBackground,
              borderRadius: "0.5rem",
              padding: "1.5rem",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              transition: "transform 0.2s, box-shadow 0.2s",
              transform: hoveredCard === connection.id ? "translateY(-4px)" : "translateY(0)",
              boxShadow:
                hoveredCard === connection.id
                  ? "0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)"
                  : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            }}
            onMouseEnter={() => setHoveredCard(connection.id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
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
                    width={50}
                    height={50}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div>
                  <h3 style={{ ...whiteText, fontSize: "1.125rem", fontWeight: "600", marginBottom: "0.25rem" }}>
                    {connection.name}
                  </h3>
                  <p style={{ ...grayText, fontSize: "0.875rem" }}>{connection.role}</p>
                </div>
              </div>
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
                <MoreHorizontal style={{ color: "white", width: "1.25rem", height: "1.25rem" }} />
              </button>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <p style={{ ...whiteText, fontSize: "0.875rem", marginBottom: "0.25rem" }}>
                <span style={{ ...grayText }}>Company:</span> {connection.company}
              </p>
              <p style={{ ...whiteText, fontSize: "0.875rem", marginBottom: "0.25rem" }}>
                <span style={{ ...grayText }}>Location:</span> {connection.location}
              </p>
              <p style={{ ...whiteText, fontSize: "0.875rem" }}>
                <span style={{ ...grayText }}>Last Contact:</span> {connection.lastContact}
              </p>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {connection.tags.map((tag, index) => (
                <span
                  key={index}
                  style={{
                    ...purpleBackground,
                    color: "white",
                    fontSize: "0.75rem",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "9999px",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
