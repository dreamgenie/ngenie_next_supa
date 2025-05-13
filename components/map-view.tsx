"use client"

import { useState } from "react"
import { Search, MapPin, Compass, Layers, Plus, Minus } from "lucide-react"
import Image from "next/image"
import { useIsMobile } from "@/hooks/use-mobile"
import CustomNetworkMap from "./custom-network-map"

// Define network connection points with real coordinates
const connections = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Marketing Director",
    company: "TechGrowth Inc.",
    location: "New York",
    coordinates: [40.7128, -74.006],
    type: "first",
    avatar: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Software Engineer",
    company: "CodeWorks",
    location: "San Francisco",
    coordinates: [37.7749, -122.4194],
    type: "first",
    avatar: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 3,
    name: "Jessica Williams",
    role: "Product Manager",
    company: "InnovateTech",
    location: "Chicago",
    coordinates: [41.8781, -87.6298],
    type: "first",
    avatar: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 4,
    name: "David Rodriguez",
    role: "Sales Director",
    company: "GrowthPartners",
    location: "Toronto",
    coordinates: [43.6532, -79.3832],
    type: "first",
    avatar: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 5,
    name: "Emily Thompson",
    role: "UX Designer",
    company: "DesignHub",
    location: "Miami",
    coordinates: [25.7617, -80.1918],
    type: "self",
    avatar: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 6,
    name: "Robert Kim",
    role: "CTO",
    company: "TechInnovate",
    location: "Seattle",
    coordinates: [47.6062, -122.3321],
    type: "second",
    avatar: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 7,
    name: "Lisa Garcia",
    role: "Marketing Manager",
    company: "BrandBoost",
    location: "Los Angeles",
    coordinates: [34.0522, -118.2437],
    type: "second",
    avatar: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 8,
    name: "James Wilson",
    role: "Financial Analyst",
    company: "CapitalGrowth",
    location: "Boston",
    coordinates: [42.3601, -71.0589],
    type: "second",
    avatar: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 9,
    name: "Patricia Moore",
    role: "HR Director",
    location: "Austin",
    company: "TalentForce",
    coordinates: [30.2672, -97.7431],
    type: "third",
    avatar: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 10,
    name: "Thomas Anderson",
    role: "Data Scientist",
    company: "DataInsights",
    location: "Denver",
    coordinates: [39.7392, -104.9903],
    type: "third",
    avatar: "/placeholder.svg?height=50&width=50",
  },
]

// Define connection lines (relationships between people)
const connectionLines = [
  [1, 5], // Sarah - Emily
  [2, 5], // Michael - Emily
  [3, 5], // Jessica - Emily
  [4, 5], // David - Emily
  [6, 2], // Robert - Michael
  [7, 1], // Lisa - Sarah
  [8, 4], // James - David
  [9, 7], // Patricia - Lisa
  [10, 6], // Thomas - Robert
]

