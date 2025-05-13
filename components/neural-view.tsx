"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Filter, ZoomIn, ZoomOut, ChevronUp, ChevronDown } from "lucide-react"

// Sample network data
const networkNodes = [
  { id: 1, name: "You", type: "self", connections: [2, 3, 4, 5, 8] },
  { id: 2, name: "Sarah Johnson", type: "first", connections: [1, 3, 6, 7] },
  { id: 3, name: "Michael Chen", type: "first", connections: [1, 2, 5, 9] },
  { id: 4, name: "Jessica Williams", type: "first", connections: [1, 8, 10] },
  { id: 5, name: "David Rodriguez", type: "first", connections: [1, 3, 11] },
  { id: 6, name: "Emily Thompson", type: "second", connections: [2, 7, 12] },
  { id: 7, name: "Robert Kim", type: "second", connections: [2, 6, 13] },
  { id: 8, name: "Lisa Garcia", type: "first", connections: [1, 4, 14] },
  { id: 9, name: "James Wilson", type: "second", connections: [3, 15] },
  { id: 10, name: "Patricia Moore", type: "second", connections: [4, 16] },
  { id: 11, name: "John Taylor", type: "second", connections: [5, 17] },
  { id: 12, name: "Jennifer Brown", type: "third", connections: [6, 18] },
  { id: 13, name: "Thomas Anderson", type: "third", connections: [7, 19] },
  { id: 14, name: "Elizabeth Martin", type: "second", connections: [8, 20] },
  { id: 15, name: "Charles White", type: "third", connections: [9] },
  { id: 16, name: "Susan Harris", type: "third", connections: [10] },
  { id: 17, name: "Joseph Clark", type: "third", connections: [11] },
  { id: 18, name: "Margaret Lewis", type: "third", connections: [12] },
  { id: 19, name: "Richard Lee", type: "third", connections: [13] },
  { id: 20, name: "Nancy Walker", type: "third", connections: [14] },
]

