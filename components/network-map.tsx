"use client"

import { useEffect, useState, useRef } from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import "leaflet/dist/leaflet.css"

// Define types for props
interface NetworkMapProps {
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
  onError?: (error: string) => void
}

// Simple map component that doesn't rely on external libraries
const NetworkMap = ({
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
  onError,
}: NetworkMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [leaflet, setLeaflet] = useState<any>(null)
  const [reactLeaflet, setReactLeaflet] = useState<any>(null)
  const [map, setMap] = useState<any>(null)
  const isMobile = useIsMobile()

  // Load Leaflet and React-Leaflet dynamically on the client
  useEffect(() => {
    const loadLeaflet = async () => {
      try {
        // Import Leaflet and React-Leaflet dynamically
        const L = await import("leaflet")
        const RL = await import("react-leaflet")

        // Import Leaflet CSS
        await import("leaflet/dist/leaflet.css")

        setLeaflet(L)
        setReactLeaflet(RL)
        setIsMapLoaded(true)
      } catch (error) {
        console.error("Failed to load map libraries:", error)
        if (onError) onError("Failed to load map libraries")
      }
    }

    loadLeaflet()
  }, [onError])

  // Initialize map once libraries are loaded
  useEffect(() => {
    if (!isMapLoaded || !leaflet || !mapContainerRef.current) return

    try {
      // Create map instance
      const mapInstance = leaflet.map(mapContainerRef.current, {
        center: center,
        zoom: zoom,
        zoomControl: false,
      })

      // Add tile layer based on map type
      let tileLayer
      switch (mapType) {
        case "satellite":
          tileLayer = leaflet.tileLayer(
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            {
              attribution: '&copy; <a href="https://www.arcgis.com/">ArcGIS</a> contributors',
            },
          )
          break
        case "dark":
          tileLayer = leaflet.tileLayer("https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png", {
            attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> contributors',
          })
          break
        default:
          tileLayer = leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          })
      }
      tileLayer.addTo(mapInstance)

      // Create custom marker icons
      const createMarkerIcon = (type: string) => {
        return leaflet.divIcon({
          className: `marker-${type}`,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
          popupAnchor: [0, -15],
          html: `<div class="marker-inner" style="width: 30px; height: 30px; border-radius: 50%; background-color: ${
            type === "self" ? "#ff5757" : type === "first" ? "#855ad1" : type === "second" ? "#10b981" : "#f59e0b"
          }; border: 2px solid white; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);"></div>`,
        })
      }

      // Add connection markers
      connections.forEach((connection) => {
        const marker = leaflet
          .marker(connection.coordinates, {
            icon: createMarkerIcon(connection.type),
          })
          .addTo(mapInstance)

        // Add popup
        marker.bindPopup(
          `<div style="text-align: center;">
            <strong>${connection.name}</strong><br>
            ${connection.role} at ${connection.company}<br>
            ${connection.location}
          </div>`,
        )

        // Add click handler
        marker.on("click", () => {
          onMarkerClick(connection.id)
        })
      })

      // Add connection lines
      if (showConnectionLines) {
        connectionLines.forEach(([fromId, toId]) => {
          const fromConn = connections.find((c) => c.id === fromId)
          const toConn = connections.find((c) => c.id === toId)

          if (!fromConn || !toConn) return

          // Get line color based on connection types
          let lineColor
          if (fromConn.type === "self" || toConn.type === "self") lineColor = "#ff5757"
          else if (fromConn.type === "first" || toConn.type === "first") lineColor = "#855ad1"
          else if (fromConn.type === "second" || toConn.type === "second") lineColor = "#10b981"
          else lineColor = "#f59e0b"

          // Create polyline
          const polyline = leaflet
            .polyline([fromConn.coordinates, toConn.coordinates], {
              color: lineColor,
              weight: 2,
              opacity: 0.7,
              dashArray: fromConn.type === "third" || toConn.type === "third" ? "5, 5" : undefined,
            })
            .addTo(mapInstance)
        })
      }

      // Add user location marker
      if (userLocation) {
        leaflet
          .circle(userLocation, {
            radius: 500,
            color: "#4b5563",
            fillColor: "#4b5563",
            fillOpacity: 0.2,
          })
          .addTo(mapInstance)
      }

      // Add new marker
      if (newMarker) {
        leaflet
          .marker(newMarker.position, {
            icon: leaflet.divIcon({
              className: "new-marker",
              iconSize: [30, 30],
              iconAnchor: [15, 15],
              html: `<div style="width: 30px; height: 30px; border-radius: 50%; background-color: #ff5757; border: 2px solid white; display: flex; align-items: center; justify-content: center;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg></div>`,
            }),
          })
          .addTo(mapInstance)
      }

      // Add map click handler
      mapInstance.on("click", (e: any) => {
        onMapClick(e.latlng.lat, e.latlng.lng)
      })

      // Store map instance
      setMap(mapInstance)

      // Cleanup function
      return () => {
        mapInstance.remove()
      }
    } catch (error) {
      console.error("Error initializing map:", error)
      if (onError) onError("Error initializing map")
    }
  }, [
    isMapLoaded,
    leaflet,
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
    onError,
  ])

  // Update map center and zoom when props change
  useEffect(() => {
    if (!map) return
    map.setView(center, zoom)
  }, [map, center, zoom])

  // Loading state
  if (!isMapLoaded) {
    return (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#132144",
          color: "white",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ marginBottom: "1rem" }}>
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#855ad1"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ animation: "spin 2s linear infinite" }}
            >
              <line x1="12" y1="2" x2="12" y2="6"></line>
              <line x1="12" y1="18" x2="12" y2="22"></line>
              <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
              <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
              <line x1="2" y1="12" x2="6" y2="12"></line>
              <line x1="18" y1="12" x2="22" y2="12"></line>
              <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
              <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
            </svg>
          </div>
          <div>Loading map...</div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div ref={mapContainerRef} style={{ height: "100%", width: "100%" }} />
      <style jsx global>{`
        .leaflet-container {
          background-color: #132144;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }

        .marker-self .marker-inner {
          animation: markerPulse 2s infinite;
        }

        .leaflet-popup-content-wrapper {
          background-color: #222957;
          color: white;
          border-radius: 8px;
        }

        .leaflet-popup-tip {
          background-color: #222957;
        }

        .leaflet-control-attribution {
          background-color: rgba(34, 41, 87, 0.8) !important;
          color: rgba(255, 255, 255, 0.7) !important;
          font-size: 10px !important;
        }

        .leaflet-control-attribution a {
          color: rgba(255, 255, 255, 0.9) !important;
        }

        @keyframes markerPulse {
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
    </>
  )
}

export default NetworkMap