export default function MapView() {
  const [mapCenter, setMapCenter] = useState<[number, number]>([39.8283, -98.5795]) // Center of US
  const [zoom, setZoom] = useState(4)
  const [selectedConnection, setSelectedConnection] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [mapType, setMapType] = useState<"standard" | "satellite" | "dark">("standard")
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const [showConnectionLines, setShowConnectionLines] = useState(true)
  const [newMarker, setNewMarker] = useState<{ position: [number, number]; name: string } | null>(null)
  const [isAddingMarker, setIsAddingMarker] = useState(false)
  const [newMarkerName, setNewMarkerName] = useState("")
  const isMobile = useIsMobile()

  // Find self connection (you)
  const selfConnection = connections.find((conn) => conn.type === "self")
  const selfCoordinates = selfConnection ? selfConnection.coordinates : mapCenter

  // Handle map click for adding new markers
  const handleMapClick = (lat: number, lng: number) => {
    if (isAddingMarker) {
      setNewMarker({
        position: [lat, lng],
        name: "",
      })
    }
  }

  // Handle connection selection
  const handleConnectionSelect = (id: number) => {
    setSelectedConnection(id === selectedConnection ? null : id)
    const connection = connections.find((conn) => conn.id === id)
    if (connection) {
      setMapCenter(connection.coordinates as [number, number])
      setZoom(8)
    }
  }

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    try {
      // Using Nominatim for geocoding (OpenStreetMap's geocoding service)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`,
      )
      const data = await response.json()
      setSearchResults(data)
      setShowSearchResults(true)

      // If results found, center map on first result
      if (data.length > 0) {
        const firstResult = data[0]
        setMapCenter([Number.parseFloat(firstResult.lat), Number.parseFloat(firstResult.lon)])
        setZoom(12)
      }
    } catch (error) {
      console.error("Error searching for location:", error)
    }
  }

  // Handle search result selection
  const handleSearchResultSelect = (result: any) => {
    setMapCenter([Number.parseFloat(result.lat), Number.parseFloat(result.lon)])
    setZoom(13)
    setShowSearchResults(false)
    setSearchQuery(result.display_name.split(",")[0]) // Set search input to selected place name
  }

  // Get user's location
  const getUserLocation = () => {
    setIsLocating(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation([latitude, longitude])
          setMapCenter([latitude, longitude])
          setZoom(13)
          setIsLocating(false)
        },
        (error) => {
          console.error("Error getting location:", error)
          setIsLocating(false)
        },
      )
    } else {
      console.error("Geolocation is not supported by this browser.")
      setIsLocating(false)
    }
  }

  // Toggle map type
  const toggleMapType = () => {
    if (mapType === "standard") setMapType("satellite")
    else if (mapType === "satellite") setMapType("dark")
    else setMapType("standard")
  }

  // Save new marker
  const saveNewMarker = () => {
    if (newMarker && newMarkerName.trim()) {
      // In a real app, you would save this to your database
      console.log("New marker saved:", { ...newMarker, name: newMarkerName })
      setNewMarker(null)
      setNewMarkerName("")
      setIsAddingMarker(false)
    }
  }

  // Cancel adding new marker
  const cancelNewMarker = () => {
    setNewMarker(null)
    setNewMarkerName("")
    setIsAddingMarker(false)
  }

  // Handle zoom in
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 1, 18))
  }

  // Handle zoom out
  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 1, 2))
  }

  // Common styles
  const darkBlueBackground = { backgroundColor: "#132144" }
  const darkerBlueBackground = { backgroundColor: "#222957" }
  const purpleBackground = { backgroundColor: "#855ad1" }
  const whiteText = { color: "white" }
  const grayText = { color: "#9ca3af" }

  return (
    <div style={{ height: "100%", width: "100%", position: "relative", ...darkBlueBackground }}>
      {/* Search and Controls Overlay */}
      <div
        style={{
          position: "absolute",
          top: isMobile ? "10px" : "20px",
          left: isMobile ? "10px" : "20px",
          right: isMobile ? "10px" : "auto",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {/* Search Bar */}
        <div
          style={{
            display: "flex",
            backgroundColor: "rgba(34, 41, 87, 0.9)",
            borderRadius: "8px",
            padding: "8px",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
            width: isMobile ? "100%" : "300px",
          }}
        >
          <input
            type="text"
            placeholder="Search locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch()
            }}
            style={{
              backgroundColor: "transparent",
              border: "none",
              color: "white",
              flex: 1,
              outline: "none",
              fontSize: "14px",
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              backgroundColor: "#855ad1",
              border: "none",
              borderRadius: "4px",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <Search size={16} color="white" />
          </button>
        </div>

        {/* Search Results Dropdown */}
        {showSearchResults && searchResults.length > 0 && (
          <div
            style={{
              backgroundColor: "rgba(34, 41, 87, 0.95)",
              borderRadius: "8px",
              padding: "8px",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
              width: isMobile ? "100%" : "300px",
              maxHeight: "200px",
              overflowY: "auto",
            }}
          >
            {searchResults.map((result, index) => (
              <div
                key={index}
                onClick={() => handleSearchResultSelect(result)}
                style={{
                  padding: "8px",
                  cursor: "pointer",
                  borderBottom: index < searchResults.length - 1 ? "1px solid rgba(255, 255, 255, 0.1)" : "none",
                  color: "white",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <MapPin size={14} style={{ marginRight: "8px", flexShrink: 0 }} />
                <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {result.display_name}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Connection List on Mobile */}
        {isMobile && selectedConnection === null && (
          <div
            style={{
              backgroundColor: "rgba(34, 41, 87, 0.95)",
              borderRadius: "8px",
              padding: "12px",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
              maxHeight: "200px",
              overflowY: "auto",
              marginTop: "10px",
            }}
          >
            <div style={{ ...whiteText, fontWeight: "bold", marginBottom: "8px", fontSize: "14px" }}>
              Your Network ({connections.length})
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {connections.map((connection) => (
                <div
                  key={connection.id}
                  onClick={() => handleConnectionSelect(connection.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "8px",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      overflow: "hidden",
                      marginRight: "8px",
                      backgroundColor:
                        connection.type === "self"
                          ? "#ff5757"
                          : connection.type === "first"
                            ? "#855ad1"
                            : connection.type === "second"
                              ? "#10b981"
                              : "#f59e0b",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    {connection.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1, overflow: "hidden" }}>
                    <div
                      style={{
                        ...whiteText,
                        fontSize: "14px",
                        fontWeight: "500",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {connection.name}
                    </div>
                    <div
                      style={{
                        ...grayText,
                        fontSize: "12px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {connection.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Map Controls */}
      <div
        style={{
          position: "absolute",
          top: isMobile ? "10px" : "20px",
          right: isMobile ? "10px" : "20px",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {/* Map Type Toggle */}
        <button
          onClick={toggleMapType}
          style={{
            backgroundColor: "rgba(34, 41, 87, 0.9)",
            border: "none",
            borderRadius: "8px",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
          }}
          title="Change Map Type"
        >
          <Layers size={20} color="white" />
        </button>

        {/* Get User Location */}
        <button
          onClick={getUserLocation}
          disabled={isLocating}
          style={{
            backgroundColor: "rgba(34, 41, 87, 0.9)",
            border: "none",
            borderRadius: "8px",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: isLocating ? "default" : "pointer",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
            opacity: isLocating ? 0.7 : 1,
          }}
          title="Find My Location"
        >
          <Compass size={20} color="white" style={{ animation: isLocating ? "spin 2s linear infinite" : "none" }} />
        </button>

        {/* Toggle Connection Lines */}
        <button
          onClick={() => setShowConnectionLines(!showConnectionLines)}
          style={{
            backgroundColor: showConnectionLines ? "#855ad1" : "rgba(34, 41, 87, 0.9)",
            border: "none",
            borderRadius: "8px",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
          }}
          title={showConnectionLines ? "Hide Connection Lines" : "Show Connection Lines"}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="5" cy="5" r="3" />
            <circle cx="19" cy="19" r="3" />
            <line x1="8" y1="8" x2="16" y2="16" />
          </svg>
        </button>

        {/* Add New Connection */}
        <button
          onClick={() => setIsAddingMarker(!isAddingMarker)}
          style={{
            backgroundColor: isAddingMarker ? "#ff5757" : "rgba(34, 41, 87, 0.9)",
            border: "none",
            borderRadius: "8px",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
          }}
          title={isAddingMarker ? "Cancel Adding" : "Add New Connection"}
        >
          <MapPin size={20} color="white" />
        </button>

        {/* Zoom Controls */}
        <button
          onClick={handleZoomIn}
          style={{
            backgroundColor: "rgba(34, 41, 87, 0.9)",
            border: "none",
            borderRadius: "8px",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
          }}
          title="Zoom In"
        >
          <Plus size={20} color="white" />
        </button>

        <button
          onClick={handleZoomOut}
          style={{
            backgroundColor: "rgba(34, 41, 87, 0.9)",
            border: "none",
            borderRadius: "8px",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
          }}
          title="Zoom Out"
        >
          <Minus size={20} color="white" />
        </button>
      </div>

      {/* Connection Details Panel */}
      {selectedConnection && (
        <div
          style={{
            position: "absolute",
            bottom: isMobile ? "20px" : "30px",
            left: isMobile ? "10px" : "20px",
            zIndex: 1000,
            backgroundColor: "rgba(34, 41, 87, 0.95)",
            borderRadius: "8px",
            padding: "16px",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
            width: isMobile ? "calc(100% - 20px)" : "350px",
            maxWidth: isMobile ? "none" : "350px",
          }}
        >
          {(() => {
            const connection = connections.find((c) => c.id === selectedConnection)
            if (!connection) return null

            return (
              <>
                <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      overflow: "hidden",
                      marginRight: "12px",
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
                    <h3 style={{ ...whiteText, fontSize: "18px", fontWeight: "bold", marginBottom: "4px" }}>
                      {connection.name}
                    </h3>
                    <p style={{ ...grayText, fontSize: "14px" }}>
                      {connection.role} at {connection.company}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedConnection(null)}
                    style={{
                      marginLeft: "auto",
                      backgroundColor: "transparent",
                      border: "none",
                      color: "white",
                      cursor: "pointer",
                      fontSize: "20px",
                      padding: "4px",
                    }}
                  >
                    ×
                  </button>
                </div>

                <div style={{ marginBottom: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                    <MapPin size={16} style={{ color: "#9ca3af", marginRight: "8px" }} />
                    <span style={{ ...whiteText, fontSize: "14px" }}>{connection.location}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span
                      style={{
                        display: "inline-block",
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        marginRight: "8px",
                        backgroundColor:
                          connection.type === "self"
                            ? "#ff5757"
                            : connection.type === "first"
                              ? "#855ad1"
                              : connection.type === "second"
                                ? "#10b981"
                                : "#f59e0b",
                      }}
                    ></span>
                    <span style={{ ...whiteText, fontSize: "14px" }}>
                      {connection.type === "self"
                        ? "You"
                        : connection.type === "first"
                          ? "1st Degree Connection"
                          : connection.type === "second"
                            ? "2nd Degree Connection"
                            : "3rd Degree Connection"}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    style={{
                      flex: 1,
                      backgroundColor: "#855ad1",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      padding: "8px 16px",
                      fontSize: "14px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    Connect
                  </button>
                  <button
                    style={{
                      flex: 1,
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      padding: "8px 16px",
                      fontSize: "14px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    View Profile
                  </button>
                </div>
              </>
            )
          })()}
        </div>
      )}

      {/* New Marker Form */}
      {newMarker && (
        <div
          style={{
            position: "absolute",
            bottom: isMobile ? "20px" : "30px",
            right: isMobile ? "10px" : "20px",
            zIndex: 1000,
            backgroundColor: "rgba(34, 41, 87, 0.95)",
            borderRadius: "8px",
            padding: "16px",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
            width: isMobile ? "calc(100% - 20px)" : "300px",
          }}
        >
          <h3 style={{ ...whiteText, fontSize: "16px", fontWeight: "bold", marginBottom: "12px" }}>
            Add New Connection
          </h3>
          <input
            type="text"
            placeholder="Connection name"
            value={newMarkerName}
            onChange={(e) => setNewMarkerName(e.target.value)}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              border: "none",
              borderRadius: "4px",
              padding: "8px 12px",
              color: "white",
              width: "100%",
              marginBottom: "12px",
              outline: "none",
            }}
          />
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={saveNewMarker}
              style={{
                flex: 1,
                backgroundColor: "#855ad1",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "8px 16px",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Save
            </button>
            <button
              onClick={cancelNewMarker}
              style={{
                flex: 1,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "8px 16px",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Legend */}
      <div
        style={{
          position: "absolute",
          bottom: isMobile ? (selectedConnection ? "140px" : "20px") : "30px",
          right: isMobile ? "10px" : "20px",
          zIndex: 1000,
          backgroundColor: "rgba(34, 41, 87, 0.9)",
          borderRadius: "8px",
          padding: "12px",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
          display: isMobile && (selectedConnection || newMarker) ? "none" : "block",
        }}
      >
        <div style={{ ...whiteText, fontWeight: "bold", marginBottom: "8px", fontSize: "14px" }}>Connection Types</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span
              style={{
                display: "inline-block",
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: "#ff5757",
                marginRight: "8px",
              }}
            ></span>
            <span style={{ ...whiteText, fontSize: "12px" }}>You</span>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span
              style={{
                display: "inline-block",
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: "#855ad1",
                marginRight: "8px",
              }}
            ></span>
            <span style={{ ...whiteText, fontSize: "12px" }}>1st Degree</span>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span
              style={{
                display: "inline-block",
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: "#10b981",
                marginRight: "8px",
              }}
            ></span>
            <span style={{ ...whiteText, fontSize: "12px" }}>2nd Degree</span>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span
              style={{
                display: "inline-block",
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: "#f59e0b",
                marginRight: "8px",
              }}
            ></span>
            <span style={{ ...whiteText, fontSize: "12px" }}>3rd Degree</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div style={{ height: "100%", width: "100%" }}>
        <CustomNetworkMap
          center={mapCenter}
          zoom={zoom}
          mapType={mapType}
          connections={connections}
          connectionLines={connectionLines}
          showConnectionLines={showConnectionLines}
          selectedConnection={selectedConnection}
          userLocation={userLocation}
          newMarker={newMarker}
          onMapClick={handleMapClick}
          onMarkerClick={handleConnectionSelect}
        />
      </div>

      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.7;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