export default function NeuralView() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [zoom, setZoom] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedNode, setSelectedNode] = useState<number | null>(null)
  const [hoveredNode, setHoveredNode] = useState<number | null>(null)
  const [tooltipInfo, setTooltipInfo] = useState<{ show: boolean; text: string; x: number; y: number }>({
    show: false,
    text: "",
    x: 0,
    y: 0,
  })
  const [isMobile, setIsMobile] = useState(false)
  const [isDetailExpanded, setIsDetailExpanded] = useState(false)

  // Check for mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)

      // Auto-collapse details on mobile when resizing
      if (window.innerWidth < 768) {
        setIsDetailExpanded(false)
      }
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

  // Filter nodes based on search term
  const filteredNodes = networkNodes.filter((node) => node.name.toLowerCase().includes(searchTerm.toLowerCase()))

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

    // Calculate node positions
    const calculateNodePositions = () => {
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const selfNode = networkNodes.find((node) => node.type === "self")
      const firstDegreeNodes = networkNodes.filter((node) => node.type === "first")
      const secondDegreeNodes = networkNodes.filter((node) => node.type === "second")
      const thirdDegreeNodes = networkNodes.filter((node) => node.type === "third")

      const nodePositions: Record<number, { x: number; y: number }> = {}

      // Adjust radius based on canvas size and mobile view
      const radiusMultiplier = isMobile ? 0.8 : 1

      // Position self node at center
      if (selfNode) {
        nodePositions[selfNode.id] = { x: centerX, y: centerY }
      }

      // Position first degree nodes in inner circle
      const firstDegreeRadius = Math.min(canvas.width, canvas.height) * 0.2 * radiusMultiplier
      firstDegreeNodes.forEach((node, index) => {
        const angle = (index * 2 * Math.PI) / firstDegreeNodes.length
        nodePositions[node.id] = {
          x: centerX + firstDegreeRadius * Math.cos(angle),
          y: centerY + firstDegreeRadius * Math.sin(angle),
        }
      })

      // Position second degree nodes in middle circle
      const secondDegreeRadius = Math.min(canvas.width, canvas.height) * 0.35 * radiusMultiplier
      secondDegreeNodes.forEach((node, index) => {
        const angle = (index * 2 * Math.PI) / secondDegreeNodes.length
        nodePositions[node.id] = {
          x: centerX + secondDegreeRadius * Math.cos(angle),
          y: centerY + secondDegreeRadius * Math.sin(angle),
        }
      })

      // Position third degree nodes in outer circle
      const thirdDegreeRadius = Math.min(canvas.width, canvas.height) * 0.45 * radiusMultiplier
      thirdDegreeNodes.forEach((node, index) => {
        const angle = (index * 2 * Math.PI) / thirdDegreeNodes.length
        nodePositions[node.id] = {
          x: centerX + thirdDegreeRadius * Math.cos(angle),
          y: centerY + thirdDegreeRadius * Math.sin(angle),
        }
      })

      return nodePositions
    }

    // Draw network visualization
    function drawVisualization() {
      if (!ctx || !canvas) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Calculate node positions
      const nodePositions = calculateNodePositions()

      // Draw connections
      ctx.globalAlpha = 0.5
      networkNodes.forEach((node) => {
        const sourcePos = nodePositions[node.id]
        if (!sourcePos) return

        node.connections.forEach((targetId) => {
          const targetPos = nodePositions[targetId]
          if (!targetPos) return

          // Determine if this connection involves the selected node
          const isHighlighted = selectedNode === node.id || selectedNode === targetId

          ctx.beginPath()
          ctx.moveTo(sourcePos.x, sourcePos.y)
          ctx.lineTo(targetPos.x, targetPos.y)
          ctx.strokeStyle = isHighlighted ? "#c580ff" : "#ffffff"
          ctx.lineWidth = isHighlighted ? 2 : 1
          ctx.stroke()
        })
      })
      ctx.globalAlpha = 1

      // Draw nodes
      networkNodes.forEach((node) => {
        const pos = nodePositions[node.id]
        if (!pos) return

        const isSelected = selectedNode === node.id
        const isHovered = hoveredNode === node.id
        const radius = isSelected || isHovered ? (isMobile ? 12 : 15) : isMobile ? 8 : 10

        // Determine node color based on type
        let color
        switch (node.type) {
          case "self":
            color = "#ff5757"
            break
          case "first":
            color = "#7755c2"
            break
          case "second":
            color = "#10b981"
            break
          case "third":
            color = "#f59e0b"
            break
          default:
            color = "#9ca3af"
        }

        // Draw node
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()

        if (isSelected || isHovered) {
          ctx.beginPath()
          ctx.arc(pos.x, pos.y, radius + (isMobile ? 2 : 3), 0, Math.PI * 2)
          ctx.strokeStyle = "#ffffff"
          ctx.lineWidth = 2
          ctx.stroke()
        }

        // Draw node label
        if (isSelected || isHovered || node.type === "self") {
          ctx.font = isMobile ? "10px Arial" : "12px Arial"
          ctx.fillStyle = "#ffffff"
          ctx.textAlign = "center"
          ctx.fillText(node.name, pos.x, pos.y + radius + (isMobile ? 12 : 15))
        }
      })
    }

    // Initial resize
    resizeCanvas()

    // Listen for window resize
    window.addEventListener("resize", resizeCanvas)

    // Mouse move event for tooltips and hover effects
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const x = (e.clientX - rect.left) / zoom
      const y = (e.clientY - rect.top) / zoom

      // Calculate node positions
      const nodePositions = calculateNodePositions()

      // Check if mouse is over a node
      let hoveredNodeId = null
      for (const node of networkNodes) {
        const pos = nodePositions[node.id]
        if (!pos) continue

        const distance = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2)
        const hitRadius = isMobile ? 15 : 20 // Larger hit area for touch
        if (distance <= hitRadius) {
          hoveredNodeId = node.id
          setTooltipInfo({
            show: true,
            text: node.name,
            x: e.clientX - rect.left,
            y: e.clientY - rect.top - 30,
          })
          break
        }
      }

      if (hoveredNodeId !== null) {
        setHoveredNode(hoveredNodeId)
      } else {
        setHoveredNode(null)
        setTooltipInfo({ show: false, text: "", x: 0, y: 0 })
      }

      drawVisualization()
    }

    // Touch event for mobile
    const handleTouchStart = (e: TouchEvent) => {
      if (!canvas || e.touches.length === 0) return
      const rect = canvas.getBoundingClientRect()
      const touch = e.touches[0]
      const x = (touch.clientX - rect.left) / zoom
      const y = (touch.clientY - rect.top) / zoom

      // Calculate node positions
      const nodePositions = calculateNodePositions()

      // Check if touch is on a node
      let touchedNodeId = null
      for (const node of networkNodes) {
        const pos = nodePositions[node.id]
        if (!pos) continue

        const distance = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2)
        const hitRadius = 20 // Larger hit area for touch
        if (distance <= hitRadius) {
          touchedNodeId = node.id
          break
        }
      }

      if (touchedNodeId !== null) {
        setSelectedNode(touchedNodeId === selectedNode ? null : touchedNodeId)
        if (isMobile) setIsDetailExpanded(true)
        drawVisualization()
      }
    }

    // Mouse click event for selecting nodes
    const handleMouseClick = (e: MouseEvent) => {
      if (hoveredNode !== null) {
        setSelectedNode(hoveredNode === selectedNode ? null : hoveredNode)
        if (isMobile) setIsDetailExpanded(true)
        drawVisualization()
      } else {
        setSelectedNode(null)
        drawVisualization()
      }
    }

    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("click", handleMouseClick)
    canvas.addEventListener("touchstart", handleTouchStart)

    // Initial draw
    drawVisualization()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("click", handleMouseClick)
      canvas.removeEventListener("touchstart", handleTouchStart)
    }
  }, [zoom, selectedNode, hoveredNode, searchTerm, isMobile])

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 2))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5))
  }

  // Toggle detail panel on mobile
  const toggleDetailPanel = () => {
    setIsDetailExpanded(!isDetailExpanded)
  }

  return (
    <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", ...darkBlueBackground }}>
      {/* Search and Filter Bar */}
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          padding: isMobile ? "0.75rem" : "1rem",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          gap: isMobile ? "0.75rem" : "0",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
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
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            marginLeft: isMobile ? "0" : "1rem",
            width: isMobile ? "100%" : "auto",
          }}
        >
          <button
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              border: "none",
              borderRadius: "0.5rem",
              padding: "0.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flex: isMobile ? "1" : undefined,
            }}
            onClick={handleZoomIn}
          >
            <ZoomIn style={{ color: "white", width: "1.25rem", height: "1.25rem" }} />
          </button>
          <button
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              border: "none",
              borderRadius: "0.5rem",
              padding: "0.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flex: isMobile ? "1" : undefined,
            }}
            onClick={handleZoomOut}
          >
            <ZoomOut style={{ color: "white", width: "1.25rem", height: "1.25rem" }} />
          </button>
          <button
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              border: "none",
              borderRadius: "0.5rem",
              padding: "0.5rem 1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              cursor: "pointer",
              flex: isMobile ? "2" : undefined,
              justifyContent: isMobile ? "center" : "flex-start",
            }}
          >
            <Filter style={{ color: "white", width: "1.25rem", height: "1.25rem" }} />
            <span style={{ color: "white" }}>Filter</span>
          </button>
        </div>
      </div>

      {/* Network Visualization */}
      <div
        style={{
          flex: isMobile && selectedNode && isDetailExpanded ? "0 0 40%" : "1",
          position: "relative",
          overflow: "hidden",
          minHeight: isMobile && selectedNode && isDetailExpanded ? "200px" : undefined,
          transition: "flex 0.3s ease",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            height: "100%",
            transform: `scale(${zoom})`,
            transformOrigin: "center",
          }}
        />

        {/* Tooltip */}
        {tooltipInfo.show && (
          <div
            style={{
              position: "absolute",
              backgroundColor: "#222957",
              color: "white",
              padding: "0.5rem",
              borderRadius: "0.25rem",
              fontSize: "0.875rem",
              zIndex: 10,
              pointerEvents: "none",
              left: tooltipInfo.x,
              top: tooltipInfo.y,
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
            }}
          >
            {tooltipInfo.text}
          </div>
        )}

        {/* Legend */}
        <div
          style={{
            position: "absolute",
            bottom: "1rem",
            left: "1rem",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            borderRadius: "0.5rem",
            padding: isMobile ? "0.5rem" : "0.75rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            fontSize: isMobile ? "0.75rem" : "0.875rem",
          }}
        >
          <div style={{ ...whiteText, fontWeight: "bold", marginBottom: "0.25rem" }}>Connection Types</div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div
              style={{
                width: "1rem",
                height: "1rem",
                borderRadius: "9999px",
                backgroundColor: "#ff5757",
              }}
            ></div>
            <span style={{ ...whiteText, fontSize: isMobile ? "0.75rem" : "0.875rem" }}>You</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div
              style={{
                width: "1rem",
                height: "1rem",
                borderRadius: "9999px",
                backgroundColor: "#7755c2",
              }}
            ></div>
            <span style={{ ...whiteText, fontSize: isMobile ? "0.75rem" : "0.875rem" }}>1st Degree</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div
              style={{
                width: "1rem",
                height: "1rem",
                borderRadius: "9999px",
                backgroundColor: "#10b981",
              }}
            ></div>
            <span style={{ ...whiteText, fontSize: isMobile ? "0.75rem" : "0.875rem" }}>2nd Degree</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div
              style={{
                width: "1rem",
                height: "1rem",
                borderRadius: "9999px",
                backgroundColor: "#f59e0b",
              }}
            ></div>
            <span style={{ ...whiteText, fontSize: isMobile ? "0.75rem" : "0.875rem" }}>3rd Degree</span>
          </div>
        </div>
      </div>

      {/* Mobile Toggle for Detail Panel */}
      {isMobile && selectedNode && (
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

      {/* Selected Node Details */}
      {selectedNode && (
        <div
          style={{
            position: isMobile ? "relative" : "absolute",
            top: isMobile ? "auto" : "5rem",
            right: isMobile ? "auto" : "1rem",
            width: isMobile ? "100%" : "20rem",
            ...darkerBlueBackground,
            borderRadius: isMobile ? "0" : "0.5rem",
            padding: "1rem",
            boxShadow: isMobile ? "none" : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            display: isMobile && !isDetailExpanded ? "none" : "block",
            flex: isMobile ? "1" : undefined,
            overflow: "auto",
            maxHeight: isMobile ? undefined : "calc(100% - 10rem)",
          }}
        >
          {(() => {
            const node = networkNodes.find((n) => n.id === selectedNode)
            if (!node) return null

            return (
              <>
                <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
                  <div
                    style={{
                      width: "3rem",
                      height: "3rem",
                      borderRadius: "9999px",
                      overflow: "hidden",
                      marginRight: "1rem",
                      backgroundColor:
                        node.type === "self"
                          ? "#ff5757"
                          : node.type === "first"
                            ? "#7755c2"
                            : node.type === "second"
                              ? "#10b981"
                              : "#f59e0b",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "1.25rem",
                    }}
                  >
                    {node.name.charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ ...whiteText, fontSize: "1.125rem", fontWeight: "bold", marginBottom: "0.25rem" }}>
                      {node.name}
                    </h3>
                    <p style={{ ...grayText, fontSize: "0.875rem" }}>
                      {node.type === "self"
                        ? "You"
                        : node.type === "first"
                          ? "1st Degree Connection"
                          : node.type === "second"
                            ? "2nd Degree Connection"
                            : "3rd Degree Connection"}
                    </p>
                  </div>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <h4 style={{ ...whiteText, fontSize: "0.875rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
                    Connection Details
                  </h4>
                  <p style={{ ...grayText, fontSize: "0.875rem", marginBottom: "0.25rem" }}>
                    Connected to: {node.connections.length} people
                  </p>
                  <p style={{ ...grayText, fontSize: "0.875rem" }}>
                    Last interaction: {node.type === "self" ? "Today" : "2 weeks ago"}
                  </p>
                </div>

                <div>
                  <h4 style={{ ...whiteText, fontSize: "0.875rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
                    Direct Connections
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {node.connections.slice(0, 3).map((connId) => {
                      const connNode = networkNodes.find((n) => n.id === connId)
                      if (!connNode) return null

                      return (
                        <div
                          key={connId}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "0.5rem",
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                            borderRadius: "0.25rem",
                          }}
                        >
                          <div
                            style={{
                              width: "2rem",
                              height: "2rem",
                              borderRadius: "9999px",
                              overflow: "hidden",
                              marginRight: "0.5rem",
                              backgroundColor:
                                connNode.type === "self"
                                  ? "#ff5757"
                                  : connNode.type === "first"
                                    ? "#7755c2"
                                    : connNode.type === "second"
                                      ? "#10b981"
                                      : "#f59e0b",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontWeight: "bold",
                            }}
                          >
                            {connNode.name.charAt(0)}
                          </div>
                          <div style={{ ...whiteText, fontSize: "0.875rem" }}>{connNode.name}</div>
                        </div>
                      )
                    })}
                    {node.connections.length > 3 && (
                      <button
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          border: "none",
                          borderRadius: "0.25rem",
                          padding: "0.5rem",
                          color: "white",
                          textAlign: "center",
                          cursor: "pointer",
                        }}
                      >
                        View all {node.connections.length} connections
                      </button>
                    )}
                  </div>
                </div>
              </>
            )
          })()}
        </div>
      )}
    </div>
  )
}
