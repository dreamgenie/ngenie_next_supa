"use client"

import { useState } from "react"
import { Search, Filter, Plus, MoreHorizontal, Mail, Phone, MapPin } from "lucide-react"
import Image from "next/image"

// Sample contacts data
const contacts = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Marketing Director",
    company: "TechGrowth Inc.",
    email: "sarah.johnson@techgrowth.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    tags: ["Marketing", "Tech"],
    avatar: "/placeholder.svg?height=50&width=50",
    connectionLevel: "1st",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Software Engineer",
    company: "CodeWorks",
    email: "michael.chen@codeworks.com",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA",
    tags: ["Engineering", "Development"],
    avatar: "/placeholder.svg?height=50&width=50",
    connectionLevel: "1st",
  },
  {
    id: 3,
    name: "Jessica Williams",
    role: "Product Manager",
    company: "InnovateTech",
    email: "jessica.williams@innovatetech.com",
    phone: "+1 (555) 345-6789",
    location: "Chicago, IL",
    tags: ["Product", "Management"],
    avatar: "/placeholder.svg?height=50&width=50",
    connectionLevel: "1st",
  },
  {
    id: 4,
    name: "David Rodriguez",
    role: "Sales Director",
    company: "GrowthPartners",
    email: "david.rodriguez@growthpartners.com",
    phone: "+1 (555) 456-7890",
    location: "Miami, FL",
    tags: ["Sales", "Business"],
    avatar: "/placeholder.svg?height=50&width=50",
    connectionLevel: "1st",
  },
  {
    id: 5,
    name: "Emily Thompson",
    role: "UX Designer",
    company: "DesignHub",
    email: "emily.thompson@designhub.com",
    phone: "+1 (555) 567-8901",
    location: "Toronto, Canada",
    tags: ["Design", "UX"],
    avatar: "/placeholder.svg?height=50&width=50",
    connectionLevel: "1st",
  },
  {
    id: 6,
    name: "Robert Kim",
    role: "CTO",
    company: "TechInnovate",
    email: "robert.kim@techinnovate.com",
    phone: "+1 (555) 678-9012",
    location: "Seattle, WA",
    tags: ["Technology", "Executive"],
    avatar: "/placeholder.svg?height=50&width=50",
    connectionLevel: "2nd",
  },
  {
    id: 7,
    name: "Lisa Garcia",
    role: "Marketing Manager",
    company: "BrandBoost",
    email: "lisa.garcia@brandboost.com",
    phone: "+1 (555) 789-0123",
    location: "Los Angeles, CA",
    tags: ["Marketing", "Branding"],
    avatar: "/placeholder.svg?height=50&width=50",
    connectionLevel: "2nd",
  },
  {
    id: 8,
    name: "James Wilson",
    role: "Financial Analyst",
    company: "CapitalGrowth",
    email: "james.wilson@capitalgrowth.com",
    phone: "+1 (555) 890-1234",
    location: "Boston, MA",
    tags: ["Finance", "Analysis"],
    avatar: "/placeholder.svg?height=50&width=50",
    connectionLevel: "2nd",
  },
]

