"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, Users } from "lucide-react"

// Sample events data
const events = [
  {
    id: 1,
    title: "Tech Industry Meetup",
    date: "2025-05-15",
    time: "14:00 - 16:00",
    location: "San Francisco Convention Center",
    attendees: 45,
    type: "networking",
  },
  {
    id: 2,
    title: "Coffee with Michael Chen",
    date: "2025-05-15",
    time: "10:00 - 11:00",
    location: "Starbucks, Downtown",
    attendees: 2,
    type: "meeting",
  },
  {
    id: 3,
    title: "Product Demo with InnovateTech",
    date: "2025-05-16",
    time: "13:00 - 14:30",
    location: "Virtual Meeting",
    attendees: 8,
    type: "meeting",
  },
  {
    id: 4,
    title: "Marketing Strategy Discussion",
    date: "2025-05-17",
    time: "09:00 - 10:30",
    location: "Office - Conference Room A",
    attendees: 5,
    type: "meeting",
  },
  {
    id: 5,
    title: "Networking Dinner",
    date: "2025-05-18",
    time: "19:00 - 21:00",
    location: "The Grand Restaurant",
    attendees: 12,
    type: "networking",
  },
  {
    id: 6,
    title: "Industry Conference",
    date: "2025-05-20",
    time: "09:00 - 17:00",
    location: "Tech Convention Center",
    attendees: 200,
    type: "conference",
  },
]

// Generate calendar days
const generateCalendarDays = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()

  const days = []
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push({ day: null, date: null })
  }

  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i)
    const dateString = date.toISOString().split("T")[0]
    const dayEvents = events.filter((event) => event.date === dateString)
    days.push({ day: i, date: dateString, events: dayEvents })
  }

  return days
}

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [hoveredDay, setHoveredDay] = useState<number | null>(null)

  // Common styles
  const darkBlueBackground = { backgroundColor: "#132144" }
  const darkerBlueBackground = { backgroundColor: "#222957" }
  const purpleBackground = { backgroundColor: "#855ad1" }
  const whiteText = { color: "white" }
  const grayText = { color: "#9ca3af" }

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const monthName = currentDate.toLocaleString("default", { month: "long" })
  const calendarDays = generateCalendarDays(year, month)

  // Get events for selected date
  const selectedDateEvents = selectedDate ? events.filter((event) => event.date === selectedDate) : []

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  return (
    <div style={{ height: "100%", width: "100%", display: "flex", ...darkBlueBackground }}>
      {/* Calendar */}
      <div style={{ flex: 1, padding: "1.5rem", display: "flex", flexDirection: "column" }}>
        {/* Calendar Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <h2 style={{ ...whiteText, fontSize: "1.5rem", fontWeight: "bold" }}>
              {monthName} {year}
            </h2>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                style={{
                  width: "2rem",
                  height: "2rem",
                  borderRadius: "9999px",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                onClick={goToPreviousMonth}
              >
                <ChevronLeft style={{ color: "white", width: "1.25rem", height: "1.25rem" }} />
              </button>
              <button
                style={{
                  width: "2rem",
                  height: "2rem",
                  borderRadius: "9999px",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                onClick={goToNextMonth}
              >
                <ChevronRight style={{ color: "white", width: "1.25rem", height: "1.25rem" }} />
              </button>
            </div>
          </div>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              backgroundColor: "#7755c2",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              padding: "0.5rem 1rem",
              cursor: "pointer",
            }}
          >
            <Plus style={{ width: "1rem", height: "1rem" }} />
            <span>Add Event</span>
          </button>
        </div>

        {/* Calendar Grid */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Days of Week */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: "0.5rem" }}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
              <div
                key={index}
                style={{
                  ...grayText,
                  textAlign: "center",
                  padding: "0.5rem",
                  fontWeight: "bold",
                  fontSize: "0.875rem",
                }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gridTemplateRows: "repeat(6, 1fr)",
              flex: 1,
              gap: "0.5rem",
            }}
          >
            {calendarDays.map((day, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: day.date === selectedDate ? "#7755c2" : "rgba(255, 255, 255, 0.05)",
                  borderRadius: "0.5rem",
                  padding: "0.5rem",
                  cursor: day.day ? "pointer" : "default",
                  position: "relative",
                  transition: "background-color 0.2s",
                  backgroundColor:
                    day.date === selectedDate
                      ? "#7755c2"
                      : hoveredDay === day.day
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(255, 255, 255, 0.05)",
                }}
                onClick={() => day.day && setSelectedDate(day.date)}
                onMouseEnter={() => day.day && setHoveredDay(day.day)}
                onMouseLeave={() => setHoveredDay(null)}
              >
                {day.day && (
                  <>
                    <div style={{ ...whiteText, fontWeight: "bold" }}>{day.day}</div>
                    {day.events && day.events.length > 0 && (
                      <div style={{ marginTop: "0.5rem" }}>
                        {day.events.slice(0, 2).map((event, eventIndex) => (
                          <div
                            key={eventIndex}
                            style={{
                              backgroundColor:
                                event.type === "networking"
                                  ? "#7755c2"
                                  : event.type === "meeting"
                                    ? "#10b981"
                                    : "#f59e0b",
                              borderRadius: "0.25rem",
                              padding: "0.25rem",
                              marginBottom: "0.25rem",
                              fontSize: "0.75rem",
                              ...whiteText,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {event.title}
                          </div>
                        ))}
                        {day.events.length > 2 && (
                          <div
                            style={{
                              ...grayText,
                              fontSize: "0.75rem",
                              textAlign: "center",
                            }}
                          >
                            +{day.events.length - 2} more
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Event Details Sidebar */}
      <div
        style={{
          width: "20rem",
          ...darkerBlueBackground,
          borderLeft: "1px solid rgba(255, 255, 255, 0.1)",
          padding: "1.5rem",
          overflowY: "auto",
        }}
      >
        <h3 style={{ ...whiteText, fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem" }}>
          {selectedDate
            ? new Date(selectedDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
            : "Select a date"}
        </h3>

        {selectedDate && selectedDateEvents.length === 0 && (
          <div style={{ ...grayText, textAlign: "center", marginTop: "2rem" }}>No events scheduled for this day</div>
        )}

        {selectedDateEvents.map((event) => (
          <div
            key={event.id}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              borderRadius: "0.5rem",
              padding: "1rem",
              marginBottom: "1rem",
              borderLeft:
                event.type === "networking"
                  ? "4px solid #7755c2"
                  : event.type === "meeting"
                    ? "4px solid #10b981"
                    : "4px solid #f59e0b",
            }}
          >
            <h4 style={{ ...whiteText, fontSize: "1.125rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
              {event.title}
            </h4>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
              <Clock style={{ color: "#9ca3af", width: "1rem", height: "1rem", marginRight: "0.5rem" }} />
              <span style={{ ...grayText, fontSize: "0.875rem" }}>{event.time}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
              <MapPin style={{ color: "#9ca3af", width: "1rem", height: "1rem", marginRight: "0.5rem" }} />
              <span style={{ ...grayText, fontSize: "0.875rem" }}>{event.location}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Users style={{ color: "#9ca3af", width: "1rem", height: "1rem", marginRight: "0.5rem" }} />
              <span style={{ ...grayText, fontSize: "0.875rem" }}>{event.attendees} attendees</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
