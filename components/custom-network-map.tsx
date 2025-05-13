"use client"

import { useEffect, useRef, useState } from "react"
import { useIsMobile } from "@/hooks/use-mobile"

// Define types for props
interface CustomNetworkMapProps {
  center: [number, number]
  zoom: number
  mapType: "standard" | "satellite" | "dark"
  connections: Array<{
    id: number
    name: string
    role: string
    company: string
    location: string
    coordinates: [number, number]
    type: string
    avatar: string
  }>
  connectionLines: Array<[number, number]>
  showConnectionLines: boolean
  selectedConnection: number | null
  userLocation: [number, number] | null
  newMarker: { position: [number, number]; name: string } | null
  onMapClick: (lat: number, lng: number) => void
  onMarkerClick: (id: number) => void
}

// Simple map component that uses canvas to render a map
const CustomNetworkMap = ({
  center,
  zoom,
  mapType,
  connections,
  connectionLines,
  showConnectionLines,
  selectedConnection,
  userLocation,
  newMarker,
  onMapClick,
  onMarkerClick,
}: CustomNetworkMapProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<{ x: number; y: number; centerLat: number; centerLng: number } | null>(
    null,
  )
  const [hoveredMarker, setHoveredMarker] = useState<number | null>(null)
  const [tooltip, setTooltip] = useState<{ id: number; x: number; y: number } | null>(null)
  const isMobile = useIsMobile()

  // Convert lat/lng to pixel coordinates
  const latLngToPixel = (
    lat: number,
    lng: number,
    centerLat: number,
    centerLng: number,
    canvasWidth: number,
    canvasHeight: number,
    zoomLevel: number,
  ) => {
    // Simple Mercator projection
    const scale = Math.pow(2, zoomLevel) * 100

    const x = (lng - centerLng) * scale + canvasWidth / 2
    const y = (centerLat - lat) * scale + canvasHeight / 2

    return { x, y }
  }

  // Convert pixel coordinates to lat/lng
  const pixelToLatLng = (
    x: number,
    y: number,
    centerLat: number,
    centerLng: number,
    canvasWidth: number,
    canvasHeight: number,
    zoomLevel: number,
  ) => {
    const scale = Math.pow(2, zoomLevel) * 100

    const lng = (x - canvasWidth / 2) / scale + centerLng
    const lat = centerLat - (y - canvasHeight / 2) / scale

    return { lat, lng }
  }

  // Draw the map
  const drawMap = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const container = containerRef.current
    if (container) {
      canvas.width = container.clientWidth
      canvas.height = container.clientHeight
    }

    // Clear canvas
    ctx.fillStyle = mapType === "dark" ? "#121212" : mapType === "satellite" ? "#263238" : "#132144"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid lines (simulating map tiles)
    ctx.strokeStyle = mapType === "dark" ? "#333333" : mapType === "satellite" ? "#37474F" : "#1D3461"
    ctx.lineWidth = 1

    const gridSize = 50 * Math.pow(1.2, zoom)
    const offsetX = (center[1] * gridSize) % gridSize
    const offsetY = (center[0] * gridSize) % gridSize

    // Vertical grid lines
    for (let x = -offsetX; x < canvas.width; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }

    // Horizontal grid lines
    for (let y = -offsetY; y < canvas.height; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    // Draw connection lines
    if (showConnectionLines) {
      connectionLines.forEach(([fromId, toId]) => {
        const fromConn = connections.find((c) => c.id === fromId)
        const toConn = connections.find((c) => c.id === toId)

        if (!fromConn || !toConn) return

        const fromPos = latLngToPixel(
          fromConn.coordinates[0],
          fromConn.coordinates[1],
          center[0],
          center[1],
          canvas.width,
          canvas.height,
          zoom,
        )
        const toPos = latLngToPixel(
          toConn.coordinates[0],
          toConn.coordinates[1],
          center[0],
          center[1],
          canvas.width,
          canvas.height,
          zoom,
        )

        // Determine line color based on connection types
        let lineColor
        if (fromConn.type === "self" || toConn.type === "self") lineColor = "#ff5757"
        else if (fromConn.type === "first" || toConn.type === "first") lineColor = "#855ad1"
        else if (fromConn.type === "second" || toConn.type === "second") lineColor = "#10b981"
        else lineColor = "#f59e0b"

        ctx.beginPath()
        ctx.moveTo(fromPos.x, fromPos.y)
        ctx.lineTo(toPos.x, toPos.y)
        ctx.strokeStyle = lineColor
        ctx.lineWidth = 2
        ctx.globalAlpha = 0.7

        // Use dashed lines for 3rd degree connections
        if (fromConn.type === "third" || toConn.type === "third") {
          ctx.setLineDash([5, 5])
        } else {
          ctx.setLineDash([])
        }

        ctx.stroke()
        ctx.globalAlpha = 1
        ctx.setLineDash([])
      })
    }

    // Draw user location
    if (userLocation) {
      const pos = latLngToPixel(
        userLocation[0],
        userLocation[1],
        center[0],
        center[1],
        canvas.width,
        canvas.height,
        zoom,
      )

      // Draw circle
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, 50, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(75, 85, 99, 0.2)"
      ctx.fill()
      ctx.strokeStyle = "#4b5563"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw center point
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, 8, 0, Math.PI * 2)
      ctx.fillStyle = "#4b5563"
      ctx.fill()
      ctx.strokeStyle = "white"
      ctx.lineWidth = 2
      ctx.stroke()
    }

    // Draw connection markers
    connections.forEach((connection) => {
      const pos = latLngToPixel(
        connection.coordinates[0],
        connection.coordinates[1],
        center[0],
        center[1],
        canvas.width,
        canvas.height,
        zoom,
      )

      // Determine marker color based on type
      let color
      switch (connection.type) {
        case "self":
          color = "#ff5757"
          break
        case "first":
          color = "#855ad1"
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

      // Determine marker size
      const isSelected = connection.id === selectedConnection
      const isHovered = connection.id === hoveredMarker
      const radius = isSelected || isHovered ? 15 : 10

      // Draw marker
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.fill()

      // Add border for selected/hovered markers
      if (isSelected || isHovered) {
        ctx.strokeStyle = "white"
        ctx.lineWidth = 2
        ctx.stroke()
      }

      // Add pulse animation for self marker
      if (connection.type === "self") {
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, radius + 5, 0, Math.PI * 2)
        ctx.strokeStyle = color
        ctx.lineWidth = 2
        ctx.globalAlpha = 0.5
        ctx.stroke()
        ctx.globalAlpha = 1
      }
    })

    // Draw new marker
    if (newMarker) {
      const pos = latLngToPixel(
        newMarker.position[0],
        newMarker.position[1],
        center[0],
        center[1],
        canvas.width,
        canvas.height,
        zoom,
      )

      ctx.beginPath()
      ctx.arc(pos.x, pos.y, 12, 0, Math.PI * 2)
      ctx.fillStyle = "#ff5757"
      ctx.fill()
      ctx.strokeStyle = "white"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw plus sign
      ctx.beginPath()
      ctx.moveTo(pos.x - 5, pos.y)
      ctx.lineTo(pos.x + 5, pos.y)
      ctx.moveTo(pos.x, pos.y - 5)
      ctx.lineTo(pos.x, pos.y + 5)
      ctx.strokeStyle = "white"
      ctx.lineWidth = 2
      ctx.stroke()
    }

    // Draw tooltip
    if (tooltip) {
      const connection = connections.find((c) => c.id === tooltip.id)
      if (connection) {
        const text = connection.name
        ctx.font = "14px Arial"
        const textWidth = ctx.measureText(text).width

        // Draw tooltip background
        ctx.fillStyle = "rgba(34, 41, 87, 0.9)"
        ctx.beginPath()
        ctx.roundRect(tooltip.x - textWidth / 2 - 10, tooltip.y - 35, textWidth + 20, 30, 5)
        ctx.fill()

        // Draw tooltip text
        ctx.fillStyle = "white"
        ctx.textAlign = "center"
        ctx.fillText(text, tooltip.x, tooltip.y - 15)
      }
    }
  }

  // Handle mouse/touch events
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Mouse down / touch start
    const handleStart = (clientX: number, clientY: number) => {
      setIsDragging(true)
      setDragStart({
        x: clientX,
        y: clientY,
        centerLat: center[0],
        centerLng: center[1],
      })
    }

    const handleMouseDown = (e: MouseEvent) => {
      handleStart(e.clientX, e.clientY)
    }

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        handleStart(e.touches[0].clientX, e.touches[0].clientY)
      }
    }

    // Mouse move / touch move
    const handleMove = (clientX: number, clientY: number) => {
      if (isDragging && dragStart) {
        // Calculate new center based on drag distance
        const dx = clientX - dragStart.x
        const dy = clientY - dragStart.y

        const scale = Math.pow(2, zoom) * 100

        const newLng = dragStart.centerLng - dx / scale
        const newLat = dragStart.centerLat + dy / scale

        // Update center (this will trigger a redraw)
        onMapClick(newLat, newLng)
      } else {
        // Check for hover over markers
        const rect = canvas.getBoundingClientRect()
        const x = clientX - rect.left
        const y = clientY - rect.top

        let hoveredId = null

        for (const connection of connections) {
          const pos = latLngToPixel(
            connection.coordinates[0],
            connection.coordinates[1],
            center[0],
            center[1],
            canvas.width,
            canvas.height,
            zoom,
          )

          const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2))

          if (distance <= 15) {
            hoveredId = connection.id
            setTooltip({
              id: connection.id,
              x: pos.x,
              y: pos.y,
            })
            break
          }
        }

        setHoveredMarker(hoveredId)

        if (hoveredId === null) {
          setTooltip(null)
        }
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        e.preventDefault() // Prevent scrolling
        handleMove(e.touches[0].clientX, e.touches[0].clientY)
      }
    }

    // Mouse up / touch end
    const handleEnd = () => {
      setIsDragging(false)
    }

    const handleMouseUp = () => {
      handleEnd()
    }

    const handleTouchEnd = () => {
      handleEnd()
    }

    // Click / tap
    const handleClick = (clientX: number, clientY: number) => {
      if (hoveredMarker !== null) {
        onMarkerClick(hoveredMarker)
      } else if (!isDragging) {
        const rect = canvas.getBoundingClientRect()
        const x = clientX - rect.left
        const y = clientY - rect.top

        const { lat, lng } = pixelToLatLng(x, y, center[0], center[1], canvas.width, canvas.height, zoom)

        onMapClick(lat, lng)
      }
    }

    const handleMouseClick = (e: MouseEvent) => {
      handleClick(e.clientX, e.clientY)
    }

    const handleTouchTap = (e: TouchEvent) => {
      if (e.touches.length === 0 && e.changedTouches.length > 0) {
        handleClick(e.changedTouches[0].clientX, e.changedTouches[0].clientY)
      }
    }

    // Add event listeners
    canvas.addEventListener("mousedown", handleMouseDown)
    canvas.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
    canvas.addEventListener("click", handleMouseClick)

    canvas.addEventListener("touchstart", handleTouchStart, { passive: false })
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false })
    canvas.addEventListener("touchend", handleTouchEnd)
    canvas.addEventListener("touchend", handleTouchTap)

    // Clean up
    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown)
      canvas.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
      canvas.removeEventListener("click", handleMouseClick)

      canvas.removeEventListener("touchstart", handleTouchStart)
      canvas.removeEventListener("touchmove", handleTouchMove)
      canvas.removeEventListener("touchend", handleTouchEnd)
      canvas.removeEventListener("touchend", handleTouchTap)
    }
  }, [center, zoom, connections, isDragging, dragStart, hoveredMarker, onMapClick, onMarkerClick])

  // Draw map when props change
  useEffect(() => {
    drawMap()

    // Set up animation loop for pulsing effects
    const animationFrame = requestAnimationFrame(function animate() {
      drawMap()
      requestAnimationFrame(animate)
    })

    return () => cancelAnimationFrame(animationFrame)
  }, [
    center,
    zoom,
    mapType,
    connections,
    connectionLines,
    showConnectionLines,
    selectedConnection,
    userLocation,
    newMarker,
    hoveredMarker,
    tooltip,
  ])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      drawMap()
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%", position: "relative" }}>
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          cursor: isDragging ? "grabbing" : hoveredMarker !== null ? "pointer" : "grab",
        }}
      />
    </div>
  )
}

export default CustomNetworkMap