export default function AllContacts() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedContact, setSelectedContact] = useState<number | null>(null)
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)

  // Common styles
  const darkBlueBackground = { backgroundColor: "#132144" }
  const darkerBlueBackground = { backgroundColor: "#222957" }
  const purpleBackground = { backgroundColor: "#855ad1" }
  const whiteText = { color: "white" }
  const grayText = { color: "#9ca3af" }

  // Filter contacts based on search term
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", ...darkBlueBackground }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 1.5rem",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <h2 style={{ ...whiteText, fontSize: "1.25rem", fontWeight: "bold" }}>All Contacts ({contacts.length})</h2>
        <div style={{ display: "flex", gap: "1rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              borderRadius: "0.5rem",
              padding: "0.5rem 1rem",
              width: "20rem",
            }}
          >
            <Search style={{ color: "white", width: "1.25rem", height: "1.25rem", marginRight: "0.5rem" }} />
            <input
              type="text"
              placeholder="Search contacts..."
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
              gap: "0.5rem",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              border: "none",
              borderRadius: "0.5rem",
              padding: "0.5rem 1rem",
              color: "white",
              cursor: "pointer",
            }}
          >
            <Filter style={{ width: "1.25rem", height: "1.25rem" }} />
            <span>Filter</span>
          </button>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              backgroundColor: "#7755c2",
              border: "none",
              borderRadius: "0.5rem",
              padding: "0.5rem 1rem",
              color: "white",
              cursor: "pointer",
            }}
          >
            <Plus style={{ width: "1.25rem", height: "1.25rem" }} />
            <span>Add Contact</span>
          </button>
        </div>
      </div>

      {/* Contacts Table */}
      <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
              <th style={{ ...grayText, textAlign: "left", padding: "0.75rem", fontWeight: "normal" }}>Name</th>
              <th style={{ ...grayText, textAlign: "left", padding: "0.75rem", fontWeight: "normal" }}>Role</th>
              <th style={{ ...grayText, textAlign: "left", padding: "0.75rem", fontWeight: "normal" }}>Company</th>
              <th style={{ ...grayText, textAlign: "left", padding: "0.75rem", fontWeight: "normal" }}>Location</th>
              <th style={{ ...grayText, textAlign: "left", padding: "0.75rem", fontWeight: "normal" }}>Connection</th>
              <th style={{ ...grayText, textAlign: "left", padding: "0.75rem", fontWeight: "normal" }}>Tags</th>
              <th style={{ ...grayText, textAlign: "center", padding: "0.75rem", fontWeight: "normal" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.map((contact) => (
              <tr
                key={contact.id}
                style={{
                  borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                  backgroundColor:
                    selectedContact === contact.id
                      ? "rgba(119, 85, 194, 0.2)"
                      : hoveredRow === contact.id
                        ? "rgba(255, 255, 255, 0.05)"
                        : "transparent",
                  cursor: "pointer",
                }}
                onClick={() => setSelectedContact(selectedContact === contact.id ? null : contact.id)}
                onMouseEnter={() => setHoveredRow(contact.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td style={{ padding: "0.75rem" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        width: "2.5rem",
                        height: "2.5rem",
                        borderRadius: "9999px",
                        overflow: "hidden",
                        marginRight: "0.75rem",
                      }}
                    >
                      <Image
                        src={contact.avatar || "/placeholder.svg"}
                        alt={contact.name}
                        width={50}
                        height={50}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                    <div style={{ ...whiteText }}>{contact.name}</div>
                  </div>
                </td>
                <td style={{ padding: "0.75rem", ...grayText }}>{contact.role}</td>
                <td style={{ padding: "0.75rem", ...grayText }}>{contact.company}</td>
                <td style={{ padding: "0.75rem", ...grayText }}>{contact.location}</td>
                <td style={{ padding: "0.75rem" }}>
                  <span
                    style={{
                      backgroundColor: contact.connectionLevel === "1st" ? "#7755c2" : "rgba(255, 255, 255, 0.1)",
                      color: "white",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "9999px",
                      fontSize: "0.75rem",
                    }}
                  >
                    {contact.connectionLevel}
                  </span>
                </td>
                <td style={{ padding: "0.75rem" }}>
                  <div style={{ display: "flex", gap: "0.25rem", flexWrap: "wrap" }}>
                    {contact.tags.map((tag, index) => (
                      <span
                        key={index}
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          color: "white",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "9999px",
                          fontSize: "0.75rem",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td style={{ padding: "0.75rem", textAlign: "center" }}>
                  <button
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MoreHorizontal style={{ color: "white", width: "1.25rem", height: "1.25rem" }} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Contact Details Panel */}
      {selectedContact && (
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            height: "100%",
            width: "25rem",
            ...darkerBlueBackground,
            boxShadow: "-4px 0 10px rgba(0, 0, 0, 0.1)",
            zIndex: 50,
            overflowY: "auto",
            padding: "1.5rem",
          }}
        >
          {(() => {
            const contact = contacts.find((c) => c.id === selectedContact)
            if (!contact) return null

            return (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2rem" }}>
                  <h3 style={{ ...whiteText, fontSize: "1.25rem", fontWeight: "bold" }}>Contact Details</h3>
                  <button
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      cursor: "pointer",
                      color: "white",
                      fontSize: "1.25rem",
                    }}
                    onClick={() => setSelectedContact(null)}
                  >
                    ×
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "2rem" }}>
                  <div
                    style={{
                      width: "6rem",
                      height: "6rem",
                      borderRadius: "9999px",
                      overflow: "hidden",
                      marginBottom: "1rem",
                    }}
                  >
                    <Image
                      src={contact.avatar || "/placeholder.svg"}
                      alt={contact.name}
                      width={120}
                      height={120}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <h4 style={{ ...whiteText, fontSize: "1.25rem", fontWeight: "bold", marginBottom: "0.25rem" }}>
                    {contact.name}
                  </h4>
                  <p style={{ ...grayText, marginBottom: "0.5rem" }}>
                    {contact.role} at {contact.company}
                  </p>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <span
                      style={{
                        backgroundColor: contact.connectionLevel === "1st" ? "#7755c2" : "rgba(255, 255, 255, 0.1)",
                        color: "white",
                        padding: "0.25rem 0.5rem",
                        borderRadius: "9999px",
                        fontSize: "0.75rem",
                      }}
                    >
                      {contact.connectionLevel} Connection
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: "2rem" }}>
                  <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                    <button
                      style={{
                        flex: 1,
                        backgroundColor: "#7755c2",
                        border: "none",
                        borderRadius: "0.5rem",
                        padding: "0.75rem",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                        cursor: "pointer",
                      }}
                    >
                      <Mail style={{ width: "1rem", height: "1rem" }} />
                      <span>Email</span>
                    </button>
                    <button
                      style={{
                        flex: 1,
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        border: "none",
                        borderRadius: "0.5rem",
                        padding: "0.75rem",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                        cursor: "pointer",
                      }}
                    >
                      <Phone style={{ width: "1rem", height: "1rem" }} />
                      <span>Call</span>
                    </button>
                  </div>
                </div>

                <div style={{ marginBottom: "2rem" }}>
                  <h5 style={{ ...whiteText, fontSize: "1rem", fontWeight: "bold", marginBottom: "1rem" }}>
                    Contact Information
                  </h5>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                      <p style={{ ...grayText, fontSize: "0.875rem", marginBottom: "0.25rem" }}>Email</p>
                      <p style={{ ...whiteText }}>{contact.email}</p>
                    </div>
                    <div>
                      <p style={{ ...grayText, fontSize: "0.875rem", marginBottom: "0.25rem" }}>Phone</p>
                      <p style={{ ...whiteText }}>{contact.phone}</p>
                    </div>
                    <div>
                      <p style={{ ...grayText, fontSize: "0.875rem", marginBottom: "0.25rem" }}>Location</p>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <MapPin style={{ color: "#9ca3af", width: "1rem", height: "1rem" }} />
                        <p style={{ ...whiteText }}>{contact.location}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: "2rem" }}>
                  <h5 style={{ ...whiteText, fontSize: "1rem", fontWeight: "bold", marginBottom: "1rem" }}>Tags</h5>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {contact.tags.map((tag, index) => (
                      <span
                        key={index}
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          color: "white",
                          padding: "0.5rem 0.75rem",
                          borderRadius: "9999px",
                          fontSize: "0.875rem",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                    <button
                      style={{
                        backgroundColor: "transparent",
                        border: "1px dashed rgba(255, 255, 255, 0.3)",
                        color: "white",
                        padding: "0.5rem 0.75rem",
                        borderRadius: "9999px",
                        fontSize: "0.875rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                        cursor: "pointer",
                      }}
                    >
                      <Plus style={{ width: "0.875rem", height: "0.875rem" }} />
                      <span>Add Tag</span>
                    </button>
                  </div>
                </div>

                <div>
                  <h5 style={{ ...whiteText, fontSize: "1rem", fontWeight: "bold", marginBottom: "1rem" }}>
                    Recent Interactions
                  </h5>
                  <div
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      borderRadius: "0.5rem",
                      padding: "1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                      <p style={{ ...whiteText, fontWeight: "bold" }}>Email Exchange</p>
                      <p style={{ ...grayText, fontSize: "0.875rem" }}>2 days ago</p>
                    </div>
                    <p style={{ ...grayText, fontSize: "0.875rem" }}>
                      Discussed potential collaboration on upcoming marketing campaign.
                    </p>
                  </div>
                  <div
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      borderRadius: "0.5rem",
                      padding: "1rem",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                      <p style={{ ...whiteText, fontWeight: "bold" }}>Meeting</p>
                      <p style={{ ...grayText, fontSize: "0.875rem" }}>2 weeks ago</p>
                    </div>
                    <p style={{ ...grayText, fontSize: "0.875rem" }}>
                      Introductory call to discuss industry trends and networking opportunities.
                    </p>
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
