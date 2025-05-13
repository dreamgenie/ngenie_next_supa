"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Grid,
  FileText,
  User,
  Bell,
  Settings,
  ChevronDown,
  ChevronUp,
  Map,
  LayoutGrid,
  MessageSquare,
  Users,
  Video,
  Calendar,
  Network,
  ContactIcon,
  Menu,
  X,
  ChevronRight,
} from "lucide-react"
import Image from "next/image"
import MapView from "@/components/map-view"
import BoxView from "@/components/box-view"
import GenieChat from "@/components/genie-chat"
import ConnectionMirror from "@/components/connection-mirror"
import LiveNetworking from "@/components/live-networking"
import CalendarView from "@/components/calendar-view"
import NeuralView from "@/components/neural-view"
import AllContacts from "@/components/all-contacts"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("MAP VIEW")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0)

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
      setIsMobile(window.innerWidth < 768)

      // Close mobile menu when resizing to desktop
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    handleResize() // Initial check

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Common styles
  const purpleBackground = { backgroundColor: "#855ad1" }
  const darkBlueBackground = { backgroundColor: "#132144" }
  const darkerBlueBackground = { backgroundColor: "#222957" }
  const activeTabBackground = { backgroundColor: "#7755c2" }
  const whiteText = { color: "white" }
  const grayText = { color: "#9ca3af" }
  const semitransparentWhiteBackground = { backgroundColor: "rgba(255, 255, 255, 0.2)" }
  const moreTransparentWhiteBackground = { backgroundColor: "rgba(255, 255, 255, 0.3)" }

  // Render the active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "MAP VIEW":
        return <MapView />
      case "BOX VIEW":
        return <BoxView />
      case "GENIE CHAT":
        return <GenieChat />
      case "CONNECTION MIRROR":
        return <ConnectionMirror />
      case "LIVE NETWORKING":
        return <LiveNetworking />
      case "CALENDAR":
        return <CalendarView />
      case "NEURAL VIEW":
        return <NeuralView />
      case "ALL CONTACTS":
        return <AllContacts />
      default:
        return <MapView />
    }
  }

  // Tab data with icons
  const tabs = [
    { name: "MAP VIEW", icon: <Map size={16} /> },
    { name: "BOX VIEW", icon: <LayoutGrid size={16} /> },
    { name: "GENIE CHAT", icon: <MessageSquare size={16} /> },
    { name: "CONNECTION MIRROR", icon: <Users size={16} /> },
    { name: "LIVE NETWORKING", icon: <Video size={16} /> },
    { name: "CALENDAR", icon: <Calendar size={16} /> },
    { name: "NEURAL VIEW", icon: <Network size={16} /> },
    { name: "ALL CONTACTS", icon: <ContactIcon size={16} /> },
  ]

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%", overflow: "hidden", position: "relative" }}>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 40,
          }}
          onClick={toggleMobileMenu}
        />
      )}

      {/* Left Sidebar - Hidden on mobile unless menu is open */}
      <div
        style={{
          ...purpleBackground,
          width: isMobile ? (isMobileMenuOpen ? "85%" : "0") : "16rem",
          display: "flex",
          flexDirection: "column",
          position: isMobile ? "fixed" : "relative",
          height: "100%",
          zIndex: 50,
          transition: "width 0.3s ease, transform 0.3s ease",
          transform: isMobile ? (isMobileMenuOpen ? "translateX(0)" : "translateX(-100%)") : "translateX(0)",
          boxShadow: isMobile && isMobileMenuOpen ? "0 0 15px rgba(0, 0, 0, 0.3)" : "none",
        }}
      >
        <div style={{ padding: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ position: "relative", height: "4rem", width: "4rem" }}>
              <div style={{ ...whiteText, fontWeight: "bold", fontSize: "1.875rem" }}>N</div>
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  height: "1rem",
                  width: "1rem",
                  backgroundColor: "#c580ff",
                }}
              ></div>
            </div>
            <div style={{ marginLeft: "0.5rem" }}>
              <div style={{ ...whiteText, fontWeight: "bold" }}>Network</div>
              <div style={{ color: "#c580ff", fontSize: "0.875rem" }}>Genie</div>
            </div>
          </div>

          {/* Close button for mobile menu */}
          {isMobile && (
            <button
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "white",
                cursor: "pointer",
                padding: "0.5rem",
              }}
              onClick={toggleMobileMenu}
            >
              <X size={24} />
            </button>
          )}
        </div>

        <div style={{ paddingLeft: "1rem", paddingRight: "1rem", paddingTop: "0.5rem", paddingBottom: "0.5rem" }}>
          <div
            style={{
              ...semitransparentWhiteBackground,
              borderRadius: "9999px",
              display: "flex",
              alignItems: "center",
              paddingLeft: "1rem",
              paddingRight: "1rem",
              paddingTop: "0.5rem",
              paddingBottom: "0.5rem",
            }}
          >
            <Search style={{ height: "1.25rem", width: "1.25rem", color: "rgba(255, 255, 255, 0.7)" }} />
            <input
              type="text"
              placeholder="Search..."
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "white",
                marginLeft: "0.5rem",
                width: "100%",
                outline: "none",
              }}
            />
          </div>
        </div>

        <nav style={{ marginTop: "1.5rem", flex: 1, overflowY: "auto" }}>
          <div
            style={{
              ...semitransparentWhiteBackground,
              marginLeft: "0.5rem",
              marginRight: "0.5rem",
              borderRadius: "9999px",
              padding: "0.75rem",
              display: "flex",
              alignItems: "center",
              marginBottom: "0.75rem",
            }}
          >
            <Grid style={{ height: "1.25rem", width: "1.25rem", color: "white", marginRight: "0.75rem" }} />
            <span style={{ ...whiteText, fontWeight: "500" }}>Dashboard</span>
          </div>

          <div
            style={{
              marginLeft: "0.5rem",
              marginRight: "0.5rem",
              borderRadius: "9999px",
              padding: "0.75rem",
              display: "flex",
              alignItems: "center",
              marginBottom: "0.75rem",
              backgroundColor: hoveredItem === "task" ? "rgba(255, 255, 255, 0.1)" : "transparent",
            }}
            onMouseEnter={() => setHoveredItem("task")}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <FileText
              style={{ height: "1.25rem", width: "1.25rem", color: "rgba(255, 255, 255, 0.7)", marginRight: "0.75rem" }}
            />
            <span style={{ color: "rgba(255, 255, 255, 0.7)", fontWeight: "500" }}>Task Reminders</span>
          </div>

          <div
            style={{
              marginLeft: "0.5rem",
              marginRight: "0.5rem",
              borderRadius: "9999px",
              padding: "0.75rem",
              display: "flex",
              alignItems: "center",
              marginBottom: "0.75rem",
              backgroundColor: hoveredItem === "customer" ? "rgba(255, 255, 255, 0.1)" : "transparent",
            }}
            onMouseEnter={() => setHoveredItem("customer")}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <User
              style={{ height: "1.25rem", width: "1.25rem", color: "rgba(255, 255, 255, 0.7)", marginRight: "0.75rem" }}
            />
            <span style={{ color: "rgba(255, 255, 255, 0.7)", fontWeight: "500" }}>Customer</span>
          </div>

          <div
            style={{
              marginLeft: "0.5rem",
              marginRight: "0.5rem",
              borderRadius: "9999px",
              padding: "0.75rem",
              display: "flex",
              alignItems: "center",
              marginBottom: "0.75rem",
              backgroundColor: hoveredItem === "notification" ? "rgba(255, 255, 255, 0.1)" : "transparent",
            }}
            onMouseEnter={() => setHoveredItem("notification")}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <Bell
              style={{ height: "1.25rem", width: "1.25rem", color: "rgba(255, 255, 255, 0.7)", marginRight: "0.75rem" }}
            />
            <span style={{ color: "rgba(255, 255, 255, 0.7)", fontWeight: "500" }}>Genie Notification</span>
          </div>

          {/* Mobile-only: Show tabs in sidebar */}
          {isMobile && (
            <div style={{ marginTop: "1.5rem" }}>
              <div style={{ padding: "0 0.5rem 0.75rem 0.5rem", ...grayText, fontSize: "0.75rem", fontWeight: "bold" }}>
                VIEWS
              </div>
              {tabs.map((tab) => (
                <div
                  key={tab.name}
                  style={{
                    marginLeft: "0.5rem",
                    marginRight: "0.5rem",
                    borderRadius: "9999px",
                    padding: "0.75rem",
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                    backgroundColor: activeTab === tab.name ? "#7755c2" : "rgba(255, 255, 255, 0.1)",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setActiveTab(tab.name)
                    if (isMobile) setIsMobileMenuOpen(false)
                  }}
                >
                  <div style={{ marginRight: "0.75rem", color: "white" }}>{tab.icon}</div>
                  <span style={{ color: "white", fontWeight: activeTab === tab.name ? "600" : "400" }}>{tab.name}</span>
                </div>
              ))}
            </div>
          )}
        </nav>
      </div>

      {/* Main Content */}
      <div
        style={{
          ...darkBlueBackground,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          marginLeft: isMobile ? 0 : undefined,
          width: isMobile ? "100%" : undefined,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: isMobile ? "0.75rem" : "1rem",
            borderBottom: "1px solid #222957",
          }}
        >
          {/* Mobile menu toggle */}
          {isMobile && (
            <button
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "white",
                cursor: "pointer",
                padding: "0.5rem",
                marginRight: "0.5rem",
              }}
              onClick={toggleMobileMenu}
            >
              <Menu size={24} />
            </button>
          )}

          <div style={{ flex: 1 }}>
            <h1
              style={{
                ...whiteText,
                fontSize: isMobile ? "1.25rem" : "1.5rem",
                fontWeight: "bold",
              }}
            >
              Welcome Back, Smith 👋
            </h1>
            <p
              style={{
                color: "#9ca3af",
                fontSize: isMobile ? "0.75rem" : "0.875rem",
              }}
            >
              YOUR NETWORK IS YOUR NETWORTH
            </p>
          </div>

          <div style={{ position: "relative" }}>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
              }}
              onClick={toggleMenu}
            >
              <div
                style={{
                  position: "relative",
                  height: "2.5rem",
                  width: "2.5rem",
                  borderRadius: "9999px",
                  overflow: "hidden",
                  marginRight: isMobile ? "0" : "0.5rem",
                }}
              >
                <Image
                  src="/placeholder.svg?height=40&width=40"
                  alt="Profile"
                  width={40}
                  height={40}
                  style={{ objectFit: "cover" }}
                />
              </div>
              {!isMobile && (
                <>
                  <div style={{ marginRight: "0.5rem" }}>
                    <div style={{ ...whiteText, fontWeight: "500" }}>Adam Smith</div>
                    <div style={{ color: "#9ca3af", fontSize: "0.875rem" }}>Account</div>
                  </div>
                  {isMenuOpen ? (
                    <ChevronUp style={{ height: "1.25rem", width: "1.25rem", color: "white" }} />
                  ) : (
                    <ChevronDown style={{ height: "1.25rem", width: "1.25rem", color: "white" }} />
                  )}
                </>
              )}
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  marginTop: "0.5rem",
                  width: isMobile ? "16rem" : "16rem",
                  ...purpleBackground,
                  borderRadius: "0.5rem",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  zIndex: 50,
                  overflow: "hidden",
                }}
              >
                <div style={{ padding: "1rem", display: "flex", justifyContent: "flex-end" }}>
                  <Settings style={{ height: "1.5rem", width: "1.5rem", color: "white" }} />
                </div>

                <div
                  style={{
                    paddingLeft: "1rem",
                    paddingRight: "1rem",
                    paddingBottom: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                  }}
                >
                  {[
                    "SETTINGS",
                    "YOUR PROFILE",
                    "WHATS NEW",
                    "BILLING",
                    "THEME: LIGHT",
                    "HELP & RESOURCES",
                    "LOG OUT",
                  ].map((item, index) => (
                    <button
                      key={index}
                      style={{
                        ...semitransparentWhiteBackground,
                        borderRadius: "0.5rem",
                        padding: "0.75rem",
                        width: "100%",
                        textAlign: "center",
                        color: "white",
                        fontWeight: "500",
                        border: "none",
                        cursor: "pointer",
                        backgroundColor:
                          hoveredItem === `menu-${index}` ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.2)",
                        transition: "background-color 0.2s",
                      }}
                      onMouseEnter={() => setHoveredItem(`menu-${index}`)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <div style={{ padding: "1rem", display: "flex", justifyContent: "flex-end" }}>
                  <div style={{ position: "relative", height: "4rem", width: "4rem" }}>
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/network_genie-ujDSwZ1J8IomV4CWI5ltPVlqidaH5S.png"
                      alt="Genie Character"
                      width={64}
                      height={64}
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs - Only show on desktop */}
        {!isMobile && (
          <div
            className="tab-container"
            style={{
              display: "flex",
              borderBottom: "1px solid #222957",
              overflowX: "auto",
              padding: "0.5rem 1rem 0",
              backgroundColor: "#1a2a50", // Slightly lighter than the main background for contrast
            }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  paddingLeft: "1rem",
                  paddingRight: "1rem",
                  paddingTop: "0.75rem",
                  paddingBottom: "0.75rem",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  backgroundColor: activeTab === tab.name ? "#7755c2" : "transparent",
                  color: activeTab === tab.name ? "white" : "#d1d5db",
                  border: "none",
                  borderRadius: "0.5rem 0.5rem 0 0",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  position: "relative",
                  transition: "all 0.2s ease",
                  marginRight: "0.25rem",
                  transform: activeTab === tab.name ? "translateY(1px)" : "translateY(0)",
                }}
                onMouseEnter={() => {
                  if (activeTab !== tab.name) {
                    setHoveredItem(`tab-${tab.name}`)
                  }
                }}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => setActiveTab(tab.name)}
              >
                {tab.icon}
                <span>{tab.name}</span>
                {activeTab === tab.name && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-1px",
                      left: 0,
                      right: 0,
                      height: "2px",
                      backgroundColor: "#c580ff",
                      borderRadius: "2px 2px 0 0",
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Mobile Tab Indicator */}
        {isMobile && (
          <div
            style={{
              padding: "0.75rem 1rem",
              borderBottom: "1px solid #222957",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#1a2a50",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "white",
                fontWeight: "500",
              }}
            >
              {tabs.find((tab) => tab.name === activeTab)?.icon}
              <span>{activeTab}</span>
            </div>
            <button
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "white",
                cursor: "pointer",
                padding: "0.25rem",
                display: "flex",
                alignItems: "center",
              }}
              onClick={toggleMobileMenu}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Tab Content */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}>{renderTabContent()}</div>
        </div>
      </div>
    </div>
  )
}
